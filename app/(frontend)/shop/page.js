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

  const [product, setProduct] = useState([]);
  // const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [color, setColor] = useState('');
  // const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState({
    rugs: '',
    collectionId: '',
    color: '',
  });



  useEffect(() => {
    // Fetch collection from the Api
    const fetchCollection = async () => {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        setCollections(data);
        // setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch collections', error);
      }
    };
    fetchCollection();
  }, []);


   // Handle Color Change
  // const handleColorChange = (value) => {
  //   setColor(value);
  // };


  // const handleCollectionChange = (value) => {
  //   setCollectionId(value);
  // };



  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [])


  const handleFilterChange = (e) => {
    const {name, value} = e.target;
    setFilter((prev) => {
      const selected = prev[name].includes(value)
        ? prev[name].filter((item) => item !== value) // Uncheck - remove from array
        : [...prev[name], value]; // Check - add to array

      return { ...prev, [name]: selected };
    });
  }




  useEffect(() => {
    async function fetchProduct() {
      try {

        const res = await fetch(`/api/products`);
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


  const filterProducts = () => {
    const { rugs, collectionId, color } = filter;
    const filteredProducts = product.filter((product) => {

      const collectionMatch = collectionId.length > 0 ? collectionId.includes(product.collectionId.toString()) : true;
      const colorMatch = color.length > 0 ? color.includes(product.color) : true;
      const rugsMatch = rugs.length > 0 ? rugs.includes(product.rugs) : true;

      return collectionMatch && colorMatch && rugsMatch;
       
  });
    setFilteredProducts(filteredProducts);
  }

  useEffect(() => {
    filterProducts();
  }, [filter]);


 





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
                <p className="block text-lg font-medium text-gray-700">Filters</p>

                <div className="my-8 space-y-2">

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
                        <span className="text-sm text-gray-700"> {filter.collectionId.length} Selected </span>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">
                      {collections.map((coll, index) => (
                        <li key={coll.id}>
                          <label htmlFor={coll.id} className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={coll.id}
                              name="collectionId"
                              value={coll.id}
                              checked={filter.collectionId.includes(coll.id.toString())}
                              onChange={handleFilterChange}
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700">{coll.name}</span>
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
                        <span className="text-sm text-gray-700"> {filter.color.length} Selected </span>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">

                      {colors?.map((color, index) => (
                        <li key={index}>
                          <label htmlFor={color.value} className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={color.value}
                              name='color'
                              value={color.value}
                              checked={filter.color.includes(color.value)}
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
                      <span className="text-sm font-medium"> Rugs </span>

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
                        <span className="text-sm text-gray-700"> {filter.rugs.length} Selected </span>
                      </header>

                      <ul className="space-y-1 border-t border-gray-200 p-4">
                        {["HandKnitted", "HandTuffted", "Handwoven"]?.map((rug, index) => (
                          <li key={index}>
                          <label htmlFor={rug} className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={rug}
                              name='rugs'
                              value={rug}
                              onChange={handleFilterChange}
                              className="size-5 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700"> {rug} </span>
                          </label>
                        </li>
                        ))}
                        

                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <ul className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {filteredProducts?.map((items)=> (
                  <li key={items.id}>
                    
                  <Link href={`/products/${items.slug}`} className="group block overflow-hidden">
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
