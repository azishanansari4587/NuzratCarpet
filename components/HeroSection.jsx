import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ArrowRight, RotateCcw, Star, Truck } from 'lucide-react'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580229064033-d6cf020b2cf2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative container mx-auto h-full flex flex-col justify-center items-start px-4 md:px-8">
        <div className="max-w-xl animate-fade-in">
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                 Transform Your Space with
                 <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                 {" "}
                 Exquisite Rugs
                 </span>
        </h1>
          <p className="text-xl text-white/90 mb-8">
            Discover our curated collection of handcrafted rugs that blend tradition with modern aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8">
                 Shop Collection
                 <ArrowRight className="ml-2 w-5 h-5" />
                 </Button>
                 <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                 Custom Design
             </Button>
            </div>
        </div>
      </div>
    </section>
    
    // <section className="relative h-[85vh] bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden ">


    //     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            
    //     <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        
    //         <div>
    //         <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">✨ New Collection 2024</Badge>
    //         <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
    //             Transform Your Space with
    //             <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
    //             {" "}
    //             Exquisite Rugs
    //             </span>
    //         </h1>
    //         <p className="text-xl text-gray-600 mb-8 max-w-lg">
    //             Discover our curated collection of premium handcrafted rugs from master artisans around the world. Each
    //             piece tells a story of tradition, quality, and timeless beauty.
    //         </p>
    //         <div className="flex flex-col sm:flex-row gap-4">
    //             <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8">
    //             Shop Collection
    //             <ArrowRight className="ml-2 w-5 h-5" />
    //             </Button>
    //             <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
    //             Custom Design
    //             </Button>
    //         </div>

    //         </div>
    //         <div className="relative">
    //         <Image
    //             src="https://i.pinimg.com/736x/4f/4b/4a/4f4b4a9dc15e428d0c2d7424bf66fc72.jpg"
    //             alt="Beautiful Persian Rug"
    //             width={600}
    //             height={600}
    //             className="rounded-2xl shadow-2xl"
    //         />
    //         </div>
    //     </div>
    //     </div>
    // </section>
  )
}

export default HeroSection