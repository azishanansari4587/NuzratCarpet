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

  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


    useEffect(() => {
      async function fetchProduct() {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
  
          // Ensure images field is correctly parsed
          const parsedData = data.map(item => ({
            ...item,
            images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
            imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path),
            tags: Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags),
          }));

          
          setProduct(parsedData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
  
      fetchProduct();
    }, []);

    if (!product) return;


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
                {product.map((item) =>
                  item.tags.includes("New") ? (
                    <CarouselItem
                      key={item.id}
                      className="basis-1/2 md:basis-1/3 lg:basis-1/4 px-2"
                    >
                      <Link href={`/products/${item.slug}`} className="group block">
                        <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white">
                          <Image
                            src={`${item.images[0]}?width=500&height=500`}
                            alt={item.image_path[0]}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
                          {item.name}
                        </h3>
                      </Link>
                    </CarouselItem>
                  ) : null
                )}
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