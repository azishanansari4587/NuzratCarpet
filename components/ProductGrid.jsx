"use client"
import { useEffect, useState } from 'react'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Spinner from '@/components/Spinner'




const ProductGrid = () => {

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
    <section>
        <div className="mx-auto px-4 py-8 sm:px-12 sm:py-12 lg:px-8">
        { isLoading ? ( <Spinner/>) : (
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {product.map((item) => (

                    <li key={item.id}>
                        <Link href={`/products/${item.id}`} className="group block overflow-hidden">
                            
                              <img
                              src={item.images[0]}
                              alt={item.image_path[0]}
                              className="h-[500px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                          />
                             {/* })}  */}
                            

                            <div className="relative bg-white pt-3">
                                <h3 className="text-gray-900 group-hover:underline group-hover:underline-offset-4">
                                    {item.name}
                                </h3>
                            </div>
                        </Link>
                    </li> 
                 ))} 
                    
                  
                  {/* item.tags.includes('Best') ? ( */}
                
            </ul>
        )}    
        </div>
    </section>
  )
}

export default ProductGrid