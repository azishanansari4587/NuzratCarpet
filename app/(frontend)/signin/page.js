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
                const user = data.user;
    
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
              {/* <label htmlFor="email" className="text-sm">
                Email
              </label> */}
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
              {/* <label htmlFor="password" className="text-sm">
                Password
              </label> */}
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
        // <section className='bg-white'>
        //     <div className='mx-auto min-h-screen  max-w-7xl py-24 md:py-24 bg-white'>
        //         <div className='flex flex-col space-y-8 pb-10 pt-12  justify-center'>
        //             <div className=" grid grid-cols-1 lg:grid-cols-2">
        //                 <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
        //                     <div className="absolute inset-0">
        //                         <img
        //                         className="h-full w-full rounded-md object-cover object-top"
        //                         src="https://plus.unsplash.com/premium_photo-1673533137302-02312e0184f7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //                         alt=""
        //                         />
        //                     </div>
        //                     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        //                     <div className="relative">
        //                         <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
        //                         <h3 className="text-4xl font-bold text-white">
        //                             Now you dont have to rely on your designer to create a new page
        //                         </h3>
        //                         <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        //                             <li className="flex items-center space-x-3">
        //                             <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
        //                                 <svg
        //                                 className="h-3.5 w-3.5 text-white"
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 viewBox="0 0 20 20"
        //                                 fill="currentColor"
        //                                 >
        //                                 <path
        //                                     fillRule="evenodd"
        //                                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        //                                     clipRule="evenodd"
        //                                 ></path>
        //                                 </svg>
        //                             </div>
        //                             <span className="text-lg font-medium text-white"> Commercial License </span>
        //                             </li>
        //                             <li className="flex items-center space-x-3">
        //                             <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
        //                                 <svg
        //                                 className="h-3.5 w-3.5 text-white"
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 viewBox="0 0 20 20"
        //                                 fill="currentColor"
        //                                 >
        //                                 <path
        //                                     fillRule="evenodd"
        //                                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        //                                     clipRule="evenodd"
        //                                 ></path>
        //                                 </svg>
        //                             </div>
        //                             <span className="text-lg font-medium text-white"> Unlimited Exports </span>
        //                             </li>
        //                             <li className="flex items-center space-x-3">
        //                             <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
        //                                 <svg
        //                                 className="h-3.5 w-3.5 text-white"
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 viewBox="0 0 20 20"
        //                                 fill="currentColor"
        //                                 >
        //                                 <path
        //                                     fillRule="evenodd"
        //                                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        //                                     clipRule="evenodd"
        //                                 ></path>
        //                                 </svg>
        //                             </div>
        //                             <span className="text-lg font-medium text-white"> 120+ Coded Blocks </span>
        //                             </li>
        //                             <li className="flex items-center space-x-3">
        //                             <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
        //                                 <svg
        //                                 className="h-3.5 w-3.5 text-white"
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 viewBox="0 0 20 20"
        //                                 fill="currentColor"
        //                                 >
        //                                 <path
        //                                     fillRule="evenodd"
        //                                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        //                                     clipRule="evenodd"
        //                                 ></path>
        //                                 </svg>
        //                             </div>
        //                             <span className="text-lg font-medium text-white"> Design Files Included </span>
        //                             </li>
        //                         </ul>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className=" lg:flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        //                     <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
        //                         <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign in</h2>
        //                         <p className="mt-2 text-sm text-gray-600">
        //                         Don&apos;t have an account?{' '}
        //                         <Link
        //                             href='/signup'
        //                             title=""
        //                             className="font-semibold text-black transition-all duration-200 hover:underline"
        //                         >
        //                             Create a free account
        //                         </Link>
        //                         </p>
        //                         <form onSubmit={handleSubmit} className="mt-8">
        //                         <div className="space-y-5">
        //                             <div>
        //                             <label htmlFor="email" className="text-base font-medium text-gray-900">
        //                                 Email address
        //                             </label>
        //                             <div className="mt-2">
        //                                 <input
        //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                 type="email"
        //                                 placeholder="Email"
        //                                 name='email'
        //                                 value={email}
        //                                 onChange={(e) =>setEmail(e.target.value)}
        //                                 ></input>
        //                             </div>
        //                             </div>
        //                             <div>
        //                                 <div className="flex items-center justify-between">
        //                                     <label htmlFor="password" className="text-base font-medium text-gray-900">
        //                                     Password
        //                                     </label>
        //                                     <Link
        //                                     href='/forgotPassword'
        //                                     title=""
        //                                     className="text-sm font-semibold text-black hover:underline"
        //                                     >
        //                                     {' '}
        //                                     Forgot password?{' '}
        //                                     </Link>
        //                                 </div>
        //                                 <div className="mt-2">
        //                                     <input
        //                                     className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        //                                     type="password"
        //                                     placeholder="Password"
        //                                     name='password'
        //                                     value={password}
        //                                     onChange={(e) => setPassword(e.target.value)}
        //                                     ></input>
        //                                 </div>
        //                             </div>
        //                             <div>
        //                             <button
        //                                 type="submit"
        //                                 className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
        //                             >
        //                                 Get started <ArrowRight className="ml-2" size={16} />
        //                             </button>
        //                             </div>
        //                             <p>{error}</p>
        //                         </div>
        //                         </form>
                                
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </section>
      )
}

export default SignIn