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
import {useParams } from 'next/navigation'



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


const ViewProduct = () => {

  const { id } = useParams(); 
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [tags, setTags] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);



  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        // Ensure images field is correctly parsed

        const parsedProduct = {
            ...data,
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images),
            imagePath: Array.isArray(data.image_path) ? data.image_path : JSON.parse(data.image_path),
            tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags),
            sizes: Array.isArray(data.sizes) ? data.sizes : JSON.parse(data.sizes),
        };
      
        
        setProduct(parsedProduct);
        setTags(parsedProduct.tags);
        setSizes(parsedProduct.sizes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }



  //   async function fetchRelatedProducts() {
  //   try {
  //     const res = await fetch(`/api/products/${id}/related`);
  //     const data = await res.json();
  //     const parsedData = data.map(item => ({
  //       ...item,
  //       images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
  //       imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path)
  //     }));
  //     if (res.ok) {
  //       setRelatedProducts(parsedData);
  //       setIsLoading(false);
  //     } else {
  //       setError(parsedData.message);
  //     }
  //   } catch (err) {
  //     setError('An error occurred while fetching related products.');
  //   }
  // }

    fetchProduct();
  }, [id]);


  return (
    <div>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            {/* <form onSubmit={handleSubmit}> */}
              <div className="flex items-center gap-4">
                
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  View Product
                </h1>
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
                            type="read-only"
                            value={product.name}
                            // onChange={(e) => setName(e.target.value)}
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
                            value = {product.description}
                            // onChange= {(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="info">Information</Label>
                          <Textarea
                            id="info"
                            placeholder="Product Information"
                            className="min-h-32"
                            value={product.info}
                            // onChange={(e)=> setInfo(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="quality">Quality</Label>
                          <Textarea
                            id="quality"
                            placeholder="Product Quality"
                            className="min-h-32"
                            value={product.quality}
                            // onChange={(e) => setQuality(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="maintenace">Care & Maintenance</Label>
                          <Textarea
                            id="maintenace"
                            placeholder="Product Description"
                            className="min-h-32"
                            value={product.maintanace}
                            // onChange={(e)=> setMaintainance(e.target.value)}
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
                      {/* <div className="relative flex flex-col items-center justify-center w-full border-dashed border-2 border-gray-300 p-5 cursor-pointer">
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
                      </div> */}
                       

                        {product?.images?.map((img, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={img}
                              alt={`Preview ${index + 1}`}
                              width={500}
                              height={300}
                              layout="responsive"
                              className="object-cover rounded"
                            />
                          </div>
                        ))}
                        
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
                          {collections.map((collection) => (
                              <p key={collection.id} value={collection.id}>{collection.name}</p>
                            ))}
                          {/* <Select onValueChange={handleCollectionChange}>
                            <SelectTrigger
                              id="collection"
                            >
                              <SelectValue placeholder="Select Collection" 
                              // value={collectionId}
                              // onChange={(e)=> setCollectionId(e.target.value)} 
                              />
                            </SelectTrigger>
                            <SelectContent>
                            {collections.map((collection) => (
                              <SelectItem key={collection.id} value={collection.id}>{collection.name}</SelectItem>
                            ))}
                            </SelectContent>
                          </Select> */}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category">Rugs Type</Label>
                          <Input
                            id="rugs"
                            type="read-only"
                            value={product.rugs}
                            className="w-full"
                            placeholder= "Product Name"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category">Color</Label>
                          <p>{product.color}</p>
                          
                        </div>
                        
                        <div className="grid gap-3">
                          <Label htmlFor="category">Size</Label>
                          <MultiText
                            placeholder="Enter size and press Enter"
                            value={sizes}
                            // onChange={handleSizeChange}
                            // onRemove={handleSizeRemove}
                          />
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="tags">Tags</Label>
                          <MultiText
                            placeholder="Enter Tags and press Enter"
                            value={tags}
                            // onChange={handleTagChange}
                            // onRemove={handleTagRemove}

                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 ">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <button type="submit" >Save Product</button>
              </div>
            {/* </form> */}
            {/* {message && <p>{message}</p>} */}
          </div>
        </main>
    </div>
  )
}

export default ViewProduct