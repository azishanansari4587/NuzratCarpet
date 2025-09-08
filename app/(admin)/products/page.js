"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from 'next/link';
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";



export default function ViewProducts() {
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [collections, setCollections] = useState([]);

useEffect(() => {
  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections([{ id: "all", name: "All Collections" }, ...data]);
    } catch (err) {
      console.error("Failed to load collections:", err);
    }
  };

  fetchCollections();
}, []);

// ** Safe Parse ** //
const safeParse = (value, fallback = []) => {
  try {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value);
    if (Array.isArray(value)) return value;
    return fallback;
  } catch {
    return fallback;
  }
};


const fetchProducts = async () => {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (res.ok) {
      // Convert to expected shape
      const formatted = data.products.map(p => ({
        id: p.id,
        name: p.name,
        image: p.images?.[0] || "/placeholder.svg", // First image or fallback
        // category: p.category,
        collectionId: p.collectionId, 
        stock: p.stock,
        tags: safeParse(p.tags, []),
        sizes: safeParse(p.sizes, []),
        designers: safeParse(p.designers, []),
        active: p.active === 1, // assuming active is TINYINT(1)
      }));

      setProducts(formatted);
    } else {
      console.error("Failed to fetch products:", data.error);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const collectionOptions = [...collections];



  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = collectionFilter === "all" || product.collectionId.toString() === collectionFilter;
    return matchesSearch && matchesCollection;
  });


 


  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        setProducts(products.filter(product => product.id !== id));
        toast.success("Product deleted successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete product.");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting the product.");
    }
  };

  const [deleteProduct, setDeleteProduct] = useState(null);

  
  

  const handleToggleActive = (id, currentState) => {
    // In a real app, would call API to update
    setProducts(products.map(product => 
      product.id === id ? { ...product, active: !currentState } : product
    ));
    
    toast({
      title: currentState ? "Product Deactivated" : "Product Activated",
      description: currentState 
        ? "The product has been hidden from your store." 
        : "The product is now visible in your store.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Products</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-forest-800">
            <Link href="/products/add_product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
        
        <Card className="mb-8 border-forest-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label htmlFor="search" className="text-sm font-medium text-forest-800">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-forest-500" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name, SKU, etc."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64 space-y-2">
                <label htmlFor="collectionFilter" className="text-sm font-medium text-forest-800">
                  Filter by Collection
                </label>
                <select
                  id="collectionFilter"
                  value={collectionFilter}
                  onChange={(e) => setCollectionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                >
                  {collectionOptions.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>

              </div>

            </div>
          </CardContent>
        </Card>
        {loading ? (
            <Spinner />
        ) : (
        <div className="bg-white border border-forest-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Collection Name</TableHead>
                  <TableHead className="text-center">Tags</TableHead>
                  <TableHead className="text-center">Sizes</TableHead>
                  <TableHead className="text-center">Designers</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>

                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.jpg"}  // fallback if image is missing
                            alt={product.name || "Product image"}
                            fill
                            className="object-cover"
                          />
                        </div>

                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{collections.find((col) => col.id === product.collectionId)?.name || "N/A"}</TableCell>
                      <TableCell className="text-center"> {product.tags.map((tag, index) => ( <span key={index} className="px-2 py-1 gap-4 text-xs font-medium rounded-full bg-gray-200 text-gray-700" > {tag} </span> ))} </TableCell>
                      <TableCell className="text-center"> {product.sizes.map((size, index) => ( <span key={index} className="px-2 py-1 gap-4 text-xs font-medium rounded-full bg-gray-200 text-gray-700" > {size} </span> ))} </TableCell>
                      <TableCell className="text-center"> {product.designers.map((designer, index) => ( <span key={index} className="px-2 py-1 gap-4 text-xs font-medium rounded-full bg-gray-200 text-gray-700" > {designer} </span> ))} </TableCell>

                      <TableCell className="text-center">
                        <button
                          onClick={() => handleToggleActive(product.id, product.active)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.active ? 'Active' : 'Inactive'}
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
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteProduct(product)}
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>


                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-black rounded-lg shadow-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <b>{deleteProduct?.name}</b>?  
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(deleteProduct?.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-forest-600">
                      No products found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 border-t border-forest-200">
            <div className="text-sm text-forest-700">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{" "}
              <span className="font-medium">{products.length}</span> products
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-forest-300" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-forest-300" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
