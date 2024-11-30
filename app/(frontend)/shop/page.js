"use client"
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Headers from '@/components/Header'
import React from 'react'
import Link from 'next/link'
import Spinner from '@/components/Spinner'
import Image from 'next/image'


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


const Shop = () => {

  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [color, setColor] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState([]);

    // Filter states
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);


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


   // Handle Color Change
  const handleColorChange = (value) => {
    setColor(value);
  };


  const handleCollectionChange = (value) => {
    setCollectionId(value);
  };



  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [])


  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        // Ensure images field is correctly parsed
        const parsedData = data?.map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images : JSON.parse(item.images),
          imagePath: Array.isArray(item.image_path) ? item.image_path : JSON.parse(item.image_path),
          tags: Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags),
        }));

        
        setProduct(parsedData);
        setFilteredProducts(parsedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProduct();
  }, []);


  // Handle filter change
  const handleFilterChange = (filterType, filterValue) => {
    if (filterType === 'material') {
      const newMaterials = selectedMaterials.includes(filterValue)
        ? selectedMaterials.filter((item) => item !== filterValue)
        : [...selectedMaterials, filterValue];
      setSelectedMaterials(newMaterials);
    } else if (filterType === 'color') {
      const newColors = selectedColors.includes(filterValue)
        ? selectedColors.filter((item) => item !== filterValue)
        : [...selectedColors, filterValue];
      setSelectedColors(newColors);
    }
  };

  // Apply filters to products
  useEffect(() => {
    let filtered = products;

    // Filter by materials
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) =>
        selectedMaterials.includes(product.material)
      );
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        selectedColors.includes(product.color)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedMaterials, selectedColors, products]);



  return (
    <div>
      <Headers/>
      <section className='bg-white'>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className='flex flex-col items-center'>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Shop</h2>

            <p className="mt-4 max-w-md  text-gray-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque praesentium cumque iure
              dicta incidunt est ipsam, officia dolor fugit natus?
            </p>
          </header>
          { isLoading ? ( <Spinner/>) : (

          <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-5 lg:items-start lg:gap-16">
            <div className=" space-y-4 lg:block">

              <div>
                {/* <p className="block text-lg font-medium text-gray-700">Filters</p> */}

                <div className="my-8 space-y-2">

                  {/* <details
                    className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary
                      className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                    >
                      <span className="text-sm font-medium"> Category </span>

                      <span className="transition group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div className="border-t border-gray-200 bg-white">
                      <header className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-700"> 0 Selected </span>

                        <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
                          Reset
                        </button>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">
                        {category.map((cat)=> (
                          <li>
                          <label htmlFor="FilterRed" className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="FilterRed"
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700"> {cat.category_name} </span>
                          </label>
                        </li>
                        ))}
                        

                      </ul>
                    </div>
                  </details> */}

                  <details
                    className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary
                      className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                    >
                      <span className="text-sm font-medium"> Collections </span>

                      <span className="transition group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div className="border-t border-gray-200 bg-white">
                      <header className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-700"> 0 Selected </span>

                        <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
                          Reset
                        </button>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">
                      {collections.map((collection, index) => (
                        <li key={index}>
                          <label htmlFor="FilterRed" className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id=''
                              name="category"
                              value=''
                              onChange={handleFilterChange}
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700">{collection.name}</span>
                          </label>
                        </li>
                      ))}

                      </ul>
                    </div>
                  </details>

                  <details
                    className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary
                      className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                    >
                      <span className="text-sm font-medium"> Colors </span>

                      <span className="transition group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div className="border-t border-gray-200 bg-white">
                      <header className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-700"> 0 Selected </span>

                        <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
                          Reset
                        </button>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">

                      {colors?.map((color, index) => (
                        <li key={index}>
                          <label htmlFor="FilterRed" className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="FilterRed"
                              onChange={handleFilterChange}
                              className="size-5 rounded border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700"> {color.name} </span>
                          </label>
                        </li>
                      ))}
                      </ul>
                    </div>
                  </details>

                  <details
                    className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary
                      className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition"
                    >
                      <span className="text-sm font-medium"> Quality </span>

                      <span className="transition group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>

                    <div className="border-t border-gray-200 bg-white">
                      <header className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-700"> 0 Selected </span>

                        <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
                          Reset
                        </button>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">
                        <li>
                          <label htmlFor="FilterRed" className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="FilterRed"
                              onChange={handleFilterChange}
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700"> HandKnitted </span>
                          </label>
                        </li>

                        <li>
                          <label htmlFor="FilterBlue" className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="FilterBlue"
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700"> HandTuffted </span>
                          </label>
                        </li>

                        <li>
                          <label htmlFor="FilterGreen" className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="FilterGreen"
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700"> HandWoven </span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <ul className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {product?.map((items)=> (
                  <li key={items.id}>
                    
                  <Link href={`/products/${items.id}`} className="group block overflow-hidden">
                    <img
                      src={items.images[0]}
                      alt=""
                      className="h-[300px] object-cover transition duration-500 group-hover:scale-105 sm:h-[350px]"
                    />

                    <div className="relative bg-white pt-3">

                      <div className="my-1.5 flex gap-1">
                        <form>
                          <fieldset>
                            <legend className="sr-only">Color</legend>
                          </fieldset>

                          {/* <div className="flex flex-wrap justify-center gap-2 [&:hover_label]:opacity-75">
                          {items.color.map((colors)=>(
                            <div key={colors}>
                              <input type="checkbox" id="ColorSg" className="sr-only" />
                              
                                <label
                                htmlFor="ColorSg"
                                className={`block size-8 cursor-pointer, ${colors}  transition hover:!opacity-100`}
                                >
                                  <span className="sr-only"> Space Gray </span>
                                </label>
                            </div>
                            ))}
                          </div> */}
                        </form>
                      </div>

                      <h3
                        className="mt-2 text-gray-700 group-hover:underline group-hover:underline-offset-4"
                      >
                        {items.name}
                      </h3>

                    </div>

                  </Link>
                </li>
                ))}
              </ul>
            </div>
          </div>
          )}
        </div>
      </section>
      <Footer/>
    </div>
  )
}

export default Shop
