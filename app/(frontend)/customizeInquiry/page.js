"use client"
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import toast from 'react-hot-toast';


// const CustomizeInquiry = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         productName: '',
//         companyName: '',
//         email: '',
//         message: '',
//     });
//     const [phone, setPhone] = useState('');
    
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
    
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post('/api/customize', {
//             ...formData,
//             phone,
//             });
//             toast.success('Inquiry submitted successfully!');
//             setFormData({
//             name: '',
//             productName: '',
//             companyName: '',
//             email: '',
//             message: '',
//             });
//             setPhone('');
//         } catch (err) {
//             console.error(err);
//             toast.error('Something went wrong!');
//         }
//     };

//   return (
//     <section className='container mx-auto max-w-2xl px-4 py-12'>
//       <h1 className="text-2xl font-medium mb-2">Customize Inquiry</h1>
//       <p className='mb-2'>Reach out to us if you are interested in customizing this product, or would like more information.</p>
//       <form onSubmit={handleSubmit} className='mt-6'>
//         <div className="mb-4">
//           <label htmlFor="name" className="block mb-1">Name <span className='text-red-500'>*</span></label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange}
//             className="w-full p-2 border-b-2 focus:outline-none focus:border-black" required />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="productName" className="block mb-1">Product Name <span className='text-red-500'>*</span></label>
//           <input type="text" name="productName" value={formData.productName} onChange={handleChange}
//             className="w-full p-2 border-b-2 focus:outline-none focus:border-black" required />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="companyName" className="block mb-1">Company Name</label>
//           <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
//             className="w-full p-2 border-b-2 focus:outline-none focus:border-black" />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="email" className="block mb-1">Email Address <span className='text-red-500'>*</span></label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange}
//             className="w-full p-2 border-b-2 focus:outline-none focus:border-black" required />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="phone" className="block mb-1">Phone <span className='text-red-500'>*</span></label>
//           <PhoneInput
//             country={'in'}
//             value={phone}
//             onChange={setPhone}
//             enableSearch={true}
//             inputStyle={{ width: '100%' }}
//             placeholder="Enter phone number"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="message" className="block mb-1">Message <span className='text-red-500'>*</span></label>
//           <textarea name="message" value={formData.message} onChange={handleChange}
//             className="w-full p-2 border rounded focus:outline-none focus:border-black" rows="4" required />
//         </div>
//         <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded">
//           Submit
//         </button>
//       </form>
//     </section>
//   )
// }


// import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneNumber from "@/components/PhoneNumber";


const CustomizeInquiry = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sizeOption, setSizeOption] = useState("standard");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rugType: "",
      size: "",
      customSize: {
        width: "",
        length: ""
      },
      material: "",
      colors: "",
      pattern: "",
      timeline: "4-8 weeks",
      additionalInfo: ""
    }
  });

  // const onSubmit = (data) => {
  //   setIsSubmitting(true);
    
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     toast({
  //       title: "Request submitted",
  //       description: "We've received your customization request and will contact you shortly.",
  //     });
  //     form.reset();
  //   }, 1500);
    
  //   console.log(data);
  // };

  const onSubmit = async (data) => {
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/customize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      toast({
        title: "Request submitted",
        description: "We've received your customization request and will contact you shortly.",
      });
      form.reset();
    } else {
      toast({
        title: "Submission failed",
        description: result.message || "Please try again.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-semibold mb-2">
              Customize Your Perfect Rug
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let our expert artisans create a custom rug tailored to your exact specifications.
              Fill out the form below, and we&apos;ll work with you to bring your vision to life.
            </p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-sm p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneNumber {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Rug Specifications */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Rug Specifications</h2>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="rugType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rug Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rug type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="area-rug">Area Rug</SelectItem>
                                <SelectItem value="runner">Runner</SelectItem>
                                <SelectItem value="wall-hanging">Wall Hanging</SelectItem>
                                <SelectItem value="carpet">Carpet</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3">
                      <FormLabel>Size</FormLabel>
                      <RadioGroup 
                        value={sizeOption} 
                        onValueChange={setSizeOption}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">Standard Size</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="custom" />
                          <Label htmlFor="custom">Custom Size</Label>
                        </div>
                      </RadioGroup>
                      
                      {sizeOption === "standard" ? (
                        <FormField
                          control={form.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select standard size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3x5">3&apos; x 5&apos;</SelectItem>
                                    <SelectItem value="4x6">4&apos; x 6&apos;</SelectItem>
                                    <SelectItem value="5x8">5&apos; x 8&apos;</SelectItem>
                                    <SelectItem value="8x10">8&apos; x 10&apos;</SelectItem>
                                    <SelectItem value="9x12">9&apos; x 12&apos;</SelectItem>
                                    <SelectItem value="10x14">10&apos; x 14&apos;</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="customSize.width"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Width (feet)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" step="0.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="customSize.length"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Length (feet)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" step="0.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Material</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="wool">Wool</SelectItem>
                                <SelectItem value="silk">Silk</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="jute">Jute/Sisal</SelectItem>
                                <SelectItem value="synthetic">Synthetic</SelectItem>
                                <SelectItem value="bamboo">Bamboo</SelectItem>
                                <SelectItem value="blend">Blend</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="colors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Colors</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Blue, Beige, Earth tones" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pattern/Design</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your desired pattern or design" 
                              className="min-h-20" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Project Details */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Project Details</h2>
                  <div className="space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              value={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2-4 weeks" id="2-4" />
                                <Label htmlFor="2-4">2-4 weeks (rush)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4-8 weeks" id="4-8" />
                                <Label htmlFor="4-8">4-8 weeks (standard)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="8-12 weeks" id="8-12" />
                                <Label htmlFor="8-12">8-12 weeks (flexible)</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other details or specific requirements" 
                              className="min-h-32" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : "Submit Customization Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Our design team will review your request and contact you within 1-2 business days to discuss your custom rug project.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


export default CustomizeInquiry