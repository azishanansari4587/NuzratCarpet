"use client"
import React, {useState, useEffect, useRef} from 'react'

import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import 'swiper/css/navigation';
import { MoveRight, MoveLeft, Minus, Plus, Info, Check } from 'lucide-react';
import {useParams, useRouter } from 'next/navigation';
import Link from 'next/link'
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import LightGallery from 'lightgallery/react';

// Plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

// Styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import useWishlistStore from '@/store/useWishlistStore';
import useCartStore from '@/store/cartStore';
import RelatedProduct from '@/components/RelatedProduct';



  

const Product = () => {
    const { slug } = useParams(); 

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    // const [selectedColor, setSelectedColor] = useState('');

    // const [selectedImage, setSelectedImage] = useState(product?.images?.[0])
    const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter();


    const currentColorObj = product?.colors?.find(c => c.value === selectedColor) || product?.colors?.[0] || null;

    const currentImages = currentColorObj?.images || [];
  
    const sizeObject = product?.sizes?.find(s => s.value === selectedSize);
  
    const isInStock = sizeObject ? sizeObject.inStock : true;
  
    const addToWishlistLocal = useWishlistStore((state) => state.addToWishlist);

  
    const handleAddToCart = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        alert("Please login to add to cart");
        router.push("/signin");
        return;
      }
    
      const cartItem = {
        productId: product.id,
        quantity: 1,
        color: currentColorObj?.name,
        size: selectedSize,
        image: currentImages[selectedImage], // 🟢 send this too
      };
    
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        useCartStore.getState().addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: currentImages[selectedImage],
            color: currentColorObj?.name,
            size: selectedSize,
          });

        toast.success(`${quantity} x ${product.name} (${selectedSize}, ${selectedColor}) added to your cart.`);
  
      } else {
        toast.error(data.error);
      }
    };
    
  
    const handleAddToWishlist = async (productId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to wishlist");
        router.push("/login");
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
        addToWishlistLocal(product);
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
    
  
  
     const handleColorChange = (colorValue) => {
      setSelectedColor(colorValue);
      setSelectedImage(0); // Reset to first image when color changes
    };

  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
  
      return () => clearTimeout(timer);
    }, []);
  
    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const res = await fetch(`/api/products/${slug}`);
            const data = await res.json();
    
            if (res.ok) {
              setProduct(data);
              setSelectedColor(data.colors[0]?.value);
              setSelectedSize(data.sizes[0]);
            } else {
              toast.warning(`Product Not Found,  ${data.error || "Unable to fetch product."} `);
            }
          } catch (err) {
            toast.error(`Something went wrong`);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProduct();
      }, [slug]);
    
      if (loading) {
        return (
          <Spinner/>
        );
      }


    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

  
    return (
        <>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
            <div className="text-sm text-gray-500">
            <Link href={"/shop"} className="hover:text-gray-700">
                SHOP
            </Link>{" "}
            / <span className='text-gray-700 uppercase'>{product.name}</span>
            </div>
        </div>

        
        
        <section className='container mx-auto px-4 py-4'>
            <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Product Images */}
                <div className="md:sticky top-24 self-start flex flex-col md:flex-row gap-8">
                {/* Thumbnails - will appear on top (mobile) or left (desktop) */}
                    <div className="flex flex-row md:flex-col gap-4 md:mr-4 mb-4 md:mb-0 order-2 md:order-1">
                        {currentImages.map((i, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className="w-16 h-16 rounded-full overflow-hidden border border-gray-300"
                        >
                            <div className="relative w-full h-full bg-stone-300">
                            <Image
                                src={`${i}?height=64&width=64`}
                                alt={`Thumbnail ${index}`}
                                fill
                                className="object-cover"
                                priority
                            />
                            </div>
                        </button>
                        ))}
                    </div>

                    {/* Main Image - will appear below (mobile) or right (desktop) */}
                    <div className="relative aspect-square w-full bg-stone-100 mb-4 md:mb-0 cursor-zoom-in order-1 md:order-2">
                        <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]} elementClassNames="custom-wrapper">
                            <Image
                                src={`${currentImages[selectedImage]}?height=700&width=700`}
                                alt="Main product"
                                fill
                                className="object-cover"
                                priority
                            />
                        </LightGallery>
                    </div>
                </div>


                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-medium uppercase mb-2">{product?.name}</h1>
                        <Separator/>
                        <div className="flex items-center py-4 space-x-4">
                            {product?.tags?.includes("New") &&  (
                                <span className="text-sm rounded-md bg-gray-200 px-2 py-1">NEW</span>
                            )}
                        </div>
                    </div>

                    {/* Color */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Color</h3>
                        <span className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                            {currentColorObj.name}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {product.colors.map(color => (
                            <button
                            key={color.value}
                            className={`relative w-16 h-16 rounded-full overflow-hidden transition-all duration-200 ${
                                !color.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                            } ${
                                selectedColor === color.value 
                                ? 'ring-4 ring-primary ring-offset-2 scale-110 shadow-lg' 
                                : 'ring-2 ring-border hover:ring-primary/50'
                            }`}
                            onClick={() => color.inStock && handleColorChange(color.value)}
                            disabled={!color.inStock}
                            title={color.name}
                            aria-label={`Select color: ${color.name}`}
                            >
                            <Image 
                                src={`${color.images?.[0]}?height=100&width=100 `}
                                alt={color.name} 
                                fill
                                className="object-cover w-full h-full rounded-full" 
                            />

                            {selectedColor === color.value && (
                                <Check size={20} className="absolute inset-0 m-auto text-white drop-shadow-lg" />
                            )}
                            
                            {!color.inStock && (
                                <div className="absolute inset-0 bg-gray-400/50 rounded-full flex items-center justify-center">
                                <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                                </div>
                            )}
                            </button>
                        ))}
                    </div>

                    {/* Size Selector */}
                    <div className="flex flex-wrap gap-2">
                        {product?.sizes?.map((size, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedSize(size)}
                                className={`cursor-pointer border rounded px-4 py-2 text-sm font-semibold transition duration-200 
                                    ${selectedSize === size ? "bg-black text-white border-black" : "border-gray-300 text-gray-700 hover:border-black"}`}
                            >
                                {size}
                            </div>
                        ))}
                    </div>

                    <Separator/>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 w-fit">
                        <button className="p-2" aria-label="Decrease quantity" onClick={decreaseQuantity}>
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4">{quantity}</span>
                        <button className="p-2" aria-label="Increase quantity" onClick={increaseQuantity}>
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-12" onClick={handleAddToCart}>ADD TO CART</Button>


                    {/* Add to Wishlist Button */}
                    <Button variant="outline" className="w-full rounded-none h-12 border-gray-300 hover:bg-gray-50" onClick={() => handleAddToWishlist(product.id)}>ADD TO WISHLIST</Button>
                    
                    

                    {/* Shipping Info */}
                    <div className="space-y-2 pt-4">
                        <p className='text-sm text-wrap text-green-500'>In Stock</p>   
                        <div className="flex items-center text-sm">
                            <span>Ships in 3-4 Weeks</span>
                            <Info className="h-4 w-4 ml-1" />
                        </div>
                        <div className="flex items-center text-sm">
                            <span>Non-refundable</span>
                            <Info className="h-4 w-4 ml-1" />
                        </div>
                    </div>

                    <Separator />

                    {/* Product Description */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="description" className="border-b">
                            <AccordionTrigger className="text-sm font-medium py-4">DESCRIPTION</AccordionTrigger>
                            <AccordionContent>
                            <div className="space-y-4 text-sm">
                                <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product?.description }} />
                            </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="dimensions" className="border-b">
                            <AccordionTrigger className="text-sm font-medium py-4">INFORMATION</AccordionTrigger>
                            <AccordionContent>
                            <div className="space-y-2 text-sm">
                                {/* <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product.info }} /> */}
                                {product.specifications.map((item, index) => (
                                    <div key={index} className="border-b pb-3">
                                    <div className="flex justify-items-stretch gap-12 px-4">
                                        <span className="font-medium">{item.key}</span>
                                        <span className="text-muted-foreground">{item.value}</span>
                                    </div>
                                    </div>
                                ))}
                            </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="materials" className="border-b">
                            <AccordionTrigger className="text-sm font-medium py-4">MATERIALS</AccordionTrigger>
                            <AccordionContent>
                            <div className="space-y-2 text-sm">
                                <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product.quality }} />
                            </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="construction" className="border-b">
                            <AccordionTrigger className="text-sm font-medium py-4">CARE & MAINTENANCE</AccordionTrigger>
                            <AccordionContent>
                            <div className="space-y-2 text-sm">
                                <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product.maintanace }} />
                            </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>

                    {/* Social Sharing */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button className="flex items-center text-sm">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            >
                            <path d="M8 12h8" />
                            <path d="M12 8v8" />
                            <circle cx="12" cy="12" r="10" />
                            </svg>
                            <span className="ml-1">PIN TO PINTEREST</span>
                        </button>
                        <button className="flex items-center text-sm">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            >
                            <path d="M17 17h.01" />
                            <path d="M7 11h10" />
                            <path d="M7 7h10" />
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            </svg>
                            <span className="ml-1">PRINT TEARSHEET</span>
                        </button>
                    </div>
                </div>
            </div>
            
        </section>

        <Separator className="h-[2px] border-black mt-12"/>

        {/* Related Products */}
        <section className="py-16 md:py-24">
        
            <div className="container mx-auto px-4 md:px-6">
                
                <h2 className="text-2xl font-light mb-12 text-center">YOU MAY ALSO LIKE</h2>
                <RelatedProduct/>
            </div>    
        </section>

        </> 
    );
}

export default Product
