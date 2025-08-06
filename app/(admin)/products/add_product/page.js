// "use client"
// import React, {useState, useEffect} from 'react'
// import Image from "next/image"
// import Link from "next/link"
// import {
//   Upload,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Separator } from '@/components/ui/separator'
// import MultiText from '@/components/MultiText';
// import { useRouter } from 'next/navigation'
// import { Checkbox } from "@/components/ui/checkbox";
// import TiptapEditor from '@/components/TipTapEditor'
// import withAuth from '@/lib/withAuth'




// const colors = [
//   { name: 'Red', value: 'bg-red-500' },
//   { name: 'Blue', value: 'bg-blue-500' },
//   { name: 'Green', value: 'bg-green-500' },
//   { name: 'Yellow', value: 'bg-yellow-500' },
//   { name: 'Orange', value: 'bg-orange-500' },
//   { name: 'Indigo', value: 'bg-indigo-500' },
//   { name: 'Pink', value: 'bg-pink-500' },
//   { name: 'Purple', value: 'bg-purple-500' },
//   { name: 'Gray', value: 'bg-gray-500'},
//   { name: 'Black', value: 'bg-black'},
//   { name: 'White', value: 'bg-white'}
//   // Add more colors as needed
// ];


// const AddProduct = () => {
//   const [color, setColor] = useState('');
//   const [collectionId, setCollectionId] = useState('');
//   const [collections, setCollections] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [message, setMessage] = useState('');
//   const [files, setFiles] = useState([]);
//   const [imagePreview, setImagePreview] = useState([]);
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [info, setInfo] = useState('');
//   const [quality, setQuality] = useState('');
//   const [maintanace, setMaintainance] = useState('');
//   const [rugs, setRugs] = useState('');
//   const router = useRouter();

//   const availableTags = ["Banner", "New", "Discount"]; // Available options


//   useEffect(() => {
//     // Fetch collection from the Api
//     const fetchCollection = async () => {
//       try {
//         const res = await fetch('/api/collections');
//         const data = await res.json();
//         setCollections(data);
//       } catch (error) {
//         console.error('Failed to fetch collections', error);
//       }
//     };
//     fetchCollection();
//   }, []);



//   const handleImageChange = (event) => {
//     const filesImage = Array.from(event.target.files);
//     const newImagePreviews = filesImage.map(file => URL.createObjectURL(file));
//     setFiles(prevImages => [...prevImages, ...filesImage]);
//     setImagePreview(prevPreviews => [...prevPreviews, ...newImagePreviews]);
//   };

//   const removeImage = (imageUrl) => {
//     const newImagePreviews = imagePreview.filter(preview => preview !== imageUrl);
//     const newImages = files.filter((_, index) => newImagePreviews.includes(imagePreview[index]));
//     setImagePreview(newImagePreviews);
//     setFiles(newImages);
//   };


//   // const handleChange = (e) => {
//   //   setColor(e.target.value);
//   // };

//   const handleTagChange = (tag) => {
//     setTags((prev) =>
//       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag] // Add/remove tag
//     );
//   };



//   const handleSizeChange = (newSize) => {
//     if (newSize && !sizes.includes(newSize)) {
//       setSizes([...sizes, newSize]);
//     }
//   };

//   const handleSizeRemove = (sizeToRemove) => {
//     setSizes(sizes.filter((size) => size !== sizeToRemove));
//   };


//   // Handle Color Change
//   const handleColorChange = (value) => {
//     setColor(value);
//   };

//    // Handle Collection ID Change
//   const handleCollectionChange = (value) => {
//     setCollectionId(value);
//   };

//     // Find the selected collection by ID
//   const selectedCollection = collections.find((c) => c.id === collectionId);


//   // Handle Rugs Change
//   const handleRugsChange = (value) => {
//     setRugs(value);
//   };


//   // Submit Products //
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     // Create a form data object to handle file uploads
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('description', description);
//     formData.append('info', info);
//     formData.append('quality', quality);
//     formData.append('maintanace', maintanace);
//     formData.append('color', color);
//     formData.append('collectionId', collectionId);
//     formData.append('rugs', rugs);

