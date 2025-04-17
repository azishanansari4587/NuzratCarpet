import React from 'react'
// app/collections/[slug]/page.jsx
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard"; // ya jo bhi tu use karta hai
import connection from "@/lib/db";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Filter } from 'lucide-react';

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  const [collectionRows] = await connection.execute(
    "SELECT * FROM collections WHERE slug = ?",
    [slug]
  );

  if (collectionRows.length === 0) return notFound();

  const collection = collectionRows[0];
  console.log(collection);
  
  const collectionId = collection.id;
  

  const [productRows] = await connection.execute(
    "SELECT * FROM products WHERE collectionId = ?",
    [collectionId]
  );

  return (
    <>
      <section className="container mx-auto px-4 py-8 md:py-12">
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
      </section>

      {/* Filter Bar */}
      <section className="container mx-auto px-4 py-4 border-t border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>FILTER</span>
          </Button> */}
          <div className="text-sm text-gray-500 flex items-center">
            <span>SHOP</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium uppercase">{collection.name}</span>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-8">
        {/* <h1 className="text-2xl font-semibold mb-6 capitalize">{slug.replace("-", " ")}</h1> */}
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
      </section>
    </>
  );
}
