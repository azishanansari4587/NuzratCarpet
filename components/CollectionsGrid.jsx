"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import Spinner from './Spinner';

const CollectionsGrid = () => {

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch('/api/collections');
  
        if (!res.ok) {
          throw new Error("Failed to fetch collections");
        }
  
        const data = await res.json();
  
        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }
  
        setCollections(data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCollection();
  }, []);
  

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-light mb-12 text-center">SHOP BY COLLECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add your collection cards here */}
          {loading ? (
            <Spinner />
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : collections.length === 0 ? (
            <p className="text-gray-500 text-center">No collections found.</p>
          ) : (
            collections.map((collection) => (
              <CategoryCard 
                key={collection.id} 
                title={collection.name} 
                image={`${collection.image}?height=600&width=600&fit=crop&auto=format`}
                slug={collection.slug}
              />
            ))
          )}

        </div>
      </div>
    </section>
  )
}

// Component for category cards
function CategoryCard({ title, image, slug }) {
  return (
    <Link href={`/collection/${slug}`} className="group">
      <div className="aspect-square relative overflow-hidden mb-4">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
      </div>
      {/* <div className="absolute inset-0 flex items-center justify-center"> */}
        <h3 className="text-xl text-center font-light tracking-wider">{title}</h3>
      {/* </div> */}
    </Link>
  )
}

export default CollectionsGrid