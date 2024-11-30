import React from 'react'
import {ShoppingBasket, User, User2 } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  LineChart,
  Package,
  Phone,
  PanelLeft,
  Search,
  Store,
  Users2,
  BriefcaseBusiness,
  FileChartColumnIncreasing
} from "lucide-react"
import Link from 'next/link';

import Logo from '@/public/47.jpg'
import Logo1 from '@/public/48.jpg'

const Header = () => {
  return (
    <header className='bg-white shadow-2xl'>
        <div className='mx-auto max-w-screen-xl p-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between '>
            <div className='md:flex md: items-center md:gap-12'>
              <a href="#" className='block text-teal-600'>
                <div className='flex flex-col items-center gap-2'>
                <Image src={Logo1} alt='' width={30} />
                <Image src={Logo} alt="" width={250}/>
                </div>
              </a>
            </div>

            <div className='hidden md:block'>
               <nav>
                <ul className='flex items-center gap-6 text-sm'>
                  <li>
                    <a href="/" className='text-black transition hover:text-gray-600'>Home</a>
                  </li>
                  <li>
                    <a href="/shop" className='text-black transition hover:text-gray-600'>Shop</a>
                  </li>
                  <li>
                    <a href="#" className='text-black transition hover:text-gray-600'>Professionals</a>
                  </li>
                  <li>
                    <a href="/about" className='text-black transition hover:text-gray-600'>About</a>
                  </li>
                  <li>
                    <a href="/contact" className='text-black transition hover:text-gray-600'>Contact</a>
                  </li>
                  {/* <li>
                    <a href="/signin" className='text-black transition hover:text-gray-600'>SignIn</a>
                  </li>
                  <li>
                    <a href="/signup" className='text-black transition hover:text-gray-600'>SignUp</a>
                  </li>

                  <li>
                    <a href="/dashboard" className='text-black transition hover:text-gray-600'>Dashboard</a>
                  </li> */}
                </ul>
               </nav>
            </div>
            
            <div className='hidden md:block'>
            <div className='flex gap-6'>
              <a href="/cart"><ShoppingBasket className='h-12 w-6'/></a>
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <a href="/signin"><DropdownMenuItem>SignIn</DropdownMenuItem></a>
                <a href="/signup"><DropdownMenuItem>SignUp</DropdownMenuItem></a>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              
 
            </div>
            </div>


            <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                  <nav className="grid gap-6 text-lg font-medium">
                    <div
                      href="#"
                      className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>

                    </div>
                    <Link
                      href="/"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                    <Link
                      href="#"
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
                      href="#"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <FileChartColumnIncreasing className="h-5 w-5" />
                      About
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-5 w-5" />
                      Contact
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <ShoppingBasket className="h-5 w-5" />
                      Cart
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      SignIn
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Users2 className="h-5 w-5" />
                      SignUp
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