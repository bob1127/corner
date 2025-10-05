"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const API_URL =
  "https://starislandbaby.com/test/wp-json/wc/v3/products/categories?consumer_key=ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b&consumer_secret=cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f&per_page=100";
const PRODUCTS_API_URL =
  "https://starislandbaby.com/test/wp-json/wc/v3/products?consumer_key=ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b&consumer_secret=cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f&per_page=100";

const SmallChildrenProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch(API_URL);
        const categories = await categoriesRes.json();

        // Fetch products
        const productsRes = await fetch(PRODUCTS_API_URL);
        const productsData = await productsRes.json();

        // Find category with slug 'small-children'
        const smallChildrenCategory = categories.find(
          (category) => category.slug === "small-children"
        );

        if (smallChildrenCategory) {
          // Filter products by 'small-children' category
          const filteredProducts = productsData.filter((product) =>
            product.categories.some(
              (category) => category.id === smallChildrenCategory.id
            )
          );
          setProducts(filteredProducts);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center">No products found for Small Children.</div>
    );
  }

  return (
    <div className="product-list">
      <h2 className="text-3xl font-bold text-center mb-6">
        Small Children Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-item border p-4 rounded-lg shadow-md"
          >
            <div className="relative">
              <Image
                src={product.images[0]?.src || "/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={300}
                layout="responsive"
                priority
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-500">{product.price} NT</p>
            <Link href={`/product/${product.id}`}>
              <a className="text-blue-500 mt-2 inline-block">View Product</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmallChildrenProducts;
