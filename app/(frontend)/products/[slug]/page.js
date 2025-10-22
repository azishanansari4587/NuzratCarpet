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
      <section className='container mx-auto px-4 py-4'>
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-2">
          {/* Product Images */}
          <div className="md:sticky top-24 self-start flex flex-col md:flex-row gap-8">
            {/* Thumbnails */}
            <div className="flex flex-row md:flex-col gap-4 md:mr-4 mb-4 md:mb-0 order-2 md:order-1">
              {currentImages.map((i, index) => (
                <button key={index} onClick={() => { setSelectedImage(index); }}
                  className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                  <div className="relative w-full h-full bg-stone-300">
                    <Image src={`${i}?height=64&width=64`} alt={`Thumbnail ${index}`} fill className="object-cover" />
                  </div>
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square w-full bg-stone-100 mb-4 md:mb-0 cursor-zoom-in order-1 md:order-2"
              onClick={() => handleOpenGallery(selectedImage)}>
              <Image src={`${currentImages[selectedImage]}?height=700&width=700`} alt="Main product" fill className="object-cover" />
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
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-medium uppercase mb-2 flex justify-between gap-2">
              {product.name}
              </h1>

              {product.isOutlet === 1 && (
                <div className='flex justify-between gap-6'>
                  <span className="text-md font-semibold text-green-600">
                    Starting from USD {product.outletNewPrice } to
                    USD {product.outletOldPrice } 
                    
                  </span>
                  <span className="ml-2 text-lg text-red-500 font-semibold border border-red-500 rounded-md p-2 ">
                   - {product.outletDiscount}% Off
                  </span>
                </div>
              )}

              <Separator />
              <div className="space-y-4 text-md text-gray-500">
                <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
              </div>
            </div>

            {/* Color */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Color</h3>
              <span className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">{currentColorObj?.name}</span>
            </div>

            <div className="flex flex-wrap gap-4">
              {product.colors.map(color => (
                <button key={color.name} onClick={() => color.inStock && handleColorChange(color.name)}
                  disabled={!color.inStock}
                  title={color.name}
                  aria-label={`Select color: ${color.name}`}
                  className={`relative w-16 h-16 rounded-full overflow-hidden transition-all duration-200
                    ${!color.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                    ${selectedColor === color.name ? 'ring-4 ring-primary ring-offset-2 scale-110 shadow-lg' : 'ring-2 ring-border hover:ring-primary/50'}`}>
                  <Image src={`${color.images?.[0]}?height=100&width=100`} alt={color.name} fill className="object-cover w-full h-full rounded-full" />
                  {selectedColor === color.name && <Check size={20} className="absolute inset-0 m-auto text-white drop-shadow-lg" />}
                  {!color.inStock && <div className="absolute inset-0 bg-gray-400/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                  </div>}
                </button>
              ))}
            </div>

            {/* Size Selector */}
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <div key={index} onClick={() => setSelectedSize(size.value || size)}
                  className={`cursor-pointer border rounded px-4 py-2 text-sm font-semibold transition duration-200
                    ${selectedSize === (size.value || size) ? " text-black border-black" : "border-gray-300 text-gray-700 hover:border-black"}`}>
                  {size.value || size}
                </div>
              ))}
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
