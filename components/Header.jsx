"use client"
import React from 'react'
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Phone,
  PanelLeft,
  Search,
  Store,
  BriefcaseBusiness,
  FileChartColumnIncreasing,
  ShoppingCart, User,
  ShoppingBasket, Users2, 
  MenuIcon
} from "lucide-react"
import Link from 'next/link';
import { useCartStore } from '@/components/useCartStore';

import Logo from '@/public/47.jpg'
import Logo1 from '@/public/48.jpg'

const Header = () => {
  const totalItems = useCartStore(
    (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0)
  );


  return (
    <header className='sticky top-0 z-40 w-full bg-white py-4 border-b border-gray-100'>
        <div className='container mx-auto px-4 md:px-6'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <div className='md:flex md: items-center md:gap-12'>
              <Link href={"/"} className='block text-teal-600'>
                <div className='flex flex-col items-center gap-2'>
                <Image src={Logo1} alt='' width={30} />
                <Image src={Logo} alt="" width={250}/>
                </div>
              </Link>
            </div>
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
            <Link href={"/"} className="text-xs uppercase tracking-wider hover:text-neutral-500">
              Home
            </Link>
            <Link href={"/shop"} className="text-xs uppercase tracking-wider hover:text-neutral-500">
              Shop
            </Link>
            <Link href={"/professionals"} className="text-xs uppercase tracking-wider hover:text-neutral-500">
              Professional
            </Link>
            <Link href={"/about"} className="text-xs uppercase tracking-wider hover:text-neutral-500">
              About
            </Link>
            <Link href={"/contact"} className="text-xs uppercase tracking-wider hover:text-neutral-500">
              Contact
            </Link>

            </nav>
            
            {/* Actions */}
            <div className='hidden md:block'>
              <div className="flex items-center space-x-4">
                <button aria-label="Search" className="text-neutral-800 hover:text-neutral-500">
                  <Search className="h-4 w-4" />
                </button>
                <Link href={"/myEnquiry"} aria-label="My Enquiry" className="text-xs uppercase tracking-wider hover:text-neutral-500 hidden md:block">
                  My Enquiry
                </Link>
                <Link href={"/signin"} aria-label="Account" className="text-xs uppercase tracking-wider hover:text-neutral-500 hidden md:block">
                  Account
                </Link>
                <Link href={"/cart"} aria-label="Cart" className="flex text-neutral-800 hover:text-neutral-500">
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    console.log('cart', cart),
                    <span className="ml-1 text-xs">({totalItems})</span>
                  )}
                </Link>
                <button className="md:hidden text-neutral-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>  


            <div className=" sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0  sm:px-6">
              <Sheet >
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetTitle></SheetTitle>
                <SheetContent side="left" className="sm:max-w-xs bg-white">
                  <nav className="grid gap-6 text-lg font-medium">
                    <div
                      className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>

                    </div>
                    <Link
                      href={"/"}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                    <Link
                      href={"/shop"}
                      className="flex items-center gap-4 px-2.5 text-foreground"
                    >
                      <Store className="h-5 w-5" />
                      Shop
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <BriefcaseBusiness className="h-5 w-5" />
                      Professional
                    </Link>
                    <Link
                      href={"/about"}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <FileChartColumnIncreasing className="h-5 w-5" />
                      About
                    </Link>
                    <Link
                      href={"/contact"}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-5 w-5" />
                      Contact
                    </Link>
                    <Link
                      href={"/cart"}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <ShoppingBasket className="h-5 w-5" />
                      Cart
                    </Link>
                    <Link
                      href={"/signin"}
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      Account
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
    </header>
  )
}

export default Header