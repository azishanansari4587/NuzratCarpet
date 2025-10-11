"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import Link from "next/link";
import { FolderPlus, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import withAuth from "@/lib/withAuth";

const AddCollection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    isActive: true,
    isFeatured: false,
    image: null,
    imageUrl: "",
    bannerImage: null,
    bannerImageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from name if it's the name field that changed
    if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e, field) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const url = URL.createObjectURL(file);
    
    if (field === 'image') {
      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: url
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        bannerImage: file,
        bannerImageUrl: url
      }));
    }
  };

  const handleRemoveImage = (field) => {
    if (field === 'image') {
      if (formData.imageUrl) URL.revokeObjectURL(formData.imageUrl);
      setFormData(prev => ({
        ...prev,
        image: null,
        imageUrl: ""
      }));
    } else {
      if (formData.bannerImageUrl) URL.revokeObjectURL(formData.bannerImageUrl);
      setFormData(prev => ({
        ...prev,
        bannerImage: null,
        bannerImageUrl: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const data = new FormData();
  for (let key in formData) {
    if (formData[key] !== null) {
      data.append(key, formData[key]);
    }
  }

  try {
    const res = await fetch("/api/collections", {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Unknown error");

    toast.success("Collection Created")

    // Reset form if needed
    // ✅ Reset form after successful submit
    setFormData({
      name: "",
      description: "",
      slug: "",
      isActive: true,
      isFeatured: false,
      image: null,
      imageUrl: "",
    });

  } catch (err) {
    toast.error(data.err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-2 mb-6">
          <FolderPlus className="h-5 w-5 text-forest-700" />
          <h1 className="text-3xl font-serif font-bold text-forest-800">Add New Collection</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 text-forest-800">Collection Information</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                    Collection Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Persian Carpets"
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-forest-800">
                    Slug
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g., persian-carpets"
                    className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                  <p className="text-xs text-forest-600">
                    Used in the URL. Automatically generated from the collection name.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-forest-800">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the collection"
                    className="min-h-[120px] w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isActive" 
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-forest-800"
                    >
                      Active (visible on site)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isFeatured" 
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                    />
                    <label
                      htmlFor="isFeatured"
                      className="text-sm font-medium text-forest-800"
                    >
                      Featured Collection
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 text-forest-800">Collection Media</h2>
              
              <div className="space-y-6">
                {/* Collection Thumbnail */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Collection Thumbnail
                    </label>
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('image')}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {!formData.imageUrl ? (
                    <label
                      htmlFor="image"
                      className="cursor-pointer block border-2 border-dashed border-forest-300 rounded-md p-6 text-center"
                    >
                      <Upload className="h-8 w-8 mx-auto text-forest-400 mb-2" />
                      <p className="text-forest-700 mb-2">Drag and drop an image or click to upload</p>
                      <p className="text-sm text-forest-600 mb-4">PNG, JPG, GIF up to 5MB</p>
                      <p variant="outline" className="border-forest-300">
                        Select File
                      </p>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image')}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <Image
                        src={formData.imageUrl || "/placeholder.jpg"} // fallback if imageUrl is empty
                        alt="Collection thumbnail preview"
                        width={400}  // adjust based on your layout
                        height={192} // 16:9 aspect ratio for h-48
                        className="w-full h-48 object-cover rounded-md border border-forest-200"
                        style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage('image')}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-forest-600 mt-2">
                    This image will be used as the thumbnail in collection listings.
                  </p>
                </div>

                {/* Banner Image */}
                {/* <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Banner Image
                    </label>
                    {formData.bannerImageUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('bannerImage')}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {!formData.bannerImageUrl ? (
                    <label
                      htmlFor="bannerImage"
                      className="cursor-pointer block border-2 border-dashed border-forest-300 rounded-md p-6 text-center"
                    >
                      <Upload className="h-8 w-8 mx-auto text-forest-400 mb-2" />
                      <p className="text-forest-700 mb-2">Drag and drop an image or click to upload</p>
                      <p className="text-sm text-forest-600 mb-4">PNG, JPG, GIF up to 5MB</p>
                      <p className="border-forest-300 ">
                        Select File
                      </p>
                      <input
                        type="file"
                        id="bannerImage"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'bannerImage')}
                        className="hidden"
                      />
                      
                    </label>
                  ) : (
                    <div className="relative">
                      <Image
                        src={formData.bannerImageUrl || "/placeholder.jpg"} // fallback if imageUrl is empty
                        alt="Collection thumbnail preview"
                        width={400}  // adjust based on your layout
                        height={192} // 16:9 aspect ratio for h-48
                        className="w-full h-48 object-cover rounded-md border border-forest-200"
                        style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage('bannerImage')}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-forest-600 mt-2">
                    This image will be displayed as a large banner on the collection page.
                  </p>
                </div> */}
              </div>

            </CardContent>
          </Card>
          
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" className="border-forest-300" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-forest-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Collection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(AddCollection, [1]);

