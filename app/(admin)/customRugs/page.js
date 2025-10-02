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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { set } from 'react-hook-form'
import withAuth from '@/lib/withAuth'


const CustomRugs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customRugs, setCustomRugs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRug, setSelectedRug] = useState(null);
  const [status, setStatus] = useState("");


//   useEffect(() => {
//   const fetchCustomRugs = async () => {
//     try {
//       setIsLoading(true);
//       const res = await fetch("/api/customize");
//       const data = await res.json();
//       setCustomRugs(data);
//     } catch (err) {
//       console.error("Failed to load messages:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchCustomRugs();
// }, []);

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

useEffect(() => {
  fetchCustomRugs();
}, []);



const handleEditClick = (rug) => {
    setSelectedRug(rug);
    setStatus(rug.status || "");
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/customize/${selectedRug.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setCustomRugs((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
        setOpenDialog(false);
        fetchCustomRugs();
      }
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsLoading(false); // 🔥 stop loading
    }
  };

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
              {customRugs?.map((order) =>  (
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

                  <TableCell className="font-medium capitalize">
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

                  <TableCell className="hidden md:table-cell capitalize">
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
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(order)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
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

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog} className="z-50 bg-white">
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Custom Rug</DialogTitle>
          </DialogHeader>
          {selectedRug && (
            <div className="space-y-4">

              {/* Image Preview Section */}
              {selectedRug.image && (
                <div className="space-y-2">
                  <Label>Uploaded Image</Label>
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedRug.image}
                      alt="Uploaded Rug"
                      width={150}
                      height={150}
                      className="rounded-md border"
                    />
                    <a
                      href={selectedRug.image}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}

              {/* Rug Details Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={selectedRug.name} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={selectedRug.email} disabled />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={selectedRug.phone} disabled />
                </div>
                <div>
                  <Label>Business Type</Label>
                  <Input value={selectedRug.business_type} disabled />
                </div>
                <div>
                  <Label>Size</Label>
                  <Input
                    value={
                      selectedRug.size ||
                      `${selectedRug.custom_width} x ${selectedRug.custom_length}`
                    }
                    disabled
                  />
                </div>
                <div>
                  <Label>Colors</Label>
                  <Input value={selectedRug.colors} disabled />
                </div>
                <div>
                  <Label>Material</Label>
                  <Input value={selectedRug.material} disabled />
                </div>

                <div>
                  <Label>Pattern</Label>
                  <Input
                    value={selectedRug.pattern}
                    disabled
                  />
                </div>

                <div>
                  <Label>Rugs Type</Label>
                  <Input
                    value={selectedRug.rug_type}
                    disabled
                  />
                </div>

                <div>
                  <Label>Timeline</Label>
                  <Input
                    value={selectedRug.timeline}
                    disabled
                  />
                </div>

                <div>
                  <Label>Date</Label>
                  <Input
                    value={new Date(selectedRug.created_at).toLocaleDateString()}
                    disabled
                  />
                </div>

              </div>

              <div>
                  <Label>Additional Information</Label>
                  <Textarea
                  rows = {5}
                    value={selectedRug.additional_info}
                    disabled
                  />
              </div>

              {/* Status Update */}
              <div>
                <Label>Status</Label>
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
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  )
}

export default withAuth(CustomRugs, [1]);