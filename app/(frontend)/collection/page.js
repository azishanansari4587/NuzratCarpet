"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Grid } from "lucide-react";
import Spinner from "@/components/Spinner";
import Image from "next/image";

export default function Collection() {

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // setLoading(true)
        // Fetch collection from the Api
        const fetchCollection = async () => {
          try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            setCollections(data);
            // setFilteredProducts(data);
          } catch (error) {
            console.error('Failed to fetch collections', error);
          } finally {
            setLoading(false);
          }
        };
        fetchCollection();
      }, []);

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
        {loading ? (
          <Spinner />
        ):
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Card key={collection.slug} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  {/* <img 
                    src={collection.image} 
                    alt={collection.name} 
                    className="w-full h-full object-cover"
                  /> */}
                  <div className="relative w-full h-full">
                    <Image
                      src={collection.image || "/placeholder.jpg"}  // fallback if `collection.image` is missing
                      alt={collection.name || "Collection image"}
                      fill
                      className="object-cover"
                    />
                  </div>

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
        }
      </div>
    </div>
  );
}
