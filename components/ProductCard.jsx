"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import useWishlistStore from '@/store/useWishlistStore';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';



const ProductCard = ({
  productId,
  id,
  name,
  image,
  hoverImage,
  category,
  colors,
  sizes,
  badges
}) => {

    const [showHoverImage, setShowHoverImage] = useState(false);
    const router = useRouter();
    const hoverTimer = useRef(null);

    const handleMouseEnter = () => {
        if (!hoverImage) return; // skip if no hoverImage
        hoverTimer.current = setTimeout(() => {
          setShowHoverImage(true);
        }, 500); // 5 seconds
      };
      

    const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setShowHoverImage(false);
    };


    const addToWishlistLocal = useWishlistStore((state) => state.addToWishlist);

    const handleAddToWishlist = async (productId) => {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Please login to add to wishlist");
            router.push("/signin");
            return;
          }
        
          const decoded = jwtDecode(token);;// ✅ This will now work
          const userId = decoded.id;
        
          const res = await fetch("/api/wishlist/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, productId }),
          });
        
          const result = await res.json();
        
          if (res.ok) {
            addToWishlistLocal(productId);
            toast.success("Added to Wishlist");
          } else {
            // If already exists
            if (res.status === 409) {
                toast.warning("Already in Wishlist");
            } else {
                toast.error( result.error);
            }
          }
        };
    

  return (
    <div className="group product-card">
      <div 
        className="relative overflow-hidden rounded-md bg-secondary mb-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >

        {/* ✅ Badge (top-right corner) */}
        {badges && badges !== "none" && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gray-500 text-white px-2 py-1 rounded-md shadow">
              {badges}
            </Badge>
          </div>
        )}

        {/* Product image */}
        <Link href={`/products/${id}`}>

          <div className="relative aspect-square overflow-hidden">
            <Image
              src={(hoverImage && showHoverImage ? hoverImage : image) || "/placeholder.jpg"}
              alt={name || "Product Image"}
              fill
              className="object-cover transition-opacity duration-200 product-card-image"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

        </Link>

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-between items-center">
            <Button size="sm" variant="secondary" 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            onClick={() => handleAddToWishlist(productId)}>
              <Heart size={18} className="text-foreground" />
            </Button>

          </div>
        </div>

      </div>

      {/* Product info */}
      <div>
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <Link href={`/products/${id}`} className="block">
          <h3 className="font-serif text-md font-medium hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex justify-between items-center">

          
          {/* Color options */}
          <div className="flex items-center space-x-1">
            {colors.map((color, index) => (
              <div 
                key={index} 
                className="w-3 h-3 rounded-full border border-muted" 
                style={{ backgroundColor: color }}
                aria-label={`Color: ${color}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;