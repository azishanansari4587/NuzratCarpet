"use client"
import Spinner from '@/components/Spinner';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import withAuth from '@/lib/withAuth';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';


const Subscribers = () => {

  const [subscribers, setSubscribers] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)

  useEffect(() => { 
    const fetchSubscribers = async () => { 
      try { 
        setIsLoading(true);
        const response = await fetch('/api/subscribers'); 
        const data = await response.json(); 
        setSubscribers(data.subscribers);
      } catch (error) { 
        console.error('Error fetching subscribers:', error); 
      } finally {
      setIsLoading(false); // ✅ yaha loading khatam
      }
    }; 
    fetchSubscribers(); 
  }, []);


  // 🧩 Open confirmation dialog
  const confirmDelete = (sub) => {
    setSelectedSubscriber(sub)
    setOpenDialog(true)
  }

  // 🗑️ Actual delete function
  const handleDelete = async () => {
    if (!selectedSubscriber) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/subscribers/${selectedSubscriber.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSubscribers((prev) =>
          prev.filter((r) => r.id !== selectedSubscriber.id)
        )
        setOpenDialog(false)
        toast.success("Subscriber deleted successfully!")
      } else {
        toast.error("Failed to delete subscriber.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Something went wrong while deleting.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableCaption>A list of your subscribers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers?.map((sub) => (
              <TableRow key={sub.id || sub.email}>
                <TableCell className="font-medium">{sub.email}</TableCell>
                <TableCell>
                  {new Date(sub.created_at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long", // August, September etc.
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => confirmDelete(sub)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Subscribers</TableCell>
              <TableCell className="text-right">
                {subscribers.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}


      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {selectedSubscriber?.email}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

}

export default withAuth(Subscribers, [1]);