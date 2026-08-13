"use client"
import React, { useState, useEffect, useRef } from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import { Minus, Plus, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgPager from 'lightgallery/plugins/pager';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-pager.css';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct
import DOMPurify from 'dompurify';
import useWishlistStore from '@/store/useWishlistStore';
import useCartStore from '@/store/cartStore';
import RelatedProduct from '@/components/RelatedProduct';


import { useSearchParams } from "next/navigation";
import ProductThumbnails from '@/components/ProductThumbnail';


const Product = () => {
  const { slug } = useParams(); 
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);


  const searchParams = useSearchParams();
  const initialColor = searchParams.get("color");


  const addToWishlistLocal = useWishlistStore((state) => state.addToWishlist);
  const lightGalleryRef = useRef(null);

  const handleOpenGallery = (index) => {
    if (lightGalleryRef.current) {
      lightGalleryRef.current.instance.openGallery(index);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    setSelectedImage(0);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to cart");
      router.push("/signin");
      return;
    }

    const currentColorObj = product?.colors?.find(c => c.name === selectedColor) || product?.colors?.[0] || null;
    const currentImages = currentColorObj?.images ?? [];

    const cartItem = {
      productId: product.id,
      quantity: quantity,
      color: currentColorObj?.name,
      size: selectedSize,
      image: currentImages[selectedImage],
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

      // ✅ Custom Popup at Bottom Right
      toast (
        <div className="flex gap-4 items-center">
          <Image
            src={currentImages[selectedImage]}
            alt={product.name}
            width={64}
            height={64}
            className="object-cover rounded-md"
          />
          <div>
            <h4 className="text-md font-bold text-black">{product.name}</h4>
            <p className="text-sm text-gray-700">
              Quantity: {quantity},
            </p>
            <p className='text-sm text-gray-700'> Size: {selectedSize},</p>
            <p className='text-sm text-gray-700'>Color: {selectedColor}</p>
            <button
              onClick={() => router.push("/cart")}
              className="mt-1 text-xs px-3 py-1 bg-black text-white rounded"
            >
              View Cart
            </button>
          </div>
        </div>,

        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

    } else {
      toast.error(data.error);
    }

  };

  const handleAddToWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to wishlist");
      router.push("/signin");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const res = await fetch("/api/wishlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, productId }),
    });

    const result = await res.json();

    if (res.ok) {
      addToWishlistLocal(product);
      toast.success("Added to Wishlist");
    } else {
      if (res.status === 409) {
        toast.warning("Already in Wishlist");
      } else {
        toast.error(result.error);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);

          const validColor = data.colors.find(c => c.name.toLowerCase() === initialColor?.toLowerCase());
  
          setSelectedColor(validColor ? validColor.name : data.colors[0]?.name);
          // setSelectedColor(data.colors[0]?.name);
          setSelectedSize(data.sizes[0]?.value || data.sizes[0]);
        } else {
          toast.warning(`Product Not Found, ${data.error || "Unable to fetch product."}`);
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading || !product) return <Spinner />;

  // const currentColorObj = product?.colors?.find(c => c.name === selectedColor) || product?.colors?.[0] || null;
  const currentColorObj = product?.colors?.find(c => c.name === selectedColor) || product?.colors?.[0];
  const currentImages = currentColorObj?.images ?? [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-500">
          <Link href={"/shop"} className="hover:text-gray-700">SHOP</Link>{" "}
          / <span className='text-gray-700 uppercase'>{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <section className='container mx-auto px-4 py-4 md:py-8'>
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-2">
          {/* Product Images Container */}
          <div className="md:sticky top-24 self-start flex flex-col md:flex-row gap-4">
            {/* Main Image - First on Mobile, Second on Desktop */}
            <div 
              className="relative aspect-square w-full bg-stone-100 cursor-zoom-in order-1 md:order-2 rounded-xl overflow-hidden shadow-sm"
              onClick={() => handleOpenGallery(selectedImage)}
            >
              <Image 
                src={`${currentImages[selectedImage]}?height=700&width=700`} 
                alt={product.name || "Main product"} 
                fill 
                className="object-cover" 
                priority
              />
            </div>

            {/* Thumbnails - Second on Mobile (Below Main Image), First on Desktop (Left of Main Image) */}
            <div className="order-2 md:order-1 w-full md:w-auto flex-shrink-0">
              <ProductThumbnails
                currentImages={currentImages}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>

            {/* Hidden LightGallery */}
            <LightGallery
              onInit={ref => lightGalleryRef.current = ref}
              dynamic
              elementClassNames="custom-lightgallery"
              dynamicEl={currentImages.map((img, index) => ({
                src: `${img}?height=1200&width=1200`,
                thumb: `${img}?height=100&width=100`,
                subHtml: `<span>${index + 1} / ${currentImages.length}</span>`,
              }))}
              plugins={[lgThumbnail, lgZoom, lgPager]}
              closable
              download={false}
              toggleThumb
              hash={false}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium uppercase mb-3 text-gray-900">
                {product.name}
              </h1>

              {product.isOutlet === 1 && (
                <div className='flex flex-wrap items-center justify-between gap-2 mb-3'>
                  <span className="text-sm sm:text-base font-semibold text-green-600">
                    Starting from USD {product.outletNewPrice} to USD {product.outletOldPrice}
                  </span>
                  <span className="text-sm font-semibold text-red-500 border border-red-500 rounded-md px-2 py-1">
                    -{product.outletDiscount}% Off
                  </span>
                </div>
              )}

              <Separator />
              <div className='text-sm font-medium py-3'>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </div>
              </div>
            </div>

            {/* Color */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-800">Color</h3>
                <span className="text-amber-700 font-medium bg-amber-50 px-3 py-1 rounded-full text-xs sm:text-sm">{currentColorObj?.name}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button 
                    key={color.name} 
                    onClick={() => color.inStock && handleColorChange(color.name)}
                    disabled={!color.inStock}
                    title={color.name}
                    aria-label={`Select color: ${color.name}`}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden transition-all duration-200
                      ${!color.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                      ${selectedColor === color.name ? 'ring-4 ring-amber-600 ring-offset-2 scale-105 shadow-md' : 'ring-2 ring-gray-200 hover:ring-amber-500'}`}
                  >
                    <Image src={`${color.images?.[0]}?height=100&width=100`} alt={color.name} fill className="object-cover w-full h-full rounded-full" />
                    {selectedColor === color.name && <Check size={18} className="absolute inset-0 m-auto text-white drop-shadow-lg" />}
                    {!color.inStock && <div className="absolute inset-0 bg-gray-400/50 rounded-full flex items-center justify-center">
                      <div className="w-5 h-0.5 bg-red-500 rotate-45"></div>
                    </div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedSize(size.value || size)}
                    className={`cursor-pointer border rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition duration-200
                      ${selectedSize === (size.value || size) ? "text-amber-700 border-amber-700 bg-amber-50/50" : "border-gray-300 text-gray-700 hover:border-gray-800"}`}
                  >
                    {size.value || size}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 w-fit">
              <button className="p-2" aria-label="Decrease quantity" onClick={decreaseQuantity}><Minus className="h-4 w-4" /></button>
              <span className="px-4">{quantity}</span>
              <button className="p-2" aria-label="Increase quantity" onClick={increaseQuantity}><Plus className="h-4 w-4" /></button>
            </div>

            {/* Add to Cart & Wishlist */}
            <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-12" onClick={handleAddToCart}>ADD TO QUOTE REQUEST</Button>
            <Button variant="outline" className="w-full rounded-none h-12 border-gray-300 hover:bg-gray-50" onClick={() => handleAddToWishlist(product.id)}>ADD TO WISHLIST</Button>

            {/* Accordion */}
            <Separator />
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description" className="border-b">
                <AccordionTrigger className="text-sm font-medium py-2">DETAILS</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm pb-1">  
                    {product.features?.map((feature, index) => (
                      <div key={index}>
                        <span className="font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm pb-1">
                    {product.specifications?.map((item, index) => (
                      <div key={index} className="flex justify-items-center ">
                        <span className="font-medium text-gray-700">{item.key} :</span>
                        <span className="text-muted-foreground text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="materials" className="border-b">
                <AccordionTrigger className="text-sm font-medium py-4">CERTIFICATION</AccordionTrigger>
                <AccordionContent>
                  <div className="prose max-w-none mt-4 text-gray-700 whitespace-pre-wrap">
                    {product.certification}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="construction" className="border-b">
                <AccordionTrigger className="text-sm font-medium py-4">CARE & MAINTENANCE</AccordionTrigger>
                <AccordionContent>
                  <div className="prose max-w-none mt-4 text-gray-700 whitespace-pre-wrap">
                    {product.care}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="addInfo" className="border-b">
                <AccordionTrigger className="text-sm font-medium py-4 uppercase">Additional Info</AccordionTrigger>
                <AccordionContent>
                  <div className="prose max-w-none mt-4 text-gray-700 whitespace-pre-wrap">
                    {product.addInfo}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-light mb-12 text-center">YOU MAY ALSO LIKE</h2>
          <RelatedProduct />
        </div>
      </section>
    </>
  );
};

export default Product;
