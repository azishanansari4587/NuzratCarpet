"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import Spinner from './Spinner';

const CollectionsGrid = () => {

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch('/api/collections', { cache: "no-store" });
        // const res = await fetch('/api/collections', { next: { revalidate: 60 } });
        const data = await res.json();
  
        if (Array.isArray(data)) {
          // ✅ Sirf wahi collections jinka isFeatured === 1 hai
        const featuredCollections = data.filter(
          (item) => item.isFeatured === 1 || item.isFeatured === "1"
        );
        setCollections(featuredCollections);
          // setCollections(data);
        } else {
          console.error("Invalid API response:", data);
          setCollections([]);
        }
      } catch (error) {
        console.error('Failed to fetch collections', error);
        setCollections([]);
      } finally {
        setLoading(false); // ye zaroori hai
      }
    };
    fetchCollection();
  }, []);
  


  return (

    <section className="section-padding bg-sand-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Explore Our Featured Collections</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            From traditional Persian masterpieces to contemporary designs,
            find the perfect carpet for your unique space.
          </p>
        </div>
        {loading ? (
          <Spinner />
        ):
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(collections) && collections.map((category) => (
              <Link 
              key={category.slug}
                href={`/collection/${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >

                <div className="relative aspect-[4/3] overflow-hidden group">
                  <Image
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name || "Category Image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent"></div>
                </div>


                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-2xl font-serif font-medium mb-2">{category.name}</h3>
                      <span className="text-white text-sm font-medium bg-primary/80 px-3 py-1 rounded-full">
                      {category.productCount || 0} products
                      </span>
                    </div>
                    <span className="text-white underline text-sm flex-shrink-0 transition-transform group-hover:translate-x-1">
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
         }
      </div>
    </section>
  )
}


export default CollectionsGrid