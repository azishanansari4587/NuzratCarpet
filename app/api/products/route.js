import  connection  from '@/lib/connection';
import { NextResponse } from 'next/server';
import  cloudinary  from '@/lib/cloudinary';


// pages/api/products.js OR app/api/products/route.js (agar app router use kar raha h)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // default 1mb hai
    },
  },
};



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
    const designers = JSON.parse(formData.get("designers") || "[]");
    const sizes = JSON.parse(formData.get("sizes") || "[]");
    const features = JSON.parse(formData.get("features") || "[]");
    const specifications = JSON.parse(formData.get("specifications") || "[]");
    const collectionId = formData.get("collectionId");

    const isOutlet = formData.get("isOutlet") === "true";
    const outletOldPrice = formData.get("outletOldPrice");
    const outletNewPrice = formData.get("outletNewPrice");
    const outletDiscount = formData.get("outletDiscount");
    const care = formData.get("care");
    const certification = formData.get("certification");

    // ✅ Images & Colors are already Cloudinary URLs from frontend
    const images = JSON.parse(formData.get("images") || "[]"); 
    const colors = JSON.parse(formData.get("colors") || "[]");

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

    

    // Save to DB
    const [result] = await connection.execute(
      `INSERT INTO product 
      (name, code, slug, short_description, description, isActive, isFeatured, tags, designers, images, colors, sizes, features, specifications, inStock, sku, care, certification, barcode, weight, collectionId, isOutlet, outletOldPrice, outletNewPrice, outletDiscount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        code,
        slug,
        short_description,
        description,
        isActive ? 1 : 0,
        isFeatured ? 1 : 0,
        JSON.stringify(tags),
        JSON.stringify(designers),

        JSON.stringify(images),   // ✅ Already URLs
        JSON.stringify(colors),   // ✅ Each color already has images[] URLs

        JSON.stringify(sizes),
        JSON.stringify(features),
        JSON.stringify(specifications),
        inStock ? 1 : 0,
        sku,
        care, 
        certification,
        barcode,
        weight,
        collectionId,
        isOutlet ? 1 : 0,
        outletOldPrice,
        outletNewPrice,
        outletDiscount
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

// ** DELETE METHOD
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Delete query
    const [result] = await connection.execute(
      "DELETE FROM product WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      message: "Product deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

