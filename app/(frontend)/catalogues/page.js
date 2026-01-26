"use client"
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
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
            ) :
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {catalogues.map((cat) => (
                            <div
                                key={cat.id}
                                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                            >
                                {/* Decorative Gradient Background behind Image */}
                                <div className="relative w-full h-72 bg-white group-hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center overflow-hidden">

                                    {/* Subtle pattern or shine effect (Optional) */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

                                    <Image
                                        src={cat.imageUrl || "/placeholder.jpg"}
                                        alt={cat.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-in-out z-0"
                                    />
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex flex-col flex-grow items-center text-center justify-between relative z-20 bg-white">

                                    {/* Title with decorative underline on hover */}
                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                            {cat.title}
                                        </h2>
                                        <div className="h-1 w-12 bg-primary/20 mx-auto mt-2 rounded-full group-hover:w-24 group-hover:bg-primary transition-all duration-300" />
                                    </div>

                                    {/* Action Button */}
                                    {cat.pdfUrl && (
                                        <Button
                                            asChild
                                            className="w-full bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm font-medium rounded-full mt-auto"
                                        >
                                            <a
                                                href={cat.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 py-6" // Thoda bada button click area ke liye
                                            >
                                                <span>View Catalogue</span>
                                                <ExternalLink className="w-4 h-4" />
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