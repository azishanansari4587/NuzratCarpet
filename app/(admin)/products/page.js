"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import {
  File,
  ListFilter,
  PlusCircle,
  Eye, 
  Trash, 
  FilePenLine 
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Spinner from '@/components/Spinner';




const Products = () => {

  const [product, setProduct] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        // Ensure images field is correctly parsed
        const parsedData = data.map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images : JSON.parse(item.images)
        }));

        
        setProduct(parsedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, []);



  return (
    <>
    { isLoading ? ( <Spinner/>) : (
      <section>
      <div className="flex items-center">
          <h1 className='text-2xl'>Products</h1>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Archived
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Link href={'/products/add_product'}> 
              <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                  </span>
              </Button>
            </Link>
          </div>
        </div>
      <div className="mx-auto py-8 sm:px-12 sm:py-12 lg:px-4">
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              
              {product.map((item, index) => (
                  <Card className="w-[330px]" key={index}>
                      <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Image
                          src={item.images[0]}
                          alt={`Product Image ${index + 1}-0`}
                          width={500}
                          height={500}
                          className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[350px]"
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                          <Link href={'/products/view_product'}><Button variant="outline"> <Eye className="mr-2 h-4 w-4"/> View</Button></Link>
                          <Link href={'/products/edit_product'}><Button variant="outline"> <FilePenLine className="mr-2 h-4 w-4"/> Edit</Button></Link>
                          <Link href={''}><Button variant="destructive"> <Trash className="mr-2 h-4 w-4"/> Delete</Button></Link>
                      </CardFooter>
                  </Card>
              ))}
              
          </ul>
      </div>
  </section>
    )}
    </>
    
  )
}

export default Products