import connection from "@/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, { params }) {
  if (!params) {
    return new Response(JSON.stringify({ error: "Params are missing" }), { status: 400 });
  }
  const { slug } = await params;

  if (!slug) {
    return new NextResponse(JSON.stringify({ error: "Product ID is required" }), { status: 400 });
  }


  try {
    const [rows] = await connection.query(
      // "SELECT * FROM products WHERE id = ?", [id]
      "SELECT products.*, collections.name AS collection_name FROM products JOIN collections ON products.collectionId = collections.id WHERE products.slug = ?", 
      [slug]
    );
    
    if (rows.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching the product.' }), { status: 500 });
  }
}




export async function PUT(request, { params }) {
  
  // const { params } = context;

  // const { id } = params;
  const { slug } = await params; // Extract the product ID from the URL parameters

  if (!slug) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const data = await request.formData();
  const id = data.get("id");
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


  // Validation check (uncomment if needed)
  // if (!name || !info || !description || !quality || !maintanace || !collectionId || !tags || !rugs || !color || !sizes) {
  //     return NextResponse.json({ error: "Product name and Product Details are required" }, { status: 400 });
  // }

  try {

    

    let imageUrls = [];

    if (files.length > 0) {
      // Upload new images if provided
      for (const file of files) {
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

        const uploadResponse = await cloudinary.v2.uploader.upload(base64String, {
          folder: "NuzratProducts",
        });

        imageUrls.push(uploadResponse.secure_url);
      }
    } else {
      // Fetch existing images if no new ones are provided
      const [existingProduct] = await connection.execute(
        "SELECT images FROM products WHERE id = ?",
        [id]
      );
      if (existingProduct.length > 0) {
        imageUrls = JSON.parse(existingProduct[0].images);
      }
    }



    // Update the product in the database with new values
    const [result] = await connection.execute(
      "UPDATE products SET name = ?, description = ?, info = ?, quality = ?, maintanace = ?, tags = ?, images = ?, image_path = ?, color = ?, rugs = ?, sizes = ?, collectionId = ? WHERE id = ?",
      [
        name,
        description,
        info,
        quality,
        maintanace,
        JSON.stringify(tags),
        JSON.stringify(imageUrls), // Store the array of image paths
        color,
        rugs,
        JSON.stringify(sizes),
        collectionId,
        id // Use the product ID from the URL to update the correct product
      ]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  }
}





