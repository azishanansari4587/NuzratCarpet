"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from 'next/link';
import { Eye, FolderOpen, ImageIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';


export default function Banner() {
  
  // Mock collections data
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        const data = await res.json();
         // ✅ agar data object hai {banners: [...]}, array extract karo
      setBanners(Array.isArray(data) ? data : data.banners || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);





    // Open edit modal and pre-fill data
    const handleEditOpen = (collection) => {
      setEditForm({
        id: collection.id,
        slug: collection.slug,
        name: collection.name,
        description: collection.description,
        image: collection.image || "/placeholder.jpg",
        isActive: collection.isActive === 1,     // ✅
        isFeatured: collection.isFeatured === 1, // ✅

      });
      setEditDialogOpen(true);
    };


    // Handle form update
    const handleEditChange = (field, value) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
      try {
        const formData = new FormData();
        formData.append("name", editForm.name);
        formData.append("description", editForm.description);
        formData.append("isActive", editForm.isActive);     // already 1/0 ✅
        formData.append("isFeatured", editForm.isFeatured); // already 1/0 ✅


        if (editForm.file) {
          formData.append("image", editForm.file); // new image file
        }

        const res = await fetch(`/api/collections/${editForm.slug}`, {
          method: "PUT",
          body: formData,
        });

        if (!res.ok) throw new Error("Update failed");

        toast.success("Collection updated successfully");
        setEditDialogOpen(false);
        fetchCollections();
      } catch (err) {
        toast.error(err.message);
      }
    };






// React component ke andar
const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this banner?")) return;

  try {
    const res = await fetch(`/api/banners/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Failed to delete banner");

    // ✅ UI se remove karna
    setBanners((prev) => prev.filter((banner) => banner.id !== id));

    toast.success("Banner deleted successfully");
  } catch (err) {
    console.error("Delete error:", err);
    toast.error(err.message || "Something went wrong");
  }
};



  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Banners</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-forest-800">
            <Link href="/banners/add_banners" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Banner
            </Link>
          </Button>
        </div>
        {loading ? (
            <Spinner />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {banners.map((banner) => (
    <div
      key={banner.id}
      className="relative w-full pt-[100%] rounded-md overflow-hidden border border-gray-300 group"
    >
      {/* Banner Image */}
      <Image
        src={banner.imageUrl || "/placeholder.jpg"} // fallback
        alt={`Banner ${banner.id}`}
        fill
        className="object-cover rounded-md"
      />

      {/* Delete button - hidden by default, visible on hover */}
      <button
        onClick={() => handleDelete(banner.id)}
        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        // aria-label="Delete banner"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  ))}
</div>
        )}
      </div>

    </div>
  );
}