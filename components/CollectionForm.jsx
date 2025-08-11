// components/CollectionForm.jsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

export default function CollectionForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Pre-fill if initialData is passed (Edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        image: null,
        bannerImage: null,
        imageUrl: initialData.imageUrl || "",
        bannerImageUrl: initialData.bannerImageUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "name" && !formData.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      [field]: file,
      [`${field}Url`]: url,
    }));
  };

  const handleRemoveImage = (field) => {
    if (formData[`${field}Url`]) URL.revokeObjectURL(formData[`${field}Url`]);
    setFormData(prev => ({
      ...prev,
      [field]: null,
      [`${field}Url`]: "",
    }));
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
      await onSubmit(data);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* === Info Section === */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4">Collection Information</h2>
          <div className="space-y-6">
            {/* Name */}
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
            {/* <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div> */}
            {/* Slug */}
            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            {/* Switches */}
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
            
            {/* <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={(val) => handleSwitchChange("isActive", val)} />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isFeatured} onCheckedChange={(val) => handleSwitchChange("isFeatured", val)} />
                <span>Featured</span>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* === Media Section === */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4">Collection Media</h2>

          {/* Thumbnail */}
          <div className="mb-4">
            <label className="block mb-2">Thumbnail</label>
            {!formData.imageUrl ? (
              <label className="block border p-4 text-center cursor-pointer">
                <Upload className="mx-auto mb-2" />
                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "image")} />
              </label>
            ) : (
              <div className="relative">
                <Image src={formData.imageUrl} alt="Thumbnail" width={400} height={200} className="rounded" />
                <button type="button" onClick={() => handleRemoveImage("image")} className="absolute top-2 right-2">
                  <X />
                </button>
              </div>
            )}
          </div>

          {/* Banner */}
          <div>
            <label className="block mb-2">Banner</label>
            {!formData.bannerImageUrl ? (
              <label className="block border p-4 text-center cursor-pointer">
                <Upload className="mx-auto mb-2" />
                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "bannerImage")} />
              </label>
            ) : (
              <div className="relative">
                <Image src={formData.bannerImageUrl} alt="Banner" width={400} height={200} className="rounded" />
                <button type="button" onClick={() => handleRemoveImage("bannerImage")} className="absolute top-2 right-2">
                  <X />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
