"use client"
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,   SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Image from "next/image";

export default function AddProduct() {

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        if (!response.ok) throw new Error("Failed to fetch collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);


  const [product, setProduct] = useState({
    id: "",
    name: "",
    code: "",
    isActive: true,
    isFeatured: false,
    tags: [], // ✅ empty array instead of [""]
    images: [], // ✅ empty array instead of [""]
    imageUrls: [], // ✅ correct
    colors: [], // ✅ initially empty or [{ name: "", value: "", inStock: true, images: [] }] if you're binding a single item
    sizes: [], // ✅ empty array instead of [""]
    features: [], // ✅ empty array instead of [""]
    specifications: [], // ✅ empty array instead of [{ key: "", value: "" }]
    inStock: true,
    sku: "",
    barcode: "",
    weight: "",
    quantity: "",
    collectionId: "",
    short_description: "",
    description: "",
  });


  const availableTags = ["Rugs", "OutDoor", "New Arrival", "Cushion", "Pillow"];
  const availableSizes = ["3' x 5'", "4' x 6'", "5' x 8'", "6' x 9'", "8' x 10'", "9' x 12'", "10' x 14'", "Runner", "Custom"];
  // const availableTags = ["Banner", "New", "Discount"]; // Available options

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setProduct(prev => ({ ...prev, [name]: checked }));
  };


//  const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map((file) => URL.createObjectURL(file));
//     setProduct({ ...product, images: [...product.images, ...urls] });
//   };

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// const handleImageUpload = async (e) => {
//   const files = Array.from(e.target.files);
//   const base64Images = await Promise.all(files.map(getBase64));
//   setProduct({ ...product, images: [...product.images, ...base64Images] });
// };


//   const handleRemoveImage = (index) => {
//     const imgs = [...product.images];
//     imgs.splice(index, 1);
//     setProduct({ ...product, images: imgs });
//   };


  // const handleColorImageUpload = (e, colorIndex) => {
  //   const files = Array.from(e.target.files);
  //   const imageUrls = files.map(file => URL.createObjectURL(file));

  //   const updatedColors = [...product.colors];

  //   if (!updatedColors[colorIndex]) return; // Safety check

  //   if (!Array.isArray(updatedColors[colorIndex].images)) {
  //     updatedColors[colorIndex].images = []; // Initialize if undefined
  //   }

  //   updatedColors[colorIndex].images.push(...imageUrls);
  //   setProduct({ ...product, colors: updatedColors });
  // };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, images: [...product.images, ...files] }); // Store File objects
  };
  
  const handleRemoveImage = (index) => {
    const imgs = [...product.images];
    imgs.splice(index, 1);
    setProduct({ ...product, images: imgs });
  };
  
  const handleColorImageUpload = (e, colorIndex) => {
    const files = Array.from(e.target.files);
    const updatedColors = [...product.colors];
  
    if (!updatedColors[colorIndex]) return;
  
    if (!Array.isArray(updatedColors[colorIndex].images)) {
      updatedColors[colorIndex].images = [];
    }
  
    updatedColors[colorIndex].images.push(...files); // Store File objects
    setProduct({ ...product, colors: updatedColors });
  };
  
  const handleRemoveColorImage = (colorIndex, imageIndex) => {
    const updatedColors = [...product.colors];
    if (
      updatedColors[colorIndex] &&
      Array.isArray(updatedColors[colorIndex].images)
    ) {
      updatedColors[colorIndex].images.splice(imageIndex, 1);
      setProduct({ ...product, colors: updatedColors });
    }
  };
  

  // const handleColorImageUpload = async (e, colorIndex) => {
  //   const files = Array.from(e.target.files);
  //   const base64Images = await Promise.all(files.map(getBase64)); // 🔥 Convert to Base64
  
  //   const updatedColors = [...product.colors];
  
  //   if (!updatedColors[colorIndex]) return;
  
  //   if (!Array.isArray(updatedColors[colorIndex].images)) {
  //     updatedColors[colorIndex].images = [];
  //   }
  
  //   updatedColors[colorIndex].images.push(...base64Images); // ✅ store Base64 for Cloudinary
  //   setProduct({ ...product, colors: updatedColors });
  // };
  

  // const handleRemoveColorImage = (colorIndex, imageIndex) => {
  //   const updatedColors = [...product.colors];
  //   if (
  //     updatedColors[colorIndex] &&
  //     Array.isArray(updatedColors[colorIndex].images)
  //   ) {
  //     updatedColors[colorIndex].images.splice(imageIndex, 1);
  //     setProduct({ ...product, colors: updatedColors });
  //   }
  // };


  const handleTagChange = (tag, checked) => {
    setProduct(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag] 
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSizeChange = (size, checked) => {
    setProduct(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size] 
        : prev.sizes.filter(s => s !== size)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send data to API route
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Add New Product</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Basic Information</h2>
                
                <div className="grid gap-6 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={product.name}
                      onChange={handleChange}
                      placeholder="e.g., Persian Royal Blue Handmade Carpet"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                      Product Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="code"
                      type="text"
                      required
                      value={product.code}
                      onChange={handleChange}
                      placeholder="e.g., ROYAL2134Z"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  
                  <div className="space-y-2">
                    <label htmlFor="short_description" className="block text-sm font-medium text-forest-800">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="short_description"
                      name="short_description"
                      type="text"
                      value={product.short_description}
                      onChange={handleChange}
                      placeholder="Brief description for product listings"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                    <p className="text-xs text-forest-600">
                      Brief summary displayed in product listings and search results.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-forest-800">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      value={product.description}
                      onChange={handleChange}
                      placeholder="Detailed product description"
                      className="min-h-[120px] w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isActive" 
                        checked={product.isActive}
                        onCheckedChange={(checked) => handleCheckboxChange("isActive", checked === true)}
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                      >
                        Active (visible on site)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isFeatured" 
                        checked={product.isFeatured}
                        onCheckedChange={(checked) => handleCheckboxChange("isFeatured", checked === true)}
                      />
                      <label  
                        htmlFor="isFeatured"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                      >
                        Featured Product
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Product Images</h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-forest-300 rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-forest-400 mb-2" />
                    <p className="text-forest-700 mb-2">Drag and drop images here or click to upload</p>
                    <p className="text-sm text-forest-600 mb-4">PNG, JPG, GIF up to 5MB</p>
                    <div className="relative inline-block overflow-hidden">
                      <Button variant="outline" className="border-forest-300">Select Files</Button>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  {product.images.filter((url) => url).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {product.images.map((url, index) =>
                      url ? (
                        <div key={index} className="relative group">
                          {/* <img
                            src={url}
                            alt={`Product preview ${index + 1}`}
                            // maxSize={5 * 1024 * 1024}
                            className="w-full h-32 object-cover rounded-md border border-forest-200"
                          /> */}
                          <div className="relative w-full h-32 rounded-md border border-forest-200 overflow-hidden">
                            <Image
                              src={URL.createObjectURL(url)}// fallback if url is missing
                              alt={`Product preview ${index + 1}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Organization</h2>
                
                <div className="grid gap-6">
                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Collections
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {collections.map((collection) => (
                        <div key={collection.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`collection-${collection.id}`} 
                            checked={product.collections.includes(collection.id)}
                            onCheckedChange={(checked) => handleCategoryChange(collection.id, checked === true)}
                          />
                          <label
                            htmlFor={`collection-${collection.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {collection.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}


                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Available Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={product.categories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}


                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Collection
                    </label>
                    <select
                      name="collectionId"
                      value={product.collectionId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                      required
                    >
                      <option value="">Select a Collection</option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Features */}
                  <div className="grid gap-6 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                        Product Features <span className="text-red-500">*</span>
                      </label>
                    {product.features.map((f, i) => (
                      <Textarea
                        key={i}
                        placeholder={`Feature ${i + 1}`}
                        value={f}
                        onChange={(e) => {
                          const features = [...product.features];
                          features[i] = e.target.value;
                          setProduct({ ...product, features });
                        }}
                      />
                    ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setProduct({ ...product, features: [...product.features, ""] })}
                    >
                      + Add Feature
                    </Button>
                  </div>

                  {/* Specifications */}
                  <div className="grid gap-6 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                        Product Specifications <span className="text-red-500">*</span>
                      </label>
                      {product.specifications.map((s, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            placeholder="Key"
                            value={s.key}
                            onChange={(e) => {
                              const specs = [...product.specifications];
                              specs[i].key = e.target.value;
                              setProduct({ ...product, specifications: specs });
                            }}
                          />
                          <Input
                            placeholder="Value"
                            value={s.value}
                            onChange={(e) => {
                              const specs = [...product.specifications];
                              specs[i].value = e.target.value;
                              setProduct({ ...product, specifications: specs });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        setProduct({ ...product, specifications: [...product.specifications, { key: "", value: "" }] })
                      }
                    >
                      + Add Specification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Variants</h2>
                
                <div className="grid gap-6">

                  {/* Colors */}
                  <div className="space-y-2">
                    <label className="font-semibold">🎨 Colors</label>
                    {product.colors.map((color, idx) => (
                      <div key={idx} className="border p-4 rounded-lg space-y-2 ">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input placeholder="Color Name" value={color.name} onChange={(e) => {
                            const colors = [...product.colors];
                            colors[idx].name = e.target.value;
                            setProduct({ ...product, colors });
                          }} />
                          <Input type="color" value={color.value} onChange={(e) => {
                            const colors = [...product.colors];
                            colors[idx].value = e.target.value;
                            setProduct({ ...product, colors });
                          }} />
                        </div>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={color.inStock}
                            onCheckedChange={(val) => {
                              const colors = [...product.colors];
                              colors[idx].inStock = val;
                              setProduct({ ...product, colors });
                            }}
                          />
                          In Stock
                        </label>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Color Images:</label>

                          {/* File input */}
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                            <div className="relative inline-block overflow-hidden">
                              <Button variant="outline" className="border-forest-300">Select Color Images</Button>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleColorImageUpload(e, idx)}
                                // maxSize={5 * 1024 * 1024}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Image previews */}
                          {color.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                              {color.images.map((img, i) => {
                                if (!img) return null; // ✅ skip empty strings or undefined

                                const imageUrl = typeof img === "string" ? img : URL.createObjectURL(img);

                                return (
                                  <div key={i} className="relative group">
                                    <img
                                    
                                      src={imageUrl}
                                      alt={`Color ${i + 1}`}
                                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveColorImage(idx, i)}
                                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                                    >
                                      ❌
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* <Button type="button" onClick={() => setProduct({ ...product, colors: [...product.colors, { name: "", value: "#000000", inStock: true, images: [""] }] })}>
                      + Add Color
                    </Button> */}
                    <Button
                      type="button"
                      onClick={() =>
                        setProduct({
                          ...product,
                          colors: [
                            ...product.colors,
                            { name: "", value: "#000000", inStock: true, images: [] }
                          ]
                        })
                      }
                    >
                      + Add Color
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Available Sizes
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableSizes.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`size-${size}`} 
                            checked={product.sizes.includes(size)}
                            onCheckedChange={(checked) => handleSizeChange(size, checked === true)}
                          />
                          <label
                            htmlFor={`size-${size}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Available Tags
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag}`} 
                            checked={product.tags.includes(tag)}
                            onCheckedChange={(checked) => handleTagChange(tag, checked === true)}
                          />
                          <label
                            htmlFor={`tag-${tag}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <div className="grid gap-3">
                    <Label htmlFor="tags">Tags</Label>
                    <Select>
                      <SelectTrigger id="tags">
                        <SelectValue placeholder={product.tags.length ? product.tags.join(", ") : "Select Tags"} />
                    </SelectTrigger>
                      <SelectContent className="p-2 border rounded-lg bg-white shadow-md">
                        {availableTags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
                            onClick={() => handleTagChange(tag)}
                          >
                            <Checkbox checked={product.tags.includes(tag)} />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-4">
                      <h3 className="font-medium">Selected Tags:</h3>
                      <p className="text-gray-700">{product.tags.length ? product.tags.join(", ") : "None"}</p>
                    </div>
                  </div> */}


                </div>
              </CardContent>
            </Card>
            
            {/* <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Inventory</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="sku" className="block text-sm font-medium text-forest-800">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      id="sku"
                      name="sku"
                      type="text"
                      value={product.sku}
                      onChange={handleChange}
                      placeholder="e.g., CP-123-BLU"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="barcode" className="block text-sm font-medium text-forest-800">
                      Barcode (UPC, EAN)
                    </label>
                    <input
                      id="barcode"
                      name="barcode"
                      type="text"
                      value={product.barcode}
                      onChange={handleChange}
                      placeholder="e.g., 123456789012"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="weight" className="block text-sm font-medium text-forest-800">
                      Weight (lbs)
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={product.weight}
                      onChange={handleChange}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" className="border-forest-300" asChild>
                <Link href="/admin">Cancel</Link>
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-forest-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
            
          </form>

        </div>
      </div>
    </>
  );
}