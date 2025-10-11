"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
import { useParams, useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";

const EditProduct = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.slug;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialProductState = {
    id: "",
    name: "",
    code: "",
    slug: "",
    isActive: true,
    isFeatured: false,
    tags: [],
    designers: [],
    images: [],
    colors: [],
    sizes: [],
    features: [],
    specifications: [],
    inStock: true,
    sku: "",
    quantity: "",
    collectionId: "",
    short_description: "",
    description: "",
    care: "",
    certification: "",
    isOutlet: false,
    outletOldPrice: "",
    outletNewPrice: "",
    outletDiscount: "",
    addInfo: "",
    badges: "",
  };

  const [product, setProduct] = useState(initialProductState);

    const availableTags = ["Rugs", "OutDoor", "New Arrival", "Cushion", "Bag", "Puff", "Outlet"];
  const availableDesigners = ["Karim Rashid", "Ingrid Kulper", "Own"]; // Available options
  const availableBadges = [
    {id: "new", name:"New"},
    {id: "top_sell", name: "Top Sell"}
  ];

  // ✅ Collections fetch
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

  // ✅ Fetch existing product by ID
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        // setProduct(data); // 👈 server se aaya hua data state me set
        setProduct({
          ...initialProductState,
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || "[]"),
          designers: Array.isArray(data.designers) ? data.designers : JSON.parse(data.designers || "[]"),
        });
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load product");
      }
    };
    fetchProduct();
  }, [productId]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle checkbox change
  const handleCheckboxChange = (name, checked) => {
    setProduct((prev) => ({ ...prev, [name]: checked }));
  };


const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);

  // 🔹 Step 1: Create previews (for UI)
  const previews = files.map(file => ({
    id: `${file.name}-${Date.now()}`,
    file,
    url: URL.createObjectURL(file), // temp local preview
    progress: 0,
    uploading: true,
    temp: true,
  }));

  // Add previews to product state
  setProduct(prev => ({
    ...prev,
    images: [...prev.images, ...previews],
  }));

  try {
    // 🔹 Step 2: Upload files to Cloudinary with progress
    const uploaded = await Promise.all(
      files.map(file =>
        uploadToCloudinary(file, "NurzatProducts", "image", (progress) => {
          setProduct(prev => ({
            ...prev,
            images: prev.images.map(img =>
              img.file === file ? { ...img, progress } : img
            ),
          }));
        })
      )
    );

    // 🔹 Step 3: Replace previews with Cloudinary URLs
    setProduct(prev => ({
      ...prev,
      images: [
        ...prev.images
          .filter(img => !img.temp) // already existing images
          .map(img => img.url),      // keep their URLs
        ...uploaded.map(u => u.secure_url) // Cloudinary URLs
      ]
    }));
  } catch (err) {
    console.error("Image upload error:", err);
    toast.error("❌ Failed to upload image");
  }
};
  
  
    
    
  
    const handleRemoveImage = (index) => {
      const imgs = [...product.images];
      imgs.splice(index, 1);
      setProduct({ ...product, images: imgs });
    };
    
  
