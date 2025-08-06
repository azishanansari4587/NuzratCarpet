import connection from "@/lib/connection";
import { NextResponse } from "next/server";





export async function GET(req, context) {
  const { slug } = await context.params;

    if (!slug) {
      return new Response(JSON.stringify({ error: "Product Slug is required" }), { status: 400 });
    }

  
    try {
      const [rows] = await connection.query("SELECT * FROM products WHERE slug = ?", [slug]);
      
      if (rows.length === 0) {
        return new NextResponse(JSON.stringify({ error: 'Product not found' }), { status: 404 });
      }

      const product = rows[0];

        const [relatedProductRows] = await connection.execute(
        'SELECT * FROM products WHERE collectionId = ? AND slug != ?',
        [product.collectionId, slug]
        );

        if (relatedProductRows.length === 0) {
        return new NextResponse(JSON.stringify({ message: "No related products found" }), { status: 404 });
        }

        return NextResponse.json(relatedProductRows, { status: 200 });

    } catch (error) {
      return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching the product.' }), { status: 500 });
    }
}