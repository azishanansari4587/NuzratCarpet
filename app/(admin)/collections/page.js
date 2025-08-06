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
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ArrowLeft, Eye, FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';

export default function ViewCollections() {
  const { toast } = useToast();
  
  // Mock collections data
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch collections from backend
  useEffect(() => {
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
      
      toast({
        title: currentValue ? "Collection Deactivated" : "Collection Activated",
        description: message,
      });
    } else {
      message = currentValue 
        ? "The collection has been removed from featured." 
        : "The collection is now featured on your store.";
      
      toast({
        title: currentValue ? "Collection Unfeatured" : "Collection Featured",
        description: message,
      });
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
                    <TableCell className="text-right">
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
    </div>
  );
}