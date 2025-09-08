"use client"
import { useState, useEffect} from 'react'
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import withAuth from '@/lib/withAuth'
import Spinner from '@/components/Spinner'





const Enquiry = () => {
  const [orders, setOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setIsLoading(true); // ✅ yaha loading start
      const res = await fetch("/api/myEnquiry");
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        console.error(data.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // ✅ yaha loading khatam
    }
  };

  fetchOrders();
}, []);




  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products Enquiry</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
              {orders.length === 0 ? (
                  <p className="text-center text-gray-500">No Cart Items Found.</p>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="">Image</span>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Total Quantity
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Size
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Color
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Time
                      </TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {orders.map((order) => order.cartItems?.map((item, index) => (
                    // return (
                    <TableRow key={`${order.id}-${index}`}>
                      <TableCell className="hidden sm:table-cell">
                        <Image src={item.image} alt={item.name} width={100} height={100}/>
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>

                      <TableCell className="font-small">
                        <p>{order.user_name}</p>
                        {order.user_email}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.quantity}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.size}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.color}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long", // August, September etc.
                        year: "numeric"
                      })}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.formatted_time}
                      </TableCell>

                    </TableRow>

                  )))}
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
          </TabsContent>
        </Tabs>
      </div>
      )}
    </>
  )
}

export default withAuth(Enquiry, [1]);