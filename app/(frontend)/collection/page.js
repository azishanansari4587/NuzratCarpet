"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Grid } from "lucide-react";

export default function Collection() {
  // Mock collection data
  const collections = [
    {
      id: 1,
      name: "Persian Heritage",
      slug:"persian-heritage",
      description: "Timeless Persian carpets featuring intricate patterns and luxurious textures.",
      imageUrl: "https://i.pinimg.com/736x/2c/83/09/2c83093af4ae6024a4e327df75d0fcf7.jpg",
      productCount: 24
    },
    {
      id: 2,
      name: "Modern Simplicity",
      slug: "modern-simplicity",
      description: "Contemporary designs with clean lines and minimalist aesthetics.",
      imageUrl: "https://i.pinimg.com/736x/b9/e6/9b/b9e69b46ce6c156814437ae2d8aa429e.jpg",
      productCount: 18
    },
    {
      id: 3,
      name: "Traditional Classics",
      slug: "traditional-classics",
      description: "Traditional patterns inspired by rich cultural histories and artisanal techniques.",
      imageUrl: "https://i.pinimg.com/736x/c7/52/d6/c752d6750cb91ee4f2b89b42917aaf79.jpg",
      productCount: 32
    },
    {
      id: 4,
      name: "Handcrafted Artisan",
      slug: "handcrafted-artisan",
      description: "Unique handcrafted pieces made by skilled artisans from around the world.",
      imageUrl: "https://i.pinimg.com/736x/47/c2/ef/47c2efbc4ef6cc05577575d8d67fdee9.jpg",
      productCount: 15
    },
    {
      id: 5,
      name: "Eco-Friendly",
      slug: "eco-friendly",
      description: "Sustainable carpets made from organic materials and natural dyes.",
      imageUrl: "https://i.pinimg.com/736x/6a/6f/3c/6a6f3c7c4c75c95c196dc051889f4efb.jpg",
      productCount: 12
    },
    {
      id: 6,
      name: "Luxury Collection",
      description: "Premium carpets with exquisite details and superior quality materials.",
      imageUrl: "https://i.pinimg.com/736x/30/65/1a/30651aa9acc07f3d3e973fda34fab657.jpg",
      productCount: 9
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Grid className="h-5 w-5 text-forest-700" />
          <h1 className="text-3xl font-serif font-bold text-forest-800">Our Collections</h1>
        </div>
        
        <p className="text-lg mb-10 max-w-3xl text-forest-700">
          Explore our curated collections of fine carpets and rugs, each representing unique styles, 
          origins, and craftsmanship techniques.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Card key={collection.slug} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-64">
                <img 
                  src={collection.imageUrl} 
                  alt={collection.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-forest-700 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {collection.productCount} items
                </div>
              </div>
              
              <CardContent className="p-5">
                <h3 className="text-xl font-serif font-bold mb-2 text-forest-800">{collection.name}</h3>
                {/* <p className="text-forest-700 mb-4">{collection.description}</p> */}
                <Button asChild className="w-full bg-sand-600 hover:bg-sand-700 border-none">
                  <Link href={`/collection/${collection.slug}`}>View Collection</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
