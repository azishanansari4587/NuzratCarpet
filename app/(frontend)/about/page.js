import Footer from '@/components/Footer'

import React from 'react'
import Image from 'next/image'

import first from '@/public/1.png'

const About = () => {
  return (
    <div>
        <div className='w-full bg-white'>
            <div className='mx-auto max-w-screen-2xl lg:px-8'>
                <div className='flex flex-col justify-center px-4 py-10 lg:px-6'>
                    <div className='py-4'>
                    <Image
                        className="w-full  object-cover  lg:h-[500px]"
                        src={first}
                        alt="Nuzrat Carpet Image"
                    />
                    </div>

                    <div className='mx-auto max-w-7xl px-4 py-10 lg:px-64'>
                        <h2 className='text-3xl text-center leading-10 text-gray-600 font-medium py-8 lg:py-10 '>About of Nuzrat Carpet Emporium</h2>
                        <p className='text-center leading-8 text-gray-500'>Kasthall has been at the forefront of the interior design industry for over 100 years. We combine elegant designs, materials of the utmost quality, and superior craftsmanship to make unique rugs that define every room and floor. Together with architects and designers, we create beautiful homes, offices, retail stores, hotels, and yachts. As a purveyor to the Royal Court of Sweden, our rugs are also used in historical buildings and palaces.</p>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 py-10 lg:px-64'>
                        <h2 className='text-3xl text-center leading-10 text-gray-600 font-medium py-8 lg:py-10'>History of Nuzrat Carpet Emporium</h2>
                        <p className='text-center leading-8 text-gray-600'>Kasthall has been at the forefront of the interior design industry for over 100 years. We combine elegant designs, materials of the utmost quality, and superior craftsmanship to make unique rugs that define every room and floor. Together with architects and designers, we create beautiful homes, offices, retail stores, hotels, and yachts. As a purveyor to the Royal Court of Sweden, our rugs are also used in historical buildings and palaces.</p>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 py-10 lg:px-64'>
                        <h2 className='text-3xl text-center leading-10 text-gray-600 font-medium py-8 lg:py-10'>How to work Nuzrat Carpet Emporium</h2>
                        <p className='text-center leading-8 text-gray-600'>Kasthall has been at the forefront of the interior design industry for over 100 years. We combine elegant designs, materials of the utmost quality, and superior craftsmanship to make unique rugs that define every room and floor. Together with architects and designers, we create beautiful homes, offices, retail stores, hotels, and yachts. As a purveyor to the Royal Court of Sweden, our rugs are also used in historical buildings and palaces.</p>
                    </div>

                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16'>
                        <div>
                            <Image src={first} alt=""  className="w-full object-cover   lg:h-[500px]"/>
                        </div>
                        <div>
                            <Image src={first} alt="" className="w-full  object-cover  lg:h-[500px]"/>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    </div>
  )
}

export default About