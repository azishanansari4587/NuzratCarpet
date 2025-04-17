import { NextResponse } from "next/server";
import connection from "@/lib/db";
import cloudinary from "cloudinary";


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});





export async function POST(request) {
  
    try {
        //Check if collections already exists 
        // const [collectionExists] = await connection.execute("SELECT * FROM collections WHERE name = ?", [name]);
        // if( collectionExists.length > 0) {
        //     return NextResponse.json({error: "Collection already exists"}, {status: 400});
        // }
        const formData = await request.formData();
        const name = formData.get('name');
        // const slug = formData.get('slug');
        const status = formData.get('status');
        const description = formData.get('description');
        const imageFile = formData.get('image');
        // const { name, status } = await request.json();
        const slugify = (str) => {
          if (!str) return Date.now().toString(); // Use a unique timestamp if name is empty
          return str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special chars with '-'
            .replace(/^-+|-+$/g, ""); // Remove leading/trailing '-'
        };
      
        const slug = slugify(name);

        
        if (!name || !status || !description || !imageFile) {
            return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 });
        }
  
      // Upload image to Cloudinary
        const byteData = await imageFile.arrayBuffer();
        const buffer = Buffer.from(byteData);

        const base64String = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

        //* Upload to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(base64String, {
        folder: "NuzratProducts",
        });

        const imageUrl = uploadResponse.secure_url;

        // Check if slug already exists
      const [existing] = await connection.query(
        'SELECT id FROM collections WHERE slug = ?',
        [slug]
      );

      if (existing.length > 0) {
        return NextResponse.json({ error: 'Collection with similar name already exists' }, { status: 400 });
      }
  
  
        //Insert the new user into the database 
        const [result] = await connection.execute(
           "INSERT INTO collections (name, slug, status, description, image) VALUES (?, ?, ?, ?, ?)",
            [name, slug, status, description, imageUrl]
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


