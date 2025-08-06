import  connection  from '@/lib/connection';
import { NextResponse } from 'next/server';
import  cloudinary  from '@/lib/cloudinary';

async function uploadToCloudinary(base64Image) {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: 'NurzatProducts',
  });
  return result.secure_url;
}


function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


export async function POST(req) {
  try {
    const body = await req.json();

    let {
      name,
      code,
      isActive,
      isFeatured,
      short_description,
      description,
      images, // Base64 array
      colors, // with base64 images
      sizes,
      features,
      specifications,
      inStock,
      sku,
      barcode,
      weight,
      tags,
      // quantity,
      collectionId,
    } = body;

    const slug = generateSlug(name);


    // ✅ Upload main product images to Cloudinary


    const uploadedProductImages = await Promise.all(
      images.map(async (img) => {
        if (img.startsWith("data:")) {
          return await uploadToCloudinary(img);
        }
        return img; // already uploaded
      })
    );
    


    const updatedColors = await Promise.all(
      colors.map(async (color) => {
        const updatedImages = await Promise.all(
          color.images.map(async (img) => {
            if (img.startsWith("data:")) {
              return await uploadToCloudinary(img);
            }
            return img;
          })
        );
        return { ...color, images: updatedImages };
      })
    );
    


    const [result] = await connection.execute(
      `INSERT INTO product 
      (name, code, slug, short_description, description, isActive, isFeatured, tags, images, colors, sizes, features, specifications, inStock, sku, barcode, weight,  collectionId) 
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
        JSON.stringify(uploadedProductImages),
        JSON.stringify(updatedColors),
        JSON.stringify(sizes),
        // JSON.stringify(categories),
        JSON.stringify(features),
        JSON.stringify(specifications),
        inStock ? 1 : 0,
        sku,
        barcode,
        weight,
        collectionId,
      ]
    );

    return NextResponse.json({ message: 'Product saved with Cloudinary images!' }, { status: 201 });

  } catch (err) {
    console.error('Product Save Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// export async function GET(req) {
//   try {
//     const [rows] = await connection.execute("SELECT * FROM product ORDER BY id DESC");

//     // Parse JSON fields (optional, depends how you want to return it)
//     const products = rows.map((product) => ({
//       ...product,
//       images: JSON.parse(product.images || "[]"),
//       colors: JSON.parse(product.colors || "[]"),
//       sizes: JSON.parse(product.sizes || "[]"),
//       features: JSON.parse(product.features || "[]"),
//       specifications: JSON.parse(product.specifications || "[]"),
//     }));

//     return new Response(JSON.stringify(products), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });

//   } catch (error) {
//     console.error("GET product error:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
//       status: 500,
//     });
//   }
// }

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

