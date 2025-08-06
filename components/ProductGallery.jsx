'use client'

import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const ProductGallery = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Image */}
      <div
        className="relative aspect-square w-full bg-stone-100 cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        {selectedImage && (
          <Image
            src={`${selectedImage}?height=600&width=500`}
            alt="Main product"
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Lightbox for Zoom */}
      {isOpen && (
        <Lightbox
          mainSrc={selectedImage}
          onCloseRequest={() => setIsOpen(false)}
          enableZoom={true}
        />
      )}

      {/* Thumbnails */}
      <div className="md:flex md:flex-col gap-4 md:ml-4 mt-4 md:mt-0 w-full md:w-auto">
        <div className="hidden md:flex md:flex-col gap-2">
          {product?.images?.map((i, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(i)}
              className="w-16 h-16 rounded-full overflow-hidden border border-gray-300"
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductGallery
