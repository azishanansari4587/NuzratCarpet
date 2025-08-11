import connection from "@/lib/connection";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { slug } = await context.params; // ✅ params awaited

  if (!slug) {
    return NextResponse.json({ error: "Product Slug is required" }, { status: 400 });
  }

  try {
    // Find current product
    const [rows] = await connection.query(
      "SELECT * FROM product WHERE slug = ?",
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = rows[0];

    // Find related products (same collection, different slug)
    const [relatedProductRows] = await connection.execute(
      "SELECT * FROM product WHERE collectionId = ? AND slug != ?",
      [product.collectionId, slug]
    );

    if (relatedProductRows.length === 0) {
      return NextResponse.json({ message: "No related products found" }, { status: 404 });
    }

    const formattedProduct = relatedProductRows.map((product) => ({
      ...product,
      colors: JSON.parse(product.colors || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      features: JSON.parse(product.features || '[]'),
      specifications: JSON.parse(product.specifications || '[]'),
      images: JSON.parse(product.images || '[]'),
    }));

    return NextResponse.json(
      { relatedProducts: formattedProduct },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
}
