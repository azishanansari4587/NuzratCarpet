import React from 'react'
import {ShoppingBasket } from 'lucide-react';
import Image from 'next/image';


import Logo from '@/public/47.jpg'
import Logo1 from '@/public/48.jpg'

const Header = () => {
  return (
    <header className='bg-white shadow-2xl'>
        <div className='mx-auto max-w-screen-xl p-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between '>
            <div className='md:flex md: items-center md:gap-12'>
              <a href="#" className='block text-teal-600'>
                <div className='flex flex-col items-center gap-2'>
                <Image src={Logo1} alt='' width={30} />
                <Image src={Logo} alt="" width={250}/>
                </div>
              </a>
            </div>

            <div className='hidden md:block'>
               <nav>
                <ul className='flex items-center gap-6 text-sm'>
                  <li>
                    <a href="/" className='text-black transition hover:text-gray-600'>Home</a>
                  </li>
                  <li>
                    <a href="/shop" className='text-black transition hover:text-gray-600'>Shop</a>
                  </li>
                  <li>
                    <a href="#" className='text-black transition hover:text-gray-600'>Professionals</a>
                  </li>
                  <li>
                    <a href="/about" className='text-black transition hover:text-gray-600'>About</a>
                  </li>
                  <li>
                    <a href="/contact" className='text-black transition hover:text-gray-600'>Contact</a>
                  </li>
                  <li>
                    <a href="/signin" className='text-black transition hover:text-gray-600'>SignIn</a>
                  </li>
                  <li>
                    <a href="/signup" className='text-black transition hover:text-gray-600'>SignUp</a>
                  </li>

                  <li>
                    <a href="/dashboard" className='text-black transition hover:text-gray-600'>Dashboard</a>
                  </li>
                </ul>
               </nav>
            </div>
            
            <div className='flex gap-6'>
              <a href="/cart"><ShoppingBasket/></a>
              <Image
                src="/placeholder-user.jpg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              /> 
            </div>


          </div>
        </div>
    </header>
  )
}

export default Header