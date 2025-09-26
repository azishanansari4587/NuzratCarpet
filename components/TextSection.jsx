import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const TextSection = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-6">The World Known as Nuzrat Carpet Emporium.</h2>
          <p className="text-neutral-700 mb-8">
          The story of Nuzrat Carpet Emporium is one of tradition, resilience, and excellence. It begins with the vision of the Late Mr. Haji Arman Ali, a farmer who combined his agricultural livelihood with an entrepreneurial spirit in the 1940s. With determination and foresight, he established a small cottage industry in his village, where skilled neighbors and artisans came together to weave hand-knotted carpets. These rugs, rooted in traditional techniques, supplied the local Indian market and quickly became admired for their beauty and durability.
          </p>
          <p className="text-neutral-700 mb-8">
          &#34;From the heart of India to homes around the world — every thread tells a story.&#34;
          </p>
          <Button
            size="lg"
            variant="outline"
            className="rounded-none border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white"
          >
            <Link href="/about">READ MORE</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TextSection