"use client"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import Image from "next/image";

const EnquiryClient = () => {
    const searchParams = useSearchParams();
    const ref = searchParams.get("ref");
    const [loading, setLoading] = useState(true);
    const [enquiry, setEnquiry] = useState(null);
    const router = useRouter();
  
    useEffect(() => {
      if (!ref) return;
  
      const fetchEnquiry = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/myEnquiry/${ref}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await res.json();
          if (res.ok) {
            setEnquiry(data);
          } else {
            console.error(data.error || "Failed to fetch enquiry");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchEnquiry();
    }, [ref]);
  
  
    // ✅ Redirect after 15 seconds
    useEffect(() => {
      if (!loading) {
        const timer = setTimeout(() => {
          router.push("/");
        }, 15000); // 15 sec = 15000 ms
  
        return () => clearTimeout(timer); // cleanup
      }
    }, [loading, router]);
  
    if (loading) return <Spinner />;
  
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Enquiry Submitted!</h1>
        <p className="text-lg mb-6">
          Thank you for your enquiry. Our team will contact you shortly.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Enquiry Reference: <b>{ref}</b>
        </p>
  
        {enquiry && (
          <div className="border rounded-lg shadow-sm p-6 text-left">
            <h2 className="text-xl font-semibold mb-4">📦 Your Enquiry Items</h2>
            <ul className="space-y-3">
              {enquiry.cartItems.map((item, index) => (
                <li key={index} className="border-b pb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <Image src={item.image} alt={item.name} width={100} height={100}/>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
}

export default EnquiryClient