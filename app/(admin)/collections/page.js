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
import EditCollectionDialog from '@/components/EditCollection';
import { toast } from 'react-toastify';


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

  const handleDeleteCollection = (id, name) => {
    // In a real app, would call API to delete
    setCollections(collections.filter(collection => collection.id !== id));
    
    toast({
      title: "Collection Deleted",
      description: `${name} has been removed from your collections.`,
    });
  };

  const handleToggleStatus = (id, field, currentValue) => {
    // In a real app, would call API to update
    setCollections(collections.map(collection => 
      collection.id === id ? { ...collection, [field]: !currentValue } : collection
    ));
    
    let message = "";
    if (field === 'isActive') {
      message = currentValue 
        ? "The collection has been hidden from your store." 
        : "The collection is now visible in your store.";
      
      toast.success( currentValue ? "Collection Deactivated" : "Collection Activated");
    } else {
      message = currentValue 
        ? "The collection has been removed from featured." 
        : "The collection is now featured on your store.";
      
      toast.error(
        currentValue ? "Collection Unfeatured" : "Collection Featured",
        );
    }
  };


   // Dialog states
   const [viewDialogOpen, setViewDialogOpen] = useState(false);
   const [editDialogOpen, setEditDialogOpen] = useState(false);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
 
   const [selectedCollection, setSelectedCollection] = useState(null);
   const [editForm, setEditForm] = useState({
     name: "",
     description: "",
     isActive: false,
     isFeatured: false,
     image: null
   });

const handleEditClick = (collection) => {
  setSelectedCollection(collection);
  setEditDialogOpen(true);
};


  //*** */
  const handleView = async (slug) => {
    try {
      const res = await fetch(`/api/collections/${slug}`);
      const data = await res.json();
      setSelectedCollection(data.collection);
      setViewDialogOpen(true);
    } catch {
      toast.error("Failed to load collection");
    }
  };

  const handleEditOpen = (collection) => {
    setSelectedCollection(collection);
    setEditForm({
      name: collection.name,
      description: collection.description || "",
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
      image: null
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("isActive", editForm.isActive);
      formData.append("isFeatured", editForm.isFeatured);
      if (editForm.image) formData.append("image", editForm.image);

      const res = await fetch(`/api/collections/${selectedCollection.slug}`, {
        method: "PUT",
        body: formData
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
                      {/* <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-12 h-12 object-cover rounded"
                      /> */}
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
                      <button
                        onClick={() => handleToggleStatus(collection.id, 'isActive', collection.isActive)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          collection.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {collection.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleStatus(collection.id, 'isFeatured', collection.isFeatured)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          collection.isFeatured
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {collection.isFeatured ? 'Featured' : 'Not Featured'}
                      </button>
                    </TableCell>
                    {/* <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <Link href={`/collections/${collection.id}`}>
                            <span className="sr-only">View</span>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <Link href={`/admin/collections/edit/${collection.id}`}>
                            <span className="sr-only">Edit</span>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCollection(collection.id, collection.name)}
                        >
                          <span className="sr-only">Delete</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell> */}

                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleView(collection.slug)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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

      {/* *** */}
      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0" />
        <DialogContent className="bg-white rounded-lg shadow-lg w-full max-w-7xl max-h-[80vh] p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCollection?.name}</DialogTitle>
          </DialogHeader>
          {selectedCollection && (
            <>
              <Image src={selectedCollection.image} alt={selectedCollection.name} width={200} height={200} className="rounded" />
              <p>{selectedCollection.description}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {/* <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0" />
        <DialogContent className="bg-white rounded-lg shadow-lg w-full max-w-7xl max-h-[80vh] p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      {selectedCollection && (
      <EditCollectionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        collection={selectedCollection}
        refreshCollections={fetchCollections}
      />
    )}

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