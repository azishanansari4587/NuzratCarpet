"use client"
import React, {useState, useEffect} from 'react'
import Footer from '@/components/Footer'
import Headers from '@/components/Header'


import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { MoveRight, MoveLeft } from 'lucide-react';
import {useParams } from 'next/navigation';
import Link from 'next/link'
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import toast from 'react-hot-toast';


  

const Product = () => {
    const { slug } = useParams(); 
    const [error, setError] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    // const [selectedColor, setSelectedColor] = useState('');


    const [selectedSize, setSelectedSize] = useState('');

    // const {addItem} = useCart();
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
  
      return () => clearTimeout(timer);
    }, []);
  
  
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
    // alert('Product added to cart');
};
  
    return (
        <>
            <Headers/>
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-8 2xl:py-16">
            { isLoading ? ( <Spinner/>) : (
                
                <div>
                    <>
                    <div className="block grid-cols-9 items-start gap-x-10 pb-10 pt-7 lg:grid lg:pb-14 xl:gap-x-14 2xl:pb-20">

                        <div className="col-span-5 grid grid-cols-1 gap-2.5">
                            <Swiper navigation={{
                            nextEl: ".button-next-slide",
                            prevEl: ".button-prev-slide",
                        }} modules={[Navigation]} className='w-full h-full'>
                                {product?.images?.map((img, index) => ( 
                                    <SwiperSlide key={index} className="col-span-1 transition duration-150 ease-in hover:opacity-90">
                                        <img
                                            src={img}
                                            alt={img}
                                            className="block h-full w-full object-cover lg:h-[600px]"
                                        />
                                    </SwiperSlide>
                                    ))} 
                                    <div className='top-[50%] absolute z-10 border border-black button-prev-slide left-5 text-black w-[40px] h-[40px] hover:text-white  hover:bg-black grid place-items-center'  >
                                        <MoveLeft />
                                    </div>

                                    <div className='top-[50%] absolute z-10 border border-black button-next-slide right-5 text-black w-[40px] h-[40px] hover:text-white hover:bg-black grid place-items-center'>
                                        <MoveRight/>
                                    </div>
                                
                                
                            </Swiper>
                            <div>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="flex items-center gap-4">
                                    {product?.images?.map((img, index) => (
                                        <img
                                        key={index}
                                        src={img}
                                        alt={img}
                                        className="h-52 w-52 cursor-pointer rounded object-cover"
                                        onClick={() => setSelectedImage(img)}
                                        />
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4 pt-8 lg:pt-0">
                            <div className="mb-7 border-b border-gray-300 pb-7">
                                <h2 className="text-heading mb-3.5 text-lg md:text-xl lg:text-2xl 2xl:text-3xl">
                                {product.name}
                                
                                </h2>

                            </div>
                            <div className="border-b border-gray-300 pb-3  ">
                                <div className="mb-4">
                                    <p className="text-body text-sm leading-6  lg:text-base lg:leading-8">
                                    {product.description}
                                    </p>
                                    <h3 className="my-4 text-heading mb-2.5 text-base font-semibold capitalize md:text-lg" onClick={() => setSelectedColor(color)}>Color </h3>
                                    <div className='flex items-center gap-3'><span className={`block h-9 w-9 rounded ${product.color}`} /></div>
                                    
                                    <h3 className="my-4 text-heading mb-2.5 text-base font-semibold capitalize md:text-lg">
                                        size
                                    </h3>
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
                                    {/* <div className="colors -mr-3 ">
                                        
                                        <select
                                             value={selectedSize} 
                                             onChange={(e) => {
                                               const selectedValue = e.target.value;  // Get the selected value
                                               console.log('Selected size:', selectedValue);  // Log the selected size
                                               setSelectedSize(selectedValue);  // Set the selected size in state
                                             }}
                                            required
                                            className="text-heading mb-2 mr-2 flex  cursor-pointer items-center justify-center rounded border border-gray-100 p-1 text-xs font-semibold transition duration-200 ease-in-out hover:border-black md:mb-3 md:mr-3 md:text-sm "
                                        >
                                            <option type="read-only">Choose an option</option>
                                            {product?.sizes?.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        ))}
                                        </select>
                                        
                                    </div> */}
                                </div>
                                <div className="mb-4 ">
                                <h3 className="text-heading mb-2.5 text-base font-semibold capitalize md:text-lg">
                                    Also Available
                                </h3>
                                <ul className="image -mr-3 flex flex-wrap">
                                    {relatedProducts.map((relatedProduct, index) => (
                                        <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                                            <li
                                            key={relatedProduct.id}
                                            className="text-heading mb-2 mr-2 flex h-64 w-32 cursor-pointer items-center justify-center rounded border border-gray-100 p-1 text-xs font-semibold uppercase transition duration-200 ease-in-out hover:border-black md:mb-3 md:mr-3 md:h-20 md:w-20 md:text-sm"
                                        >
                                            <img src={relatedProduct.images[0]} className="h-full w-full object-cover" alt={relatedProduct.name} />
                                        
                                            </li>
                                        
                                        </Link>
                                    ))} 
                                </ul>
                                </div>
                            </div>
                            <div className="space-s-4 3xl:pr-48 flex items-center gap-2 border-b border-gray-300 py-8  md:pr-32 lg:pr-12 2xl:pr-32">
                                <div className="group flex h-11 flex-shrink-0 items-center justify-between overflow-hidden rounded-md border border-gray-300 md:h-12">
                                <button
                                    className="text-heading hover:bg-heading flex h-full w-10 flex-shrink-0 items-center justify-center border-e border-gray-300 transition duration-300 ease-in-out focus:outline-none md:w-12"
                                    onClick={decreaseQuantity}
                                >
                                    -
                                </button>
                                <span className="duration-250 text-heading flex h-full w-12  flex-shrink-0 cursor-default items-center justify-center text-base font-semibold transition-colors ease-in-out  md:w-20 xl:w-24">
                                    {quantity}
                                </span>
                                <button  onClick={increaseQuantity} className="text-heading hover:bg-heading flex h-full w-10 flex-shrink-0 items-center justify-center border-s border-gray-300 transition duration-300 ease-in-out focus:outline-none md:w-12">
                                    +
                                </button>
                                </div>
                                <button
                                onClick={addToCart}
                                type="button"
                                className="h-11 w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                >
                                Add to cart
                                </button>
                            </div>

                        </div>

                    </div>
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-3'>
                        <div className="shadow-sm ">
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
                                >
                                <h2 className="font-medium">Information</h2>

                                <svg
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                </summary>

                                <p className="mt-4 px-4 leading-relaxed text-gray-700">
                                {product.info}
                                </p>
                            </details>
                        </div>

                        <div className="shadow-sm ">
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
                                >
                                <h2 className="font-medium">Quality</h2>

                                <svg
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                </summary>

                                <p className="mt-4 px-4 leading-relaxed text-gray-700">
                                {product.quality}
                                </p>
                            </details>
                        </div>

                        <div className="shadow-sm ">
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
                                >
                                <h2 className="font-medium">Care & Maintenance</h2>

                                <svg
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                </summary>

                                <p className="mt-4 px-4 leading-relaxed text-gray-700">
                                {product.maintanace}
                                </p>
                            </details>
                        </div>
                            
                            
                    </div>
                    </>
                </div>
            )} 

                {/* <div>
                    <h2>Related Products</h2>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-3">
                        
                        <div key={relatedProducts.id} className="shadow-sm">
                            <h3>{relatedProducts.name}</h3>
                            {relatedProducts.map((relatedProduct) => (
                            <img src={relatedProduct.images[0]} alt={relatedProduct.name} />
                        ))} 
                        </div>
                        
                    </div>
                </div> */}
                
            </div>
            <Footer/>
        </>
    );
}

export default Product

