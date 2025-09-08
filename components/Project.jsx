import Image from 'next/image'
import React from 'react'
import first from '@/public/KALEIDOSCOPE.jpg'
import second from '@/public/URBAN.jpg'
import third from '@/public/KARDIO.jpg'


const Project = () => {
  return (
    <section>
        <div className="mx-auto  px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="text-center">

                <p className='text-5xl text-center font-Open text-gray-700'><span className='text-amber-700'>Projects</span> from the World of <span className='text-amber-700'>Nuzrat Carpet Emporium</span></p>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <li>
                <a href="#" className="group relative block">
                <Image
                    src={first}
                    alt={first}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                />
                </a>
            </li>

            <li>
                <a href="#" className="group relative block">
                <Image
                    src={second}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                />
                </a>
            </li>

            <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <a href="#" className="group relative block">
                <Image
                    src={third}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90"
                />
                </a>
            </li>
            </ul>
        </div>
    </section>
  )
}

export default Project