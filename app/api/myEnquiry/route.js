import { NextResponse } from "next/server";
import connection from "@/lib/connection"; 
import jwt from "jsonwebtoken"; 
import nodemailer from "nodemailer";
// Ensure you import your DB connection



// app/api/myEnquiries/route.js


export async function GET(req) {
  try {
    // 🛡️ Token se user ka ID nikalna (JWT decode ya session)
    
    // const authHeader = req.headers.get("authorization");
    // if (!authHeader) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const token = authHeader.split(" ")[1];
   
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;

    const [rows] = await connection.execute(
      // "SELECT * FROM enquiries WHERE userId = ? ORDER BY created_at DESC",
      // "SELECT * FROM enquiries WHERE userId = ? ORDER BY created_at DESC;",
      // [userId]
      `SELECT e.id, 
       e.cartItems, 
       e.created_at,
       u.id as user_id, 
       CONCAT(u.first_name, ' ', u.last_name) as user_name, 
       u.email as user_email
FROM enquiries e
LEFT JOIN users u ON e.userId = u.id
ORDER BY e.created_at DESC;
`
    );

    // cartItems ko JSON parse karke bhejna
    const data = rows.map((enquiry) => ({
      ...enquiry,
      cartItems: JSON.parse(enquiry.cartItems),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode token to get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { items, total } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1️⃣ Save enquiry in DB
    const [result] = await connection.execute(
      "INSERT INTO enquiries (userId, cartItems) VALUES (?, ?)",
      [userId, JSON.stringify(items)]
    );

    const enquiryId = result.insertId;

    // 2️⃣ Send Email to Admin
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: process.env.SMTP_PORT == 465,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    const cartTable = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product ID</th>
            <th>Color</th>
            <th>Size</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td><img src="${item.image}" alt="Product" width="60"></td>
              <td>${item.productId}</td>
              <td>${item.color}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_ADDRESS}>`,
      // to: process.env.EMAIL_ADDRESS,
      to: "shikshawala.in@gmail.com",
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry from User ID: ${userId}</h3>
        ${cartTable}
        <p><b>Total Price:</b> ${total}</p>
      `,
    });

    // 3️⃣ Remove all cart items from DB for this user
    await connection.execute("DELETE FROM cart WHERE userId = ?", [userId]);

    return NextResponse.json({
      message: "Enquiry saved, email sent, and cart cleared",
      enquiryId,
    });
  } catch (error) {
    console.error("Enquiry Error:", error);
    return NextResponse.json({ error: "Error processing enquiry" }, { status: 500 });
  }
}