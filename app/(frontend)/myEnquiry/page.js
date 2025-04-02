"use client"
import React from 'react'
import { useState, useEffect } from "react";

const MyEnquiry = () => {
    const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch("/api/myEnquiry");
        const data = await response.json();
        console.log("API Response:", data);
        setCart(data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Inquiries</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">User Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          { cart.map((c) => (
            <tr key={c._id} className="text-center">
              <td className="border p-2">{c.user_name}</td>
              <td className="border p-2">{c.user_email}</td>
              <td className="border p-2">{c.product_name}</td>
              <td className="border p-2">${c.price}</td>
              {/* <td className="border p-2">{inquiry.message}</td> */}
              {/* <td className="border p-2">{new Date(inquiry.inquiry_date).toLocaleDateString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyEnquiry