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
                        <h1 className='text-3xl leading-8  font-bold py-2 lg:py-3 '>Nuzrat Carpet Emporium </h1>

                        <h2 className='text-2xl  font-bold py-4 lg:py-6'>A Journey of Craftsmanship Across Generations</h2>
                        <p className='leading-6 text-gray-700'>The story of Nuzrat Carpet Emporium is one of tradition, resilience, and excellence. It begins with the vision of the Late Mr. Haji Arman Ali, a farmer who combined his agricultural livelihood with an entrepreneurial spirit in the 1940s. With determination and foresight, he established a small cottage industry in his village, where skilled neighbors and artisans came together to weave hand-knotted carpets. These rugs, rooted in traditional techniques, supplied the local Indian market and quickly became admired for their beauty and durability.</p>
                        <p className=' py-4 leading-6 text-gray-700'>
                        For decades, this humble initiative nurtured not only livelihoods but also a deep cultural heritage. It was within this environment of creativity and craftsmanship that his son, Mr. Abdul Sattar, grew up. From a young age, he observed the details of weaving, dyeing, and designing—learning from the artisans who worked alongside his father. By the time he came of age, Abdul Sattar had absorbed both the artistry and the business sense required to carry the vision forward.
                        </p>

                        <p className=' leading-6 text-gray-700'>
                        In 1982, with confidence and ambition, Mr. Abdul Sattar founded Nuzrat Carpet Emporium, transforming the family tradition into a formal enterprise. He set out to create a company that would not only preserve the art of handmade carpets but also adapt it to changing markets and international standards. Under his leadership, the firm expanded rapidly, introducing new designs, experimenting with materials, and adopting innovative weaving techniques. Within a short span, the company established itself as one of India’s most respected names in the manufacturing and export of handmade carpets and rugs. 
                        </p>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 lg:px-64'>
                        <h2 className='text-3xl  leading-10  font-bold py-6 lg:py-8'>The Heritage Continued by the Third Generation</h2>
                        <p className=' leading-6 text-gray-700'>Today, the proud heritage of Nuzrat Carpet Emporium is upheld by the third generation of the family—Mr. Raju Ansari and Mr. Shah Alam, the grandsons of Haji Arman Ali and sons of Abdul Sattar. Both leaders bring not only business acumen but also a deep personal connection to the craft. Having learned the weaving process themselves, they possess a unique advantage: the ability to manage the company from the perspective of both artisans and entrepreneurs.
                        </p>

                        <p className=' py-4 leading-6 text-gray-700'>Their presence on the production floor, close involvement in design development, and direct communication with international clients ensure that quality, innovation, and customer satisfaction remain the hallmarks of the company. Unlike many large - scale manufacturers, Nuzrat Carpet Emporium remains a family-run business, where every decision is taken with care and every product is overseen with personal attention.</p>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 py-10 lg:px-64'>
                        <h2 className='text-3xl leading-10 font-bold py-6 lg:py-8'>Our Products & Expertise</h2>

                        <p className=' leading-6 text-gray-700'>Over the decades, Nuzrat Carpet Emporium has built a wide - ranging product portfolio that caters to global tastes and modern lifestyles while maintaining traditional roots.</p>

                        <ul className='py-2 leading-6 text-gray-700 px-5 list-disc '>
                            <li><span className='font-bold'>Carpets & Rugs:</span> Hand-knotted, hand-tufted, hand woven flat rugs, kilims, dhurries, shaggy rugs, and more, crafted in a variety of designs ranging from classical Persian inspirations to contemporary patterns.</li>
                            <li><span className='font-bold'>Materials:</span> Expertise in weaving with wool, silk, bamboo silk, cotton, linen, leather, hemp, acrylic, polypropylene, recycled pet yarn, and blends of natural and modern fibers.</li>
                            <li><span className='font-bold'>Expanded Collections:</span> In recent years, the company has extended beyond carpets to create a holistic home décor line, including furniture, cushions, poufs, and other home accessories.</li>
                        </ul>

                        <p className=' py-4 leading-6 text-gray-700'>Each product is developed with a focus on quality, durability, and elegance, making them suitable for both luxury interiors and everyday living spaces.</p>

                        <h2 className='py-2 text-3xl font-bold'>Global Reach & Clientele</h2>
                        <p className=' leading-6 text-gray-700'>Nuzrat Carpet Emporium has steadily grown from a local cottage industry to a global exporter. Our products are shipped to wholesalers, distributors, retail chains, designers, and institutions around the world. Our clientele includes:</p>
                        <ul className='py-2 leading-6 text-gray-700 font-medium px-5 list-disc '>
                            <li>Wholesalers & Distributors</li>
                            <li>Retail Chain Stores & Independent Retailers</li>
                            <li>Architects & Interior Designers</li>
                            <li>Hotels & Restaurants</li>
                            <li>Government Institutions</li>
                            <li>Private Collectors & Individuals</li>
                        </ul>

                        <p className='py-3 leading-6 text-gray-700'>The company has invested in modern infrastructure to ensure efficient and timely logistics. Whether by air, sea, or courier, we guarantee safe and reliable shipment of goods to destinations across Europe, the Middle East, North America, Asia, and beyond.</p>

                        <h2 className='py-2 text-3xl font-bold'>What Sets Us Apart</h2>
                        <ul className='leading-6 text-gray-700 px-5 list-disc '>

                            <li><span className='font-bold'>Heritage & Experience:</span> Three generations of expertise in handmade carpets, blending tradition with innovation.</li>
                            <li><span className='font-bold'>Personal Supervision:</span> Owners with weaving knowledge who directly oversee the work, ensuring uncompromising quality.</li>
                            <li><span className='font-bold'>Customer-Centric Approach:</span> Our philosophy places the customer at the center of every decision, from design development to final delivery.</li>
                            <li><span className='font-bold'>Flexibility & Innovation:</span> Ability to adapt quickly to custom requirements, new trends, and market demands.</li>
                            <li><span>Global Infrastructure:</span> Strong logistics network for timely worldwide delivery.</li>
                        </ul>

                        <h2 className='py-2 text-3xl font-bold'>Our Philosophy</h2>
                        <p className=' leading-6 text-gray-700'>At Nuzrat Carpet Emporium, we believe that every carpet tells a story— a story of craftsmanship, heritage, and human touch. Our philosophy is simple yet powerful:</p>
                        
                        <p className='py-2 leading-6 text-gray-700 font-bold'>“Giving the best service is our first priority. We never compromise on quality. During work, our eyes are always the eyes of our customers.”</p>
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