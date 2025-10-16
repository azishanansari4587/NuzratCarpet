"use client"
import { useEffect, useState } from 'react'
import React from 'react'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { GridIcon, ListIcon } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

const Outlet = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutletProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const products = data?.products || [];

        // ✅ Sirf "Outlet" tag wale products lo
        const outletProducts = products.filter((product) => {
          let tags = [];

          try {
            if (Array.isArray(product.tags)) {
              tags = product.tags;
            } else if (typeof product.tags === "string") {
              if (product.tags.trim().startsWith("[")) {
                tags = JSON.parse(product.tags);
              } else {
                tags = product.tags.split(",").map(tag => tag.trim());
              }
            }
          } catch (e) {
            console.error("Tag parsing error:", e);
          }

          return tags.some(tag => tag === "Outlet"); // ✅ case-insensitive
        });

        setProducts(outletProducts);
      } catch (error) {
        console.error("Error fetching outlet products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutletProducts();
  }, []);

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
           Our Outlet Products
          </h1>
          <p className="text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
            Exclusive outlet deals on our handcrafted rugs & carpets. Limited stock, grab yours now!
          </p>
        </div>
      </section>

      {/* Products section */}
      {loading ? (
        <Spinner />
      ) : (
        <section className="py-12">
          <div className="container-custom">
            <div className="w-full">
              {/* Sort controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="text-muted-foreground">
                  Showing {indexOfFirstProduct + 1}-
                  {Math.min(indexOfLastProduct, products.length)} of {products.length} results
                </div>
                <div className="flex items-center">
                  <div className="hidden sm:flex border rounded-md">
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
                </div>
              </div>

              {/* Products */}
              {currentProducts.length > 0 ? (
  <div
    className={
      viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        : "space-y-6"
    }
  >
    {currentProducts.flatMap((product) => {
      let images = [];

      try {
        if (Array.isArray(product.images)) {
          images = product.images;
        } else if (typeof product.images === "string") {
          if (product.images.trim().startsWith("[")) {
            images = JSON.parse(product.images);
          } else {
            images = [product.images];
          }
        }
      } catch (e) {
        console.error("Failed to parse images:", e);
      }

      // ✅ color wise cards
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        return product.colors.map((color, idx) => (
          <ProductCard
            key={`${product.id}-${idx}`}
            productId={product.id}
            id={product.slug}
            name={`${product.name} - ${color.name}`} // ✅ name ke sath color bhi
            image={color.images?.[0] || images[0]}   // ✅ color ka image
            hoverImage={color.images?.[1] || images[1] || null}
            category={product.category}
            colors={product.colors}
            badges={product.badges}
            sizes={product.sizes || []}
            selectedColor={color} // ✅ send complete color object
          />
        ));
      }

      // ✅ agar koi colors nahi hai
                  return (
                    <ProductCard
                      key={product.id}
                      productId={product.id}
                      id={product.slug}
                      name={product.name}
                      image={images[0]}
                      hoverImage={images[1] || null}
                      category={product.category}
                      colors={product.colors || []}
                      badges={product.badges}
                      sizes={product.sizes || []}
                    />
                  );
                })}
              </div>
            )  : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No outlet products found</h3>
                  <p className="text-muted-foreground mb-6">
                    Currently no products are available in Outlet.
                  </p>
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
        </section>
      )}
    </main>
  )
}

export default Outlet
