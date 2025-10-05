import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../components/context/CartContext";
import parse from "html-react-parser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Heart } from "lucide-react";

const EasyProduct = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [variationData, setVariationData] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({
    color:
      product.default_attributes.find((a) => a.name === "color")?.option || "",
    size:
      product.default_attributes.find((a) => a.name === "size")?.option || "",
  });
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!product.variation_data) {
      fetch(
        `https://starislandbaby.com/test/wp-json/wc/v3/products/${product.id}/variations?consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`
      )
        .then((res) => res.json())
        .then(setVariationData)
        .catch(() => setVariationData([]));
    } else {
      setVariationData(product.variation_data);
    }
  }, [product]);

  const getVariantId = () => {
    const { color, size } = selectedAttributes;
    const matched = variationData.find((variation) => {
      const attrs = Object.fromEntries(
        variation.attributes.map((attr) => [
          attr.name.toLowerCase(),
          attr.option,
        ])
      );
      return (
        (!color || attrs.color === color) && (!size || attrs.size === size)
      );
    });
    return matched?.id || null;
  };

  const handleAddToCart = () => {
    const variantId = getVariantId();
    if (!variantId) {
      alert("請選擇顏色與尺寸");
      return;
    }
    addToCart({
      id: variantId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.src,
      color: selectedAttributes.color,
      size: selectedAttributes.size,
    });
    alert("商品已成功加入購物車！");
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      alert("請先加入會員！");
      return;
    }

    setFavorite(true);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    const exists = favorites.find((f) => f.id === product.id);
    if (!exists) {
      favorites.push({
        id: product.id,
        name: product.name,
        image: product.images[0]?.src,
        slug: product.slug, // ✅ 加上 slug
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    alert("✅ 已將商品加入我的最愛！");
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-xl mt-[250px] z-[999999999]  sm:flex-row pb-4 relative">
      {/* 關閉按鈕 */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white border border-black rounded-full w-8 h-8 flex items-center justify-center text-black text-xl hover:bg-gray-100"
        >
          ×
        </button>
      )}

      {/* 左側輪播圖 */}
      <div className="w-full p-8 sm:w-1/2">
        <Swiper
          navigation
          modules={[Navigation, Thumbs]}
          className="rounded-xl overflow-hidden"
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image.src || "/images/default.jpg"}
                alt={product.name}
                width={600}
                height={600}
                className="rounded-xl max-w-[450px] w-[90%] mx-auto"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 右側資訊區 */}
      <div className="w-full p-8 sm:w-1/2 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col mb-5">
            <h2 className="text-xl text-left font-bold">{product.name}</h2>
            <p className="text-lg font-semibold text-gray-900">
              價格：${product.price}
            </p>
          </div>

          <button onClick={handleFavorite} className="ml-4">
            <Heart
              className={`w-6 h-6 transition ${
                favorite ? "text-rose-500" : "text-gray-400"
              }`}
              fill={favorite ? "#f43f5e" : "none"}
            />
          </button>
        </div>

        {/* 顏色選擇 */}
        {product.attributes.find((a) => a.name === "color") && (
          <div className="flex gap-2 flex-wrap">
            {product.attributes
              .find((a) => a.name === "color")
              .options.map((option, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 border rounded-full ${
                    selectedAttributes.color === option
                      ? "bg-[#B4746B] text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedAttributes((prev) => ({
                      ...prev,
                      color: option,
                    }))
                  }
                >
                  {option}
                </button>
              ))}
          </div>
        )}

        {/* 尺寸選擇 */}
        {product.attributes.find((a) => a.name === "size") && (
          <div className="flex gap-2 flex-wrap">
            {product.attributes
              .find((a) => a.name === "size")
              .options.map((option, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 border rounded-full ${
                    selectedAttributes.size === option
                      ? "bg-[#B4746B] text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedAttributes((prev) => ({
                      ...prev,
                      size: option,
                    }))
                  }
                >
                  {option}
                </button>
              ))}
          </div>
        )}

        {/* 數量與加入按鈕 */}
        <div className="flex items-center gap-4">
          <label>數量：</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border px-2 py-1 w-20 text-center"
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="group mb-[50px] mt-5 relative inline-flex h-12 items-center justify-center w-[150px] overflow-hidden rounded-full border border-neutral-200 bg-white font-medium"
        >
          <div className="inline-flex h-12 translate-y-0 items-center justify-center px-6 text-neutral-950 transition duration-500 group-hover:-translate-y-[150%]">
            加入購物車
          </div>

          <div className="absolute inline-flex h-12 w-full translate-y-[100%] items-center justify-center text-neutral-50 transition duration-500 group-hover:translate-y-0">
            <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#B4746B] text-white transition duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
            <span className="z-10 text-white">加入購物車</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EasyProduct;
