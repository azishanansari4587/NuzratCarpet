"use client";
import { useState } from "react";
import ProductSearch from "./ProductSearch";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  return (
    <div>
      {/* Search Bar */}
      <ProductSearch onResults={setProducts} />

      {/* Display Search Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {products.length > 0 ? (
            products.map((p) => (
                <div key={p.id} className="border p-4 rounded">
                <img src={p.filePaths?.split(",")[0]} alt={p.name} className="w-full h-40 object-cover" />
                <h2 className="font-bold mt-2">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.color}</p>
                </div>
            ))
            ) : (
            <p className="text-gray-500 col-span-full">No products found</p>
            )}
        </div>
    </div>
  );
}
