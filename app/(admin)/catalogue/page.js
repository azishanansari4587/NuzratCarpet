"use client";
import { Button } from "@/components/ui/button";
import withAuth from "@/lib/withAuth";
import { Book, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const ViewCatalogues = () => {
  const [catalogues, setCatalogues] = useState([]);

  useEffect(() => {
    fetch("/api/catalogues")
      .then((res) => res.json())
      .then((data) => setCatalogues(data.catalogues || [])) // ✅ only array set
      .catch((err) => console.error("Fetch error:", err));
  }, []);


  // React component ke andar
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this catalogue?")) return;
  
    try {
      const res = await fetch(`/api/catalogues/${id}`, {
        method: "DELETE",
      });
  
      const result = await res.json();
  
      if (!res.ok) throw new Error(result.error || "Failed to delete catalogue");
  
      // ✅ UI se remove karna
      setCatalogues((prev) => prev.filter((project) => project.id !== id));
  
      toast.success("Catalogue deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-forest-700" />
                <h1 className="text-3xl font-serif font-bold text-forest-800">Catalogue</h1>
            </div>
            <Button asChild className="bg-primary hover:bg-forest-800">
                <Link href="/catalogue/add_catalogue" className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Catalogue
                </Link>
            </Button>
        </div>

      {catalogues.length === 0 ? (
        <p className="text-gray-500">No catalogues found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogues.map((c) => (
            <div key={c.id} className="border p-4 rounded-md shadow">
                <div className="relative group w-full h-48">
                    {/* Image */}
                    <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-full  h-full object-cover rounded"
                    />

                    {/* Delete Button */}
                    <button
                        onClick={() => handleDelete(c.id)}
                        className="
                        absolute top-2 right-2
                        bg-white/90 hover:bg-white
                        p-2 rounded-full shadow-md
                        text-red-600 hover:text-red-700
                        opacity-0 group-hover:opacity-100
                        transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-red-400
                        "
                        aria-label="Delete banner"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
                <h2 className="font-semibold mb-2">{c.title}</h2>
                <Link
                    href={c.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    View PDF
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(ViewCatalogues, [1]);
