"use client"
import React from 'react'
import { useState, useEffect } from "react";
import Spinner from '@/components/Spinner';

import Image from "next/image";
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const MyEnquiry = () => {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
    const fetchInquiries = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        return;
      }

      try {
        const response = await fetch(`/api/myEnquiry?user_id=${user.id}`);
        const data = await response.json();
        console.log("API Response:", data);
        setCart(data.cart);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);
  return (
    <>
    { isLoading ? ( <Spinner/>) : (
    <div className="mx-auto flex max-w-3xl flex-col space-y-4 p-6 px-2 sm:p-10 sm:px-2">
      <h1 className="text-2xl font-bold mb-4">Product Inquiries</h1>
      {Array.isArray(cart) && cart.length === 0 ? (

        <div className="grid place-items-center h-64">
          <p className="text-gray-500 text-center">Your Inquiries is empty.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {cart?.map((item) => {
                const images = JSON.parse(item.product_images || "[]"); // ✅ Parse images array
                const firstImage = images.length > 0 ? images[0] : null; // ✅ Get first image
                 // Ensure proper formatting
                // const formattedDate = item.formatted_date ? new Date(item.formatted_date).toLocaleDateString() : "N/A";
                // const formattedTime = item.formatted_time ? new Date(`1970-01-01T${item.formatted_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";

                return (
                  <li key={item.id} className="p-4 border rounded-lg shadow">
                    <div className="flex flex-col w-full space-x-2 sm:space-x-4 sm:flex-row">
                      {/* ✅ Display First Image */}
                      {firstImage ? (
                        // <img
                        //   className="h-[200px] w-full flex-shrink-0 rounded object-cover outline-none sm:h-32 sm:w-32"
                        //   src={firstImage}
                        //   alt={item.product_name}
                        // />
                        <div className="relative h-[200px] w-full sm:h-32 sm:w-32 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={firstImage || "/placeholder.jpg"}
                            alt={item.product_name || "Product Image"}
                            fill
                            className="object-cover"
                          />
                        </div>

                      ) : (
                        <p className="text-gray-500">No Image Available</p>
                      )}
                      <div className="flex w-full justify-between py-3">
                        <div className="flex  w-full justify-between space-x-2 pb-2 ">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold leading-snug sm:pr-8">{item.product_name}</h3>
                                <div className='flex items-center gap-3'>Color: <span className={`block h-5 w-5 rounded ${item.color}`} /></div>
                                <p className="text-sm">Size: {item.size}</p>
                                <p className='text-sm'>Quantity: {item.quantity}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-right text-sm font-semibold">Date: {item.formatted_date}</p> 
                              <p className="text-right text-sm font-semibold">Time: {item.formatted_time}</p> 
                            </div>
                        </div>
                        
                      </div> 
                    </div>
                  </li>
                );
              })}
        </ul>
      )}

    </div>
    )}
    </>
  )
}

export default MyEnquiry