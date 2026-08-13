import Image from 'next/image'
import React from 'react'

import first from '@/public/LOGO1.png'
const Contact = () => {
  return (
    <div>
        <section className='bg-white'>
            <div className='mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8'>
                
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.8485500382294!2d82.54965758713976!3d25.140810620370484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398febb2d79fdd11%3A0xcd52558298ff21e4!2sNew%20Masjid(Hayat%20Nagar)!5e0!3m2!1sen!2sin!4v1721809400110!5m2!1sen!2sin"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative z-10 lg:py-16">
                        <div className="relative h-48 sm:h-64 lg:h-full">
                            <Image
                                alt=""
                                src={first}
                                fill
                                className="object-contain"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                                priority
                            />
                        </div>
                    </div>

                    <div className="relative flex items-center bg-gray-100 mt-6 lg:mt-0">
                        <span
                        className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"
                        ></span>

                        <div className="p-6 sm:p-10 lg:p-16">
                            <h2 className="text-2xl font-bold sm:text-3xl">
                                Contact
                            </h2>

                            <h4 className='mt-5 font-semibold'>Head Office &amp; Showroom</h4>
                            <address className="mt-4 text-gray-700 not-italic">  
                                Hayat Nagar Mirzapur,<br/>
                                231001<br/>
                                Uttar Pradesh,<br/> 
                                India.
                            </address>

                            <p className='mt-4 text-gray-700'>Contact: <a href="tel:+919839805703" className="text-amber-600 hover:underline">+91 9839805703</a></p>
                            <div className="mt-4 text-gray-700">
                                <span className="font-medium">Email:</span>
                                <div className='flex flex-col mt-1 gap-1'>
                                    <a href="mailto:nuzratcarpet@gmail.com" className="text-blue-600 underline break-all">
                                    nuzratcarpet@gmail.com
                                </a>
                                <a href="mailto:info@nuzratcarpet.com" className="text-blue-600 underline break-all">
                                    info@nuzratcarpet.com
                                </a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Contact