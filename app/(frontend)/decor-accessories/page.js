"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { Grid } from "lucide-react";

import ProductFilter from "@/components/ProductFilter";

export default function DecorAccessoriesPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        colors: [],
        sizes: [],
        designers: []
    });

    // Tags we want to filter for
    const targetTags = ["cushion", "bag", "sofa", "pouf"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();
                const allProducts = data?.products || [];

                // Filter products that contain at least one of the target tags
                const filteredProducts = allProducts.filter((product) => {
                    let productTags = [];

                    try {
                        // Some tags are stored as a JSON string array "['cushion']", others might be a plain string
                        productTags = Array.isArray(product.tags)
                            ? product.tags
                            : JSON.parse(product.tags || "[]");
                    } catch {
                        // If JSON.parse fails, maybe it's a comma-separated string
                        if (typeof product.tags === "string") {
                            productTags = product.tags.split(',').map(t => t.trim());
                        }
                    }

                    // Case insensitive matching
                    const lowerProductTags = productTags.map((tag) => tag.toLowerCase());

                    return targetTags.some((targetTag) =>
                        lowerProductTags.some(ptag => ptag.includes(targetTag))
                    );
                });

                setProducts(filteredProducts);
                setFilteredProducts(filteredProducts);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Apply color filters whenever activeFilters changes
    useEffect(() => {
        let result = [...products];

        // Filter by color
        if (activeFilters.colors && activeFilters.colors.length > 0) {
            result = result.filter(product => {
                let productColors = [];
                try {
                    productColors = Array.isArray(product.colors)
                        ? product.colors
                        : JSON.parse(product.colors || '[]');
                } catch { }

                // Check if any product color's name matches any selected color filter (case-insensitive)
                return productColors.some(pc => {
                    const pcName = pc?.name || pc;
                    return activeFilters.colors.some(filterColor =>
                        typeof pcName === 'string' &&
                        pcName.toLowerCase() === filterColor.toLowerCase()
                    );
                });
            });
        }

        setFilteredProducts(result);
    }, [activeFilters, products]);

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Grid className="h-5 w-5 text-forest-700" />
                    <h1 className="text-3xl font-serif font-bold text-forest-800">Decor & Accessories</h1>
                </div>

                <p className="text-lg mb-10 max-w-3xl text-forest-700">
                    Enhance your living space with our exclusive selection of decorative cushions, stylish bags, and comfortable poufs.
                </p>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <div className="w-full lg:w-1/4">
                        <ProductFilter onFilterChange={handleFilterChange} />
                    </div>

                    {/* Product Grid */}
                    <div className="w-full lg:w-3/4">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No products found matching your filters.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => {
                                    // Parse images safely (logic taken from your other components)
                                    let images = [];
                                    try {
                                        if (Array.isArray(product.images)) {
                                            images = product.images;
                                        } else if (typeof product.images === "string") {
                                            images = product.images.trim().startsWith("[")
                                                ? JSON.parse(product.images)
                                                : [product.images];
                                        }
                                    } catch { }

                                    const imageUrl = images[0] || "/placeholder.jpg";

                                    return (
                                        <div key={product.id} className="group flex flex-col items-center">
                                            <Link href={`/products/${product.slug}`} className="w-full">
                                                <div className="w-full aspect-square relative overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            </Link>
                                            <div className="mt-4 text-center">
                                                <Link href={`/products/${product.slug}`}>
                                                    <h3 className="text-lg font-serif font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
