"use client"
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const Catalogues = () => {
    const [catalogues, setCatalogues] = useState([]);
    const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        fetch("/api/catalogues")
          .then((res) => res.json())
          .then((data) => setCatalogues(data.catalogues || [])) // ✅ only array set
          .catch((err) => console.error("Fetch error:", err))
          .finally(() => {
            setLoading(false);
            });
      }, []);


  return (
    <div>
        <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-primary">Our Catalogues & Brochures</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Explore our latest collections and products. Browse, download, and stay updated with our curated catalogues.
            </p>
            </div>
        </section>
        {loading ? (
          <Spinner />
        ):
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {catalogues.map((cat) => (
                <div
                    key={cat.id}
                    className="border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative group"
                >
                    {/* Catalogue Image */}
                    <div className="relative w-full h-64 md:h-80 lg:h-96">
                    <Image
                        src={cat.imageUrl || "/placeholder.jpg"}
                        alt={cat.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    </div>

                    {/* Title & PDF Button */}
                    <div className="p-6 flex flex-col items-center">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
                        {cat.title}
                    </h2>
                    {cat.pdfUrl && (
                        <Button
                        asChild
                        className="bg-primary hover:bg-forest-800 w-full md:w-auto"
                        >
                        <a
                            href={cat.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View PDF
                        </a>
                        </Button>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>
        }
    </div>
  )
}

export default Catalogues