// "use client"
// import { useEffect, useState } from 'react'
// import React from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import Spinner from '@/components/Spinner'
// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"




// const ProductGrid = () => {

//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);


//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         const res = await fetch("/api/products");
//         const data = await res.json();
  
//         const products = data?.products || []; // ✅ safe fallback
//         const filtered = products.filter((product) => {
//           let tags = [];
  
//           try {
//             tags = Array.isArray(product.tags)
//               ? product.tags
//               : JSON.parse(product.tags || "[]");
//           } catch (e) {
//             console.error("Tag parsing error:", e);
//           }
  
//           return tags.includes("New Arrival");
//         });
  
//         setProducts(filtered);
//       } catch (error) {
//         console.error("Error fetching best sellers:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchBestSellers();
//   }, []);

  



//   return (
//     <section className="py-16 md:py-24">
//         <div className="container mx-auto  md:px-6">
//           <h2 className="text-2xl font-light mb-12 text-center">NEW ARRIVALS</h2>
//           { isLoading ? ( <Spinner/>) : (
//               <Carousel
//               opts={{ align: "start" }}
//               className="w-full max-w-7xl mx-auto"
//             >
//               <CarouselContent className="flex flex-nowrap overflow-x-hidden">
//                   {products.map((product) => {
//               let images = [];

//               try {
//                 if (Array.isArray(product.images)) {
//                   images = product.images;
//                 } else if (typeof product.images === "string") {
//                   if (product.images.trim().startsWith("[")) {
//                     images = JSON.parse(product.images);
//                   } else {
//                     images = [product.images]; // single image string
//                   }
//                 }
//               } catch (e) {
//                 console.error("Failed to parse images:", e);
//               }
              

//               return (
//                     <CarouselItem
//                       key={product.id}
//                       className="basis-1/2 md:basis-1/3 lg:basis-1/4 "
//                     >
//                       <Link href={`/products/${product.slug}`} className="group block">
//                         <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white">
//                           <Image
//                             src={`${images[0] || "/placeholder.svg"}?width=400&height=400`}
//                             alt={product.name}
//                             fill
//                             className="object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         </div>
//                         <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
//                           {product.name}
//                         </h3>
//                       </Link>
//                     </CarouselItem>
//                   );
//                 })}
//               </CarouselContent>
//               <CarouselPrevious />
//               <CarouselNext />
//             </Carousel>
            
//           )}    
//         </div>
//     </section>
//   )
// }

// export default ProductGrid

"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ProductGrid = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const [navigationReady, setNavigationReady] = useState(false)

  useEffect(() => setNavigationReady(true), [])

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

  return (
    <section className="py-16 md:py-24 overflow-x-hidden">
      <div className="container mx-auto md:px-6 relative">
        <h2 className="text-2xl font-light mb-12 text-center">NEW ARRIVALS</h2>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="relative">
            {/* Custom Arrows */}
            <div
              ref={prevRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 hover:opacity-100 transition-opacity"></div>
              <ChevronLeft className="text-white w-6 h-6 relative z-10" />
            </div>

            <div
              ref={nextRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="text-white w-6 h-6 relative z-10" />
            </div>

            {/* Swiper */}
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={1}
              loop
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation={navigationReady ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
              onSwiper={(swiper) => {
                if (navigationReady && swiper.navigation) {
                  swiper.navigation.init()
                  swiper.navigation.update()
                }
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              pagination={false} // dots disabled
              className="overflow-hidden"
            >
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
                  <SwiperSlide key={product.id}>
                    <Link href={`/products/${product.slug}`} className="group block">
                      <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white">
                        <Image
                          src={`${images[0] || "/placeholder.svg"}?width=400&height=400`}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
                        {product.name}
                      </h3>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
 