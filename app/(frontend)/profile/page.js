"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { User, Package, Heart, ShoppingBag, LogOut, Settings, Home } from "lucide-react";
import PhoneNumber from "@/components/PhoneNumber";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { data } from "autoprefixer";
import Spinner from "@/components/Spinner";
import Image from "next/image";


export default function Profile() {

  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "", // optional if not updatable
    contact: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  



  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };



const fetchProfile = async () => {
    setIsProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const user = data.user;
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  
        setProfileData({
          ...user,
          name: fullName,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error loading profile");
    } finally {
      setIsProfileLoading(false);
    }
  };
  


  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
  
      // Split name into first and last
      const [first_name, ...rest] = profileData.name.trim().split(" ");
      const last_name = rest.join(" ");
  
      const payload = {
        ...profileData,
        first_name,
        last_name,
      };
  
      // Remove `name` because backend doesn't have it
      delete payload.name;
  
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      console.log("Profile fetched from backend:", data);

      if (res.ok) {
        toast.success("Profile Update Successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchProfile();
  }, []);


  const router = useRouter(); // ✅ hook call at top-level
  const handleLogout = () => {
    // Clear JWT token
    localStorage.removeItem("token");

    // Show toast
    toast.warning("Logged Out");

    // Redirect to login page
    router.push("/signin");
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/myEnquiry", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          console.error(data.error || "Failed to fetch orders");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">My Account</h1>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
        {isProfileLoading ? (
        <Spinner/>
      ) : (
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className="lg:col-span-1 bg-sand-50 border-sand-200 h-fit">
            <CardContent className="p-4">
              <div className="space-y-1 pt-2">
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={profileData.image || "/default-avatar.png"} alt={profileData.name || "User"} />
                    <AvatarFallback>
                      {profileData.name
                        ? profileData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-forest-800">{profileData.name}</h3>
                    <p className="text-sm text-forest-600">{profileData.email}</p>
                  </div>
                </div>
                
                {/* <div className="space-y-2">
                  <Link href="/user" className="flex items-center gap-2 p-2 rounded-md bg-forest-100 text-forest-800">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-2 p-2 rounded-md hover:bg-sand-100 text-forest-700">
                    <Package className="h-4 w-4" /> My Enquiry
                  </Link>
                  <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-sand-100 text-forest-700">
                    <Home className="h-4 w-4" /> Back to Home
                  </Link>
                </div> */}
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4 text-forest-800">Personal Information</h3>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="first_name" className="text-sm font-medium text-forest-800">
                            First Name
                          </label>
                          <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={profileData.first_name}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="first_name" className="text-sm font-medium text-forest-800">
                            Last Name
                          </label>
                          <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={profileData.last_name}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-forest-800">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-forest-800">
                            Phone Number
                          </label>
                          {/* <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          /> */}
                          <PhoneNumber value={profileData.contact} onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, contact: e.target.value }))
                          } />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-medium mb-2 mt-6 text-forest-800">Shipping Address</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <label htmlFor="address" className="text-sm font-medium text-forest-800">
                            Street Address
                          </label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={profileData?.address || ""}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="city" className="text-sm font-medium text-forest-800">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={profileData?.city || ""}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="state" className="text-sm font-medium text-forest-800">
                            State/Province
                          </label>
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={profileData?.state || ""}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="zipCode" className="text-sm font-medium text-forest-800">
                            ZIP/Postal Code
                          </label>
                          <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={profileData?.zipCode || ""}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="country" className="text-sm font-medium text-forest-800">
                            Country
                          </label>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            value={profileData?.country || ""}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-forest-800"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4 text-forest-800">Your Orders</h3>
                    
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border rounded-lg shadow p-4 bg-white"
                          >
                            <p className="text-sm text-gray-500 mb-2">
                              Reference: <b>{order.id}</b> 
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                              Date: {new Date(order.created_at).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "long", // August, September etc.
                                year: "numeric"
                              })}
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
                                      Size: {item.size}
                                    </p>
                                    <p className="text-sm text-gray-500">Color: {item.color} </p>
                                    <p className="text-sm text-gray-500">Qty:{" "}
                                    {item.quantity}</p>
                                  </div>
                                  <Image src={item.image} alt={item.name} width={100} height={100}/>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-forest-300 mb-4" />
                        <h4 className="text-lg font-medium text-forest-800 mb-2">No orders yet</h4>
                        <p className="text-forest-600 mb-4">When you place orders, they will appear here</p>
                        <Button asChild className="bg-forest-700 hover:bg-forest-800">
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              

            </Tabs>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}



