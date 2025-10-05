import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

// ✅ WooCommerce API base
const WC_API_URL = `https://fegoesim.com/wp-json/wc/v3/products/categories`;
const WC_API_PARAMS = {
  consumer_key: "ck_ef9f4379124655ad946616864633bd37e3174bc2",
  consumer_secret: "cs_3da596e08887d9c7ccbf8ee15213f83866c160d4",
};

const Navbar = ({ initialCategories = [] }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // ✅ 若沒傳 initialCategories，就 client-side 抓取
  useEffect(() => {
    if (initialCategories.length > 0) return;

    const fetchCategories = async () => {
      let allCategories = [];
      let page = 1;
      const perPage = 100;

      try {
        while (true) {
          const response = await axios.get(WC_API_URL, {
            params: {
              ...WC_API_PARAMS,
              page,
              per_page: perPage,
            },
          });

          if (response.data.length === 0) break;
          allCategories = [...allCategories, ...response.data];
          page++;
        }
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [initialCategories]);

  // ✅ 判斷是否為手機
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="relative w-full bg-white">
      {isMobile ? (
        // ✅ 手機版下拉式選單
        <div className=" w-[90%] sm:w-full px-0 mt-5 sm:mt-0  sm:px-4">
          <select
            className="w-full p-2 border border-gray-300 rounded-[8px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const selectedSlug = e.target.value;
              if (selectedSlug) router.push(`/category/${selectedSlug}`);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              請選擇分類
            </option>

            {categories
              .filter((category) => category.parent === 0)
              .flatMap((parent) => {
                const children = categories.filter(
                  (cat) => cat.parent === parent.id
                );
                return [
                  // 主分類
                  <option key={parent.id} value={parent.slug}>
                    {parent.name}
                  </option>,

                  // 子分類（縮排）
                  ...children.map((child) => (
                    <option key={child.id} value={child.slug}>
                      └ {child.name}
                    </option>
                  )),
                ];
              })}
          </select>
        </div>
      ) : (
        // ✅ 桌機版分類清單（點擊主分類跳轉）
        <ul className="flex flex-row mt-4 space-x-4 overflow-x-auto scrollbar-none px-4">
          {categories
            .filter((category) => category.parent === 0)
            .map((category) => {
              const isActive = router.query.slug === category.slug;

              return (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    scroll={false}
                    className={`py-1 rounded-full px-4 inline-block text-center font-bold whitespace-nowrap
              hover:bg-blue-100 transition-colors duration-200
              ${
                isActive
                  ? "bg-[#20A2E3] text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
