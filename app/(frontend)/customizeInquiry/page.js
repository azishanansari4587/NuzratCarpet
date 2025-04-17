"use client"
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import toast from 'react-hot-toast';


const CustomizeInquiry = () => {
    const [formData, setFormData] = useState({
        name: '',
        productName: '',
        companyName: '',
        email: '',
        message: '',
    });
    const [phone, setPhone] = useState('');
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/customize', {
            ...formData,
            phone,
            });
            toast.success('Inquiry submitted successfully!');
            setFormData({
            name: '',
            productName: '',
            companyName: '',
            email: '',
            message: '',
            });
            setPhone('');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

  return (
    <section className='container mx-auto max-w-2xl px-4 py-12'>
      <h1 className="text-2xl font-medium mb-2">Customize Inquiry</h1>
      <p className='mb-2'>Reach out to us if you are interested in customizing this product, or would like more information.</p>
      <form onSubmit={handleSubmit} className='mt-6'>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">Name <span className='text-red-500'>*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full p-2 border-b-2 focus:outline-none focus:border-black" required />
        </div>
        <div className="mb-4">
          <label htmlFor="productName" className="block mb-1">Product Name <span className='text-red-500'>*</span></label>
          <input type="text" name="productName" value={formData.productName} onChange={handleChange}
            className="w-full p-2 border-b-2 focus:outline-none focus:border-black" required />
        </div>
        <div className="mb-4">
          <label htmlFor="companyName" className="block mb-1">Company Name</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
            className="w-full p-2 border-b-2 focus:outline-none focus:border-black" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email Address <span className='text-red-500'>*</span></label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full p-2 border-b-2 focus:outline-none focus:border-black" required />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1">Phone <span className='text-red-500'>*</span></label>
          <PhoneInput
            country={'in'}
            value={phone}
            onChange={setPhone}
            enableSearch={true}
            inputStyle={{ width: '100%' }}
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-1">Message <span className='text-red-500'>*</span></label>
          <textarea name="message" value={formData.message} onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-black" rows="4" required />
        </div>
        <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </section>
  )
}

export default CustomizeInquiry