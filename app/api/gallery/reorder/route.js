import connection from "@/lib/connection";
import { NextResponse } from "next/server";

// ✅ PUT -> Reorder gallery images (drag & drop)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { order } = body; // array of { id, sort_order }

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ error: "Order array is required" }, { status: 400 });
    }

    // Update each image's sort_order
    const updates = order.map(({ id, sort_order }) =>
      connection.execute("UPDATE gallery SET sort_order = ? WHERE id = ?", [sort_order, id])
    );

    await Promise.all(updates);

    return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error reordering gallery:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
