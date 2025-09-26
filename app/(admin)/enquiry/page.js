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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import withAuth from '@/lib/withAuth'
import Spinner from '@/components/Spinner'
import { Edit } from 'lucide-react'





const Enquiry = () => {
  const [orders, setOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [status, setStatus] = useState("")


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

  useEffect(() => {
    fetchOrders();
  }, []);

const handleEdit = (order) => {
    setSelectedOrder(order)
    setStatus(order.status || "pending")
    setOpenDialog(true)
  }

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/myEnquiry/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
        setOpenDialog(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsLoading(false); // 🔥 stop loading
    }
  };





  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                    Status
                  </TableHead>

                  <TableHead >
                    Action
                  </TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
              {/* {orders.map((order) => order.cartItems?.map((item, index) => ( */}
              {orders.map((order) => {
                let cartItems = [];

                try {
                  cartItems =
                    typeof order.cartItems === "string"
                      ? JSON.parse(order.cartItems)
                      : order.cartItems || [];
                } catch (e) {
                  console.error("❌ cartItems JSON parse error:", order.cartItems);
                }

                return cartItems.map((item, index) => (

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

                  <TableCell className="hidden md:table-cell capitalize">
                    {order.status}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit({ ...order, ...item })}
                    >
                      <Edit className="h-4 w-4"/>
                    </Button>
                  </TableCell>

                </TableRow>

              ));
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
      </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Enquiry</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Image Preview + Download */}
              {selectedOrder.image && (
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedOrder.image}
                    alt="Uploaded Image"
                    width={150}
                    height={150}
                    className="rounded border"
                  />
                </div>
              )}

              {/* User Info */}
              <div>
                <p><strong>User:</strong> {selectedOrder.user_name}</p>
                <p><strong>Email:</strong> {selectedOrder.user_email}</p>
              </div>

              {/* Product Info */}
              <div>
                <p><strong>Product:</strong> {selectedOrder.name}</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p><strong>Size:</strong> {selectedOrder.size}</p>
                <p><strong>Color:</strong> {selectedOrder.color}</p>
              </div>

              {/* Status Update */}
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default withAuth(Enquiry, [1]);