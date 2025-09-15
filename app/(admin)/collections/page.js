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
import { Eye, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';


export default function ViewCollections() {
  
  // Mock collections data
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections"); // 🔁 your API route here
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch collections");
      setCollections(data || []);
      console.log("Fetched collections:", data);

    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch collections from backend
  useEffect(() => {
    fetchCollections();
  }, []);


   // Dialog states
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [selectedCollection, setSelectedCollection] = useState(null);

   // States
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
      id: null,
      name: "",
      description:"",
      image: "",
      isActive: false,
      isFeatured: false,
    });


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






  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/collections/${selectedCollection.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Collection deleted successfully");
      setDeleteDialogOpen(false);
      fetchCollections();
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Collections</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-forest-800">
            <Link href="/collections/add_collections" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Collection
            </Link>
          </Button>
        </div>
        {loading ? (
            <Spinner />
        ) : (
        <div className="bg-white border border-forest-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Collection Name</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>

                      <div className="relative w-12 h-12">
                        <Image
                          src={collection.image || "/placeholder.jpg"} // fallback in case image is missing
                          alt={collection.name || "Collection image"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                    </TableCell>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell className="text-center">{collection.productCount || 0}</TableCell>

                    <TableCell className="text-center"> 
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </TableCell>
                    <TableCell className="text-center"> 
                      {collection.isFeatured ? 'Featured' : 'Not Featured'}
                    </TableCell>

                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEditOpen(collection)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedCollection(collection); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
        
            </Table>
          </div>
          
          {collections.length === 0 && (
            <div className="text-center py-8 text-forest-600">
              No collections found. Create your first collection to get started.
            </div>
          )}

        </div>
        )}
      </div>

      {/* *** Edit Collection Dialog ****/}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen} className="mx-auto max-w-7xl fixed inset-0 z-50 flex items-center justify-center">
        <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0" />
        <DialogContent className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Collection Image</label>
            
            {/* Preview */}
            <div className="relative w-24 h-24 mb-2">
              <Image
                src={editForm.image || "/placeholder.jpg"}
                alt="Preview"
                fill
                className="object-cover rounded"
              />
            </div>

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Preview image
                  const previewUrl = URL.createObjectURL(file);
                  setEditForm((prev) => ({
                    ...prev,
                    image: previewUrl,
                    file, // actual file for upload
                  }));
                }
              }}
              className="block text-sm text-gray-600"
            />
          </div>


          {/* Collection Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              value={editForm.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              rows={4}
              value={editForm.description}
              onChange={(e) => handleEditChange("description", e.target.value)}
            />
          </div>

          {/* Status Switch */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <Switch
              checked={editForm.isActive}
              onCheckedChange={(val) => handleEditChange("isActive", val ? 1 : 0)} // ✅ force 1/0
            />
          </div>

          {/* Featured Switch */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-700">Featured</span>
            <Switch
              checked={editForm.isFeatured}
              onCheckedChange={(val) => handleEditChange("isFeatured", val ? 1 : 0)} // ✅ force 1/0
            />
          </div>

          <DialogFooter>
            <Button onClick={handleUpdate} className="bg-primary">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>




      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0" />
        <DialogContent className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete &quot;{selectedCollection?.name}&quot;?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}