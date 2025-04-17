"use client"
import React, {useState, useEffect, useRef} from 'react'
import Footer from '@/components/Footer'
import Headers from '@/components/Header'


import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { MoveRight, MoveLeft, Minus, Plus, Info } from 'lucide-react';
import {useParams, useRouter } from 'next/navigation';
import Link from 'next/link'
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import toast from 'react-hot-toast';
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


  

const Product = () => {
    const { slug } = useParams(); 
    const [error, setError] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    // const [selectedColor, setSelectedColor] = useState('');

    const [selectedImage, setSelectedImage] = useState(product?.images?.[0])
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter();



    const [selectedSize, setSelectedSize] = useState('');

    // const {addItem} = useCart();
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
  
      return () => clearTimeout(timer);
    }, []);
  
    // Set default image once product loads
    useEffect(() => {
        if (product?.images?.length > 0) {
        setSelectedImage(product.images[0]);
        }
    }, [product]);

  
  
    useEffect(() => {
    async function fetchProduct() {
        try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();

        // Ensure images field is correctly parsed

        const parsedProduct = {
            ...data,
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images),
            imagePath: Array.isArray(data.image_path) ? data.image_path : JSON.parse(data.image_path),
            tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags),
            sizes: Array.isArray(data.sizes) ? data.sizes : JSON.parse(data.sizes),
        };

        
        setProduct(parsedProduct);
        setSelectedSize(parsedProduct.size);
        setIsLoading(false);
        } catch (error) {
        console.error('Error fetching products:', error);
        }
    }

    async function fetchRelatedProducts() {
    try {
        const res = await fetch(`/api/products/${slug}/related`);
        const data = await res.json();
        const parsedData = data.map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
        imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path)
        }));
        if (res.ok) {
        setRelatedProducts(parsedData);
        setIsLoading(false);
        } else {
        setError(parsedData.message);
        }
    } catch (err) {
        setError('An error occurred while fetching related products.');
    }
    }

    fetchProduct();
    fetchRelatedProducts();
    }, [slug]);

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };



     const addToCart = async () => {
    // Fetch product details by ID
    const response = await fetch(`/api/products/${slug}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    const data = await response.json();

    
    const parsedProduct = {
        ...data,
        images: Array.isArray(data.images) ? data.images : JSON.parse(data.images),
        imagePath: Array.isArray(data.image_path) ? data.image_path : JSON.parse(data.image_path),
        tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags),
        sizes: Array.isArray(data.sizes) ? data.sizes : JSON.parse(data.sizes),
    };
    if(!selectedSize){
        toast.error('Please select a size');
        return;
    }

    // Construct cart item with full details
    const cartItem = {
        productId: product.id,
        quantity: quantity,
        image: parsedProduct.images[0],
        color: product.color,
        size: selectedSize,
        title: parsedProduct.name,
    };
    console.log(cartItem);
    

    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Product added to cart 🛒' );
    router.push('/cart');
    // alert('Product added to cart');
};
  
    return (
        <>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
            <div className="text-sm text-gray-500">
            <Link href={"/shop"} className="hover:text-gray-700">
                SHOP
            </Link>{" "}
            / <span className='text-gray-700 uppercase'>{product?.name}</span>
            </div>
        </div>
        
        <section className='container mx-auto px-4 py-4'>
            <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Product Images */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Image */}
                <div
                    className="relative aspect-square w-full bg-stone-100 mb-4 md:mb-0 cursor-zoom-in"
                >
                    <LightGallery
                    speed={500}
                    plugins={[lgThumbnail, lgZoom]}
                    elementClassNames="custom-wrapper"
                    >
                    {selectedImage && (
                      <Image
                        src={`${selectedImage}?height=600&width=600`}
                        alt="Main product"
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                     </LightGallery>
                </div>
                   
                                

                  {/* Thumbnails */}
                <div className="flex flex-row md:flex-col gap-4 md:mr-4 mb-4 md:mb-0">
                    <div className=" md:flex md:flex-col gap-2">
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
                              priority
                            />
                          </div>
                        </button>
                      ))}
                    </div>
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
                    <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-12" onClick={addToCart}>ADD TO CART</Button>

                    {/* Inquire Button */}
                    
                        <Button variant="outline" className="w-full rounded-none h-12 border-gray-300 hover:bg-gray-50">
                        <Link href={'/customizeInquiry'}>
                            CUSTOMIZE INQUIRE
                        </Link>
                        </Button>
                    

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
                                <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product.info }} />
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedProducts.map((product) => (
                        <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                        <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white">
                          <Image
                            src={`${product.images[0]}?width=500&height=500`}
                            alt={product.image_path[0]}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
                          {product.name}
                        </h3>
                      </Link>
                    ))}
                </div>
            </div>    
        </section>

        </> 
    );
}

export default Product
