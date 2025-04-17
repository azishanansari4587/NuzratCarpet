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
    const [isLoading, setIsLoading] = useState(false)
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [phone, setPhone] = useState('');
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
                body: JSON.stringify({ firstName, lastName, email, password, contact, address}),
            });

            const data = await result.json();

            if( result.ok) {
                toast.success('Account created successfully!');
                router.push('/signin');
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
                        {/* <Label htmlFor="firstName">First name</Label> */}
                        <Input 
                            id="firstName" 
                            name="firstName" 
                            placeholder="First Name"
                            value={firstName} 
                            onChange={(e) => setfirstName(e.target.value)} 
                            className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                            required 
                        />
                        </div>
                        <div className="space-y-2">
                        {/* <Label htmlFor="lastName">Last name</Label> */}
                        <Input 
                            id="lastName" 
                            name="lastName" 
                            value={lastName} 
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)} 
                            className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                            required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {/* <Label htmlFor="email">Email</Label> */}
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={email} 
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                            required />
                    </div>

                    <div className="space-y-2">
                        {/* <Label htmlFor="password">Password</Label> */}
                        <Input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
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

                    <div className="space-y-2 py-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox value="yes" id="trade-yes" />
                            <Label htmlFor="trade-yes">Sign up for our email newsletter</Label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
        // <section className='bg-white'>
        //   <div className='mx-auto min-h-screen  max-w-7xl py-24 md:py-24 bg-white'>
        //     <div className='flex flex-col space-y-8 pb-10 pt-12  justify-center'>
        //         <div className="grid grid-cols-1 lg:grid-cols-2">
        //             <div className="hidden lg:relative lg:flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
        //                 <div className="absolute inset-0">
        //                     <img
        //                     className="h-full w-full rounded-md object-cover object-top"
        //                     src="./48.jpg?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
        //                     alt=""
        //                     />
        //                 </div>

        //             </div>
        //             <div className="lg:flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        //                 <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
        //                     <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
        //                     <p className="mt-2 text-base text-gray-600">
        //                     Already have an account?{' '}
        //                     <Link
        //                         href="/signin"
        //                         title=""
        //                         className="font-medium text-black transition-all duration-200 hover:underline"
        //                     >
        //                         Sign In
        //                     </Link>
        //                     </p>
        //                     <form onSubmit={handleSubmit} className="mt-8">
        //                     <div className="space-y-5">
        //                         <div>
        //                             <label htmlFor="name" className="text-base font-medium text-gray-900">
        //                                 Full Name
        //                             </label>
        //                             <div className="mt-2">
        //                                 <input
        //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                 type="text"
        //                                 placeholder="Full Name"
        //                                 id="name"
        //                                 name='name'
        //                                 value={name}
        //                                 onChange={(e) => setName(e.target.value)}
        //                                 ></input>
        //                             </div>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="email" className="text-base font-medium text-gray-900">
        //                                 Email address
        //                             </label>
        //                             <div className="mt-2">
        //                                 <input
        //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                 type="email"
        //                                 placeholder="Email"
        //                                 id="email"
        //                                 name='email'
        //                                 value={email}
        //                                 onChange={(e) => setEmail(e.target.value.trim())}
        //                                 ></input>
        //                             </div>
        //                         </div>
        //                         <div>
        //                             <label htmlFor="contact" className="text-base font-medium text-gray-900">
        //                                 Contact
        //                             </label>
        //                             <div className="mt-2">
        //                                 <input
        //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                 type="number"
        //                                 placeholder="Contact"
        //                                 id="contact"
        //                                 name='contact'
        //                                 value={contact}
        //                                 onChange={(e) => setContact(e.target.value.trim())}
        //                                 ></input>
        //                             </div>
        //                         </div>
        //                         <div>
        //                             <div className="flex items-center justify-between">
        //                                 <label htmlFor="password" className="text-base font-medium text-gray-900">
        //                                 Password
        //                                 </label>
        //                             </div>
        //                             <div className="mt-2">
        //                                 <input
        //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                 type="password"
        //                                 placeholder="Password"
        //                                 id="password"
        //                                 name='password'
        //                                 value={password}
        //                                 onChange={(e) => setPassword(e.target.value)}
        //                                 ></input>
        //                             </div>
        //                         </div>
        //                         <div>
        //                             <div className="flex items-center justify-between">
        //                                 <label htmlFor="address" className="text-base font-medium text-gray-900">
        //                                 Address
        //                                 </label>
        //                             </div>
        //                             <div className="mt-2">
        //                                 <textarea
        //                                 className="flex  w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                 type="text"
        //                                 placeholder="Address"
        //                                 id="address"
        //                                 rows={'3'}
        //                                 name='address'
        //                                 value={address}
        //                                 onChange={(e) => setAddress(e.target.value)}
        //                                 ></textarea>
        //                             </div>
        //                         </div>
        //                         <div>
        //                         <button
        //                             type="submit"
        //                             className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
        //                         >
        //                             Create Account <ArrowRight className="ml-2" size={16} />
        //                         </button>
        //                         </div>
        //                     </div>
        //                     </form>
        //                     {error && <p style={{ color: 'red' }}>{error}</p>}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //   </div>
        // </section>
      )
}

export default SignUp
