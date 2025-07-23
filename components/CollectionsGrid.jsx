"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'

const CollectionsGrid = () => {

  const [collections, setCollections] = useState([]);

  useEffect(() => {
      // Fetch collection from the Api
      const fetchCollection = async () => {
        try {
          const res = await fetch('/api/collections');
          const data = await res.json();
          setCollections(data);
          // setFilteredProducts(data);
        } catch (error) {
          console.error('Failed to fetch collections', error);
        }
      };
      fetchCollection();
    }, []);


    // Mock category data
const categories = [
  {
    id: 1,
    slug: 'persian',
    name: 'Persian',
    description: 'Timeless patterns with intricate designs from the ancient Persian tradition.',
    image: 'https://i.pinimg.com/736x/db/fc/3f/dbfc3ff8935d09c718d2759351a36c62.jpg',
    count: 48
  },
  {
    id: 2,
    slug: 'modern',
    name: 'Modern',
    description: 'Contemporary styles with bold patterns and innovative designs.',
    image: 'https://i.pinimg.com/736x/5e/0a/0a/5e0a0aa02be7349c2177bcf0c83d32dc.jpg',
    count: 36
  },
  {
    id: 3,
    slug: 'traditional',
    name: 'Traditional',
    description: 'Classic designs that bring warmth and elegance to any space.',
    image: 'https://i.pinimg.com/736x/da/7e/56/da7e5699304420b11c4b506c4f965207.jpg',
    count: 52
  },
  {
    id: 4,
    slug: 'handmade',
    name: 'Handmade',
    description: 'Artisanal carpets crafted with meticulous care and authentic techniques.',
    image: 'https://i.pinimg.com/736x/cd/94/d4/cd94d4232988dfcd718cd2a345bc4a87.jpg',
    count: 29
  }
];

  return (
    // <section className="py-16 bg-white">
    //   <div className="container mx-auto px-4 md:px-6">
    //     <h2 className="text-2xl font-light mb-12 text-center">SHOP BY COLLECTION</h2>
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //       {/* Add your collection cards here */}
    //       {Array.isArray(collections) && collections.length > 0 ? (
    //         collections.map((collection) => (
    //           <CategoryCard 
    //             key={collection.id} 
    //             title={collection.name} 
    //             image={`${collection.image}?height=600&width=600&fit=crop&auto=format`}
    //             slug={collection.slug}
    //           />
    //         ))
    //       ) : (
    //         <p className="text-center text-gray-500">No collections found or failed to load.</p>
    //       )}
    //     </div>
    //   </div>
    // </section>

    <section className="section-padding bg-sand-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Explore Our Featured Collections</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            From traditional Persian masterpieces to contemporary designs,
            find the perfect carpet for your unique space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={category.id}>
            <Link 

              href={`/collection/${category.slug}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-white text-2xl font-serif font-medium mb-2">{category.name}</h3>
                    <span className="text-white text-sm font-medium bg-primary/80 px-3 py-1 rounded-full">
                      {category.count} products
                    </span>
                  </div>
                  <span className="text-white underline text-sm flex-shrink-0 transition-transform group-hover:translate-x-1">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
            </div>
          ))}
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