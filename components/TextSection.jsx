import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const TextSection = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-6">The World Known as Nuzrat Carpet Emporium.</h2>
          <p className="text-neutral-600 mb-8">
          Nuzrat Carpet Emporium isn&#39;t just a name — it&#39;s a symbol of tradition, elegance, and craftsmanship recognized across continents. With roots tracing back to the 1940s in the carpet city of Mirzapur, India, we&#39;ve evolved from a humble cottage industry into a globally respected brand.
          </p>
          <p className="text-neutral-600 mb-8">
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