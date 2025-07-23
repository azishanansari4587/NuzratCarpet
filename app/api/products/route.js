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
  const slug = data.get("slug");
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

  if (!name || !info || !description || !quality || !maintanace || !collectionId || !tags || !rugs || !color || !sizes) {
      return NextResponse.json({ error: "Product name and Product Details are required" }, { status: 400 });
  }

  try {
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

      const slugify = (str) => {
        if (!str) return Date.now().toString(); // Use a unique timestamp if name is empty
        return str
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special chars with '-'
          .replace(/^-+|-+$/g, ""); // Remove leading/trailing '-'
      };

      const slug = slugify(name);
      // Insert the product with file paths
      const [result] = await connection.execute(
          "INSERT INTO products (name, slug, description, info, quality, maintanace, tags, images, image_path, color, rugs, sizes, collectionId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
              name,
              slug,
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



//* Delete a Product
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Fetch existing product images before deleting
    const [existingProduct] = await connection.execute("SELECT images FROM products WHERE id = ?", [productId]);

    if (!existingProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const imageUrls = JSON.parse(existingProduct[0].images);

    // Delete images from Cloudinary (optional)
    await Promise.all(
      imageUrls.map(async (url) => {
        const publicId = url.split("/").pop().split(".")[0]; // Extract public ID from URL
        await cloudinary.v2.uploader.destroy(`NuzratProducts/${publicId}`);
      })
    );

    // Delete product from DB
    await connection.execute("DELETE FROM products WHERE id = ?", [productId]);

    return NextResponse.json({ message: "Product deleted successfully", success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  }
}

