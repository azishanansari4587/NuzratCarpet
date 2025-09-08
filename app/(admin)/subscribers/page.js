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


const Subscribers = () => {

  const [subscribers, setSubscribers] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

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
  }, [])

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
    </>
  );

}

export default Subscribers