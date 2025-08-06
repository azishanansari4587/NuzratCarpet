"use client"
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const router = useRouter();

    useEffect(() => {
        // Load cart items from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (Object.values(formData).some(field => field === '')) {
            toast.error('Please fill in all fields.');
            return;
        }

        // Here you can handle the submission logic, e.g., sending data to your backend

        // Clear the cart after successful checkout (optional)
        localStorage.removeItem('cart');
        setCartItems([]);
        toast.success('Order placed successfully!');

        // Redirect to a success page or homepage
        router.push('/');
    };

    return (
        <>
            <section className='bg-white py-12'>
                <div className="mx-auto max-w-3xl p-6">
                    <h2 className="text-3xl font-medium">Checkout</h2>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                                className="border rounded p-2"
                            />
                        </div>
                        <h3 className="text-lg font-semibold mt-4">Order Summary</h3>
                        <ul className="my-4">
                            {cartItems.map((item) => (
                                <li key={item.productId} className="flex justify-between">
                                    <span>{item.title} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <h4 className="font-bold">Total: ${calculateTotal()}</h4>
                        <button
                            type="submit"
                            className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                        >
                            Place Order
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Checkout;
