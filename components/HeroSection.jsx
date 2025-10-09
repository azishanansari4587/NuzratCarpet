"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const HeroSection = () => {
  const [slides, setSlides] = useState([])
  const carouselRef = useRef(null)
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }))

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners", { cache: "no-store" })
        const data = await res.json()
        setSlides(data)
      } catch (err) {
        console.error("Failed to fetch banners:", err)
      }
    }
    fetchBanners()
  }, [])



  if (!slides.length)
    return (
      <div className="flex items-center justify-center h-[80vh] md:h-[70vh] w-full bg-gray-100">
        <p className="text-gray-500">Loading banners...</p>
      </div>
    )

  return (
    <section className="relative h-[80vh] md:h-[70vh] w-full overflow-hidden">
      <Carousel
        ref={carouselRef}
        loop
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full h-full relative"
      >
        <CarouselContent className="w-full h-full relative">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-full relative h-[80vh] md:h-[70vh]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={`Slide ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-amber-500 text-white flex items-center justify-center rounded-full cursor-pointer shadow-lg transition">
          <ChevronLeft size={28} />
        </CarouselPrevious>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-amber-500 text-white flex items-center justify-center rounded-full cursor-pointer shadow-lg transition">
          <ChevronRight size={28} />
        </CarouselNext>
      </Carousel>
    </section>
  )
}

export default HeroSection
