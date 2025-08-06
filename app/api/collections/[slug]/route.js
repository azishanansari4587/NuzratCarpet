import { NextResponse } from "next/server";
import connection from "@/lib/connection";


// export async function GET(request, { params }) {
//   const { slug } = params;

//   try {
//     const [rows] = await connection.query('SELECT * FROM collections WHERE slug = ?', [slug]);

//     if (rows.length === 0) {
//       return NextResponse.json({ error: 'Collections not found' }, { status: 404 });
//     }
//     return NextResponse.json(rows[0]);
//   } catch (error) {
//     return NextResponse.json({ error: 'Database error' }, { status: 500 });
//   }
// }


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


export async function PUT(request, { params }) {
    const { slug } = params;
    const { name, status } = await request.json();
  
    try {
      const [result] = await connection.execute(
        'UPDATE collections SET name = ?, status = ?, description = ?, image = ? WHERE slug = ?',
        [name, status, description, image, slug]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Collection updated successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }
}