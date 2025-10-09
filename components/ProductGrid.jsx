"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,

} from "@/components/ui/carousel"

const ProductGrid = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [api, setApi] = useState()
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        const products = data?.products || []

        const filtered = products.filter((product) => {
          let tags = []
          try {
            tags = Array.isArray(product.tags)
              ? product.tags
              : JSON.parse(product.tags || "[]")
          } catch {}
          return tags.includes("New Arrival")
        })

        setProducts(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])



  if (isLoading)
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto relative">
        <h2 className="text-2xl font-light mb-12 text-center">NEW ARRIVALS</h2>

        <Carousel
          setApi={setApi}
          loop
          plugins={[autoplay.current]}
          opts={{ align: "start", containScroll: "trimSnaps" }}
          className="relative"
        >
          <CarouselContent className="-ml-2 gap-4 md:gap-6">
            {products.map((product) => {
              let images = []
              try {
                if (Array.isArray(product.images)) images = product.images
                else if (typeof product.images === "string") {
                  images = product.images.trim().startsWith("[")
                    ? JSON.parse(product.images)
                    : [product.images]
                }
              } catch {}

              return (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex-shrink-0"
                >
                  <div className="p-1">
                    <Link href={`/products/${product.slug}`} className="group block">
                      <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white shadow-sm hover:shadow-lg transition-shadow">
                        <Image
                          src={images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/50 shadow-lg flex items-center justify-center cursor-pointer hover:bg-amber-600 hover:text-white transition-all duration-300">
            <ChevronLeft className="w-6 h-6" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/50 shadow-lg flex items-center justify-center cursor-pointer hover:bg-amber-600 hover:text-white transition-all duration-300">
            <ChevronRight className="w-6 h-6" />
          </CarouselNext>

        </Carousel>
      </div>
    </section>
  )
}

export default ProductGrid
