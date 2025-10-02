"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Plus, Projector, Trash2 } from "lucide-react";
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import withAuth from '@/lib/withAuth';


const Projects = () => {
  
  // Mock collections data
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
         // ✅ agar data object hai {banners: [...]}, array extract karo
      setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);


// React component ke andar
const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this project?")) return;

  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Failed to delete project");

    // ✅ UI se remove karna
    setProjects((prev) => prev.filter((project) => project.id !== id));

    toast.success("Project deleted successfully");
  } catch (err) {
    console.error("Delete error:", err);
    toast.error(err.message || "Something went wrong");
  }
};



  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Projector className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Projects</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-forest-800">
            <Link href="/projects/add_projects" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Projects
            </Link>
          </Button>
        </div>
        {loading ? (
            <Spinner />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative w-full pt-[100%] rounded-md overflow-hidden border border-gray-300 group"
            >
              {/* Project Image */}
              <Image
                src={project.imageUrl || "/placeholder.jpg"} // fallback
                alt={`Project ${project.id}`}
                fill
                className="object-cover rounded-md"
              />

              {/* Delete button - hidden by default, visible on hover */}
              <button
                onClick={() => handleDelete(project.id)}
                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                // aria-label="Delete banner"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        )}
      </div>

    </div>
  );
}

export default withAuth(Projects, [1]);