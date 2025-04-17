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
import { toast } from 'react-toastify'
import { Textarea } from '@/components/ui/textarea'

const AddCollections = () => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!name || !status || !description || !image) {
            toast.error('Please fill in all fields');
            return;
          }
      
          const formData = new FormData();
          formData.append('name', name);
          formData.append('status', status);
          formData.append('description', description);
          formData.append('image', image);
      

        try {
            const result = await fetch('/api/collections', {
                method: 'POST',
                body: formData,
            });
        

            const data = await result.json();

            if( result.ok) {
                toast.success('Category added successfully!');
                setName('');
                setStatus('active');
                setDescription('');
                setImage(null);
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
                
                <div className='my-3 grid gap-3'>
                    <Label htmlFor="name">Collection Name</Label>
                    <Input type="text" placeholder="Collection Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>

                <div className='my-3 grid gap-3'>
                    <Label htmlFor="description">Collection Description</Label>
                    <Textarea type="text" placeholder="Enter Collection Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required/>
                </div>

                <div className='my-3 grid gap-3'>
                    <Label>Collection Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required className="w-full border border-gray-300 p-2 rounded-md"/> 
                </div>   
                
                <div className="my-3 grid gap-3 ">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
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