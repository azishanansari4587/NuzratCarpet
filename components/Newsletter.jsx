"use client" 
import React, {useState} from 'react'

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');


    const handleSubscribe = async(e)=> {
        e.preventDefault();
        try {
          const response = await fetch('api/subscribers', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          console.log(data);
          
          if(response.ok) {
            setMessage("Thanks for subscribing!");
            setEmail('');
          }else {
            setMessage(data.error);
          }
        } catch (error) {
          console.log(error);
          
          setMessage(error.message);
        }
    }
    
    

  return (
    <section className="bg-gray-50">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
            <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                SUBSCRIBE NEWSLETTER
            </h2>

            <p className=" text-gray-500 sm:mt-4 sm:block">
                Let&apos;s stay in touch! Subscribe to our newsletter for latest updates.
            </p>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
            <form onSubmit={handleSubscribe} className="sm:flex sm:gap-4">
                <div className="sm:flex-1">
                <label htmlFor="email" className="sr-only">Email</label>

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition focus:border-white focus:outline-none focus:ring focus:ring-black"
                />
                </div>

                <button
                type="submit"
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-black sm:mt-0 sm:w-auto"
                >
                <span className="text-sm font-medium"> Subscribe </span>


                <svg
                    className="size-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                </svg>
                </button>
                {message && <p className="text-red-500">{message}</p>}
              </form>
            </div>
        </div>
    </section>
  )
}

export default Newsletter