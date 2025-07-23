"use client"
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Headers from '@/components/Header'
import React from 'react'
import Link from 'next/link'
import Spinner from '@/components/Spinner'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import ProductFilter from '@/components/ProductFilter'
import { Button } from '@/components/ui/button'
import { GridIcon, ListIcon } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import ProductCard from '@/components/ProductCard'


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


const Rugs = () => {

  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  // const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState({
    rugs: '',
    collectionId: '',
    color: '',
  });



  // useEffect(() => {
  //   // Fetch collection from the Api
  //   const fetchCollection = async () => {
  //     try {
  //       const res = await fetch('/api/collections');
  //       const data = await res.json();
  //       setCollections(data);
  //       // setFilteredProducts(data);
  //     } catch (error) {
  //       console.error('Failed to fetch collections', error);
  //     }
  //   };
  //   fetchCollection();
  // }, []);




  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [])


  // const handleFilterChange = (e) => {
  //   const {name, value} = e.target;
  //   setFilter((prev) => {
  //     const selected = prev[name].includes(value)
  //       ? prev[name].filter((item) => item !== value) // Uncheck - remove from array
  //       : [...prev[name], value]; // Check - add to array

  //     return { ...prev, [name]: selected };
  //   });
  // }




  // useEffect(() => {
  //   async function fetchProduct() {
  //     try {

  //       const res = await fetch(`/api/products`);
  //       const data = await res.json();

  //       // Ensure images field is correctly parsed
  //       const parsedData = data?.map(item => ({
  //         ...item,
  //         images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
  //         imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path),
  //         tags: Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags),
  //       }));

        
  //       setProduct(parsedData);
  //       setFilteredProducts(parsedData);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   }

  //   fetchProduct();
  // }, []);


  // const filterProducts = () => {
  //   const { rugs, collectionId, color } = filter;
  //   const filteredProducts = product.filter((product) => {

  //     const collectionMatch = collectionId.length > 0 ? collectionId.includes(product.collectionId.toString()) : true;
  //     const colorMatch = color.length > 0 ? color.includes(product.color) : true;
  //     const rugsMatch = rugs.length > 0 ? rugs.includes(product.rugs) : true;

  //     return collectionMatch && colorMatch && rugsMatch;
       
  // });
  //   setFilteredProducts(filteredProducts);
  // }

  // useEffect(() => {
  //   filterProducts();
  // }, [filter]);


 

  // Mock product data - would come from API in a real application




  const allProducts = [
  {
    id: '1',
    name: 'Persian Medallion Hand-Knotted Rug',
    price: 1299.99,
    image: 'https://i.pinimg.com/736x/87/11/30/871130a71c59ccb3e12da8099f15882f.jpg',
    hoverImage: 'https://i.pinimg.com/736x/21/bd/45/21bd458a7cb076b73800da9f7d8868fd.jpg',
    category: 'Persian',
    colors: ['#b98b62', '#734f3e', '#a37d6c']
  },
  {
    id: '2',
    name: 'Modern Geometric Wool Rug',
    price: 849.99,
    originalPrice: 999.99,
    image: 'https://i.pinimg.com/736x/c1/a1/bf/c1a1bf78023fb8c04e08cca1024e3af8.jpg',
    category: 'Modern',
    isSale: true,
    colors: ['#cebbb3', '#818d82', '#555e55']
  },
  {
    id: '3',
    name: 'Vintage Distressed Area Rug',
    price: 599.99,
    image: 'https://i.pinimg.com/736x/8a/10/52/8a1052b50396cf8687452c545b78d45e.jpg',
    category: 'Vintage',
    isNew: true,
    colors: ['#b59789', '#cebbb3', '#e2d8d4']
  },
  {
    id: '4',
    name: 'Contemporary Minimalist Rug',
    price: 749.99,
    image: 'https://i.pinimg.com/736x/e2/25/89/e22589e1a14a6e19efc284689291ed76.jpg',
    category: 'Contemporary',
    colors: ['#e8d9c7', '#aab3aa', '#61443c']
  },
  {
    id: '5',
    name: 'Traditional Oriental Runner',
    price: 449.99,
    originalPrice: 499.99,
    image: 'https://i.pinimg.com/736x/22/d5/09/22d5095e6da282af26804f8ae641a0d7.jpg',
    category: 'Traditional',
    isSale: true,
    colors: ['#c25e5e', '#8b5e46', '#333333']
  },
  {
    id: '6',
    name: 'Handmade Moroccan Berber Carpet',
    price: 1599.99,
    image: 'https://i.pinimg.com/736x/fe/47/6a/fe476a3d841528417e4af92dc5f4301a.jpg',
    hoverImage: 'https://i.pinimg.com/736x/ea/8a/3b/ea8a3b2428c404cceba3ed8e5689be17.jpg',
    category: 'Handmade',
    isNew: true,
    colors: ['#e8d9c7', '#9f9ea1', '#8b5e46']
  },
  {
    id: '7',
    name: 'Geometric Abstract Area Rug',
    price: 899.99,
    image: 'https://i.pinimg.com/736x/52/48/2f/52482f98a692f842982e69ab49718462.jpg',
    hoverImage: 'https://i.pinimg.com/736x/27/d3/b3/27d3b3de59e8a35d5b3363e137f5ab9e.jpg',
    category: 'Modern',
    colors: ['#a4c2e3', '#9f9ea1', '#c25e5e']
  },
  {
    id: '8',
    name: 'Vintage Persian Tabriz Rug',
    price: 2999.99,
    image: 'https://i.pinimg.com/736x/a6/cf/15/a6cf15ac1cb12d173fe7d42c1e528dc2.jpg',
    category: 'Persian',
    colors: ['#c25e5e', '#8b5e46', '#e8d9c7']
  }
];

