// pages/_app.js
import "../src/globals.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { useRouter } from "next/router";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "../components/AuthProvider";
import { CartProvider } from "../components/context/CartContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 1000,      // 預設動畫時間
      easing: "ease-in-out",
      once: true,          // 是否只觸發一次
      offset: 50,          // 提前觸發的距離
    });

    // 切頁後重新計算（避免 CSR/動態內容沒被掃到）
    const onRouteDone = () => {
      // 若有新節點，使用 refreshHard；一般 refresh 即可
      AOS.refresh();
    };
    router.events.on("routeChangeComplete", onRouteDone);
    return () => router.events.off("routeChangeComplete", onRouteDone);
  }, [router.events]);

  return (
    <AuthProvider>
      <NextUIProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </NextUIProvider>
    </AuthProvider>
  );
}

export default MyApp;
