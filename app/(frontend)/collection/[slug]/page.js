import React from 'react'
// app/collections/[slug]/page.jsx
import { notFound } from "next/navigation";
import connection from "@/lib/db";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Filter } from 'lucide-react';


// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FolderOpen } from "lucide-react";
import ProductCard from '@/components/ProductCard';

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  // const [collectionRows] = await connection.execute(
  //   "SELECT * FROM collections WHERE slug = ?",
  //   [slug]
  // );

  // if (collectionRows.length === 0) return notFound();

  // const collection = collectionRows[0];
  // console.log(collection);
  
  // const collectionId = collection.id;
  

  // const [productRows] = await connection.execute(
  //   "SELECT * FROM products WHERE collectionId = ?",
  //   [collectionId]
  // );

  // const { slug } = useParams();
  
  // Mock collection data (would fetch based on collectionId in a real application)
  const collection = {
    id: parseInt(slug || "1"),
    name: slug === "1" ? "persian-heritage" : 
          slug === "2" ? "modern-simplicity" : 
          slug === "3" ? "traditional-classics" : 
          "handcrafted-artisan",     
    description: "Our exclusive collection of meticulously crafted carpets, each piece telling a story of tradition and artistry. These timeless designs feature intricate patterns, luxurious textures, and vibrant colors that reflect centuries of craftsmanship.",
    longDescription: "The art of carpet weaving has been passed down through generations, with each region developing its own distinct style and technique. Our collection showcases these diverse traditions, from the geometric patterns of Moroccan Berber rugs to the floral motifs of Persian carpets. We work directly with artisans and cooperatives to ensure fair trade practices and preserve traditional craftsmanship. Each piece is made using natural fibers and dyes, ensuring not only beauty but sustainability.",
    imageUrl: "/placeholder.svg",
    bannerUrl: "https://i.pinimg.com/736x/d8/8c/66/d88c664f0e0b51057768b610e0322ed6.jpg"
  };
  
  // Mock products in this collection
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `${collection.name} Carpet ${i + 1}`,
    // price: 599 + (i * 100),
    image: "https://i.pinimg.com/736x/a0/d4/28/a0d428d42b99ffbfcd1f8b5f7e89f5e2.jpg",
    // discount: i % 3 === 0 ? 15 : null
    colors: ['#c25e5e', '#8b5e46', '#e8d9c7']
  }));

  return (
    <>
      {/* <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={`${collection.image}?height=600&width=800`}
              alt="Modern living room with minimalist furniture"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-4 md:pl-8">
            <h2 className="text-sm uppercase tracking-wider text-gray-500">ABOUT THE COLLECTION</h2>
            <h1 className="text-3xl font-medium tracking-wider uppercase">{slug.replace("-", " ")}</h1>
            <p className="text-gray-700">
              {collection.description}
            </p>
          </div>
        </div>
      </section> */}

      {/* Filter Bar */}
      {/* <section className="container mx-auto px-4 py-4 border-t border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 flex items-center">
            <span>SHOP</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium uppercase">{collection.name}</span>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productRows.map((product) => {
            // Parse images if stored as a string
            const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images);
            return (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="group">
                  <div className="relative aspect-square bg-gray-100 mb-3">
                    <Image
                      src={`${images[0]}?height=500&width=500`}
                      alt="Modern ottoman in beige fabric"
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <h3 className="font-medium">{product.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section> */}


<div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-2 mb-6">
          <FolderOpen className="h-5 w-5 text-forest-700" />
          <h1 className="text-3xl font-serif font-bold text-forest-800">{collection.name}</h1>
        </div>
        
        <div className="mb-10">
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
            <img 
              src={collection.bannerUrl} 
              alt={`${collection.name} banner`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-900/60 to-transparent flex items-end p-8">
              <div className="max-w-2xl text-white">
                <h2 className="text-2xl font-serif font-bold mb-3">{collection.name}</h2>
                <p className="text-white/90">{collection.description}</p>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-forest-700 max-w-4xl">
            {collection.longDescription}
          </p>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold mb-6 text-forest-800">Products in this Collection</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product}/>
              // <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              //   <Link href={`/products/${product.id}`}>
              //     <div className="relative h-64">
              //       <img 
              //         src={product.imageUrl} 
              //         alt={product.name} 
              //         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              //       />

              //     </div>
                  
              //     <div className="p-4">
              //       <h3 className="font-medium text-forest-800 mb-1 truncate">{product.name}</h3>
              //       <div className="flex items-center gap-2">

              //       </div>
              //     </div>
              //   </Link>
              // </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
