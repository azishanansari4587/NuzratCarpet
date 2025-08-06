"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import withAuth from "@/lib/withAuth";

const colors = [
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Orange', value: 'bg-orange-500' },
    { name: 'Indigo', value: 'bg-indigo-500' },
    { name: 'Pink', value: 'bg-pink-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Gray', value: 'bg-gray-500'},
    { name: 'Black', value: 'bg-black'},
    { name: 'White', value: 'bg-white'}
    // Add more colors as needed
];

const EditProduct = ({}) => {
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [collections, setCollections] = useState([]);
  const [sizes, setSizes] = useState([]); // Ensure sizes is initialized as an empty array
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [info, setInfo] = useState("");
  const [quality, setQuality] = useState("");
  const [maintanace, setMaintainance] = useState("");
  const [rugs, setRugs] = useState("");
  const router = useRouter();
  const {slug} = useParams();


 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        // console.log(data);
  
        // const parseJSON = (value) => (Array.isArray(value) ? value : JSON.parse(value || "[]"));
        const parsedProduct = {
          ...data,
          images: Array.isArray(data.images) ? data.images : JSON.parse(data.images),
          imagePath: Array.isArray(data.image_path) ? data.image_path : JSON.parse(data.image_path),
          tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags),
          sizes: Array.isArray(data.sizes) ? data.sizes : JSON.parse(data.sizes),
      };
        
        if (res.ok) {
          setProduct(data);
          setName(data.name);
          setDescription(data.description);
          setInfo(data.info);
          setQuality(data.quality);
          setMaintainance(data.maintanace);
          setColor(data.color);
          setCollectionId(data.collectionId);
          setRugs(data.rugs);
          setSizes(parsedProduct.sizes); // Ensure sizes is an array
          setTags(parsedProduct.tags); // Ensure tags is an array
          // setImagePreview(data.imageUrls);
          setImagePreview(parsedProduct.images);
        } else {
          setMessage(`Error: ${data.error}`);
        }
      } catch (error) {
        setMessage("Failed to fetch product data");
      }
    };
  
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };

    fetchProduct();
    fetchCollections();
  }, [slug]);

  // const handleImageChange = (event) => {
  //   const filesImage = Array.from(event.target.files);
  //   const newImagePreviews = filesImage.map((file) => URL.createObjectURL(file));
  //   setFiles((prevImages) => [...prevImages, ...filesImage]);
  //   setImagePreview((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  // };

  // const removeImage = (imageUrl) => {
  //   const newImagePreviews = imagePreview.filter((preview) => preview !== imageUrl);
  //   const newImages = files.filter((_, index) => newImagePreviews.includes(imagePreview[index]));
  //   setImagePreview(newImagePreviews);
  //   setFiles(newImages);
  // };

  const handleSizeChange = (newSize) => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes((prevSizes) => [...prevSizes, newSize]);
    }
  };

  const handleSizeRemove = (sizeToRemove) => {
    setSizes((prevSizes) => prevSizes.filter((size) => size !== sizeToRemove));
  };

  // const handleSizeChange = (newSize) => {
  //   if (newSize && !sizes.includes(newSize)) {
  //     setSizes([...sizes, newSize]);
  //   }
  // };
  
  // const handleTagChange = (newTag) => {
  //   if (newTag && !tags.includes(newTag)) {
  //     setTags([...tags, newTag]);
  //   }
  // };

  const handleTagChange = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle Color Change
  const handleColorChange = (value) => {
    setColor(value);
  };

  // Handle Collection ID Change
  const handleCollectionChange = (value) => {
    setCollectionId(value);
  };

  // Handle Rugs Change
  const handleRugsChange = (value) => {
    setRugs(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("info", info);
    formData.append("quality", quality);
    formData.append("maintanace", maintanace);
    formData.append("color", color);
    formData.append("collectionId", collectionId);
    formData.append("rugs", rugs);

    tags.forEach((tag) => formData.append("tags", tag));
    sizes.forEach((size) => formData.append("sizes", size));
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      
      if (res.ok) {
        setMessage("Product updated successfully!");
        router.push("/products");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    }
  };

  // if (!product) return <p>Loading...</p>;

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Edit Product</h1>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full"
                          placeholder="Product Name"
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Product Description"
                          className="min-h-32"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                      {/* Additional fields (info, quality, maintenance, etc.) */}
                      <div className="grid gap-3">
                          <Label htmlFor="info">Information</Label>
                          <Textarea
                            id="info"
                            placeholder="Product Information"
                            className="min-h-32"
                            value={info}
                            onChange={(e)=> setInfo(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="quality">Quality</Label>
                          <Textarea
                            id="quality"
                            placeholder="Product Quality"
                            className="min-h-32"
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="maintenace">Care & Maintenance</Label>
                          <Textarea
                            id="maintenace"
                            placeholder="Product Description"
                            className="min-h-32"
                            value={maintanace}
                            onChange={(e)=> setMaintainance(e.target.value)}
                          />
                        </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="relative flex flex-col items-center justify-center w-full border-dashed border-2 border-gray-300 p-5 cursor-pointer">
                        <input
                          id="images"
                          type="file"
                          name="files"
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          // onChange={handleImageChange}
                        />
                        <span className="text-gray-400">Click to upload images</span>
                      </div>
                      {/* {imagePreview && imagePreview.length > 0 && imagePreview.map((imageUrl, index) => ( */}
                        { imagePreview?.length > 0 && imagePreview.map((img, index) => (
                          <div key={index} className="relative">
                          <Image
                            src={img}
                            alt={`Preview ${index + 1}`}
                            width={500}
                            height={300}
                            layout="responsive"
                            className="object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="xs"
                            onClick={() => removeImage(img)}
                            className="absolute top-1 right-1"
                          >
                            Remove
                          </Button>
                        </div>
                        ))}
                        
                      {/* ))} */}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Label>Color</Label>
                      <Select onValueChange={handleColorChange} value={color}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Color" />
                        </SelectTrigger>
                        <SelectContent>
                        {colors.map((color, index) => (
                              <SelectItem key={index} value={color.value}> 
                            <div className='flex items-center gap-3'><span className={`block h-9 w-9 rounded ${color.value}`} />{color.name}</div>
                              </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label>Collection</Label>
                      <Select onValueChange={handleCollectionChange} value={collectionId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Collection" />
                        </SelectTrigger>
                        <SelectContent>
                          {collections.map((collection) => (
                            <SelectItem key={collection.id} value={collection.id}>
                              {collection.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label>Rugs</Label>
                      <Input
                        value={rugs}
                        onChange={(e) => handleRugsChange(e.target.value)}
                        placeholder="Enter rugs"
                      />
                    </div>
                    {/* Handle Sizes and Tags */}
                    <div className="grid gap-3">
                      <Label>Sizes</Label>
                      <Input
                        placeholder="Add size"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSizeChange(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <div>
                        {sizes.map((size) => (
                         <Badge key={size} className="bg-gray-500 text-white">
                            {size}
                            <Button
                              // variant="destructive"
                              className="ml-1 rounded-full outline-none hover:bg-red-1"
                              size="xs"
                              onClick={() => handleTagRemove(size)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label>Tags</Label>
                      
                      <Input
                        placeholder="Add tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleTagChange(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <div>
                        {tags.map((tag) => (
                          <Badge key={tag} className="bg-gray-500 text-white">
                            {tag}
                            <Button
                              // variant="destructive"
                              className="ml-1 rounded-full outline-none hover:bg-red-1"
                              size="xs"
                              onClick={() => handleTagRemove(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button type="submit">Update Product</Button>
              {message && <p className="text-red-500">{message}</p>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default withAuth(EditProduct, [1]);
