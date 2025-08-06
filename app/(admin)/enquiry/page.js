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





const Enquiry = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/myEnquiry");
        const data = await response.json();
        setCartItems(data);
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);



  return (
    <>
      
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            {/* <div className="ml-auto flex items-center gap-2">
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
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </Button>
            </div> */}
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Products Enquiry</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
              {cartItems.length === 0 ? (
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
                        Rugs
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
                  {cartItems.map((item) => {
                    const images = JSON.parse(item.product_images || "[]");
                    const firstImage = images.length > 0 ? images[0] : "/placeholder.jpg";
                    return (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                      {images.length > 0 && (
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="100"
                          src={firstImage}
                          width="100"
                        />
                      )}  
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.product_name}
                      </TableCell>

                      <TableCell className="font-small">
                        <p>{item.user_name}</p>
                        {item.user_email}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.quantity}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.size}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.rugs}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.formatted_date}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {item.formatted_time}
                      </TableCell>

                    </TableRow>
                    );
                  })}  
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
    </>
  )
}

export default withAuth(Enquiry, [1]);