const handleColorImageUpload = async (e, colorIndex) => {
  const files = Array.from(e.target.files);

  if (files.length === 0) return;

  setProduct(prev => {
    const newColors = [...prev.colors];
    if (!Array.isArray(newColors[colorIndex].images)) newColors[colorIndex].images = [];

    // ✅ Prevent duplicate previews based on file name
    const existingFileNames = newColors[colorIndex].images
      .filter(img => img.file)
      .map(img => img.file.name);

    const uniqueFiles = files.filter(f => !existingFileNames.includes(f.name));

    const previews = uniqueFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
      progress: 0,
      uploading: true,
      temp: true,
    }));

    newColors[colorIndex].images.push(...previews);
    return { ...prev, colors: newColors };
  });

  // 🔹 Upload each unique file
  for (const file of files) {
    // Skip already existing files
    if (!file) continue;

    try {
      const uploaded = await uploadToCloudinary(file, "NurzatProducts/colors", "image", progress => {
        setProduct(prev => {
          const newColors = [...prev.colors];
          newColors[colorIndex].images = newColors[colorIndex].images.map(img =>
            img.file === file ? { ...img, progress, uploading: progress < 100 } : img
          );
          return { ...prev, colors: newColors };
        });
      });

      setProduct(prev => {
        const newColors = [...prev.colors];
        // Replace the temp image with uploaded URL
        newColors[colorIndex].images = newColors[colorIndex].images.map(img =>
          img.file === file ? uploaded.secure_url : img
        );
        return { ...prev, colors: newColors };
      });

    } catch (err) {
      console.error("Color image upload error:", err);
      toast.error("❌ Failed to upload color image");
    }
  }
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
    
  
  
    const handleTagChange = (tag, checked) => {
      setProduct(prev => ({
        ...prev,
        tags: checked 
          ? [...prev.tags, tag] 
          : prev.tags.filter(t => t !== tag)
      }));
    };
  
    const handleDesignerChange = (designer, checked) => {
      setProduct(prev => ({
        ...prev,
        designers: checked 
          ? [...prev.designers, designer] 
          : prev.designers.filter(d => d !== designer)
      }));
    };

  // ✅ Update product (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("✅ Product updated successfully!");
        router.push("/products");
      } else {
        toast.error(`❌ Error: ${result.message || "Failed to update product"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`❌ Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeft className="h-5 w-5 text-forest-700" />
          <h1 className="text-3xl font-serif font-bold text-forest-800">
            Edit Product
          </h1>
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
                  <label htmlFor="code" className="block text-sm font-medium text-forest-800">
                    Product Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="code"
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

                <div className="space-y-2">
                  <label htmlFor="care" className="block text-sm font-medium text-forest-800">
                    Product Care Guide <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="care"
                    name="care"
                    required
                    value={product.care}
                    onChange={handleChange}
                    placeholder="Enter product care guide"
                    className="min-h-[120px] w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="certification" className="block text-sm font-medium text-forest-800">
                    Product Certification <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="certification"
                    name="certification"
                    required
                    value={product.certification}
                    onChange={handleChange}
                    placeholder="Enter product certification details"
                    className="min-h-[120px] w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="addInfo" className="block text-sm font-medium text-forest-800">
                    Product Additional Info <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="addInfo"
                    name="addInfo"
                    required
                    value={product.addInfo}
                    onChange={handleChange}
                    placeholder="Enter product certification details"
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
                    {product.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-32 rounded-md border border-forest-200 overflow-hidden flex items-center justify-center">
                          <Image
                            src={img.temp ? img.url : img} // temp → local blob, uploaded → cloud URL
                            alt={`Product preview ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />

                          {/* Progress bar + spinner only for temp images */}
                          {img.temp && (
                            <>
                              <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full transition-all"
                                  style={{ width: `${img.progress}%` }}
                                />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Remove button only for uploaded images */}
                        {!img.temp && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 text-forest-800">Organization</h2>
              
              <div className="grid gap-6">

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

                        {color.images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {color.images.map((img, i) => (
                              <div key={i} className="relative group">
                                {/* Image display */}
                                <Image
                                  src={img.temp ? img.url : img} // preview object vs Cloud URL
                                  alt={`Color ${i + 1}`}
                                  width={150}
                                  height={150}
                                  className="w-full h-32 object-cover rounded-md border border-gray-200"
                                />

                                {/* Progress + Spinner for preview images */}
                                {img.temp && (
                                  <>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                                      <div
                                        className="h-1 bg-blue-500"
                                        style={{ width: `${img.progress}%` }}
                                      />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                  </>
                                )}

                                {/* Remove button for both previews and uploaded URLs */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColorImage(colorIndex, i)}
                                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                                  aria-label="Remove image"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  ))}

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

                {/* Sizes (Dynamic Input) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-forest-800">
                    Product Sizes
                  </label>

                  {/* Input + Add Button */}
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter size (e.g., 5' x 8')"
                      value={product.newSize || ""}
                      onChange={(e) =>
                        setProduct({ ...product, newSize: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (product.newSize && !product.sizes.includes(product.newSize)) {
                          setProduct({
                            ...product,
                            sizes: [...product.sizes, product.newSize],
                            newSize: "",
                          });
                        }
                      }}
                    >
                      + Add
                    </Button>
                  </div>

                  {/* Preview Added Sizes */}
                  {product.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.sizes.map((size, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 px-3 py-1 border border-forest-300 rounded-full bg-forest-50 text-forest-800 text-sm"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...product.sizes];
                              updated.splice(i, 1);
                              setProduct({ ...product, sizes: updated });
                            }}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                <div className="space-y-2">
                  <label className="block text-sm font-medium text-forest-800">
                    Product Badges
                  </label>
                  <select
                    name="badges"
                    value={product.badges}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    required
                  >
                    <option value="">Select a Badge</option>
                    {availableBadges.map((badge) => (
                      <option key={badge.id} value={badge.name}>
                        {badge.name}
                      </option>
                    ))}
                  </select>
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

                {/* Designers */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-forest-800">
                    Available Designers
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableDesigners.map((designer) => (
                      <div key={designer} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`designer-${designer}`} 
                          checked={product.designers.includes(designer)}
                          onCheckedChange={(checked) => handleDesignerChange(designer, checked === true)}
                        />
                        <label
                          htmlFor={`designer-${designer}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                        >
                          {designer}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>

          {/* Outlet Product Section */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 text-forest-800">Outlet Product</h2>

              {/* Switch / Checkbox */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="isOutlet"
                  checked={product.isOutlet}
                  onCheckedChange={(checked) =>
                    setProduct({ ...product, isOutlet: checked === true })
                  }
                />
                <label
                  htmlFor="isOutlet"
                  className="text-sm font-medium leading-none text-forest-800"
                >
                  Mark as Outlet Product
                </label>
              </div>

              {/* Show Price + Discount only when Outlet is ON */}
              {product.isOutlet && (
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="outletPrice"
                      className="block text-sm font-medium text-forest-800"
                    >
                      Outlet Old Price <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="outletOldPrice"
                      name="outletOldPrice"
                      type="number"
                      min="0"
                      value={product.outletOldPrice || ""}
                      onChange={(e) =>
                        setProduct({ ...product, outletOldPrice: e.target.value })
                      }
                      placeholder="Enter outlet price"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="outletPrice"
                      className="block text-sm font-medium text-forest-800"
                    >
                      Outlet New Price <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="outletNewPrice"
                      name="outletNewPrice"
                      type="number"
                      min="0"
                      value={product.outletNewPrice || ""}
                      onChange={(e) =>
                        setProduct({ ...product, outletNewPrice: e.target.value })
                      }
                      placeholder="Enter outlet price"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="outletDiscount"
                      className="block text-sm font-medium text-forest-800"
                    >
                      Discount (%)
                    </label>
                    <Input
                      id="outletDiscount"
                      name="outletDiscount"
                      type="number"
                      min="0"
                      max="100"
                      value={product.outletDiscount || ""}
                      onChange={(e) =>
                        setProduct({ ...product, outletDiscount: e.target.value })
                      }
                      placeholder="Enter discount percentage"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" className="border-forest-300" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-forest-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditProduct, [1]);
