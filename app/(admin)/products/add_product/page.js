"use client"
import React, {useState, useEffect} from 'react'
import Image from "next/image"
import Link from "next/link"
import {
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@/components/ui/separator'
import MultiText from '@/components/MultiText';
import { useRouter } from 'next/navigation'

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


const AddProduct = () => {
  const [color, setColor] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [info, setInfo] = useState('');
  const [quality, setQuality] = useState('');
  const [maintanace, setMaintainance] = useState('');
  const [rugs, setRugs] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch collection from the Api
    const fetchCollection = async () => {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error('Failed to fetch collections', error);
      }
    };
    fetchCollection();
  }, []);



  const handleImageChange = (event) => {
    const filesImage = Array.from(event.target.files);
    const newImagePreviews = filesImage.map(file => URL.createObjectURL(file));
    setFiles(prevImages => [...prevImages, ...filesImage]);
    setImagePreview(prevPreviews => [...prevPreviews, ...newImagePreviews]);
  };

  const removeImage = (imageUrl) => {
    const newImagePreviews = imagePreview.filter(preview => preview !== imageUrl);
    const newImages = files.filter((_, index) => newImagePreviews.includes(imagePreview[index]));
    setImagePreview(newImagePreviews);
    setFiles(newImages);
  };


  // const handleChange = (e) => {
  //   setColor(e.target.value);
  // };


  const handleSizeChange = (newSize) => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
    }
  };

  const handleSizeRemove = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const handleTagChange = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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


  // Submit Products //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Create a form data object to handle file uploads
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('info', info);
    formData.append('quality', quality);
    formData.append('maintanace', maintanace);
    formData.append('color', color);
    formData.append('collectionId', collectionId);
    formData.append('rugs', rugs);

    tags.forEach(tag => formData.append('tags', tag));
    sizes.forEach(size => formData.append('sizes', size));
    Array.from(files).forEach(file => formData.append('files', file));
    // images.forEach(image => formData.append('images', image));

    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (res.ok) {
            setMessage('Product added successfully!');
            setName("");
            setDescription("");
            setCollectionId("");
            setColor("");
            setInfo("");
            setQuality("");
            setMaintainance("");
            setDescription("");
            setFiles([]);
            setSizes([]);
            setTags([]);
            router.push('/products');
        } else {
            setMessage(`Error: ${data.error}`);
        }
    } catch (error) {
        setMessage('An unexpected error occurred');
    }
};

  return (
    <div>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-4">
                
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Add Product
                </h1>
                {/* <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
                  <button type="submit">Save Product</button>
                </div> */}
              </div>
              <Separator/>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Product Details</CardTitle>
                      <CardDescription>
                        Lipsum dolor sit amet, consectetur adipiscing elit
                      </CardDescription>
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
                            placeholder= "Product Name"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Product Description"
                            className="min-h-32"
                            value = {description}
                            onChange= {(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
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

                  <Card
                    className="overflow-hidden"
                  >
                    <CardHeader>
                      <CardTitle>Product Images</CardTitle>
                      <CardDescription>
                        Upload images of the product.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                      <div className="relative flex flex-col items-center justify-center w-full border-dashed border-2 border-gray-300 p-5 cursor-pointer">
                        <input
                          id="images"
                          type="file"
                          name='files'
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                          // onChange={(e) => setFiles(e.target.files)}
                        />
                        <Upload className="h-8 w-8 mb-2 text-gray-400"/>
                        <span className="text-gray-400">Click to upload images</span>
                      </div>
                        {/* <input 
                        id='image' 
                        type='file' 
                        accept='image/*'
                        multiple  
                        onChange={handleImageChange} 
                        className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"/> */}
                        {/* {imagePreview.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {imagePreview.map((imageUrl, index) => (
                              <button onClick={() => removeImage(imageUrl)}>
                                <Image
                                  alt={`Image preview ${index}`}
                                  className="aspect-square w-full rounded-md object-cover"
                                  height="84"
                                  src={imageUrl}
                                  value={images}
                                  // value={imagePreview}
                                  width="84"
                                />
                              </button>
                            ))}
                          </div>
                        )} */}
                        <div className="relative mb-4">
                        {imagePreview.map((imageUrl, index) => (
                          <div key={index} className='mb-4 w-full'>
                            <Image
                              src={imageUrl}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={200}
                              layout="responsive"
                              className="object-cover rounded"
                            />
                            <Button
                              variant="destructive"
                              size="xs"
                              onClick={() => removeImage(imageUrl)}
                              className="absolute top-0 right-0"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        </div>
                        
                        
                      </div>
                    </CardContent>
                  </Card>
                  
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Product Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <Select>
                            <SelectTrigger id="status" aria-label="Select status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Draft</SelectItem>
                              <SelectItem value="1">Active</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card x-chunk="dashboard-07-chunk-2">
                    <CardHeader>
                      <CardTitle>Product Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 ">
                        <div className="grid gap-3">
                          <Label htmlFor="collection">Collection</Label>
                          <Select onValueChange={handleCollectionChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Collection" />
                            </SelectTrigger>
                            <SelectContent>
                            {collections.map((collection) => (
                              <SelectItem key={collection.id} name={collection.id} value={collection.id}>{collection.name}</SelectItem>
                            ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category">Rugs Type</Label>
                          <Select onValueChange={handleRugsChange}>
                            <SelectTrigger
                              id="type"
                              // aria-label="type"
                              // value={rugs}
                              // onChange={(e)=> setRugs(e.target.value)}
                            >
                              <SelectValue placeholder="Select Rugs Type"
                              //  value={rugs}
                              // onChange={(e)=> setRugs(e.target.value)}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HandWoven">HandWoven</SelectItem>
                              <SelectItem value="HandTuffted">
                                HandTuffted
                              </SelectItem>
                              <SelectItem value="HandKnitted">
                                HandKnitted
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category">Color</Label>
                          <Select onValueChange={handleColorChange}>
                            <SelectTrigger
                              id="color"
                              // value={color}
                              // onChange={handleChange}
                              // aria-label="Select Color"
                            >
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
                          <Label htmlFor="category">Size</Label>
                          <MultiText
                            placeholder="Enter size and press Enter"
                            value={sizes}
                            onChange={handleSizeChange}
                            onRemove={handleSizeRemove}
                          />
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="tags">Tags</Label>
                          <MultiText
                            placeholder="Enter Tags and press Enter"
                            value={tags}
                            onChange={handleTagChange}
                            onRemove={handleTagRemove}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                </div>
              </div>
              <div className="flex items-center justify-between gap-8 mt-4 ">
                <Button variant="outline" size="sm">
                  Discard Product
                </Button>
                <Button type="submit" >Save Product</Button>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </main>
    </div>
  )
}

export default AddProduct