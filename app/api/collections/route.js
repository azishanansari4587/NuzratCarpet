import { NextResponse } from "next/server";
import connection from "@/lib/connection";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

    const imageFile = formData.get("image");
    // const bannerImageFile = formData.get("bannerImage");

    let imageUrl = "";
    let bannerImageUrl = "";

    // 🔍 Check for duplicate name or slug
    const [existing] = await connection.execute(
      `SELECT * FROM collection WHERE name = ? OR slug = ?`,
      [name, slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Collection with this name or slug already exists." },
        { status: 409 } // Conflict
      );
    }

    // 📤 Upload to Cloudinary
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

    // if (bannerImageFile && bannerImageFile.size > 0) {
    //   bannerImageUrl = await uploadToCloudinary(bannerImageFile, "Nuzrat/collections/banners");
    // }

    // 💾 Insert into database
    const [result] = await connection.execute(
      `INSERT INTO collection (name, slug, description, isActive, isFeatured, image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description,
        isActive,
        isFeatured,
        imageUrl,
        // bannerImageUrl,
      ]
    );

    return NextResponse.json(
      { message: "Collection created successfully", id: result.insertId },
      { status: 201 }
    );

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}

//** GET METHOD */
export async function GET() {
  try {
    const [collections] = await connection.execute(
      `SELECT 
        c.id AS collectionId,
        c.name,
        c.image,
        c.slug,
        c.description,
        c.isActive,
        c.isFeatured,
        c.created_at,
        c.updated_at,
        COUNT(p.id) AS productCount
      FROM 
        collection c
      LEFT JOIN 
        product p ON c.id = p.collectionId
      GROUP BY 
        c.id, c.name, c.image, c.slug, c.description, c.isActive, c.isFeatured, c.created_at, c.updated_at
      ORDER BY 
        productCount DESC`
    );

    const formatted = collections.map(col => ({
      id: col.collectionId,
      name: col.name,
      image: col.image,
      slug: col.slug,
      description: col.description,
      isActive: col.isActive,
      isFeatured: col.isFeatured,
      createdAt: col.created_at,
      updatedAt: col.updated_at,
      productCount: col.productCount,
    }));


    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET collection error:", error);
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  } 
}