//     tags.forEach(tag => formData.append('tags', tag));
//     sizes.forEach(size => formData.append('sizes', size));
//     Array.from(files).forEach(file => formData.append('files', file));
//     // images.forEach(image => formData.append('images', image));

//     try {
//         const res = await fetch('/api/products', {
//             method: 'POST',
//             body: formData,
//         });
//         const data = await res.json();
//         if (res.ok) {
//             setMessage('Product added successfully!');
//             setName("");
//             setDescription("");
//             setCollectionId("");
//             setColor("");
//             setInfo("");
//             setQuality("");
//             setMaintainance("");
//             setDescription("");
//             setFiles([]);
//             setSizes([]);
//             setTags([]);
//             toast.success('Product added to cart 🛒' );
//             router.push('/products');
//         } else {
//             setMessage(`Error: ${data.error}`);
//         }
//     } catch (error) {
//         setMessage('An unexpected error occurred');
//     }
// };

//   return (
//     <div>
//         <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
//           <div className="mx-auto grid max-w-full flex-1 auto-rows-max gap-4">
//             <form onSubmit={handleSubmit}>
//               <div className="flex items-center gap-4">
//                 <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
//                   Add Product
//                 </h1>
//               </div>
//               <Separator/>
//               <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
//                 <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
//                   <Card x-chunk="dashboard-07-chunk-0">
//                     <CardHeader>
//                       <CardTitle>Product Details</CardTitle>
//                       <CardDescription>
//                         Lipsum dolor sit amet, consectetur adipiscing elit
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid gap-6">
//                         <div className="grid gap-3">
//                           <Label htmlFor="name">Name</Label>
//                           <Input
//                             id="name"
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full"
//                             placeholder= "Product Name"
//                             required
//                           />
//                         </div>
//                         <div className="grid gap-3">
//                           <Label htmlFor="description">Description</Label>
//                           {/* <Wysimark value={description} onChange={setDescription}/> */}
//                           <TiptapEditor value={description} onChange={setDescription} />
//                           {/* <Textarea
//                             id="description"
//                             placeholder="Product Description"
//                             className="min-h-32"
//                             value = {description}
//                             onChange= {(e) => setDescription(e.target.value)}
//                             required
//                           /> */}
//                         </div>
//                         <div className="grid gap-3">
//                           <Label htmlFor="info">Information</Label>
//                           <Textarea
//                             id="info"
//                             placeholder="Product Information"
//                             className="min-h-32"
//                             value={info}
//                             onChange={(e)=> setInfo(e.target.value)}
//                             required
//                           />
//                         </div>
//                         <div className="grid gap-3">
//                           <Label htmlFor="quality">Quality</Label>
//                           <Textarea
//                             id="quality"
//                             placeholder="Product Quality"
//                             className="min-h-32"
//                             value={quality}
//                             onChange={(e) => setQuality(e.target.value)}
//                           />
//                         </div>
//                         <div className="grid gap-3">
//                           <Label htmlFor="maintenace">Care & Maintenance</Label>
//                           <Textarea
//                             id="maintenace"
//                             placeholder="Product Description"
//                             className="min-h-32"
//                             value={maintanace}
//                             onChange={(e)=> setMaintainance(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card
//                     className="overflow-hidden"
//                   >
//                     <CardHeader>
//                       <CardTitle>Product Images</CardTitle>
//                       <CardDescription>
//                         Upload images of the product.
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid gap-2">
//                       <div className="relative flex flex-col items-center justify-center w-full border-dashed border-2 border-gray-300 p-5 cursor-pointer">
//                         <input
//                           id="images"
//                           type="file"
//                           name='files'
//                           multiple
//                           className="absolute inset-0 opacity-0 cursor-pointer"
//                           onChange={handleImageChange}
//                           // onChange={(e) => setFiles(e.target.files)}
//                         />
//                         <Upload className="h-8 w-8 mb-2 text-gray-400"/>
//                         <span className="text-gray-400">Click to upload images</span>
//                       </div>
//                         <div className="relative mb-4">
//                         {imagePreview.map((imageUrl, index) => (
//                           <div key={index} className='mb-4 w-full'>
//                             <Image
//                               src={imageUrl}
//                               alt={`Preview ${index + 1}`}
//                               width={200}
//                               height={200}
//                               layout="responsive"
//                               className="object-cover rounded h-[200px] w-[200px]"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="xs"
//                               onClick={() => removeImage(imageUrl)}
//                               className="absolute top-0 right-0"
//                             >
//                               Remove
//                             </Button>
//                           </div>
//                         ))}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
                  
