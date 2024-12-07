import connection from "@/lib/db";


import { NextResponse } from 'next/server';
 // Assuming you have set up your DB connection

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }

  // Check if the token exists in the database
  const subscriber = await connection('users').where({ verification_token: token }).first();
  if (!subscriber) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  // Update the subscriber's status to verified
  await connection('users').where({ verification_token: token }).update({ is_verified: true });

  return NextResponse.json({ message: 'Email verified successfully!' }, { status: 200 });
}



// export async function GET(req) {
//     try {
//         // Extract the token from the query
//         const { searchParams } = new URL(req.url);
//         const token = searchParams.get("token");

//         if (!token) {
//             return new Response(
//                 JSON.stringify({ error: 'Verification token is missing' }),
//                 { status: 400 }
//             );
//         }

//         // Update the subscriber's verification status
//         const [result] = await connection.execute(
//             "UPDATE subscribers SET is_verified = ? WHERE verification_token = ?",
//             [true, token]
//         );

//         if (result.affectedRows === 0) {
//             return new Response(
//                 JSON.stringify({ error: 'Invalid or expired verification token' }),
//                 { status: 400 }
//             );
//         }

//         return new Response(
//             JSON.stringify({ message: 'Email verified successfully' }),
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error verifying email:", error.message);
//         return new Response(
//             JSON.stringify({ error: 'Database error: ' + error.message }),
//             { status: 500 }
//         );
//     }
// }


// export default async function handler(req, res) {
//     if (req.method === "GET"){
//         const {token} = req.query;

//         if (!token) {
//             return res.status(400).json({ error: 'Verification token is missing' });
//         }

//         try {
//             const [result] = await connection.execute(
//                 "UPDATE subscribers SET is_verified = ? WHERE verification_token = ?", [token]
//             );

//             if (result.affectedRows === 0) {
//                 return res.status(400).json({ error: 'Invalid verification token' });
//             }

//             return res.status(200).json({ message: 'Email verified successfully' });
//         } catch (error) {
//             return res.status(500).json({ error: 'Database error: ' + error.message });
//         } finally {
//             connection.end();
//         }
//     } else {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }
// }