import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Navbar from "@/components/Navbar/Navbar.jsx";
import Banner from "@/components/banner";
import Footer from "@/components/ui/footer.jsx";
import Head from "next/head";
import Sidebar from "@/components/Sidebar.js"; // 引入側邊欄組件
import { UserProvider } from "../components/context/UserContext";
export default function RootLayout({ children }) {
  const [sidebarProduct, setSidebarProduct] = useState(null); // 儲存購物車資料

  // handleAddToCart 用於更新 sidebarProduct
  const handleAddToCart = (product, quantity, selectedAttributes) => {
    const totalPrice = product.price * quantity; // 計算總價
    const variantId = getVariantId(selectedAttributes); // 根據選擇的屬性獲取變體 ID

    // 更新 sidebarProduct 狀態
    setSidebarProduct({
      name: product.name,
      price: product.price,
      quantity,
      totalPrice,
      variant: selectedAttributes,
      variantId,
    });
    
    // 顯示購物車側邊欄（根據需求控制顯示）ㄈ
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <Head>
        <title>有香-MemoryCorner｜台灣傳統小吃、台灣美食｜Memory Dining Group - 有香餐飲集團有限公司</title>
        <meta name="description" content="香餐飲集團2022年正式開放加盟，一起將手作匠心美食推至全北美，用正港台灣料理感動大家的味蕾!" />
        <meta name="keywords" content="產品, 購物, 優惠" />
        <meta name="author" content="" />
        <link rel="icon" href="/logo.ico" />
        <meta property="og:title" content="香餐飲集團2022年正式開放加盟，一起將手作匠心美食推至全北美，用正港台灣料理感動大家的味蕾!" />
        <meta property="og:description" content="香餐飲集團2022年正式開放加盟，一起將手作匠心美食推至全北美，用正港台灣料理感動大家的味蕾!" />
        <meta property="og:image" content="/default-og-image.jpg" />
        <meta property="og:url" content="https://www.starislandbaby.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="香餐飲集團2022年正式開放加盟，一起將手作匠心美食推至全北美，用正港台灣料理感動大家的味蕾!" />
        <meta name="twitter:description" content="香餐飲集團2022年正式開放加盟，一起將手作匠心美食推至全北美，用正港台灣料理感動大家的味蕾!" />
        <meta name="twitter:image" content="/default-og-image.jpg" />
      </Head>

        
      <div className=" ">
         

      <NextUIProvider>
  <NextThemesProvider attribute="class" defaultTheme="light">
    <UserProvider>  {/* ✅ 提早包住所有元件 */}
      <Navbar />
      <Sidebar sidebarProduct={sidebarProduct} onAddToCart={handleAddToCart} />
      {children}
    </UserProvider>
  </NextThemesProvider>
</NextUIProvider>

        <Banner />
        <Footer />
      </div>
    </>
  );
}
