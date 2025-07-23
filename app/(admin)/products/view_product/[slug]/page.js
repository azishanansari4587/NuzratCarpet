"use client"
import React, {useState, useEffect} from 'react'
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
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
import {useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge";
import withAuth from '@/lib/withAuth'



const ViewProduct = () => {

  const { slug } = useParams(); 
  const [product, setProduct] = useState([]);
  const [tags, setTags] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [collectionId, setCollectionId] = useState(""); 
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
        const res = await fetch(`/api/products/${slug}`);
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

    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };

    fetchCollections();
    fetchProduct();
  }, [slug]);


  return (
    <div>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
                           type="read-only"
                            id="description"
                            placeholder="Product Description"
                            className="min-h-32"
                            value = {product.description}
                            required
                          />
                          {/* <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: product.description }} /> */}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="info">Information</Label>
                          <Textarea
                            id="info"
                            type="read-only"
                            placeholder="Product Information"
                            className="min-h-32"
                            value={product.info}
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="quality">Quality</Label>
                          <Textarea
                            id="quality"
                            type="read-only"
                            placeholder="Product Quality"
                            className="min-h-32"
                            value={product.quality}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="maintenace">Care & Maintenance</Label>
                          <Textarea
                            id="maintenace"
                            type="read-only"
                            placeholder="Product Description"
                            className="min-h-32"
                            value={product.maintanace}
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


                  <Card x-chunk="dashboard-07-chunk-2">
                    <CardHeader>
                      <CardTitle>Product Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 ">
                        <div className="grid gap-3">
                          <Label htmlFor="collection">Collection</Label>
                          <Input
                            id="rugs"
                            type="read-only"
                            value={product.collection_name}
                            className="w-full"
                            placeholder= "Product Name"
                            required
                          />
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
                          <div className='flex items-center gap-3'><span className={`block h-9 w-9 rounded ${product.color}`} /></div>
                          
                        </div>
                        
                        <div className="grid gap-3">
                          <Label htmlFor="category">Size</Label>
                          <div className='flex gap-2'>
                            {sizes.map((size) => (
                              <Badge key={size} className="bg-gray-500 text-white">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="tags">Tags</Label>
                          <div className='flex gap-2'>
                            {tags.map((tag) => (
                              <Badge key={tag} className="bg-gray-500 text-white">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                </div>
              </div>
          </div>
        </main>
    </div>
  )
}

export default withAuth(ViewProduct, [1]);