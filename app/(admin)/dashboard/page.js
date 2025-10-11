"use client"
import React, { useEffect, useState } from 'react'
import {
  File,
  ListFilter,
 } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Spinner from '@/components/Spinner';
import withAuth from '@/lib/withAuth';
import { useRouter } from 'next/navigation';





const Dashboard = () => {
  const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        
        // Redirect if not logged in or not admin
        if (!user || JSON.parse(user).role !== 1) {
            router.push('/signin');
        }
    }, [router]);

  const [date, setDate] = React.useState(new Date());

  const [totals, setTotals] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCollections: 0,
    totalOrders: 0,
    percentageChange: 0
  });
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  useEffect(()=> {
    const fetchTotals = async()=> {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if(res.ok){
          setTotals({
            totalUsers:data.totalUsers,
            totalProducts:data.totalProducts,
            totalCollections:data.totalCollections,
            totalOrders:data.totalOrders,
            percentageChange:data.totalEnquiryPercentage
          });
        } else  {
          setError('Failed to fetch totals');
        }
      } catch (error) {
        setError('An unexpected error occured');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTotals();
  }, []);


if (error) {
    return <p>{error}</p>;
}

  return (
    <>
    { isLoading ? ( <Spinner/>) : (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 w-full">
        
        {/* Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-4xl">{totals.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">+25% from last week</div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
    
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Enquiry</CardDescription>
              <CardTitle className="text-4xl">{totals.totalOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {totals.percentageChange >= 0
                  ? `+${totals.percentageChange}%`
                  : `${totals.percentageChange}%`} from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={80} aria-label="80% increase" />
            </CardFooter>
          </Card>
    
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Product</CardDescription>
              <CardTitle className="text-4xl">{totals.totalProducts}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">+80% from last month</div>
            </CardContent>
            <CardFooter>
              <Progress value={80} aria-label="80% increase" />
            </CardFooter>
          </Card>
    
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Collection</CardDescription>
              <CardTitle className="text-4xl">{totals.totalCollections}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">+80% from last month</div>
            </CardContent>
            <CardFooter>
              <Progress value={80} aria-label="80% increase" />
            </CardFooter>
          </Card>
        </div>
    
        {/* Orders / Tabs Section */}
        <Tabs defaultValue="week" className="mt-6">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Declined
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Refunded
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-sm"
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </div>
          </div>
          <TabsContent value="week">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Table Code Same as Before */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* rows here */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    
    )}
    </>
  )
}

export default withAuth(Dashboard, [1]);
