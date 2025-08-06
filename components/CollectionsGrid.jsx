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
      // Fetch collection from the Api
      const fetchCollection = async () => {
        try {
          const res = await fetch('/api/collections');
          const data = await res.json();
          setCollections(data);
          console.log("Collection Data: ", data);
          
          // setFilteredProducts(data);
        } catch (error) {
          console.error('Failed to fetch collections', error);
        }
        // finally {
        //   setLoading(false);
        // }
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
        {/* {loading ? (
          <Spinner />
        ): */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections?.map((category, index) => (
              <div key={category.id}>
              <Link 

                href={`/collection/${category.slug}`}
                className="group relative overflow-hidden rounded-lg"
              >
                {/* <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent"></div>
                </div> */}

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
              </div>
            ))}
          </div>
        {/* } */}
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