import { NextResponse } from "next/server";
import connection from "@/lib/connection"; 
import jwt from "jsonwebtoken"; 
import nodemailer from "nodemailer";
// Ensure you import your DB connection


// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("user_id"); // Get user_id from frontend request

//     let query = `
//     SELECT 
//         cart.id,
//         users.name AS user_name,
//         users.email AS user_email,
//         products.name AS product_name,
//         products.images AS product_images,
//         products.rugs,
//         cart.quantity,
//         cart.size,
//         cart.color,
//         DATE_FORMAT(cart.created_at, '%Y-%m-%d') AS formatted_date,
//         TIME_FORMAT(cart.created_at, '%h:%i %p') AS formatted_time
//     FROM cart
//     JOIN users ON cart.user_id = users.id
//     JOIN products ON cart.product_id = products.id
//   `;

//   let values = [];

//   if (userId) {
//     // Fetch cart items for a specific user
//     query += ` WHERE cart.user_id = ?`;
//     values.push(userId);
//   }

//   const [rows] = await connection.execute(query, values);


//     return NextResponse.json(rows, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
//   }
// }


// app/api/myEnquiries/route.js


export async function GET(req) {
  try {
    // 🛡️ Token se user ka ID nikalna (JWT decode ya session)
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    // const userId = getUserIdFromToken(token); // tu yaha apna JWT decode karega
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [rows] = await connection.execute(
      // "SELECT * FROM enquiries WHERE userId = ? ORDER BY created_at DESC",
      "SELECT * FROM enquiries WHERE userId = ? ORDER BY created_at DESC;",
      [userId]
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


// export async function POST(req) {
//   try {
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const userId = decoded.id;

//     // Fetch user from DB
//     // const pool = getPool();
//     const [users] = await connection.execute(
//       "SELECT first_name, last_name, email, contact FROM users WHERE id = ?",
//       [userId]
//     );

//     if (!users.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const user = users[0];

//     // Get items from request
//     const { items, total } = await req.json();
//     if (!items?.length) {
//       return NextResponse.json({ error: "No items in enquiry" }, { status: 400 });
//     }

//     // Insert enquiry
//     const [result] = await connection.execute(
//       "INSERT INTO enquiries (user_name, user_email, user_phone, items) VALUES (?, ?, ?, ?)",
//       [user.first_name, user.email, user.contact, JSON.stringify(items)]
//     );

//     const enquiryId = result.insertId;

//     // Send mail to admin
//     await sendMail({
//       to: process.env.EMAIL_ADDRESS,
//       subject: `New Enquiry #${enquiryId}`,
//       html: `
//         <h3>New Enquiry Received</h3>
//         <p>Name: ${user.first_name}</p>
//         <p>Email: ${user.email}</p>
//         <p>Phone: ${user.contact}</p>
//         <h4>Items:</h4>
//         <pre>${JSON.stringify(items, null, 2)}</pre>
//         <p>Total: ${total}</p>
//       `,
//     });

//     return NextResponse.json({ ok: true, enquiryId });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }