"use client"
import React, { useState } from 'react'
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
import { useRouter } from 'next/navigation'

const AddCollections = () => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        try {
            const result = await fetch('/api/collections', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, status}),
            });

            const data = await result.json();

            if( result.ok) {
                setError('Category added successfully!');
                setName('');
                setStatus('');
                router.push('/collections');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('An unexpected error occured');
        }
    };


  return (
    <div>
        
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardTitle>Collection Name</CardTitle>
                <CardDescription>
                Used to identify your collections in the marketplace.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent>
                
                <Input type="text" placeholder="Collection Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required/>
                <div className="my-3 grid gap-3 ">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
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
        {error && <p style={{ color: 'red' }}>{error}</p>}    
    </div>
  )
}

export default AddCollections