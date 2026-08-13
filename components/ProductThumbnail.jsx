"use client";
import React from "react";
import Image from "next/image";

export default function ProductThumbnails({
  currentImages,
  selectedImage,
  setSelectedImage,
}) {
  if (!currentImages || currentImages.length <= 1) return null;

  return (
    <div className="w-full md:w-auto">
      {/* Thumbnails list: Horizontal scroll on mobile, Vertical scroll on desktop */}
      <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto md:max-h-[500px] py-1 px-0.5 mobile-thin-scrollbar">
        {currentImages.map((img, index) => {
          const isSelected = selectedImage === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`Select image ${index + 1}`}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                isSelected
                  ? "border-amber-600 ring-2 ring-amber-600/30 scale-105 shadow-md"
                  : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={`${img}?height=100&width=100`}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

