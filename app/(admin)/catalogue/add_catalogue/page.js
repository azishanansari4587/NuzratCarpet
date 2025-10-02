"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import withAuth from "@/lib/withAuth";

const  AddCatalogue = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/catalogues", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success("Catalogue uploaded successfully!");
      e.target.reset();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Add Catalogue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Catalogue Title" required />

        <label className="block">
          <span className="text-sm">Upload Catalogue Image</span>
          <Input type="file" name="image" accept="image/*" required />
        </label>

        <label className="block">
          <span className="text-sm">Upload Catalogue PDF</span>
          <Input type="file" name="pdf" accept="application/pdf" required />
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Catalogue"}
        </Button>
      </form>
    </div>
  );
}

export default withAuth(AddCatalogue, [1]);
