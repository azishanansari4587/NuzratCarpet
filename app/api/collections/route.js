import { NextResponse } from "next/server";
import connection from "@/lib/db";



export async function POST(request) {
    const { name, status } = await request.json();

    if (!name) {
        return NextResponse.json({ error: 'Please fill in all fields'}, {status: 400});
    }

    try {
        //Check if collections already exists 
        // const [collectionExists] = await connection.execute("SELECT * FROM collections WHERE name = ?", [name]);
        // if( collectionExists.length > 0) {
        //     return NextResponse.json({error: "Collection already exists"}, {status: 400});
        // }

        //Insert the new user into the database 
        const [result] = await connection.execute(
            "INSERT INTO collections (name, status) VALUES (?, ?)",
            [name, status]
        );

        return NextResponse.json({message: 'Collection add successfully', id: result.insertId}, {status: 201});

    } catch (error) {
        return NextResponse.json({error: "Database error: " + error.message}, {status: 500});
    }
}


export async function GET() {
    try {
      const [rows] = await connection.execute('SELECT * FROM collections');
      return NextResponse.json(rows, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }
}


