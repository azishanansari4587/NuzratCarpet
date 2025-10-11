"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

const MyEnquiry = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ Decode userId from JWT
    const decoded = jwtDecode(token);
    setUserId(decoded.id);

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/myEnquiry", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          console.error(data.error || "Failed to fetch enquiries");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">📜 My Enquiries</h1>
      {orders.length === 0 ? (
        <p>No enquiries found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <p className="text-sm text-gray-500 mb-2">
                Reference: <b>{order.id}</b> | Date:{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul className="space-y-2">
                {order.cartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color} | Qty:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <Image src={item.image} alt={item.name} width={80} height={80}/>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEnquiry
