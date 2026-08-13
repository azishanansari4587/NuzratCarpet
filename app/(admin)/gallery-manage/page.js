"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, Upload, X, GripVertical, Images } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";
import withAuth from "@/lib/withAuth";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// ─── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ open, onClose, onUploaded }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "pending", // pending | uploading | done | error
      cloudUrl: null,
    }));
    setSelectedFiles((prev) => [...prev, ...previews]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    const updated = [...selectedFiles];
    const uploadedUrls = [];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") {
        uploadedUrls.push(updated[i].cloudUrl);
        continue;
      }
      updated[i].status = "uploading";
      setSelectedFiles([...updated]);

      try {
        const result = await uploadToCloudinary(
          updated[i].file,
          "NuzratGallery",
          "image",
          (progress) => {
            updated[i].progress = progress;
            setSelectedFiles([...updated]);
          }
        );
        updated[i].status = "done";
        updated[i].cloudUrl = result.secure_url;
        uploadedUrls.push(result.secure_url);
      } catch (err) {
        updated[i].status = "error";
        toast.error(`❌ Failed to upload: ${updated[i].name}`);
      }
      setSelectedFiles([...updated]);
    }

    // Save all uploaded images to DB
    const savePromises = uploadedUrls.map((url, idx) =>
      fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, sort_order: idx }),
      })
    );

    try {
      await Promise.all(savePromises);
      toast.success(`✅ ${uploadedUrls.length} image(s) uploaded successfully!`);
      onUploaded();
      handleClose();
    } catch {
      toast.error("❌ Some images could not be saved to database");
    }

    setUploading(false);
  };

  const handleClose = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Upload Gallery Images
          </DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files).filter((f) =>
              f.type.startsWith("image/")
            );
            const previews = files.map((file) => ({
              file,
              name: file.name,
              previewUrl: URL.createObjectURL(file),
              progress: 0,
              status: "pending",
              cloudUrl: null,
            }));
            setSelectedFiles((prev) => [...prev, ...previews]);
          }}
        >
          <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">
            Click to select or drag & drop images here
          </p>
          <p className="text-sm text-gray-400 mt-1">
            PNG, JPG, WEBP — Multiple files supported
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Preview grid */}
        {selectedFiles.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
              {selectedFiles.map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Progress overlay */}
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <div className="w-3/4 bg-gray-600 rounded-full h-1.5 mb-1">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-white text-xs">{item.progress}%</span>
                    </div>
                  )}

                  {/* Done checkmark */}
                  {item.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">✓</span>
                    </div>
                  )}

                  {/* Error */}
                  {item.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                      <span className="text-white text-xl">✕</span>
                    </div>
                  )}

                  {/* Remove btn (only if pending) */}
                  {item.status === "pending" && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-red-500 hover:bg-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t mt-2">
          <span className="text-sm text-gray-500">
            {selectedFiles.length} image(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadAll}
              disabled={uploading || selectedFiles.length === 0}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {uploading ? "Uploading..." : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ""} Image(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ image, onClose }) {
  if (!image) return null;
  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-2 bg-white">
        <DialogHeader>
          <DialogTitle className="sr-only">View Gallery Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-square">
          <Image
            src={image.imageUrl}
            alt="Gallery image"
            fill
            className="object-contain rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ image, onClose, onUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cloudUrl, setCloudUrl] = useState(null);
  const fileInputRef = useRef(null);

  if (!image) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "NuzratGallery", "image");
      setCloudUrl(result.secure_url);
      toast.success("Image uploaded. Click Save to confirm.");
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!cloudUrl) return toast.error("Please select a new image first");
    try {
      const res = await fetch(`/api/gallery/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: cloudUrl }),
      });
      if (!res.ok) throw new Error();
      toast.success("✅ Image updated!");
      onUpdated();
      onClose();
    } catch {
      toast.error("❌ Update failed");
    }
  };

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Replace Image</DialogTitle>
        </DialogHeader>
        <div
          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            src={preview || image.imageUrl}
            alt="Edit preview"
            fill
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all">
            <Upload className="text-white opacity-0 hover:opacity-100 h-8 w-8" />
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center">Click image to select new photo</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!cloudUrl || uploading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ image, onClose, onConfirm }) {
  if (!image) return null;
  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Image
          </DialogTitle>
          <DialogDescription className="text-gray-600 pt-1">
            Kya aap sach mein is image ko delete karna chahte hain? Yeh action
            wapas nahi hogi.
          </DialogDescription>
        </DialogHeader>

        {/* Image preview */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 my-2">
          <Image
            src={image.imageUrl}
            alt="Image to delete"
            fill
            className="object-cover"
          />
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Haan, Delete Karo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Gallery Admin Page ───────────────────────────────────────────────────
const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // image to delete

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setImages((prev) => prev.filter((img) => img.id !== deleteTarget.id));
      toast.success("🗑️ Image delete ho gayi!");
    } catch {
      toast.error("❌ Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  // Drag & Drop handler
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Update state immediately (optimistic)
    setImages(reordered);

    // Save new order to backend
    const order = reordered.map((img, idx) => ({ id: img.id, sort_order: idx }));
    try {
      await fetch("/api/gallery/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      toast.success("✅ Order saved");
    } catch {
      toast.error("❌ Failed to save order");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Images className="h-6 w-6 text-amber-600" />
            <h1 className="text-3xl font-serif font-bold text-gray-800">Gallery</h1>
            <span className="text-sm text-gray-400 ml-2">({images.length} images)</span>
          </div>
          <Button
            onClick={() => setUploadOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Images
          </Button>
        </div>

        {/* Drag & Drop hint */}
        {images.length > 1 && (
          <p className="text-sm text-gray-400 mb-4 flex items-center gap-1">
            <GripVertical className="h-4 w-4" />
            Drag images to reorder them. Order is saved automatically.
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
          </div>
        )}

        {/* Empty state */}
        {!loading && images.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <Images className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No images yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Upload Images" to get started</p>
          </div>
        )}

        {/* Drag & Drop Grid */}
        {!loading && images.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {images.map((img, index) => (
                    <Draggable key={String(img.id)} draggableId={String(img.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 group cursor-grab active:cursor-grabbing
                            ${snapshot.isDragging
                              ? "border-amber-500 shadow-2xl scale-105 z-50"
                              : "border-gray-200 hover:border-amber-400"
                            } transition-all duration-200`}
                        >
                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 left-2 z-10 bg-black/40 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <GripVertical className="h-3 w-3 text-white" />
                          </div>

                          {/* Image */}
                          <Image
                            src={img.imageUrl}
                            alt={`Gallery ${img.id}`}
                            fill
                            className="object-cover"
                          />

                          {/* Hover overlay with action icons */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            {/* View */}
                            <button
                              onClick={() => setViewImage(img)}
                              className="bg-white/90 hover:bg-white p-2 rounded-full text-gray-700 hover:text-blue-600 transition-colors shadow"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {/* Edit */}
                            <button
                              onClick={() => setEditImage(img)}
                              className="bg-white/90 hover:bg-white p-2 rounded-full text-gray-700 hover:text-amber-600 transition-colors shadow"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTarget(img)}
                              className="bg-white/90 hover:bg-white p-2 rounded-full text-gray-700 hover:text-red-600 transition-colors shadow"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Modals */}
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={fetchImages}
      />
      <ViewModal image={viewImage} onClose={() => setViewImage(null)} />
      <EditModal
        image={editImage}
        onClose={() => setEditImage(null)}
        onUpdated={fetchImages}
      />
      <DeleteConfirmModal
        image={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default withAuth(AdminGallery, [1]);
