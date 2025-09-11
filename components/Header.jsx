"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react"
import Image from 'next/image';
import Logo from '@/public/LOGO2.png'
import Logo1 from '@/public/LOGO1.png'
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import useWishlistStore from "@/store/useWishlistStore"
import  useCartStore  from "@/store/cartStore";



export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();

  

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/rugs", label: "Rugs" },
    { href: "/outdoor", label: "Outdoor" },
    { href: "/collection", label: "Collections" },
    { href: "/designers", label: "Designers" },
    { href: "/outlet", label: "Outlets" },
    { href: "/customizeInquiry", label: "Customize" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.id) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Invalid token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const wishlist = useWishlistStore((state) => state.wishlist)
  const cart = useCartStore((state) => state.cart)

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // empty array, undefined nahi
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await fetch(`/api/products/search?q=${value}`);
      const data = await res.json();
      setResults(data.products);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  }; 


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

        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <Input
            type="text"
            placeholder="Search for rugs, patterns, colors..."
            value={query}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => query && setShowResults(true)}
            className="pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

          {/* Dropdown results */}
          {showResults && Array.isArray(results) && results.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg border mt-1 rounded z-50 max-h-64 overflow-auto">
              {results.map((item) => {
                const imageUrl = Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0]
                  : "/placeholder.png"; // fallback image

                const colorName = Array.isArray(item.colors) && item.colors.length > 0
                  ? item.colors[0].name
                  : "";

                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100"
                  >
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{colorName}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>


          {/* Navigation icons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => router.push('/profile')}>
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.push('/signin')}>
                Sign In
              </Button>
            )}

            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {wishlist?.length || 0}
                </Badge>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {/* {cart.reduce((total, item) => total + item.quantity, 0)} */}
                  {cart.length}
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
              {/* <Input type="text" placeholder="Search rugs..." className="mb-4" /> */}
              <div>
                <Input
                  type="text"
                  placeholder="Search for rugs, patterns, colors..."
                  value={query}
                  onChange={handleSearch}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  onFocus={() => query && setShowResults(true)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                {/* Dropdown results */}
                {showResults && Array.isArray(results) && results.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg border mt-1 rounded z-50 max-h-64 overflow-auto">
                    {results.map((item) => {
                      const imageUrl = Array.isArray(item.images) && item.images.length > 0
                        ? item.images[0]
                        : "/placeholder.png"; // fallback image

                      const colorName = Array.isArray(item.colors) && item.colors.length > 0
                        ? item.colors[0].name
                        : "";

                      return (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100"
                        >
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{colorName}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

              </div>

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