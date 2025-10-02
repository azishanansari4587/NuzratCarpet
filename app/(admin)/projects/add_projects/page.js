"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadCloudinary"; // ✅ function import kar
import { toast } from "react-toastify";
import withAuth from "@/lib/withAuth";


const AddProjects = () => {
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Preview create
    const preview = {
      name: file.name,
      url: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    };
    setImage(preview);

    try {
      const uploaded = await uploadToCloudinary(
        file,
        "NurzatProducts",
        "image",
        (progress) => {
          setImage((prev) => ({ ...prev, progress, uploading: progress < 100 }));
        }
      );

      // ✅ Replace with Cloudinary URL
      setImage({
        url: uploaded.secure_url,
        uploading: false,
        progress: 100,
      });

      URL.revokeObjectURL(preview.url);
    } catch (err) {
      console.error("Image upload error:", err);
      setImage(null);
      toast.error("❌ Image upload failed");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !image.url) {
      toast.error("⚠️ Please upload a banner first");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: image.url,
        }),
      });

      if (!res.ok) throw new Error("Failed to save project");

      toast.success("✅ Project saved successfully!");
      setImage(null); // reset form
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4 text-forest-800">
            Project Image Upload
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload box */}
            {!image && (
              <div className="border-2 border-dashed border-forest-300 rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-forest-400 mb-2" />
                <p className="text-forest-700 mb-2">
                  Drag and drop image here or click to upload
                </p>
                <p className="text-sm text-forest-600 mb-4">
                  PNG, JPG, GIF up to 5MB
                </p>
                <div className="relative inline-block overflow-hidden">
                  <Button variant="outline" className="border-forest-300">
                    Select File
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Image Preview */}
            {image && (
              <div className="relative w-full aspect-[16/6] rounded-md border border-forest-200 overflow-hidden">
                <Image
                  src={image.url}
                  alt="Product preview"
                  fill
                  className="object-cover rounded-md"
                />

                {/* Progress bar */}
                {image.uploading && (
                  <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${image.progress}%` }}
                    />
                  </div>
                )}

                {/* Spinner */}
                {image.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}

                {/* Remove button */}
                {!image.uploading && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Submit button (only when uploaded) */}
            {image && !image.uploading && (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Project"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(AddProjects, [1]);
