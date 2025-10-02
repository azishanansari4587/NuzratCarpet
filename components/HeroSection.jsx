"use client"

import React, { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"

const HeroSection = () => {
  const [slides, setSlides] = useState([])

  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const swiperRef = useRef(null)

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

  // ✅ Fix navigation refs AFTER Swiper is mounted
  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      swiperRef.current.params.navigation
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current
      swiperRef.current.params.navigation.nextEl = nextRef.current
      swiperRef.current.navigation.init()
      swiperRef.current.navigation.update()
    }
  }, [slides]) // jab slides load ho jaye tab run karo

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        onSwiper={(swiper) => (swiperRef.current = swiper)} // ✅ ref capture
        className="h-full overflow-hidden"
      >
        {slides?.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.id}
                fill
                className="w-full h-full object-cover"
              />
              {/* <div className="absolute inset-0 bg-white/30"></div> */}
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Arrows */}
        <div
          ref={prevRef}
          className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-amber-600 text-white rounded-full shadow-lg cursor-pointer transition"
        >
          <ChevronLeft size={28} />
        </div>
        <div
          ref={nextRef}
          className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-amber-600 text-white rounded-full shadow-lg cursor-pointer transition"
        >
          <ChevronRight size={28} />
        </div>
      </Swiper>

      {/* Custom Dots */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #d97706;
          opacity: 1;
          transform: scale(1.3);
        }
      `}</style>
    </section>
  )
}

export default HeroSection


