"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import withAuth from "@/lib/withAuth"


import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const EditCollection = ({}) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 3000);
    
        return () => clearTimeout(timer);
      }, []);
      



    useEffect (()=> {
        const fetchCollection = async () => {
            try {
                const res = await fetch(`/api/collections/${id}`);
                const data = await res.json();
                console.log(data);
                
                if( res.ok) {
                    setName(data.name || '');
                    setStatus(data.status.toString() || '');
                } else {
                    setError(data.error || 'An unexpected error occured');
                } 
            } catch (error) {
                setError('An unexpected error occured');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCollection();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const res = await fetch(`/api/collections/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, status}),
            });
            const data = await res.json();
            console.log(data);
            
            if (res.ok) {
                
                setMessage('Collections updated successfully!');
                router.push('/collections');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('An unexpected error occured');
        } finally {
            setIsLoading(false);
        }
    }


    if (error) {
        return <p> {error}</p>;
    }


  return (
    <div>
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardTitle>Edit Collection</CardTitle>
                <CardDescription>
                Used to identify your collections in the marketplace.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent>
                
                <Input type="text"  value={name} onChange={(e) => setName(e.target.value)} required/>
                <div className="my-3 grid gap-3 ">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            {/* <SelectValue placeholder="Select a status" /> */}
                            <SelectValue>{status === '1' ? 'Active' : 'Draft'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Save</Button>
            </CardFooter>
            </form>
        </Card> 
        {message && <p>{message}</p>}    
    </div>
  )
}

export default withAuth(EditCollection, [1]);