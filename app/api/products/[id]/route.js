import connection from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(req, { params }) {
  const { id } = params;

  try {
    const [rows] = await connection.query(
      // "SELECT * FROM products WHERE id = ?", [id]
      "SELECT products.*, collections.name AS collection_name FROM products JOIN collections ON products.collectionId = collections.id WHERE products.id = ?", [id]
    );
    
    if (rows.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching the product.' }), { status: 500 });
  }
}


// PUT Method for Updating a Product
export async function PUT(request, { params }) {
  const { id } = params; // Extract the product ID from the URL parameters
  const data = await request.formData();
  
  const name = data.get("name");
  const description = data.get("description");
  const info = data.get("info");
  const quality = data.get("quality");
  const maintanace = data.get("maintanace");
  const collectionId = data.get("collectionId");
  const color = data.get("color");
  const rugs = data.get("rugs");
  const sizes = data.getAll("sizes");
  const tags = data.getAll("tags");
  const files = data.getAll("files");

  // Validation check (uncomment if needed)
  // if (!name || !info || !description || !quality || !maintanace || !collectionId || !tags || !rugs || !color || !sizes) {
  //     return NextResponse.json({ error: "Product name and Product Details are required" }, { status: 400 });
  // }

  try {
    // const connection = await mysql.createConnection(dbConfig);
    
    // Create a directory to store the files if it does not exist
    const uploadDir = path.resolve("./public/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file paths to an array
    const filePaths = [];
    const fileName = [];

    for (const file of files) {
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const filePath = path.join(uploadDir, file.name);

        // Save file to the file system
        await writeFile(filePath, buffer);

        // Store the relative file path (e.g., '/uploads/filename.jpg')
        filePaths.push(`/uploads/${file.name}`);
        fileName.push(file.name);
    }

    // Update the product in the database with new values
    const [result] = await connection.execute(
      "UPDATE products SET name = ?, description = ?, info = ?, quality = ?, maintanace = ?, tags = ?, images = ?, image_path = ?, color = ?, rugs = ?, sizes = ?, collectionId = ? WHERE id = ?",
      [
        name,
        description,
        info,
        quality,
        maintanace,
        JSON.stringify(tags),
        JSON.stringify(filePaths), // Store the array of image paths
        JSON.stringify(fileName),
        color,
        rugs,
        JSON.stringify(sizes),
        collectionId,
        id // Use the product ID from the URL to update the correct product
      ]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
  }
}

