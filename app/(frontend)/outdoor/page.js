"use client"
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Headers from '@/components/Header'
import React from 'react'
import Link from 'next/link'
import Spinner from '@/components/Spinner'
import Image from 'next/image'
// import { useSearchParams } from 'next/navigation';
import ProductFilter from '@/components/ProductFilter'
import { Button } from '@/components/ui/button'
import { GridIcon, ListIcon } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import ProductCard from '@/components/ProductCard'




const Outdoor = () => {

  const [collections, setCollections] = useState([]);


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      const fetchBestSellers = async () => {
        try {
          const res = await fetch("/api/products");
          const data = await res.json();
    
          const products = data?.products || []; // ✅ safe fallback
          const filtered = products.filter((product) => {
            let tags = [];
    
            try {
              tags = Array.isArray(product.tags)
                ? product.tags
                : JSON.parse(product.tags || "[]");
            } catch (e) {
              console.error("Tag parsing error:", e);
            }
    
            return tags.includes("Outdoor");
          });
    
          setProducts(filtered);
        } catch (error) {
          console.error("Error fetching best sellers:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchBestSellers();
    }, []);
  

  
  const [filter, setFilter] = useState({
    rugs: '',
    collectionId: '',
    color: '',
  });










  // const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    // priceRange: [0, 3000]
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Apply filters to products
  const filteredProducts = products.filter(product => {

    // Category filter
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(products.category?.toLowerCase())
    ) {
      return false;
    }

        // Color filter
        // Color filter
      if (
        filters.colors.length > 0 &&
        !product.colors.some(color => filters.colors.includes(color.name))
      ) {
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

  // const handleFilterChange = (newFilters) => {
  //   setFilters(newFilters);
  //   setCurrentPage(1);
  // };
  console.log("FILTERED ON CATEGORY:", products.name, "->", products.category?.toLowerCase());

  console.log('PRODUCT CATEGORY:', products.category);
  
  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      categories: newFilters.categories.map(cat => cat.toLowerCase()),
      sizes: newFilters.sizes.map(size => size.toLowerCase()),
      // colors: newFilters.colors.map(color => color.toLowerCase())
    });
    
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


    <main className="bg-background">
        {/* Page header */}
        <section className="bg-sand-50 py-12">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-center">
              Shop Our Outdoor Rugs
            </h1>
            <p className="text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
              Discover our exquisite selection of handcrafted rugs and carpets, 
              designed to elevate any space with timeless beauty and exceptional quality.
            </p>
          </div>
        </section>

        {/* Products section */}
        {loading ? (
          <Spinner />
        ):
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
                      
                      {  currentProducts.map(product => {
                        let images = [];

                        try {
                          if (Array.isArray(product.images)) {
                            images = product.images;
                          } else if (typeof product.images === "string") {
                            if (product.images.trim().startsWith("[")) {
                              images = JSON.parse(product.images);
                            } else {
                              images = [product.images]; // single image string
                            }
                          }
                        } catch (e) {
                          console.error("Failed to parse images:", e);
                        }
                        return (<ProductCard
                          key={product.id}
                          id={product.slug}
                          name={product.name}
                          image={images[0]}
                          // image={Array.isArray(product.images) ? product.images[0] : product.images}
                          hoverImage={
                            Array.isArray(product.images) && product.images[1]
                              ? product.images[1]
                              : null
                          }
                          category={product.category}
                          colors={product.colors || []}
                          sizes={product.sizes || []}
                        />);
                      }
                        
                        // <ProductCard key={product.id} {...product} />
                        

                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your filters to find what you&apos;re looking for.
                      </p>
                      <Button onClick={() => handleFilterChange({
                        categories: [],
                        colors: [],
                        sizes: [],
                        // priceRange: [0, 3000]
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
        }
      </main>
  )
}
export default Outdoor
