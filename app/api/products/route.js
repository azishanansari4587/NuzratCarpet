import  connection  from '@/lib/connection';
import { NextResponse } from 'next/server';
import  cloudinary  from '@/lib/cloudinary';



function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Simple fields
    const name = formData.get("name");
    const code = formData.get("code");
    const isActive = formData.get("isActive") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const short_description = formData.get("short_description");
    const description = formData.get("description");
    const inStock = formData.get("inStock") === "true";
    const sku = formData.get("sku");
    const barcode = formData.get("barcode");
    const weight = formData.get("weight");
    const tags = JSON.parse(formData.get("tags") || "[]");
    const sizes = JSON.parse(formData.get("sizes") || "[]");
    const features = JSON.parse(formData.get("features") || "[]");
    const specifications = JSON.parse(formData.get("specifications") || "[]");
    const collectionId = formData.get("collectionId");

    // Generate slug
    let slug = generateSlug(name);

    // Check for existing name or slug
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const [existing] = await connection.execute(
        `SELECT id FROM product WHERE name = ? OR slug = ? LIMIT 1`,
        [name, uniqueSlug]
      );
      if (existing.length === 0) break; // Unique
      uniqueSlug = `${slug}-${counter++}`;
    }

    slug = uniqueSlug;

    // Multiple product images
    const imageFiles = formData.getAll("images"); // multiple <input name="images" />
    const uploadedProductImages = await Promise.all(
      imageFiles.map(file =>
        file.size > 0
          ? uploadToCloudinary(file, "NurzatProducts")
          : null
      )
    );

    // Colors with images
    const colors = JSON.parse(formData.get("colors") || "[]");

    const updatedColors = await Promise.all(
      colors.map(async (color, idx) => {
        const colorFiles = formData.getAll(`colorImage_${idx}[]`); // ✅ key fix
        const uploadedColorImages = await Promise.all(
          colorFiles.map(file =>
            file.size > 0
              ? uploadToCloudinary(file, "NurzatProducts/colors")
              : null
          )
        );
        return { ...color, images: uploadedColorImages.filter(Boolean) }; // remove nulls
      })
    );
    

    // Save to DB
    const [result] = await connection.execute(
      `INSERT INTO product 
      (name, code, slug, short_description, description, isActive, isFeatured, tags, images, colors, sizes, features, specifications, inStock, sku, barcode, weight, collectionId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        code,
        slug,
        short_description,
        description,
        isActive ? 1 : 0,
        isFeatured ? 1 : 0,
        JSON.stringify(tags),
        JSON.stringify(uploadedProductImages.filter(Boolean)),
        JSON.stringify(updatedColors),
        JSON.stringify(sizes),
        JSON.stringify(features),
        JSON.stringify(specifications),
        inStock ? 1 : 0,
        sku,
        barcode,
        weight,
        collectionId,
      ]
    );

    return NextResponse.json(
      { message: "Product saved successfully!", id: result.insertId },
      { status: 201 }
    );

  } catch (err) {
    console.error("Product Save Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    const [rows] = await connection.execute(`SELECT 
        p.*, 
        c.name AS collectionName
      FROM 
        product p
      JOIN 
        collection c ON p.collectionId = c.id
      ORDER BY 
        p.id DESC`);

    // ✅ Parse images JSON string
    const products = rows.map(product => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      colors: JSON.parse(product.colors || "[]"),
      sizes: JSON.parse(product.sizes || "[]"),
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

