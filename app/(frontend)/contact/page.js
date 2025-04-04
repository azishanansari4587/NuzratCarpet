import Footer from '@/components/Footer'
import Headers from '@/components/Header'
import Image from 'next/image'
import React from 'react'

const Contact = () => {
  return (
    <div>
        <section className='bg-white'>
            <div className='mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8'>
                
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.8485500382294!2d82.54965758713976!3d25.140810620370484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398febb2d79fdd11%3A0xcd52558298ff21e4!2sNew%20Masjid(Hayat%20Nagar)!5e0!3m2!1sen!2sin!4v1721809400110!5m2!1sen!2sin" height={600}   className="w-full" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                <div className="mt-12 grid grid-cols-1 lg:h-screen lg:grid-cols-2">
                    <div className="relative z-10 lg:py-16">
                        <div className="relative h-64 sm:h-80 lg:h-full">
                        <img
                            alt=""
                            src="/48.jpg"
                            className="absolute inset-0 h-full w-full object-contain"
                        />
                        </div>
                    </div>

                    <div className="relative flex items-center bg-gray-100 border border-">
                        <span
                        className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"
                        ></span>

                        <div className="p-8 sm:p-16 lg:p-24">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Contact
                            </h2>

                            <h4 className='mt-5'>Head Office, Showroom & Warehouses</h4>
                            <address className="mt-4 text-gray-600">  
                                Hayat Nagar Mirzapur,<br/>
                                231001<br/>
                                Uttar Pradesh,<br/> 
                                India.
                            </address>

                            <p className='mt-4 text-gray-600'>Work Time: 9:00 A.M To 10:00 P.M</p>
                            <p className='mt-4 text-gray-600'>Telephone: +91 9876543210</p>
                            <p className='mt-4 text-gray-600'>Email: nuzratcarpet@gmail.com</p>

                            <a
                                href="#"
                                className="mt-8 inline-block rounded border border-black bg-black px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-black focus:outline-none focus:ring active:text-indigo-500"
                            >
                                Contact Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Contact