"use client"
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
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
                body: JSON.stringify({ name, email, password, contact, address}),
            });

            const data = await result.json();

            if( result.ok) {
                router.push('/signin');
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('An unexpected error occured');
        }
    };



    return (
        <section className='bg-white'>
          <div className='mx-auto min-h-screen  max-w-7xl py-24 md:py-24 bg-white'>
            <div className='flex flex-col space-y-8 pb-10 pt-12  justify-center'>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="hidden lg:relative lg:flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
                        <div className="absolute inset-0">
                            <img
                            className="h-full w-full rounded-md object-cover object-top"
                            src="https://images.unsplash.com/photo-1671576585636-d857cdf0f06c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
                            alt=""
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div className="relative">
                            <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
                                <h3 className="text-4xl font-bold text-white">
                                    Now you dont have to rely on your designer to create a new page
                                </h3>
                                <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                                    <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                        className="h-3.5 w-3.5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> Commercial License </span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                        className="h-3.5 w-3.5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> Unlimited Exports </span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                        className="h-3.5 w-3.5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> 120+ Coded Blocks </span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <svg
                                        className="h-3.5 w-3.5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-medium text-white"> Design Files Included </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="lg:flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
                            <p className="mt-2 text-base text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/signin"
                                title=""
                                className="font-medium text-black transition-all duration-200 hover:underline"
                            >
                                Sign In
                            </Link>
                            </p>
                            <form onSubmit={handleSubmit} className="mt-8">
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="text-base font-medium text-gray-900">
                                        Full Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Full Name"
                                        id="name"
                                        name='name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-base font-medium text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        placeholder="Email"
                                        id="email"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.trim())}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact" className="text-base font-medium text-gray-900">
                                        Contact
                                    </label>
                                    <div className="mt-2">
                                        <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="number"
                                        placeholder="Contact"
                                        id="contact"
                                        name='contact'
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value.trim())}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-base font-medium text-gray-900">
                                        Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Password"
                                        id="password"
                                        name='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="address" className="text-base font-medium text-gray-900">
                                        Address
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <textarea
                                        className="flex  w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Address"
                                        id="address"
                                        rows={'3'}
                                        name='address'
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                >
                                    Create Account <ArrowRight className="ml-2" size={16} />
                                </button>
                                </div>
                            </div>
                            </form>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>
      )
}

export default SignUp
