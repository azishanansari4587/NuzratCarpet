"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { FolderOpen } from "lucide-react";
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/Spinner';
import Image from 'next/image';

export default function CollectionPage() {
  const { slug } = useParams(); 
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/collections/${slug}`);
          const data = await res.json();
  
          if (res.ok) {
            setCollection(data.collection);
            setProducts(data.products);
          } else {
            setCollection(null);
          }
        } catch (error) {
          console.error("Fetch collection error:", error);
          setCollection(null);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return <Spinner/>
  }

  if (!collection) {
    return <div className="text-center py-20 text-red-600">Collection not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="h-5 w-5 text-forest-700" />
          <h1 className="text-3xl font-serif font-bold text-forest-800">{collection.name}</h1>
        </div>
        
        <div className="mb-10">
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
            {/* <img 
              src={collection.image} 
              alt={`${collection.name} banner`} 
              className="w-full h-full object-cover"
            /> */}
            <div className="relative w-full h-full">
              <Image
                src={collection.image || "/placeholder.jpg"} // fallback if image missing
                alt={`${collection.name || "Collection"} banner`}
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-forest-900/60 to-transparent flex items-end p-8">
              <div className="max-w-2xl text-white">
                <h2 className="text-2xl font-serif font-bold mb-3">{collection.name}</h2>
                <p className="text-white/90">{collection.description}</p>
              </div>
            </div>
          </div>
          <p className="text-lg text-forest-700 max-w-4xl">
            {collection.description}
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold mb-6 text-forest-800">Products in this Collection</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* {products.map((product) => (
              <ProductCard key={product.id} {...product}/>
            ))} */}
            {  products.map(product => {
              let images = [];

              try {
                if (Array.isArray(product.images)) {
                  images = product.images;
                } else if (typeof product.images === "string") {
                  if (product.images.trim().startsWith("[")) {
                    images = JSON.parse(product.images);
                  } else {
                    images = [product.images]; // single image string
                  }
                }
              } catch (e) {
                console.error("Failed to parse images:", e);
              }
              return (<ProductCard
                key={product.id}
                id={product.slug}
                name={product.name}
                image={images[0]}
                // image={Array.isArray(product.images) ? product.images[0] : product.images}
                hoverImage={
                  Array.isArray(product.images) && product.images[1]
                    ? product.images[1]
                    : null
                }
                category={product.category}
                colors={product.colors || []}
                sizes={product.sizes || []}
              />);
            } )}
          </div>
        </div>
      </div>
    </div>
  );
}
