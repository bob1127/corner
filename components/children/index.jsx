import React from "react";
import Image from "next/image";

// API 請求的 URL
const API_URL =
  "https://starislandbaby.com/test/wp-json/wc/v3/products/categories?consumer_key=ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b&consumer_secret=cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f&per_page=100";

// 根據 slug 篩選產品的函數
const filterProductsByCategory = (categories, products) => {
  // 找到 `small-children` 類別
  const category = categories.find((cat) => cat.slug === "small-children");
  if (!category) return []; // 如果找不到類別，返回空陣列

  // 根據類別 ID 篩選出屬於此類別的產品
  return products.filter((product) =>
    product.categories.some((cat) => cat.id === category.id)
  );
};

export async function getStaticProps() {
  try {
    // 獲取所有產品類別資料
    const categoriesRes = await fetch(API_URL);
    const categories = await categoriesRes.json();

    // 獲取所有產品資料
    const productsRes = await fetch(
      "https://starislandbaby.com/test/wp-json/wc/v3/products?consumer_key=ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b&consumer_secret=cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f&per_page=100"
    );
    const products = await productsRes.json();

    // 篩選出屬於 `small-children` 類別的產品
    const filteredProducts = filterProductsByCategory(categories, products);

    return {
      props: {
        products: filteredProducts, // 返回篩選後的產品
      },
      revalidate: 2, // 可選，設置重新生成的間隔時間（秒）
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}

const ProductsPage = ({ products }) => {
  if (!products.length) {
    return <div>沒有找到相關產品。</div>;
  }

  return (
    <div className="product-list">
      <h1 className="text-3xl font-bold text-center mb-6">
        Small Children Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="relative">
              {/* 顯示產品圖片 */}
              <Image
                src={product.images[0]?.src || "/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={300}
                layout="responsive"
                priority
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.price} NT</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
