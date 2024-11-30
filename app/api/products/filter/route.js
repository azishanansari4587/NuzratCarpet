// import connection from "@/lib/db"; // Assuming you have a db.js file for database connection

// export async function POST(req) {
//     const { color, quality, rugs, collectionId } = await req.json();
    
//     try {

//         let query = "SELECT * FROM products WHERE 1=1";
//         const queryParams = [];

//         if (color) {
//             query += " AND color = ?";
//             queryParams.push(color);
//         }

//         if (quality) {
//             query += " AND quality = ?";
//             queryParams.push(quality);
//         }

//         if (rugs) {
//             query += " AND rugs = ?";
//             queryParams.push(rugs);
//         }

//         // if (tags && tags.length > 0) {
//         //     query += " AND JSON_CONTAINS(tags, ?)";
//         //     queryParams.push(JSON.stringify(tags));
//         // }

//         if (collectionId) {
//             query += " AND collectionId = ?";
//             queryParams.push(collectionId);
//         }

//         // Add other filters similarly...

//         const [products] = await connection.execute(query, queryParams);
//         return new Response(JSON.stringify(products), { status: 200 });
//     } catch (error) {
//         console.error('Error fetching filtered products:', error);
//         return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
//     }
// }

// import connection from '@/lib/db';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//     try {
//       // Parse the JSON body from the request
//       const filters = await request.json();
  
//       // Get filtered products based on the filters
//       const filteredProducts = await getFilteredProducts(filters);
  
//       return NextResponse.json(filteredProducts);
//     } catch (error) {
//       console.error('Error fetching filtered products:', error);
//       return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//     }
//   }


// export async function getFilteredProducts(filters) {
//   const { color, quality, category, material } = filters;

//   let whereClauses = [];
//   let queryParams = [];

//   if (color.length) {
//     whereClauses.push('color IN (?)');
//     queryParams.push(color);
//   }
//   if (quality.length) {
//     whereClauses.push('quality IN (?)');
//     queryParams.push(quality);
//   }
//   if (category.length) {
//     whereClauses.push('category IN (?)');
//     queryParams.push(category);
//   }
//   if (material.length) {
//     whereClauses.push('material IN (?)');
//     queryParams.push(material);
//   }

//   const whereClause = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

//   const query = `SELECT * FROM products ${whereClause}`;
  
//   try {
//     const [rows] = await connection.execute(query, queryParams);
//     return rows;
//   } catch (error) {
//     console.error('Error fetching products from the database:', error);
//     throw new Error('Failed to fetch products');
//   }
// }


export async function GET(request) {
  const url = new URL(request.url);
  const color = url.searchParams.get('color');
  const quality = url.searchParams.get('quality');
  const rugs = url.searchParams.get('rugs');
  const collectionId = url.searchParams.get('collectionId');

  let query = "SELECT * FROM products WHERE 1=1";
  const queryParams = [];

  if (color) {
     query += " AND color = ?";
     queryParams.push(color);
  }

  if (quality) {
     query += " AND quality = ?";
     queryParams.push(quality);
  }

  if (rugs) {
     query += " AND rugs = ?";
     queryParams.push(rugs);
  }

  if (collectionId) {
     query += " AND collectionId = ?";
     queryParams.push(collectionId);
  }

  try {
     const [products] = await connection.execute(query, queryParams);
     return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
     console.error('Error fetching filtered products:', error);
     return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}