import { NextResponse } from 'next/server';
import connection from '@/lib/connection';
export async function POST(req) {
    const { name, productName, companyName, email, phone, message } = await req.json();
  
    try {
      const [result] = await connection.execute(
        'INSERT INTO inquiries (name, product_name, company_name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)',
        [name, productName, companyName, email, phone, message]
      );
  
      return NextResponse.json({ success: true, message: 'Inquiry saved!' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, message: 'DB error' }, { status: 500 });
    }
  }
  