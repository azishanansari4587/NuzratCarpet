"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";


export default function Wishlist() {
  const { toast } = useToast();
  
  // Mock wishlist data
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Persian Royal Blue Carpet",
      price: 799.99,
      imageUrl: "https://i.pinimg.com/736x/84/a8/ee/84a8ee0e0607454fa73e7e5ef1757437.jpg",
      inStock: true
    },
    {
      id: 2,
      name: "Modern Geometric Rug",
      price: 349.99,
      imageUrl: "https://i.pinimg.com/736x/d0/26/d9/d026d9186a1cd37f95a83d419ef0a376.jpg",
      inStock: true
    },
    {
      id: 3,
      name: "Traditional Oriental Carpet",
      price: 1299.99,
      imageUrl: "https://i.pinimg.com/736x/e2/ff/eb/e2ffeb30b69ce078a1621994638e420b.jpg",
      inStock: false
    },
    {
      id: 4,
      name: "Vintage Moroccan Rug",
      price: 599.99,
      imageUrl: "https://i.pinimg.com/736x/96/7e/8f/967e8faab52dd66a253bda54a8dd571f.jpg",
      inStock: true
    }
  ]);

  const handleRemoveItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (id, name) => {
    // In a real app, this would add the item to the cart
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
    });
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;
    
    setWishlistItems([]);
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
          
          {wishlistItems.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-forest-700">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
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
                  <div key={item.id} className="border border-forest-200 rounded-md overflow-hidden group">
                    <div className="relative h-64">
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
                      
                      {!item.inStock && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-800/70 text-white py-2 px-3 text-sm font-medium">
                          Currently Out of Stock
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <Link href={`/products/${item.id}`} className="block mb-2 hover:text-forest-600">
                        <h3 className="font-medium text-forest-800 truncate">{item.name}</h3>
                      </Link>
                      {/* <p className="font-bold text-forest-900 mb-4">${item.price.toFixed(2)}</p> */}
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-primary hover:bg-forest-800 flex items-center justify-center gap-2"
                          disabled={!item.inStock}
                          onClick={() => handleAddToCart(item.id, item.name)}
                        >
                          <ShoppingCart className="h-4 w-4" /> Add to Cart
                        </Button>
                        <Button variant="outline" className="p-2 border-forest-300  hover:text-amber-600" asChild>
                          <Link href={`/products/${item.id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        </Button>
                      </div>
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