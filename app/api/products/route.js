import { NextResponse } from "next/server";
import connection from "@/lib/db";
import cloudinary from "cloudinary";


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(request) {
  const data = await request.formData();
  const name = data.get("name");
  const description = data.get("description");
  const info = data.get("info");
  const quality = data.get("quality");
  const maintanace = data.get("maintanace");
  const collectionId = data.get("collectionId");
  const color = data.get("color");
  const rugs = data.get("rugs");
  const sizes = data.getAll("sizes");
  const tags = data.getAll("tags");
  const files = data.getAll("files");

//   if (!name || !info || !description || !quality || !maintanace || !collectionId || !tags || !rugs || !color || !sizes) {
//       return NextResponse.json({ error: "Product name and Product Details are required" }, { status: 400 });
//   }

  try {
      // Create a directory to store the files if it does not exist
      // const uploadDir = path.resolve("public/uploads");
      // if (!fs.existsSync(uploadDir)) {
      //     fs.mkdirSync(uploadDir, { recursive: true });
      // }

      // Save file paths to an array
      // const filePaths = [];

      // const fileName = [];

      // for (const file of files) {
      //     const byteData = await file.arrayBuffer();
      //     const buffer = Buffer.from(byteData).toString("base64");
      //     const filePath = path.join(uploadDir, file.name);

      //     // Save file to the file system
      //     await writeFile(filePath, buffer);

      //     // Store the relative file path (e.g., '/uploads/filename.jpg')
      //     filePaths.push(`/uploads/${file.name}`);
      //     fileName.push(file.name);
      // }

      const imageUrls = [];

      for (const file of files) {
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);

        const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

        //* Upload to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(base64String, {
          folder: "NuzratProducts",
        });

        imageUrls.push(uploadResponse.secure_url);
      }

      // Insert the product with file paths
      const [result] = await connection.execute(
          "INSERT INTO products (name, description, info, quality, maintanace, tags, images, image_path, color, rugs, sizes, collectionId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
              name,
              description,
              info,
              quality,
              maintanace,
              JSON.stringify(tags),
              JSON.stringify(imageUrls), // Store the array of image paths
              JSON.stringify(imageUrls),
              color,
              rugs,
              JSON.stringify(sizes),
              collectionId
          ]
      );

      return NextResponse.json({ message: "Product and files uploaded successfully", success: true }, { status: 201 });
  } catch (error) {
      return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  }
}




export async function GET() {
    try {
      const [rows] = await connection.execute('SELECT * FROM products');
  
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }
}



