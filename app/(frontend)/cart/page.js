"use client"
import { useEffect, useState } from 'react';
import { Trash, ShoppingCart  } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import Image from 'next/image';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Function to remove item
  const removeItem = (idToRemove) => {
    // Filter out the item with the given ID
    const filteredItems = cartItems.filter(
      (cartItem) => cartItem.productId !== idToRemove
    );
    console.log(filteredItems);
    

    // Update the cartItems state with the filtered array
    setCartItems(filteredItems);

    // Optionally, save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(filteredItems));

    // Show success message
    toast.success('Item removed from cart');
  };

  // Function to handle checkout
  const handleCheckout = () => {
    // Implement your checkout logic here, e.g., redirect to a checkout page or open a modal
    if (cartItems.length === 0) {
        toast.error('Your cart is empty. Please add items to checkout.');
        return;
    }
    
    // Example: Redirect to a checkout page (you'll need to create this page)
    // router.push('/checkout');

    toast.success('Proceeding to checkout...');
};
  


    return (
        <>
            <Header/> 
            <section className='bg-white py-12'>
                <div className="mx-auto flex max-w-3xl flex-col space-y-4 p-6 px-2 sm:p-10 sm:px-2">
                    <h2 className="text-3xl font-medium">Your Cart</h2>
                    <p className="mt-3 text-sm font-medium text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum eius repellat ipsam, sit
                        praesentium incidunt.
                    </p>
                    {cartItems.length === 0 ? (
                        <p className='text-3xl font medium text-center'>Your cart is empty</p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-gray-200">
                        {cartItems.map((cartItem, index) => (
                        <li key={cartItem.id} className="flex flex-col py-6 sm:flex-row sm:justify-between">
                            <div className="flex w-full space-x-2 sm:space-x-4">
                            <Image
                                className="h-20 w-20 flex-shrink-0 rounded object-cover outline-none dark:border-transparent sm:h-32 sm:w-32"
                                src={cartItem.image}
                                alt={cartItem.title}
                            />
                            <div className="flex w-full flex-col justify-between pb-4">
                                <div className="flex w-full justify-between space-x-2 pb-2">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold leading-snug sm:pr-8">{cartItem.title}</h3>
                                        <div className='flex items-center gap-3'>Color: <span className={`block h-5 w-5 rounded ${cartItem.color}`} /></div>
                                        <p className="text-sm">Size: {cartItem.size}</p>
                                        <p className='text-sm'>Quantity: {cartItem.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex divide-x text-sm">
                                <button 
                                    type="button" 
                                    className="flex items-center space-x-2 px-2 py-1 pl-0 hover:text-red-600"
                                    onClick={() => removeItem(cartItem.productId)}>
                                    <Trash size={16} />
                                    <span>Remove</span>
                                </button>
                                {/* <button type="button" className="flex items-center space-x-2 px-2 py-1">
                                    <ShoppingCart size={16} />
                                    <span>Add to Cart</span>
                                </button> */}
                                </div>
                            </div> 
                            </div>
                        </li>
                        ))}
                    </ul> 
                    )}

                    {cartItems.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Order Summary</h3>
                            {/* <p className="text-lg font-medium">Total: ${calculateTotal()}</p> */}
                            <span>{`Total Cart Item : ${cartItems.length} ${
                               cartItems.length > 1 ? "items" : "item"
                            }`}</span>
                            <button 
                                onClick={handleCheckout} 
                                className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                            >
                                Proceed to Enquiry
                            </button>
                        </div>
                    )}
                    
                </div>
            </section>
            <Footer/>
        </>
    );
};

export default Cart;