"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, X } from "lucide-react";
import PhoneNumber from "@/components/PhoneNumber";
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '@/lib/uploadCloudinary';


const CustomizeInquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sizeOption, setSizeOption] = useState("standard");
  const [images, setImages] = useState([]); // image files preview state

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rugType: "",
      size: "",
      businessType: "",
      companyWebsite: "",
      customSize: {
        width: "",
        length: ""
      },
      colors: "",
      pattern: "",
      timeline: "8-12 weeks",
      additionalInfo: "",
      uploadedImages: [] // backend ko bhejne ke liye
    }
  });

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages((prev) => [...prev, ...files]);
  // };

  // const removeImage = (index) => {
  //   setImages((prev) => prev.filter((_, i) => i !== index));
  // };

   // ✅ Multiple image upload handler
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const previews = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
      file,
    }));

    setImages((prev) => [...prev, ...previews]);

    previews.forEach(async (preview) => {
      try {
        const uploaded = await uploadToCloudinary(
          preview.file,
          "NurzatProducts",
          "image",
          (progress) => {
            setImages((prev) =>
              prev.map((img) =>
                img.url === preview.url ? { ...img, progress, uploading: progress < 100 } : img
              )
            );
          }
        );

        setImages((prev) =>
          prev.map((img) =>
            img.url === preview.url
              ? { ...img, url: uploaded.secure_url, uploading: false, progress: 100 }
              : img
          )
        );

        URL.revokeObjectURL(preview.url);
      } catch (err) {
        console.error("Image upload error:", err);
        setImages((prev) => prev.filter((img) => img.url !== preview.url));
        toast.error("❌ Image upload failed");
      }
    });
  };

  const handleRemoveImage = (url) => {
    setImages((prev) => prev.filter((img) => img.url !== url));
  };


//   const uploadImagesToCloudinary = async () => {
//   let urls = [];
//   for (let img of images) {
//     const formData = new FormData();
//     formData.append("file", img);
//     formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
//       { method: "POST", body: formData }
//     );
//     const data = await res.json();
//     if (data.secure_url) {
//       urls.push(data.secure_url);
//     } else {
//       console.error("Cloudinary upload failed:", data);
//     }
//   }
//   return urls;
// };


  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      let uploadedUrls = [];
      if (images.length > 0) {
        // uploadedUrls = await uploadToCloudinary(image, "customize", "image");
        const uploadedUrls = images.filter((img) => !img.uploading).map((img) => img.url);
      }

      const finalData = { ...data, uploadedImages: uploadedUrls };

      const response = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("We've received your customization request and will contact you shortly.");
        form.reset();
        setImages([]);
      } else {
        toast.error(result.message || "Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

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

                    <FormField
                      control={form.control}
                      name="companyWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="www.carpet.com" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bussiness type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="architect">Architect</SelectItem>
                                <SelectItem value="interior-designer">Interior Designer</SelectItem>
                                <SelectItem value="retailer">Retailer</SelectItem>
                                <SelectItem value="whole-seller">Whole Seller</SelectItem>
                                <SelectItem value="hotel-owner">Hotel Owner</SelectItem>
                                <SelectItem value="store">Store</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                
                {/* Rug Specifications */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Rug Specifications</h2>
                  <div className="space-y-6">
                    
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
                                    <SelectItem value="3'11x5'11">3&apos;11&quot; x 5&apos;11&quot; feet / 120 x 180 cm </SelectItem>
                                    <SelectItem value="4'7x6'7">4&apos;7&quot; x 6&apos;7&quot; feet / 140 x 200 cm</SelectItem>
                                    <SelectItem value="5'7x7'10">5&apos;7&quot; x 7&apos;10&quot; feet / 170 x 240 cm</SelectItem>
                                    <SelectItem value="8'2x11'6">8&apos;2&quot; x 11&apos;6&quot; feet / 250 x 350 cm</SelectItem>
                                    <SelectItem value="8'10x13'1">8&apos;10&quot; x 13&apos;1&quot; feet / 270 x 400 cm</SelectItem>
                                    <SelectItem value="9'10x13'1">9&apos;10&quot; x 13&apos;1&quot; feet / 300 x 400 cm</SelectItem>
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
                                <FormLabel>Width (feet/cm)</FormLabel>
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
                                <FormLabel>Length (feet/cm)</FormLabel>
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

                

                {/* Image Upload */}
                {/* <div className="border-2 border-dashed border-forest-300 rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-forest-400 mb-2" />
                  <p className="text-forest-700 mb-2">Drag and drop images here or click to upload</p>
                  <p className="text-sm text-forest-600 mb-4">PNG, JPG, GIF up to 5MB</p>

                  <div className="relative inline-block overflow-hidden">
                    <Button variant="outline" className="border-forest-300">Select Files</Button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}

                {/* ✅ Image Upload Section */}
<div className="border-2 border-dashed border-forest-300 rounded-md p-6 text-center">
  <Upload className="h-8 w-8 mx-auto text-forest-400 mb-2" />
  <p className="text-forest-700 mb-2">Drag and drop images here or click to upload</p>
  <p className="text-sm text-forest-600 mb-4">PNG, JPG, GIF up to 5MB</p>

  <div className="relative inline-block overflow-hidden">
    <Button variant="outline" className="border-forest-300">Select Files</Button>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageUpload}
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>

  {/* ✅ Preview */}
  {images.length > 0 && (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {images.map((img, index) => (
        <div key={index} className="relative group">
          <img
            src={img.url}  // ✅ direct url use kar (Cloudinary ya local blob)
            alt="preview"
            className="w-full h-24 object-cover rounded-md"
          />

          {/* Progress bar */}
          {img.uploading && (
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: `${img.progress}%` }} />
          )}

          <button
            type="button"
            onClick={() => handleRemoveImage(img.url)}  // ✅ correct function call
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}
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
                                <RadioGroupItem value="8-12 weeks" id="8-12" />
                                <Label htmlFor="8-12">8-12 weeks (standard)</Label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4-8 weeks" id="4-8" />
                                <Label htmlFor="4-8">4-8 weeks (rush)</Label>
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
  );
};


export default CustomizeInquiry