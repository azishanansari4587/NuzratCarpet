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
                        <p className='leading-8 text-gray-500'>Nuzrat Carpet Emporium, established in 1982 by Mr. Abdul Sattar in Mirzapur, Uttar Pradesh, India, is a family-owned manufacturer and exporter of handmade carpets and rugs. The company&apos;s origins trace back to the 1940s when Mr. Sattar&apos;s father, the late Mr. Haji Arman Ali, operated a small cottage industry producing hand-knotted carpets for the local market. Today, the third generation, led by Mr. Raju Ansari and Mr. Shah Alam, continues the family&apos;s legacy in the carpet industry.</p>
                        <p className=' py-4 leading-8 text-gray-500'>
                        Specializing in hand-knotted, hand-woven, and hand-tufted carpets, Nuzrat Carpet Emporium utilizes a variety of natural fibers, including wool, linen, silk, cotton, hemp, jute, bamboo silk, and banana silk, as well as polyester. The company has expanded its product line to include furniture, cushions, poufs, and other home accessories.
                        </p>

                        <p className=' leading-8 text-gray-500'>
                        Nuzrat Carpet Emporium serves a diverse clientele, including wholesalers, retailers, retail chain stores, interior designers, architects, and end-users. The company is committed to innovation and high-quality products, ensuring direct and daily contact with customers to enhance cooperation and flexibility from design to dispatch. 
                        </p>

                        <p className='py-2 leading-8 text-gray-500'>
                        The company&apos;s headquarters are located in Deopurwa (Hayat Nagar), Mirzapur - 231001, Uttar Pradesh, India.
                        </p>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 py-10 lg:px-64'>
                        <h2 className='text-3xl text-center leading-10 text-gray-600 font-medium py-8 lg:py-10'>History of Nuzrat Carpet Emporium</h2>
                        <p className='text-center leading-8 text-gray-600'>The story begins in the 1940s when Mr. Haji Arman Ali, father of Abdul Sattar, started a small cottage industry producing hand-knotted carpets in Mirzapur. These carpets were made using traditional techniques and were sold locally, laying the foundation of a family craft passed down generations.
                        In 1982, Mr. Abdul Sattar formalized the legacy by establishing Nuzrat Carpet Emporium. Under his leadership, the company transitioned from a small setup into a more organized manufacturing unit, maintaining the authenticity of handmade carpets. The business is now managed by the third generation, including Mr. Raju Ansari and Mr. Shah Alam. They brought modern approaches and expanded the brand into global exports, while still preserving the original hand-knotting and weaving techniques.
                        </p>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 py-10 lg:px-64'>
                        <h2 className='text-3xl text-center leading-10 text-gray-600 font-medium py-8 lg:py-10'>How to work Nuzrat Carpet Emporium</h2>

                        <h3 className='py-2 text-xl fontweight-bold'>1. Design & Customization</h3>
                        <ul className='leading-8 text-gray-600 px-5 list-disc '>
                            <li>In-house designers or client requests shape the carpet designs.</li>
                            <li>Designs can be traditional, modern, abstract, or custom-made.</li>
                            <li>They work closely with interior designers, architects, and buyers to finalize patterns, colors, and materials.</li>
                        </ul>

                        <h3 className='py-2 text-xl fontweight-bold'>2. Material Selection</h3>
                        <ul className='leading-8 text-gray-600 px-5 list-disc '>
                            <li>High-quality natural and blended fibers are used:
                            <ul className='px-5 list-disc '>
                                <li>Wool, Cotton, Silk</li>
                                <li>Jute, Hemp, Banana Silk</li>
                                <li>Bamboo Silk, Polyester</li>
                            </ul>
                            </li>
                            <li>Material choice depends on the type of carpet: hand-knotted, hand-woven, or hand-tufted.</li>
                        </ul>

                        <h3 className='py-2 text-xl fontweight-bold'>3. Handcrafting Process</h3>
                        <ul className='leading-8 text-gray-600 px-5 list-disc '>
                            <li>Artisans (many from local communities) create the carpets entirely by hand.</li>
                            <li>The process involves:
                                <ul className='px-5 list-disc '>
                                    <li>Spinning the yarn</li>
                                    <li>Dyeing (often using eco-friendly dyes)</li>
                                    <li>Knotting or weaving (takes weeks to months depending on size & detail)</li>
                                    <li>Washing and finishing to bring out texture and sheen</li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className='py-2 text-xl fontweight-bold'>4. Quality Control</h3>
                        <ul className='leading-8 text-gray-600 px-5 list-disc '>
                            <li>Each carpet undergoes thorough inspection for:
                                <ul className='px-5 list-disc '>
                                    <li>Knot density</li>
                                    <li>Color consistency</li>
                                    <li>Weaving precision</li>
                                </ul>
                            </li>
                            <li>Only approved pieces move to the next step.</li>
                        </ul>
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