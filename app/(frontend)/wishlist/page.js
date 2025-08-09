"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ShoppingBag, Eye } from "lucide-react";

import { jwtDecode } from "jwt-decode";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import Image from "next/image";
import useWishlistStore from "@/store/useWishlistStore";

export default function Wishlist() {
  // const [wishlistItems, setWishlistItems] = useState([]);
  // const [loading, setLoading] = useState(true);

  // const setWishlist = useWishlistStore((state) => state.setWishlist);
  // console.log(setWishlist);

  const { wishlist: wishlistItems, setWishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false); // stop loading if no token
        return;
      }
  
      try {
        const res = await fetch("/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (res.ok) {
          // setWishlistItems(data.wishlistItems);
          // setWishlist(data.wishlistItems);
          setWishlist(data.wishlistItems);


        } else {
          toast.error(data.error)
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false); // 2. stop loading after API call completes
      }
    };
  
    fetchWishlist();
  }, []);

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // setWishlist((prev) => prev.filter((item) => item.id !== productId));
        // new
        removeFromWishlist(productId);

        toast.success("Item removed from wishlist.");
      } else {
        toast.error(data.error || "Failed to remove item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  

  const handleAddToCart = (productId, name) => {
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
    });
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;

    // new
    clearWishlist();
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  return (

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">My Wishlist</h1>
          </div>

          {loading ? (
            <Spinner />
          ):wishlistItems.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-forest-700">{wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} in your wishlist</p>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-forest-300 text-forest-700"
                  onClick={handleClearWishlist}
                >
                  <Trash2 className="h-4 w-4" /> Clear All
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="product-card">
                    {/* <div className="relative h-64">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white text-forest-700 hover:text-red-500 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div> */}

                    <div className="relative h-64 group">
                      <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name || "Wishlist Item"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white text-forest-700 hover:text-red-500 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link href={`/products/${item.slug}`} className="block mb-2 hover:text-forest-600">
                      <div className="flex justify-between items-center">
                        <h3 className="font-small text-sm mb-1">{item.name}</h3>
                        <Eye/>
                        </div>
                      </Link>
                    </div>


                    </div>

                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 border border-forest-200 rounded-lg">
              <Heart className="h-16 w-16 mx-auto text-forest-300 mb-4" />
              <h2 className="text-2xl font-medium text-forest-800 mb-3">Your wishlist is empty</h2>
              <p className="text-forest-600 mb-6 max-w-md mx-auto">
                Add items you love to your wishlist and revisit them anytime you want.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> Browse Products
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
  );
}

