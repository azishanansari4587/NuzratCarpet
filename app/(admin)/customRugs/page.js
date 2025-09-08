"use client"
import Spinner from '@/components/Spinner'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
  TableFooter,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import Link from 'next/link'

const CustomRugs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customRugs, setCustomRugs] = useState([]);


  useEffect(() => {
  const fetchCustomRugs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/customize");
      const data = await res.json();
      setCustomRugs(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchCustomRugs();
}, []);


  return (
    <>
      {/* {isLoading ? (
        <Spinner />
      ) : ( */}
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Custom Rugs Request</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <Spinner />
            ) : customRugs.length === 0 ? (
            <div className="text-center py-8 text-forest-600">
                No contact messages found.
            </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="">Image</span>
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Phone
                  </TableHead>

                  <TableHead className="hidden md:table-cell">
                    Business Type
                  </TableHead>

                  <TableHead className="hidden md:table-cell">
                    Size
                  </TableHead>

                  <TableHead className="hidden md:table-cell">
                    Color
                  </TableHead>

                  <TableHead className="hidden md:table-cell">
                    Mateiral
                  </TableHead>

                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Action
                  </TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
              {customRugs.map((order) =>  (
                // return (
                <TableRow key={`${order.id}`}>
                  <TableCell className="hidden sm:table-cell">
                    <Image src={order.image || "placeholder.svg"} alt={order.name || ""} width={100} height={100}/>
                  </TableCell>

                  <TableCell className="font-small">
                    <p>Name: {order.name}</p>
                    Email: {order.email}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {order.phone}
                  </TableCell>

                  <TableCell className="font-medium">
                    {order.business_type}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {order.size 
                      ? order.size 
                      : (order.custom_width && order.custom_length 
                          ? `${order.custom_width} x ${order.custom_length}` 
                          : "N/A")}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {order.colors}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {order.material}
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long", // August, September etc.
                    year: "numeric"
                  })}
                  </TableCell>

                  <TableCell className="hidden md:table-cell capitalize">
                    {order.status}
                  </TableCell>

                  <TableCell className="hidden md:table-cell capitalize">
                   <Link href={""}><Eye className='h-5 w-5'/></Link>
                   <Link href={""}><Edit className='h-5 w-5'/></Link>
                  </TableCell>

                  

                </TableRow>

              ))}
              </TableBody>
            </Table> 
          )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong>{" "}
              products
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* )} */}
    </>
  )
}

export default CustomRugs