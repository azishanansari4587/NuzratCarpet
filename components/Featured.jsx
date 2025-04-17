import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'

const Featured = () => {
  return (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-light mb-4">MAISON COLLECTION</h2>
            <p className="text-neutral-600 mb-6">
                Explore our customizable, made-to-order collection of furniture and rugs. Each piece is crafted with
                exceptional materials and meticulous attention to detail.
            </p>

            <Button
                size="lg"
                variant="outline"
                className="rounded-none border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white"
            >
                <Link href="/shop">SHOP NOW</Link>
            </Button>
            </div>
            <div className="order-1 md:order-2">
            <div className="aspect-[4/3] relative">
                <Image
                src={"/PULSE.jpg?height=800&width=1000"}
                alt="Minimalist sofa from the collection"
                fill
                className="object-cover"
                />
            </div>
            </div>
        </div>
        </div>
    </section>
  )
}

export default Featured