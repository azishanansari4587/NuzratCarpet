"use client"
import { useEffect, useState } from 'react'
import React from 'react'

import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'

import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Spinner from '@/components/Spinner';


const Banner = () => {

  const [product, setProduct] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


    useEffect(() => {
      async function fetchProduct() {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
  
          // Ensure images field is correctly parsed
          const parsedData = data.map(item => ({
            ...item,
            images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
            imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path),
            tags: Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags),
          }));
               
          setProduct(parsedData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
  
      fetchProduct();
    }, []);
  
    if (!product) return;


  return (
    <div className='w-full'> 
    { isLoading ? ( <Spinner/>) : (
      <Swiper navigation={ 
        {
            nextEl: ".button-next-slide",
            prevEl: ".button-prev-slide",
        }
    } 
    loop={true}
    pagination={{
      clickable: true,
      el: '.swiper-pagination',
      type: 'bullets'
    }}
    modules={[Pagination,Navigation]}>
       {product.map((items)=>(
         items.tags.includes('Banner') ? (

         
          <SwiperSlide key={items.id} className="relative text-center bg-white font-medium flex justify-center items-center">
            <Image
              src={items.images[0]}
              alt={items.name}
              width={1600}
              height={500}
              className="aspect-[4/3] w-full rounded-lg object-cover lg:aspect-auto lg:h-[700px] lg:object-center"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 hover:opacity-100  bg-opacity-50">
              <h3 className="lg:text-2xl text-white text-center">Designed by Shah Alam</h3>
              <h2 className="py-3 lg:text-8xl text-white text-center">{items.name}</h2>
              <Link href={`/products/${items.id}`} className="text-white border-b-2 lg:px-10 lg:py-2 hover:bg-black lg:m-2">
                Explore Now
              </Link>
            </div>
          </SwiperSlide>
           
        ): (
          ''
        )
        ))} 


        <div className='top-[50%] absolute z-10 border border-black button-prev-slide left-5 text-black w-[40px] h-[40px] hover:text-white  hover:bg-black grid place-items-center'>
          <ChevronLeft />
        </div>
        <div className='swiper-pagination swiper-pagination-bullets absolute z-10 '>
          
        </div>
        <div className='top-[50%] absolute z-10 border border-black button-next-slide right-5 text-black w-[40px] h-[40px] hover:text-white hover:bg-black grid place-items-center'> 
          <ChevronRight />
        </div>
    </Swiper>
    )}
        
    </div>
  )
}

export default Banner