"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// ─── Lightbox Component ────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
    setZoom(1);
    setPos({ x: 0, y: 0 });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setPos({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose]);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z + 0.25, 4));
    } else {
      setZoom((z) => {
        const next = Math.max(z - 0.25, 1);
        if (next === 1) setPos({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch swipe
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStart.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/95 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 z-10">
        <span className="text-white/70 text-sm font-medium">
          {current + 1} / {images.length}
        </span>
        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="text-white/60 text-sm min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={() => { setZoom(1); setPos({ x: 0, y: 0 }); }}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors ml-2"
            title="Close (ESC)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev button */}
        <button
          onClick={goPrev}
          className="absolute left-4 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        {/* Image */}
        <div
          ref={imgRef}
          style={{
            transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
            transition: dragging ? "none" : "transform 0.2s ease",
            cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={handleMouseDown}
          className="relative w-full max-w-4xl h-[70vh]"
        >
          <Image
            src={images[current].imageUrl}
            alt={`Gallery image ${current + 1}`}
            fill
            className="object-contain select-none"
            draggable={false}
            priority
          />
        </div>

        {/* Next button */}
        <button
          onClick={goNext}
          className="absolute right-4 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 transition-all hover:scale-110"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex items-center justify-center gap-2 px-4 pb-5 pt-3 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => { setCurrent(idx); setZoom(1); setPos({ x: 0, y: 0 }); }}
            className={`relative flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all
              ${idx === current
                ? "border-amber-400 scale-110"
                : "border-transparent opacity-50 hover:opacity-80"
              }`}
          >
            <Image
              src={img.imageUrl}
              alt={`Thumb ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Zoom hint */}
      <p className="text-white/30 text-xs text-center pb-3">
        Scroll to zoom • Arrow keys to navigate • ESC to close
      </p>
    </div>
  );
}

// ─── Frontend Gallery Page ─────────────────────────────────────────────────────
export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 py-10 sm:py-16 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-2 sm:mb-3">
            Our Gallery
          </h1>
          <p className="text-amber-200 text-sm sm:text-lg max-w-xl mx-auto">
            A curated collection of our finest rugs, crafted with tradition and artistry.
          </p>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
            </div>
          )}

          {/* Empty */}
          {!loading && images.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No gallery images available yet.</p>
            </div>
          )}

          {/* Masonry-style responsive grid */}
          {!loading && images.length > 0 && (
            <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
