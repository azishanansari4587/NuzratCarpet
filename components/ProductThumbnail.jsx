"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductThumbnails({
  currentImages,
  selectedImage,
  setSelectedImage,
}) {
  return (
    <div className="relative flex flex-col md:flex-row gap-8">
      {/* === Swiper Thumbnails === */}
      <div className="relative order-2 md:order-1 w-full md:w-auto md:h-[400px]">
        {/* Navigation Buttons */}
        {/* Up Arrow (Desktop) */}
        <button
          className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow-md"
          id="thumb-prev"
        >
          <ChevronUp size={18} />
        </button>

        {/* Down Arrow (Desktop) */}
        <button
          className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow-md"
          id="thumb-next"
        >
          <ChevronDown size={18} />
        </button>

        <Swiper
          direction="horizontal"
          spaceBetween={10}
          slidesPerView={5}
          navigation={{
            nextEl: "#thumb-next",
            prevEl: "#thumb-prev",
          }}
        //   scrollbar={{ draggable: true }}
          mousewheel
          breakpoints={{
            768: {
              direction: "vertical",
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }}
          modules={[Navigation, Scrollbar, Mousewheel]}
          className="w-full md:w-auto h-auto md:h-[400px]"
        >
          {currentImages.map((i, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <button
                onClick={() => setSelectedImage(index)}
                className={`w-32 h-32 rounded-lg overflow-hidden border transition-all ${
                  selectedImage === index
                    ? "border-black scale-105"
                    : "border-gray-300"
                }`}
              >
                <div className="relative w-full h-full bg-stone-300">
                  <Image
                    src={`${i}?height=64&width=64`}
                    alt={`Thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
