"use client"
import { useEffect, useState } from 'react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Spinner from '@/components/Spinner'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"




const ProductGrid = () => {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
  
        const products = data?.products || []; // ✅ safe fallback
        const filtered = products.filter((product) => {
          let tags = [];
  
          try {
            tags = Array.isArray(product.tags)
              ? product.tags
              : JSON.parse(product.tags || "[]");
          } catch (e) {
            console.error("Tag parsing error:", e);
          }
  
          return tags.includes("New Arrival");
        });
  
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBestSellers();
  }, []);

  



  return (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-light mb-12 text-center">NEW ARRIVALS</h2>
          { isLoading ? ( <Spinner/>) : (
              <Carousel
              opts={{ align: "start" }}
              className="w-full max-w-7xl mx-auto"
            >
              <CarouselContent>
                {/* {product.map((item) =>
                  item.tags.includes("New") ? ( */}
                  {products.map((product) => {
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
              

              return (
                    <CarouselItem
                      key={product.id}
                      className="basis-1/2 md:basis-1/3 lg:basis-1/4 px-2"
                    >
                      <Link href={`/products/${product.slug}`} className="group block">
                        <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white">
                          <Image
                            src={`${images[0] || "/placeholder.svg"}?width=500&height=500`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
                          {product.name}
                        </h3>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
          )}    
        </div>
    </section>
  )
}

export default ProductGrid