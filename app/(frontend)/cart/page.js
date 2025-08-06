"use client";
import { useEffect, useState } from "react";
import {toast} from "react-toastify"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import Image from "next/image";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      // const token = localStorage.getItem("token");
      // if (!token) return;

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
        setCartItems(data.cartItems);
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
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
        toast.success("Item removed from wishlist.");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to remove item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  
  

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 15.99 : 0;
  const taxAmount = subtotal * 0.07;
  const total = subtotal + shippingCost + taxAmount;

  return (

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-semibold mb-6">Your Cart</h1>
        <div className="border-b border-forest-200 pb-4 mb-4">
          <h2 className="text-lg font-medium text-forest-800 mb-1">
            Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
          </h2>
          <p className="text-sm text-forest-600">Review your items before checkout</p>
        </div>
      {loading ? (
        <Spinner />
      ) : cartItems.length > 0 ? (
        <>
          <div className="max-w-7xl mx-auto space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.cartId}
                className="flex flex-col sm:flex-row border rounded-lg p-4 shadow-sm"
              >
                <div className="w-full sm:w-40 h-40 overflow-hidden rounded-md mb-4 sm:mb-0">
                  {/* <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  /> */}
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image || "/placeholder.jpg"} // fallback if image is missing
                      alt={item.name || "Item image"}
                      fill
                      className="object-cover"
                    />
                  </div>


                </div>
                <div className="flex-1 sm:ml-6 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                    <h3 className="font-medium text-lg">{item.cartId}</h3>
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="text-md text-muted-foreground">Size: {item.size}</p>
                      <p className="text-md text-muted-foreground">Color: {item.color}</p>
                      <p className="text-md text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-auto">
                    <button 
                      onClick={() => handleMoveToWishlist(item.id, item.name)}
                      className="text-forest-600 hover:text-forest-800 flex items-center gap-1"
                    >
                      <Heart className="h-4 w-4" /> Save
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(item.cartId)}
                      className="text-forest-600 hover:text-red-500 flex items-center gap-1"
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
            <Button className="w-full text-lg" asChild>
              <Link href="/enquiry">
                Proceed to Enquiry
              </Link>
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