//                 </div>
//                 <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
//                   <Card x-chunk="dashboard-07-chunk-3">
//                     <CardHeader>
//                       <CardTitle>Product Status</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid gap-6">
//                         <div className="grid gap-3">
//                           <Label htmlFor="status">Status</Label>
//                           <Select>
//                             <SelectTrigger id="status" aria-label="Select status">
//                               <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="0">Draft</SelectItem>
//                               <SelectItem value="1">Active</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card x-chunk="dashboard-07-chunk-2">
//                     <CardHeader>
//                       <CardTitle>Product Category</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid gap-6 ">
//                         <div className="grid gap-3">
//                           <Label htmlFor="collection">Collection</Label>
//                           <Select value={collectionId} onValueChange={handleCollectionChange}>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select Collection" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {collections.map((collection) => (
//                                 <SelectItem key={collection.id} value={collection.id.toString()}>
//                                   {collection.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="grid gap-3">
//                           <Label htmlFor="category">Rugs Type</Label>
//                           <Select onValueChange={handleRugsChange}>
//                             <SelectTrigger
//                               id="type"
//                               // aria-label="type"
//                               // value={rugs}
//                               // onChange={(e)=> setRugs(e.target.value)}
//                             >
//                               <SelectValue placeholder="Select Rugs Type"
//                               //  value={rugs}
//                               // onChange={(e)=> setRugs(e.target.value)}
//                               />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="HandWoven">HandWoven</SelectItem>
//                               <SelectItem value="HandTuffted">
//                                 HandTuffted
//                               </SelectItem>
//                               <SelectItem value="HandKnitted">
//                                 HandKnitted
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="grid gap-3">
//                           <Label htmlFor="category">Color</Label>
//                           <Select onValueChange={handleColorChange}>
//                             <SelectTrigger
//                               id="color"
//                               // value={color}
//                               // onChange={handleChange}
//                               // aria-label="Select Color"
//                             >
//                               <SelectValue placeholder="Select Color" />
//                             </SelectTrigger>
//                             <SelectContent>
//                             {colors.map((color, index) => (
//                               <SelectItem key={index} value={color.value}> 
//                             <div className='flex items-center gap-3'><span className={`block h-9 w-9 rounded ${color.value}`} />{color.name}</div>
//                               </SelectItem>
//                             ))}
                            
//                             </SelectContent>
                            
//                           </Select>
                          
//                         </div>
                        
//                         <div className="grid gap-3">
//                           <Label htmlFor="category">Size</Label>
//                           <MultiText
//                             placeholder="Enter size and press Enter"
//                             value={sizes}
//                             onChange={handleSizeChange}
//                             onRemove={handleSizeRemove}
//                           />
//                         </div>

//                         <div className="grid gap-3">
//                           <Label htmlFor="tags">Tags</Label>
//                           <Select>
//                             <SelectTrigger id="tags">
//                               <SelectValue placeholder={tags.length ? tags.join(", ") : "Select Tags"} />
//                             </SelectTrigger>
//                             <SelectContent className="p-2 border rounded-lg bg-white shadow-md">
//                               {availableTags.map((tag, index) => (
//                                 <div
//                                   key={index}
//                                   className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
//                                   onClick={() => handleTagChange(tag)}
//                                 >
//                                   <Checkbox checked={tags.includes(tag)} />
//                                   <span>{tag}</span>
//                                 </div>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <div className="mt-4">
//                             <h3 className="font-medium">Selected Tags:</h3>
//                             <p className="text-gray-700">{tags.length ? tags.join(", ") : "None"}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
                  
