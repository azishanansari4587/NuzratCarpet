"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import CollectionForm from "@/components/CollectionForm";

export default function EditCollectionDialog({ open, onOpenChange, collection, refreshCollections }) {
  const handleEditSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/collections/${collection.slug}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update");

      toast.success("Collection updated successfully");
      onOpenChange(false);
      refreshCollections(); // fresh list
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <CollectionForm
          initialData={collection}
          submitLabel="Save Changes"
          onSubmit={handleEditSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
