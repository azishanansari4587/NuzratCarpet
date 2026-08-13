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
import useCartStore from "@/store/cartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();



  const navItems = [
    { href: "/", label: "Home" },
    { href: "/rugs", label: "Rugs" },
    { href: "/outdoor", label: "Indoor & Outdoor" },
    { href: "/collection", label: "Collections" },
    { href: "/designers", label: "Designers" },
    { href: "/outlet", label: "Outlets" },
    { href: "/decor-accessories", label: "Decor & Accessories" },
    { href: "/customizeInquiry", label: "Customize" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];



  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.id) {
          setIsLoggedIn(true);
          if (decoded?.role === 1) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error("Invalid token");
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/signin");
  };

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
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className='flex flex-col items-center gap-1'>
              <Image src={Logo1} alt='' width={22} className="md:w-[30px]" />
              <Image src={Logo} alt="" width={160} className="md:w-[220px]" />
            </div>
          </Link>

          {/* Desktop Search */}
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
                    : "/placeholder.png";
                  const colorName = Array.isArray(item.colors) && item.colors.length > 0
                    ? item.colors[0].name
                    : "";
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100"
                    >
                      <img src={imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
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

          <div className="flex items-center space-x-1 sm:space-x-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex focus-visible:ring-0">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.push('/signin')} className="hidden md:flex">
                Sign In
              </Button>
            )}

            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative p-2">
                <Heart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {wishlist?.length || 0}
                </Badge>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {cart.length}
                </Badge>
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-wrap gap-x-6 gap-y-2 py-3 border-t text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium whitespace-nowrap ${pathname === item.href ? "text-amber-600" : "text-gray-700 hover:text-amber-600"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile full-screen menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 z-40 bg-white flex flex-col">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <div className='flex flex-col items-center gap-1'>
                <Image src={Logo1} alt='' width={22} />
                <Image src={Logo} alt="" width={160} />
              </div>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Search for rugs, patterns, colors..."
                value={query}
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onFocus={() => query && setShowResults(true)}
                className="pl-10 pr-4 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

              {/* Mobile search results */}
              {showResults && Array.isArray(results) && results.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border mt-1 rounded z-50 max-h-52 overflow-auto">
                  {results.map((item) => {
                    const imageUrl = Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0] : "/placeholder.png";
                    const colorName = Array.isArray(item.colors) && item.colors.length > 0
                      ? item.colors[0].name : "";
                    return (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <img src={imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{colorName}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col divide-y divide-gray-100">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-3 text-base font-medium ${pathname === item.href ? "text-amber-600" : "text-gray-800 hover:text-amber-600"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile account actions */}
            <div className="mt-6 pt-4 border-t flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" className="w-full" onClick={() => { router.push('/dashboard'); setIsMenuOpen(false); }}>
                      Admin Dashboard
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => { router.push('/profile'); setIsMenuOpen(false); }}>
                    My Profile
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { router.push('/signin'); setIsMenuOpen(false); }}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}