import { NextResponse } from "next/server";
import connection from "@/lib/db";


export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const [rows] = await connection.query('SELECT * FROM collections WHERE slug = ?', [slug]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Collections not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
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