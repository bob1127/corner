"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 抓取 WooCommerce 分類資料
async function fetchProductCategories() {
  try {
    const categoryUrl = `https://fegoesim.com/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`;
    const response = await fetch(categoryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories. Status: ${response.status}`);
    }
    const categories = await response.json();
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

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="w-full px-0 sm:px-4 py-10">
      <h2 className="text-2xl  font-bold mb-6 text-center">其他推薦好商品</h2>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <Link href={`/category/${cat.slug}`}>
              <Card className="p-0 m-0  shadow-md mx-auto w-[330px] sm:w-full border group border-black rounded-[25px] hover:shadow-xl transition-all bg-white h-full">
                <CardHeader className="p-0">
                  {cat.image?.src ? (
                    <img
                      src={cat.image.src}
                      alt={cat.name}
                      className="w-full h-[200px] border-b-2 border-black object-cover rounded-t-[25px]"
                    />
                  ) : (
                    <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-t-[25px]">
                      無圖片
                    </div>
                  )}
                </CardHeader>
                <CardBody className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-gray-900 group-hover:text-[#1757FF] text-sm tracking-wide leading-normal">
                    {(cat.description || cat.slug)
                      .replace(/(<([^>]+)>)/gi, "")
                      .slice(0, 55)}
                    ...
                  </p>
                </CardBody>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