//                 </div>
//               </div>
//               <div className="flex items-center justify-between gap-8 mt-4 ">
//                 <Button variant="outline" size="sm">
//                   Discard Product
//                 </Button>
//                 <Button type="submit" >Save Product</Button>
//               </div>
//             </form>
//             {message && <p>{message}</p>}
//           </div>
//         </main>
//     </div>
//   )
// }




// export default withAuth(AddProduct, [1]);


"use client"
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,   SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Image from "next/image";

export default function AddProduct() {

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        if (!response.ok) throw new Error("Failed to fetch collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);


  const [product, setProduct] = useState({
    id: "",
    name: "",
    code: "",
    isActive: true,
    isFeatured: false,
    tags: [], // ✅ empty array instead of [""]
    images: [], // ✅ empty array instead of [""]
    imageUrls: [], // ✅ correct
    colors: [], // ✅ initially empty or [{ name: "", value: "", inStock: true, images: [] }] if you're binding a single item
    sizes: [], // ✅ empty array instead of [""]
    features: [], // ✅ empty array instead of [""]
    specifications: [], // ✅ empty array instead of [{ key: "", value: "" }]
    inStock: true,
    sku: "",
    barcode: "",
    weight: "",
    quantity: "",
    collectionId: "",
    shortDescription: "",
    description: "",
  });


  const availableTags = ["Rugs", "OutDoor", "New Arrival", "Cushion", "Pillow"];
  const availableSizes = ["3' x 5'", "4' x 6'", "5' x 8'", "6' x 9'", "8' x 10'", "9' x 12'", "10' x 14'", "Runner", "Custom"];
  // const availableTags = ["Banner", "New", "Discount"]; // Available options

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setProduct(prev => ({ ...prev, [name]: checked }));
  };


//  const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map((file) => URL.createObjectURL(file));
//     setProduct({ ...product, images: [...product.images, ...urls] });
//   };

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  const base64Images = await Promise.all(files.map(getBase64));
  setProduct({ ...product, images: [...product.images, ...base64Images] });
};


  const handleRemoveImage = (index) => {
    const imgs = [...product.images];
    imgs.splice(index, 1);
    setProduct({ ...product, images: imgs });
  };


  // const handleColorImageUpload = (e, colorIndex) => {
  //   const files = Array.from(e.target.files);
  //   const imageUrls = files.map(file => URL.createObjectURL(file));

  //   const updatedColors = [...product.colors];

  //   if (!updatedColors[colorIndex]) return; // Safety check

  //   if (!Array.isArray(updatedColors[colorIndex].images)) {
  //     updatedColors[colorIndex].images = []; // Initialize if undefined
  //   }

  //   updatedColors[colorIndex].images.push(...imageUrls);
  //   setProduct({ ...product, colors: updatedColors });
  // };

  const handleColorImageUpload = async (e, colorIndex) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(getBase64)); // 🔥 Convert to Base64
  
    const updatedColors = [...product.colors];
  
    if (!updatedColors[colorIndex]) return;
  
    if (!Array.isArray(updatedColors[colorIndex].images)) {
      updatedColors[colorIndex].images = [];
    }
  
    updatedColors[colorIndex].images.push(...base64Images); // ✅ store Base64 for Cloudinary
    setProduct({ ...product, colors: updatedColors });
  };
  

  const handleRemoveColorImage = (colorIndex, imageIndex) => {
    const updatedColors = [...product.colors];
    if (
      updatedColors[colorIndex] &&
      Array.isArray(updatedColors[colorIndex].images)
    ) {
      updatedColors[colorIndex].images.splice(imageIndex, 1);
      setProduct({ ...product, colors: updatedColors });
    }
  };


  const handleTagChange = (tag, checked) => {
    setProduct(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag] 
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSizeChange = (size, checked) => {
    setProduct(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size] 
        : prev.sizes.filter(s => s !== size)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send data to API route
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-2 mb-6">
            <Plus className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Add New Product</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Basic Information</h2>
                
                <div className="grid gap-6 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={product.name}
                      onChange={handleChange}
                      placeholder="e.g., Persian Royal Blue Handmade Carpet"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                      Product Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="code"
                      type="text"
                      required
                      value={product.code}
                      onChange={handleChange}
                      placeholder="e.g., ROYAL2134Z"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  
                  <div className="space-y-2">
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-forest-800">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shortDescription"
                      name="shortDescription"
                      type="text"
                      value={product.shortDescription}
                      onChange={handleChange}
                      placeholder="Brief description for product listings"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                    <p className="text-xs text-forest-600">
                      Brief summary displayed in product listings and search results.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-forest-800">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      value={product.description}
                      onChange={handleChange}
                      placeholder="Detailed product description"
                      className="min-h-[120px] w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isActive" 
                        checked={product.isActive}
                        onCheckedChange={(checked) => handleCheckboxChange("isActive", checked === true)}
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                      >
                        Active (visible on site)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isFeatured" 
                        checked={product.isFeatured}
                        onCheckedChange={(checked) => handleCheckboxChange("isFeatured", checked === true)}
                      />
                      <label  
                        htmlFor="isFeatured"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                      >
                        Featured Product
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Product Images</h2>
                
                <div className="space-y-4">
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
                  </div>
                  
                  {product.images.filter((url) => url).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {product.images.map((url, index) =>
                      url ? (
                        <div key={index} className="relative group">
                          {/* <img
                            src={url}
                            alt={`Product preview ${index + 1}`}
                            // maxSize={5 * 1024 * 1024}
                            className="w-full h-32 object-cover rounded-md border border-forest-200"
                          /> */}
                          <div className="relative w-full h-32 rounded-md border border-forest-200 overflow-hidden">
                            <Image
                              src={url || "/placeholder.jpg"} // fallback if url is missing
                              alt={`Product preview ${index + 1}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Organization</h2>
                
                <div className="grid gap-6">
                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Collections
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {collections.map((collection) => (
                        <div key={collection.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`collection-${collection.id}`} 
                            checked={product.collections.includes(collection.id)}
                            onCheckedChange={(checked) => handleCategoryChange(collection.id, checked === true)}
                          />
                          <label
                            htmlFor={`collection-${collection.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {collection.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}


                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Available Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={product.categories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div> */}


                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Collection
                    </label>
                    <select
                      name="collectionId"
                      value={product.collectionId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                      required
                    >
                      <option value="">Select a Collection</option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Features */}
                  <div className="grid gap-6 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                        Product Features <span className="text-red-500">*</span>
                      </label>
                    {product.features.map((f, i) => (
                      <Textarea
                        key={i}
                        placeholder={`Feature ${i + 1}`}
                        value={f}
                        onChange={(e) => {
                          const features = [...product.features];
                          features[i] = e.target.value;
                          setProduct({ ...product, features });
                        }}
                      />
                    ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setProduct({ ...product, features: [...product.features, ""] })}
                    >
                      + Add Feature
                    </Button>
                  </div>

                  {/* Specifications */}
                  <div className="grid gap-6 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-forest-800">
                        Product Specifications <span className="text-red-500">*</span>
                      </label>
                      {product.specifications.map((s, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            placeholder="Key"
                            value={s.key}
                            onChange={(e) => {
                              const specs = [...product.specifications];
                              specs[i].key = e.target.value;
                              setProduct({ ...product, specifications: specs });
                            }}
                          />
                          <Input
                            placeholder="Value"
                            value={s.value}
                            onChange={(e) => {
                              const specs = [...product.specifications];
                              specs[i].value = e.target.value;
                              setProduct({ ...product, specifications: specs });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        setProduct({ ...product, specifications: [...product.specifications, { key: "", value: "" }] })
                      }
                    >
                      + Add Specification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Variants</h2>
                
                <div className="grid gap-6">

                  {/* Colors */}
                  <div className="space-y-2">
                    <label className="font-semibold">🎨 Colors</label>
                    {product.colors.map((color, idx) => (
                      <div key={idx} className="border p-4 rounded-lg space-y-2 ">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input placeholder="Color Name" value={color.name} onChange={(e) => {
                            const colors = [...product.colors];
                            colors[idx].name = e.target.value;
                            setProduct({ ...product, colors });
                          }} />
                          <Input type="color" value={color.value} onChange={(e) => {
                            const colors = [...product.colors];
                            colors[idx].value = e.target.value;
                            setProduct({ ...product, colors });
                          }} />
                        </div>
                        <label className="flex items-center gap-2">
                          <Checkbox
                            checked={color.inStock}
                            onCheckedChange={(val) => {
                              const colors = [...product.colors];
                              colors[idx].inStock = val;
                              setProduct({ ...product, colors });
                            }}
                          />
                          In Stock
                        </label>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Color Images:</label>

                          {/* File input */}
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                            <div className="relative inline-block overflow-hidden">
                              <Button variant="outline" className="border-forest-300">Select Color Images</Button>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleColorImageUpload(e, idx)}
                                // maxSize={5 * 1024 * 1024}
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Image previews */}
                          {color.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                              {color.images.map((img, i) => {
                                if (!img) return null; // ✅ skip empty strings or undefined

                                const imageUrl = typeof img === "string" ? img : URL.createObjectURL(img);

                                return (
                                  <div key={i} className="relative group">
                                    <img
                                      src={imageUrl}
                                      alt={`Color ${i + 1}`}
                                      className="w-full h-32 object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveColorImage(idx, i)}
                                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full hover:bg-white text-red-500"
                                    >
                                      ❌
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* <Button type="button" onClick={() => setProduct({ ...product, colors: [...product.colors, { name: "", value: "#000000", inStock: true, images: [""] }] })}>
                      + Add Color
                    </Button> */}
                    <Button
                      type="button"
                      onClick={() =>
                        setProduct({
                          ...product,
                          colors: [
                            ...product.colors,
                            { name: "", value: "#000000", inStock: true, images: [] }
                          ]
                        })
                      }
                    >
                      + Add Color
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Available Sizes
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableSizes.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`size-${size}`} 
                            checked={product.sizes.includes(size)}
                            onCheckedChange={(checked) => handleSizeChange(size, checked === true)}
                          />
                          <label
                            htmlFor={`size-${size}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-forest-800">
                      Available Tags
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag}`} 
                            checked={product.tags.includes(tag)}
                            onCheckedChange={(checked) => handleTagChange(tag, checked === true)}
                          />
                          <label
                            htmlFor={`tag-${tag}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-forest-800"
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <div className="grid gap-3">
                    <Label htmlFor="tags">Tags</Label>
                    <Select>
                      <SelectTrigger id="tags">
                        <SelectValue placeholder={product.tags.length ? product.tags.join(", ") : "Select Tags"} />
                    </SelectTrigger>
                      <SelectContent className="p-2 border rounded-lg bg-white shadow-md">
                        {availableTags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded"
                            onClick={() => handleTagChange(tag)}
                          >
                            <Checkbox checked={product.tags.includes(tag)} />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-4">
                      <h3 className="font-medium">Selected Tags:</h3>
                      <p className="text-gray-700">{product.tags.length ? product.tags.join(", ") : "None"}</p>
                    </div>
                  </div> */}


                </div>
              </CardContent>
            </Card>
            
            {/* <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4 text-forest-800">Inventory</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="sku" className="block text-sm font-medium text-forest-800">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      id="sku"
                      name="sku"
                      type="text"
                      value={product.sku}
                      onChange={handleChange}
                      placeholder="e.g., CP-123-BLU"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="barcode" className="block text-sm font-medium text-forest-800">
                      Barcode (UPC, EAN)
                    </label>
                    <input
                      id="barcode"
                      name="barcode"
                      type="text"
                      value={product.barcode}
                      onChange={handleChange}
                      placeholder="e.g., 123456789012"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="weight" className="block text-sm font-medium text-forest-800">
                      Weight (lbs)
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={product.weight}
                      onChange={handleChange}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" className="border-forest-300" asChild>
                <Link href="/admin">Cancel</Link>
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-forest-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
            
          </form>

        </div>
      </div>
    </>
  );
}