"use client"
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardBody, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [country, setCountry] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        try {
            const result = await fetch('api/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name:firstName, last_name:lastName, email, password, contact, businessType, country}),
            });

            const data = await result.json();

            if( result.ok) {
                toast.success('Account created successfully!');
                // router.push('/signin');
            } else {
                setError(data.error);
                toast.error(data.error);
            }
        } catch (error) {
            setError('An unexpected error occured');
        }
    };



    return (
        <main className="min-h-[80vh] flex-1 flex items-center justify-center p-12">
            <Card className="w-full max-w-xl border border-black rounded-lg p-12">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-medium">Create account</CardTitle>
                    <CardDescription>Enter your details to create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 ">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <Input 
                                id="firstName" 
                                name="first_name" 
                                placeholder="First Name"
                                value={firstName} 
                                onChange={(e) => setfirstName(e.target.value)} 
                                className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                                required 
                            />
                            </div>
                            <div className="space-y-2">
                            <Input 
                                id="lastName" 
                                name="last_name" 
                                value={lastName} 
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)} 
                                className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                                required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={email} 
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value.trim())} 
                                className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                                required />
                        </div>

                        <div className="space-y-2">
                            <Input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value.trim())}
                            required
                            className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact">Phone</Label>
                            <PhoneInput
                                country={'in'}
                                value={contact}
                                onChange={setContact}
                                enableSearch={true} 
                                inputStyle={{ width: '100%' }}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessType">Business Type</Label>
                            <select
                                id="businessType"
                                name="businessType"
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                required
                                className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-black"
                            >
                                <option value="" disabled>Select business type</option>
                                <option value="architect">Architect</option>
                                <option value="interior-designer">Interior Designer</option>
                                <option value="retailer">Retailer</option>
                                <option value="whole-seller">Whole Seller</option>
                                <option value="hotel-owner">Hotel Owner</option>
                                <option value="store">Store</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="country" className="text-sm font-medium text-forest-800">
                            Country
                          </label>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>


                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>

                    <div className='space-y-2 my-2'>
                        <p className='text-center'>Have you already account ? <Link href='/signin' className='text-teal-500'>Login</Link></p>
                    </div>

                </CardContent>
            </Card>
        </main>
      )
}

export default SignUp
