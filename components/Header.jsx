"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react"
import Image from 'next/image';
import Logo from '@/public/47.jpg'
import Logo1 from '@/public/48.jpg'
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/rugs", label: "Rugs" },
    { href: "/outdoor", label: "Outdoor" },
    { href: "/collection", label: "Collections" },
    { href: "/about", label: "About Us" },
    { href: "/customizeInquiry", label: "Customize" },
    { href: "/contact", label: "Contact Us" },
  ];


  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className='flex flex-col items-center gap-2'>
              <Image src={Logo1} alt='' width={30} />
              <Image src={Logo} alt="" width={250}/>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input type="text" placeholder="Search for rugs, patterns, colors..." className="pl-10 pr-4" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Navigation icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-5 h-5" />
            </Button>

            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  2
                </Badge>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation menu */}

        <nav className="hidden md:flex items-center justify-center space-x-8 py-4 border-t">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium ${
                pathname === item.href ? "text-amber-600" : "text-gray-700 hover:text-amber-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>


        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Input type="text" placeholder="Search rugs..." className="mb-4" />
              <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium">
                Home
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-amber-600 font-medium">
                Shop All
              </Link>
              <Link href="/shop?category=Persian" className="text-gray-700 hover:text-amber-600 font-medium">
                Persian Rugs
              </Link>
              <Link href="/shop?category=Modern" className="text-gray-700 hover:text-amber-600 font-medium">
                Modern
              </Link>
              <Link href="/customize" className="text-amber-600 hover:text-amber-700 font-medium">
                Custom Rugs
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 font-medium">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}