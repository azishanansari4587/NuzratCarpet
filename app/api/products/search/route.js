import connection from "@/lib/connection"; // your MySQL connection


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return new Response(JSON.stringify({ products: [] }), { status: 200 });
  }

  try {
    const [rows] = await connection.execute(
      `SELECT id, name, slug, description, images, tags, colors, sizes
       FROM product 
       WHERE name LIKE ? 
       OR description LIKE ? 
       OR tags LIKE ? 
       LIMIT 10`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    // Parse JSON fields safely
    const products = rows.map((item) => {
      let images = [];
      let tags = [];
      let colors = [];
      let sizes = [];
      let material = [];
      let info = [];

      try { images = JSON.parse(item.images); } catch {}
      try { tags = JSON.parse(item.tags); } catch {}
      try { colors = JSON.parse(item.colors); } catch {}
      try { sizes = JSON.parse(item.sizes); } catch {}
      try { material = JSON.parse(item.material); } catch {}
      try { info = JSON.parse(item.info); } catch {}

      return {
        ...item,
        images,
        tags,
        colors,
        sizes,
        material,
        info
      };
    });

    return new Response(JSON.stringify({ products }), { status: 200 });

  } catch (err) {
    console.error("Search API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
