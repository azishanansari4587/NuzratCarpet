"use client"
import { useEffect, useState, useRef } from 'react'
import React from 'react'

import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Spinner from '@/components/Spinner';


const Banner = () => {

  const [product, setProduct] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const slidesRef = useRef([]);

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
          const parsedData = Array.isArray(data) ? data.map(item => ({
            ...item,
            images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
            imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path),
            tags: Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags),
          })) : [];
               
          setProduct(parsedData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
  
      fetchProduct();
    }, []);
  
    

    if (isLoading || product.length === 0) {
      return <Spinner/>; // 🌀 loader or fallback
    }


    

    const handleSlideChange = (swiper) => {
      slidesRef.current.forEach((el) => {
        if (el) el.classList.remove('zoom-animation');
      });
      const current = slidesRef.current[swiper.realIndex];
      if (current) {
        void current.offsetWidth; // force reflow
        current.classList.add('zoom-animation');
      }
    };


  return (
    <section className='relative'> 
    { isLoading ?  <Spinner/> : (
      <Swiper
      effect="fade"
      speed={5000} // 2 seconds fade transition
      loop={true}
      autoplay={{ delay: 10000 }}
      pagination={{
        clickable: true,
        el: '.swiper-pagination',
      }}
      navigation={{
        nextEl: ".button-next-slide",
        prevEl: ".button-prev-slide",
      }}
      modules={[Pagination, Navigation, Autoplay, EffectFade]}
      onSlideChange={handleSlideChange}
      onSwiper={(swiper) => handleSlideChange(swiper)} // apply zoom on first slide
      className="w-full h-[80vh]"
    >
      {product
        .filter(item => item.tags.includes('Banner'))
        .map((item, index) => (
          <SwiperSlide key={item.id}>
            <div
              ref={(el) => (slidesRef.current[index] = el)}
              className="relative w-full h-[80vh]"
            >
              <Image
                src={`${item.images[0]}?height=1080&width=1920`}
                alt={item.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )}
    
        
    </section>
  )
}

export default Banner