"use client"
import { useState } from 'react';
import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            
            if (response.ok) {
                setMessage(data.message);
                router.push('/resetPassword');
            }else {
                setMessage(data.error || 'Password reset failed');
            }
        } catch (error) {
            setMessage(error.message + ' Password reset failed');
        }
    };


  return (
    <main className="min-h-[70vh] flex-grow flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white p-8 border border-gray-200">
                <div className="text-center mb-6">
                <h1 className="text-2xl font-serif mb-2">Reset your password</h1>
                <p className="text-sm text-gray-600">We will send you an email to reset your password</p>
                </div>
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
                    required
                    />
                </div>
                <Button type="submit" className="w-full bg-[#2d2d2d] hover:bg-black text-white rounded-none font-normal">
                    SUBMIT
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2 border border-gray-300 rounded-none text-gray-700 hover:bg-gray-50 font-normal"
                    onClick={() => window.history.back()}
                >
                    CANCEL
                </Button>
                </form>
            </div>
        </div>
    </main>

    // <section className="relative flex flex-wrap lg:h-screen lg:items-center">
    //     <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
    //         <img
    //         alt=""
    //         src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
    //         className="absolute inset-0 h-full w-full object-cover"
    //         />
    //     </div>
    //     <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
    //         <div className="mx-auto max-w-lg text-center">
    //         <h1 className="text-2xl font-bold sm:text-3xl">Forget Password</h1>

    //         <p className="mt-4 text-gray-500">
    //             Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
    //             ipsa culpa autem, at itaque nostrum!
    //         </p>
    //         </div>

    //         <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
    //         <div>
    //             <label htmlFor="email" className="sr-only">Email</label>

    //             <div className="relative">
    //             <input
    //                 type="email"
    //                 name='email'
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
    //                 placeholder="Enter email"
    //             />

    //             <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
    //                 <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="size-4 text-gray-400"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 >
    //                 <path
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                     strokeWidth="2"
    //                     d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
    //                 />
    //                 </svg>
    //             </span>
    //             </div>
    //         </div>
    //         <button
    //             type="submit"
    //             className="block w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
    //         >
    //             ResetPassword
    //         </button>

    //         </form>
    //         {message && <p>{message}</p>}
    //     </div>
    // </section>
  )
}

export default ForgotPassword