// Duplicate products to simulate more items
const mockProducts = [
  ...allProducts,
  ...allProducts.map(p => ({ ...p, id: `${p.id}-duplicate` }))
];


  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 3000]
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Apply filters to products
  const filteredProducts = mockProducts.filter(product => {
    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category.toLowerCase())) {
      return false;
    }
    
    // For demo purposes, we're not actually filtering by color and size since mockProducts don't have those fields
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return b.id.localeCompare(a.id); // Using ID as a proxy for date
      default:
        return 0; // Featured
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    // <div>
    //   <section className='bg-white'>
    //     <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    //       <header className='flex flex-col items-center'>
    //         <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Shop</h2>

    //         <p className="mt-4 max-w-5xl text-center sm:mt-5 sm:text-lg sm:leading-relaxed  text-gray-500">
    //         Welcome to our curated collection of timeless elegance and handcrafted excellence. Explore a wide range of carpets and home décor pieces — each one uniquely woven with heritage, tradition, and passion.
    //         </p>
    //       </header>
    //       { isLoading ? ( <Spinner/>) : (

    //       <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-5 lg:items-start lg:gap-16">
    //         <div className=" space-y-4 lg:block">

    //           <div>
    //             <p className="block text-lg font-medium text-gray-700">Filters</p>

    //             <div className="my-8 space-y-2">

    //             <details
    //                 className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
    //               >
    //                 <summary
    //                   className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
    //                 >
    //                   <span className="text-sm font-medium"> Collections </span>

    //                   <span className="transition group-open:-rotate-180">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       strokeWidth="1.5"
    //                       stroke="currentColor"
    //                       className="h-4 w-4"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    //                       />
    //                     </svg>
    //                   </span>
    //                 </summary>

    //                 <div className="border-t border-gray-200 bg-white">
    //                   <header className="flex items-center justify-between p-4">
    //                     <span className="text-sm text-gray-700"> {filter.collectionId.length} Selected </span>
    //                   </header>

    //                   <ul className="space-y-1 border-t border-gray-200 p-4">
    //                   {collections.map((coll, index) => (
    //                     <li key={coll.id}>
    //                       <label htmlFor={coll.id} className="inline-flex items-center gap-2">
    //                         <input
    //                           type="checkbox"
    //                           id={coll.id}
    //                           name="collectionId"
    //                           value={coll.id}
    //                           checked={filter.collectionId.includes(coll.id.toString())}
    //                           onChange={handleFilterChange}
    //                           className="size-5 rounded border-gray-300"
    //                         />

    //                         <span className="text-sm font-medium text-gray-700">{coll.name}</span>
    //                       </label>
    //                     </li>
    //                   ))}

    //                   </ul>
    //                 </div>
    //               </details>

    //               <details
    //                 className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
    //               >
    //                 <summary
    //                   className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
    //                 >
    //                   <span className="text-sm font-medium"> Colors </span>

    //                   <span className="transition group-open:-rotate-180">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       strokeWidth="1.5"
    //                       stroke="currentColor"
    //                       className="h-4 w-4"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    //                       />
    //                     </svg>
    //                   </span>
    //                 </summary>

    //                 <div className="border-t border-gray-200 bg-white">
    //                   <header className="flex items-center justify-between p-4">
    //                     <span className="text-sm text-gray-700"> {filter.color.length} Selected </span>
    //                   </header>

    //                   <ul className="space-y-1 border-t border-gray-200 p-4">

    //                   {colors?.map((color, index) => (
    //                     <li key={index}>
    //                       <label htmlFor={color.value} className="inline-flex items-center gap-2">
    //                         <input
    //                           type="checkbox"
    //                           id={color.value}
    //                           name='color'
    //                           value={color.value}
    //                           checked={filter.color.includes(color.value)}
    //                           onChange={handleFilterChange}
    //                           className="size-5 rounded border-gray-300"
    //                         />
    //                         <span className="text-sm font-medium text-gray-700"> {color.name} </span>
    //                       </label>
    //                     </li>
    //                   ))}
    //                   </ul>
    //                 </div>
    //               </details>


    //               <details
    //                 className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
    //               >
    //                 <summary
    //                   className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
    //                 >
    //                   <span className="text-sm font-medium"> Rugs </span>

    //                   <span className="transition group-open:-rotate-180">
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       fill="none"
    //                       viewBox="0 0 24 24"
    //                       strokeWidth="1.5"
    //                       stroke="currentColor"
    //                       className="h-4 w-4"
    //                     >
    //                       <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    //                       />
    //                     </svg>
    //                   </span>
    //                 </summary>

    //                 <div className="border-t border-gray-200 bg-white">
    //                   <header className="flex items-center justify-between p-4">
    //                     <span className="text-sm text-gray-700"> {filter.rugs.length} Selected </span>
    //                   </header>

    //                   <ul className="space-y-1 border-t border-gray-200 p-4">
    //                     {["HandKnitted", "HandTuffted", "Handwoven"]?.map((rug, index) => (
    //                       <li key={index}>
    //                       <label htmlFor={rug} className="inline-flex items-center gap-2">
    //                         <input
    //                           type="checkbox"
    //                           id={rug}
    //                           name='rugs'
    //                           value={rug}
    //                           onChange={handleFilterChange}
    //                           className="size-5 rounded border-gray-300"
    //                         />

    //                         <span className="text-sm font-medium text-gray-700"> {rug} </span>
    //                       </label>
    //                     </li>
    //                     ))}
                        

    //                   </ul>
    //                 </div>
    //               </details>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="lg:col-span-4">
    //           <ul className="grid gap-4 grid-cols-2 lg:grid-cols-4">
    //             {filteredProducts?.map((items)=> (
    //               <li key={items.id}>
    //               <Link href={`/products/${items.slug}`} className="group block relative w-full h-64">
    //                 <Image
    //                   src={`${items.images[0]}?height=200&width=200`}
    //                   alt={items.name}
    //                   fill
    //                   className="object-cover transition-opacity group-hover:opacity-90"
    //                   priority
    //                 />
    //                 <div className="absolute bottom-0 w-full bg-white bg-opacity-80 p-2">
    //                   <h3 className="text-gray-700 group-hover:underline group-hover:underline-offset-4">
    //                     {items.name}
    //                   </h3>
    //                 </div>
    //               </Link>
    //             </li>
                
    //             ))}
    //           </ul>
    //         </div>
    //       </div>
    //       )}
    //     </div>
    //   </section>
    // </div>

    <main className="bg-background">
        {/* Page header */}
        <section className="bg-sand-50 py-12">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-center">
              Shop Our Rugs
            </h1>
            <p className="text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
              Discover our exquisite selection of handcrafted rugs and carpets, 
              designed to elevate any space with timeless beauty and exceptional quality.
            </p>
          </div>
        </section>

        {/* Products section */}
        <section className="py-12">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter sidebar */}
              <div className="w-full lg:w-1/4">
                <ProductFilter onFilterChange={handleFilterChange} />
              </div>

              {/* Products grid */}
              <div className="w-full lg:w-3/4">
                {/* Sort controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div className="text-muted-foreground">
                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} results
                  </div>
                  <div className="flex flex-wrap gap-4 sm:gap-2">
                    <div className="flex items-center">
                      <div className="hidden sm:flex border rounded-md mr-4">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="icon"
                          className="rounded-r-none h-9 w-9"
                          onClick={() => handleViewModeChange('grid')}
                          aria-label="Grid view"
                        >
                          <GridIcon size={18} />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="icon"
                          className="rounded-l-none h-9 w-9"
                          onClick={() => handleViewModeChange('list')}
                          aria-label="List view"
                        >
                          <ListIcon size={18} />
                        </Button>
                      </div>
                      <Select defaultValue="featured" onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Products */}
                {currentProducts.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }>
                    {currentProducts.map(product => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters to find what you're looking for.
                    </p>
                    <Button onClick={() => handleFilterChange({
                      categories: [],
                      colors: [],
                      sizes: [],
                      priceRange: [0, 3000]
                    })}>
                      Reset Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </Button>
                    </div>
                  </div>
                )}
              </div>


            </div>
          </div>
        </section>
      </main>
  )
}
export default Rugs
