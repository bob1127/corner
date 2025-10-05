"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Link from "next/link";

// 抓 WooCommerce 所有商品分類，包含 description
// 抓 WooCommerce 所有商品分類，包含 description
async function fetchProductCategories() {
  try {
    const categoryUrl = `https://fegoesim.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`;
    const response = await fetch(categoryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories. Status: ${response.status}`);
    }
    const categories = await response.json();

    // 過濾掉空白分類、未分類、以及 all-product
    return categories.filter(
      (cat) =>
        cat.name &&
        cat.slug &&
        cat.name !== "未分類" &&
        cat.slug !== "all-product"
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default function ProductCarousel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await fetchProductCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">所有商品分類</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link href={`/category/${cat.slug}`} key={cat.id}>
            <Card className="p-0 m-0 shadow-md border group border-black rounded-[25px] hover:shadow-xl transition-all bg-white">
              <CardHeader className="p-0">
                {cat.image?.src ? (
                  <img
                    src={cat.image.src}
                    alt={cat.name}
                    className="w-full h-[250px] border-b-2 border-black object-cover rounded-t-md"
                  />
                ) : (
                  <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    無圖片
                  </div>
                )}
              </CardHeader>
              <CardBody className="p-4 text-center">
                <div className="flex justify-between px-4">
                  <h3 className="text-[22px] font-semibold text-black">
                    {cat.name}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-900 group-hover:text-[#1757FF] text-left tracking-wider leading-normal text-[20px] font-bold">
                    {(cat.description || cat.slug)
                      .replace(/(<([^>]+)>)/gi, "")
                      .slice(0, 55)}
                    ...
                  </p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
