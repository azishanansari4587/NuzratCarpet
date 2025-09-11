import { NextResponse } from "next/server";
import connection from "@/lib/connection";



export async function GET(req, { params }) {
  const { slug } = params;

  try {
    // Step 1: Get the collection by slug
    const [collectionRows] = await connection.query(
      `SELECT * FROM collection WHERE slug = ?`, 
      [slug]
    );

    if (collectionRows.length === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const collection = collectionRows[0];

    // Step 2: Get products from that collection
    const [productRows] = await connection.query(
      `SELECT * FROM product WHERE collectionId = ?`, 
      [collection.id]
    );

    // Step 3: Format fields (like images, colors, etc.)
    const formattedProducts = productRows.map(product => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      colors: JSON.parse(product.colors || "[]"),
      sizes: JSON.parse(product.sizes || "[]"),
    }));

    return NextResponse.json({
      collection,
      products: formattedProducts,
    }, { status: 200 });

  } catch (error) {
    console.error("GET collection by slug error:", error);
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}


// 📌 PUT update collection
export async function PUT(req, context) {
  const { slug } = await context.params; // ✅ await karo

  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const imageFile = formData.get("image");
    const bannerImageFile = formData.get("bannerImage");

    // Check if collection exists
    const [existing] = await connection.execute(
      `SELECT * FROM collection WHERE slug = ?`,
      [slug]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    let imageUrl = existing[0].image;
    let bannerImageUrl = existing[0].bannerImage;

    // Upload to Cloudinary if new files are provided
    async function uploadToCloudinary(file, folder) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      return result.secure_url;
    }

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToCloudinary(imageFile, "Nuzrat/collections/thumbnails");
    }

    if (bannerImageFile && bannerImageFile.size > 0) {
      bannerImageUrl = await uploadToCloudinary(bannerImageFile, "Nuzrat/collections/banners");
    }

    await connection.execute(
      `UPDATE collection 
       SET name = ?, description = ?, isActive = ?, isFeatured = ?, image = ?, bannerImage = ?
       WHERE slug = ?`,
      [name, description, isActive, isFeatured, imageUrl, bannerImageUrl, slug]
    );

    return NextResponse.json({ message: "Collection updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("PUT collection error:", error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

// 📌 DELETE collection
export async function DELETE(req, { params }) {
  const { slug } = params;

  try {
    const [result] = await connection.execute(
      `DELETE FROM collection WHERE slug = ?`,
      [slug]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Collection deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("DELETE collection error:", error);
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}