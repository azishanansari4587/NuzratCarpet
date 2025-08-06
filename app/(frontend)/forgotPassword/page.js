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
  )
}

export default ForgotPassword