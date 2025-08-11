import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, {useState, useEffect} from 'react'


const RelatedProduct = () => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { slug } = useParams(); // ✅ Correct param


    useEffect(() => {
    const fetchRelatedProducts = async () => {
        if (!slug) return;

        try {
            const res = await fetch(`/api/products/related/${slug}`);
            const data = await res.json();
            setRelatedProducts(data.relatedProducts || []);
        } catch (err) {
            console.error("Failed to fetch related products:", err);
        }
 
    };

  fetchRelatedProducts();
}, [slug]);

  return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <div className="w-full aspect-square relative overflow-hidden rounded-md bg-white">
                    <Image
                    src={`${product.images[0]}?width=500&height=500`}
                    alt={product.images[0]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <h3 className="mt-2 text-sm font-medium text-center text-gray-800">
                    {product.name}
                </h3>
                </Link>
            ))}
        </div>
  )
}

export default RelatedProduct