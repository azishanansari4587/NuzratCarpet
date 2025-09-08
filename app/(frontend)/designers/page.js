import Image from 'next/image'
import React from 'react'
import designer1 from '@/public/KarimRashid.png'
import designer2 from '@/public/kulper.jpg'
import { ExternalLink } from 'lucide-react';
import Link from "next/link"

const Designers = () => {
  return (
    <div>
        <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Meet Our <span className="text-primary">Master Designers</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover the talented artisans behind our exquisite carpet collections. 
                Each designer brings unique expertise and cultural heritage to create 
                one-of-a-kind pieces.
            </p>
            </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <Image src={designer1} alt="Designer 1" priority className="w-full h-auto" />
            <div className="col-span-1 lg:col-span-2">
                <p className='py-4 leading-6 text-gray-700'>Karim Rashid is one of the most prolific designers of his generation. Over 4000 designs in production, over 300 awards and working in over 40 countries attest to Karim’s legend of design. His award winning designs include luxury goods for Christofle, Veuve Clicquot, and Alessi, democratic products for Umbra, Bobble, and 3M, furniture for Bonaldo and Vondom, lighting for Artemide and Fontana Arte, high tech products for Asus and Samsung, surface design for Marburg and Abet Laminati, brand identity for Citibank and Sony Ericsson and packaging for Method, Paris Baguette, Kenzo and Hugo Boss.</p>

                <p className='py-4 leading-6 text-gray-700'>Karim’s touch expands beyond product to interiors such as the Morimoto restaurant, Philadelphia; Semiramis hotel, Athens; nhow hotel, Berlin; Universita Metro Station, Naples as well as exhibition design for Deutsche Bank and Audi.</p>

                <p className='py-4 leading-6 text-gray-700'>Karim’s work is featured in 20 permanent collections and he exhibits art in galleries worldwide. Karim is a perennial winner of the Red Dot award, Chicago Athenaeum Good Design award, I. D. Magazine Annual Design Review, IDSA Industrial Design Excellence award.</p>

                <p className='py-4 leading-6 text-gray-700'>Karim is a frequent guest lecturer at universities and conferences globally disseminating the importance of design in everyday life. He holds Honorary Doctorates from the OCAD, Toronto and Corcoran College of Art & Design, Washington. Karim has been featured in magazines and books including Time, Vogue, Esquire, GQ, Wallpaper, and countless more.</p>

                <Link
                href="" // yahan apna actual path de
                className="inline-flex items-center gap-1 rounded-md bg-neutral-800 text-white p-2 text-sm hover:bg-neutral-700 transition"
                >
                <span>View More About Karim Rashid</span>
                <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="col-span-1 lg:col-span-2">
                <p className='py-4 leading-6 text-gray-700'>Ingrid Kulper, hailing from Sweden, is a designer known for her serene aesthetic—a harmonious blend of minimalist elegance and thoughtful craftsmanship. Her award-winning designs, such as the Jigzaw Stardust Carpet and Edge Area Rug (Silver A’ Design Awards, 2016–2017), reflect her talent for creating functional art. The Astron Shape-Shifting Rug, her 2018 Gold A’ Design Award winner, showcases her ingenuity in marrying flexibility, beauty, and comfort—cementing her status among Sweden’s most celebrated contemporary designers</p>

                <p className='py-4 leading-6 text-gray-700'>Beyond A’ Design, Ingrid has earned accolades from the European Product Design Award, International Design Award, German Design Award, and the Iconic Product Design Award in 2017–2018. Her work has been featured in publications like Plaza Interior and I Form, and she has crafted custom pieces for prestigious institutions such as KTH. Multilingual and creatively grounded, Ingrid brings her passions—yoga, sailing, raw food, and gardening—to every design, grounding her artistic vision in authenticity and balance.</p>

                <Link
                href="" // yahan apna actual path de
                className="inline-flex items-center gap-1 rounded-md bg-neutral-800 text-white p-2 text-sm hover:bg-neutral-700 transition"
                >
                <span>View More About Ingrid Kulper</span>
                <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
            <Image src={designer2} alt="Designer 1" priority className="w-full h-auto" />
        </div>

    </div>
  )
}

export default Designers