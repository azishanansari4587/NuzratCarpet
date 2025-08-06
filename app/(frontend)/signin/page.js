"use client"
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await fetch('api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const data = await result.json();
            console.log(data);
            
            if (result.ok) {
                const { user, token } = data;
                console.log(token);
                
                // ✅ Save both token & user
                localStorage.setItem('token', token);
    
                // Save user details in localStorage (or a state management library)
                localStorage.setItem('user', JSON.stringify({ id: user.id, role: user.role }));
    
                // Redirect based on role
                if (user.role === 1) {
                    toast.success('✅ Admin logged in successfully!');
                    router.push('/dashboard');
                } else if (user.role === 0) {
                    toast.success('✅ User logged in successfully!');
                    router.push('/');
                }
            } else {
                setError(data.error);
                toast.error(`❌ ${data.error || "Login failed"}`);
            }
        } catch (error) {
            setError('An unexpected error occured');
            toast.error('🚨 An unexpected error occurred. Please try again.');
        }
    };
    const loginUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User stored in localStorage:', userData); // Check if the user data has `id` or `_id`
    };

      
    return (
        <main className="min-h-[80vh] flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-xl border border-black rounded-lg p-12">
          <h1 className="text-2xl font-serif text-center mb-6">Login</h1>

          <form  onSubmit={handleSubmit} className="space-y-6 lg:px-12">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                name = "email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                name = "password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black"
              />
            </div>

            <Button type="submit" className="w-full bg-zinc-900 hover:bg-black text-white rounded-none">
              SIGN IN
            </Button>

            <Button variant="outline" className="w-full border-zinc-300 rounded-none hover:bg-zinc-50">
              <Link href={"/signup"}>CREATE ACCOUNT</Link>
            </Button>

            <div className="text-center space-y-2">
              <Link href={"/forgotPassword"} className="text-xs uppercase tracking-wide hover:underline">
                Forgot your password?
              </Link>

              <div className="pt-2">
                <Link href={"/"} className="text-xs uppercase tracking-wide hover:underline">
                  Return to store
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      )
}

export default SignIn