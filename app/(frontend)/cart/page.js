"use client";
import { useEffect, useState } from "react";
import {toast} from "react-toastify"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { cart: cartItems, setCart, removeFromCart, clearCart } = useCartStore();


  const fetchCart = async () => {
    try {

      const token = localStorage.getItem("token");
      console.log(token);
      
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      
      if (res.ok) {
        setCart(data.cartItems); // ✅ Zustand update

      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        removeFromCart(productId); // ✅ Zustand update
        toast.success("Item removed from wishlist.");
  
       
      } else {
        toast.error(data.error || "Failed to remove item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  

  const handleClearCart = () => {
    clearCart(); // ✅ Zustand clear
    toast.success("Cart cleared.");
  };
  

  const handleProceedToEnquiry = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to proceed");
        return;
      }
  
      if (!cartItems.length) {
        toast.error("Your cart is empty");
        return;
      }
  
      const res = await fetch("/api/myEnquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("Enquiry sent successfully!");
        clearCart(); // ✅ Zustand cart clear
        router.push(`/enquirySuccess?ref=${data.enquiryId}`);
      } else {
        toast.error(data.error || "Failed to send enquiry");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };



  const handleMoveToWishlist = async (productId, name) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save to wishlist");
      return;
    }
    try {
      const res = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        toast.success(`${name || "Item"} saved to wishlist`);
      } else {
        toast.warning("Item already in wishlist or error occurred");
      }
    } catch {
      toast.error("Failed to save to wishlist");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-serif font-semibold mb-6">Your Cart</h1>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-1">
          Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
        </h2>
        <p className="text-sm text-gray-500">Review your items before enquiry</p>
      </div>
      {loading ? (
        <Spinner />
      ) : cartItems.length > 0 ? (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.cartId || item.id}
                className="flex flex-col sm:flex-row border rounded-xl p-4 shadow-sm bg-white gap-4"
              >
                <div className="w-full sm:w-36 h-36 relative overflow-hidden rounded-lg flex-shrink-0 bg-gray-100">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name || "Item image"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800">{item.name}</h3>
                    {item.size && <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>

                  <div className="flex items-center gap-6 mt-4 pt-2 border-t border-gray-100 sm:border-0 sm:pt-0">
                    <button 
                      onClick={() => handleMoveToWishlist(item.id, item.name)}
                      className="text-gray-600 hover:text-amber-600 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Heart className="h-4 w-4" /> Save
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(item.cartId || item.id)}
                      className="text-gray-600 hover:text-red-600 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Proceed to Enquiry */}
          <div className="max-w-7xl mx-auto mt-8 ">
            <h3 className="text-md font-bold space-x-3 m-2">Order Summary</h3>
            <h4 className="text-md  space-x-3 m-2">Total Cart Items : {cartItems.length} Items</h4>
            <Button className="w-full text-lg" onClick={handleProceedToEnquiry}>
                Proceed to Enquiry
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      )}

      </div>
  );
};

export default Cart;
