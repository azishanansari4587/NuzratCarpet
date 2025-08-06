import connection from '@/lib/connection';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  const params = await context.params; // ✅ await required
  const slug = params.slug;

  try {
    const [rows] = await connection.query(
      'SELECT * FROM product WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = rows[0];

    // Safely parse all JSON fields
    const formattedProduct = {
      ...product,
      colors: JSON.parse(product.colors || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      features: JSON.parse(product.features || '[]'),
      specifications: JSON.parse(product.specifications || '[]'),
      images: JSON.parse(product.images || '[]'),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('PRODUCT GET ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
