"use client"
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import {MapPin, Mail, Phone, Clock9, Youtube, Twitter, Instagram, Facebook} from 'lucide-react';

import image1 from '@/public/LOGO2.png'
import Logo1 from '@/public/LOGO1.png'
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'react-toastify';


const Footer = () => {
  const [email, setEmail] = useState('');
  
  
      const handleSubscribe = async(e)=> {
          e.preventDefault();
          try {
            const response = await fetch('api/subscribers', {
              method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              body: JSON.stringify({ email }),
            });
  
            const data = await response.json();
            console.log(data);
            
            if(response.ok) {
              toast.success("Thanks for subscribing!");
              setEmail('');
  
            }else {
              toast.error(data.error);
            }
          } catch (error) {
            
            toast.error(error.message);
          }
      }
  return (

    <footer className="bg-[#DED3C4] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>

            <div className='flex flex-col items-center gap-2 space-y-2 mb-4'>
                <Image src={Logo1} alt='Logo1' width={30}/>
                <Image src={image1} alt='Logo2' width={300}/>
            </div>
            <p className="text-gray-700 mb-4">
              Discover the finest collection of handcrafted rugs and carpets from around the world. Quality, beauty, and
              tradition in every piece.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black p-2">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link href="/rugs" className="hover:text-black transition-colors">
                  Rugs
                </Link>
              </li>
              <li>
                <Link href="/outdoor" className="hover:text-black transition-colors">
                  Indoor & Outdoor
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-black transition-colors">
                  Designers
                </Link>
              </li>
              <li>
                <Link href="/outlet" className="hover:text-black transition-colors">
                  Outlet
                </Link>
              </li>
              <li>
                <Link href="/customizeInquiry" className="hover:text-black transition-colors">
                  Customize Rugs
                </Link>
              </li>
            </ul>
          </div>

          

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/catalogues" className="hover:text-black transition-colors">
                  Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-gray-700 mb-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 9839805703</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@nuzratcarpet.com">info@nuzratcarpet</a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>
                  Hayat Nagar Mirzapur, 
                  231001 Uttar Pradesh, India.
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Newsletter</h4>
              <p className="text-sm text-gray-700 mb-3">Subscribe for exclusive offers and new arrivals</p>
              <form onSubmit={handleSubscribe}>
              <div className="flex gap-2">
                <Input type="email" 
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Subscribe</Button>
              </div>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 text-sm">© {new Date().getFullYear()} Nuzrat Carpet Emporium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer