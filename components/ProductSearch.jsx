"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProductSearch({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      onResults([]); // Empty input → no results
      return;
    }

    try {
      const res = await fetch(`/api/products/search?q=${value}`);
      const data = await res.json();
      onResults(data.products);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="hidden md:flex flex-1 max-w-lg mx-8">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search for rugs, patterns, colors..."
          value={query}
          onChange={handleSearch}
          className="pl-10 pr-4"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
    </div>
  );
}
