import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const fetchCategories = async () => {
  let allCategories = [];
  let page = 1;
  const perPage = 100;
  const consumerKey = "ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b";
  const consumerSecret = "cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f";

  try {
    while (true) {
      const response = await axios.get(
        "https://starislandbaby.com/test/wp-json/wc/v3/products/categories",
        {
          params: {
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            page,
            per_page: perPage,
          },
        }
      );

      if (response.data.length === 0) break;

      allCategories = [...allCategories, ...response.data];
      page++;
    }

    return allCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const Navbar = () => {
  const { data: categories, isValidating } = useSWR(
    "categories",
    fetchCategories,
    {
      fallbackData: [],
      refreshInterval: 60000,
      revalidateOnFocus: false, // 避免切換頁面後重新抓取
    }
  );

  const [localCategories, setLocalCategories] = useState([]);

  // 當 categories 更新時，避免 UI 閃爍，先更新 useState
  useEffect(() => {
    if (categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState(null);

  // 確保分類按照 menu_order 排序
  const sortedCategories = useMemo(
    () => [...localCategories].sort((a, b) => a.menu_order - b.menu_order),
    [localCategories]
  );

  // 遞歸渲染子分類
  const renderCategories = (parentId) => {
    const subCategories = sortedCategories.filter(
      (category) => category.parent === parentId
    );
    if (subCategories.length === 0) return null;

    return (
      <div>
        <ul className="flex flex-col text-white justify-center space-y-2 pl-4">
          {subCategories.map((category) => (
            <li className="flex text-white" key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="text-black mt-4"
              >
                {category.name}
              </Link>

              {renderCategories(category.id)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex justify-center  mx-auto">
      <nav className="flex mx-auto  justify-center">
        <ul className="flex  space-x-8 mx-auto justify-center relative">
          {isValidating && localCategories.length === 0 ? (
            <div className="text-gray-500"></div>
          ) : (
            sortedCategories
              .filter((category) => category.parent === 0)
              .map((category) => {
                const hasSubCategories = sortedCategories.some(
                  (cat) => cat.parent === category.id
                );

                return (
                  <div className="flex ">
                    <li
                      key={category.id}
                      className="relative text-gray-300 py-5 hover:text-white duration-150 text-[14px] font-bold"
                      onMouseEnter={() => setActiveCategory(category.id)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <button className="flex items-center gap-0">
                        <Link href={`/category/${category.slug}`}>
                          {category.name}
                        </Link>

                        {hasSubCategories && (
                          <span className="ml-2">
                            {activeCategory === category.id ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </span>
                        )}
                      </button>
                      {activeCategory === category.id && hasSubCategories && (
                        <motion.div
                          className="absolute top-10 left-0 w-max bg-white duration-200 tracking-widest mt-2 py-8 font-medium rounded-xl pl-5 pr-[80px] shadow-lg z-10"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {renderCategories(category.id)}
                        </motion.div>
                      )}
                    </li>
                  </div>
                );
              })
          )}
        </ul>
      </nav>
      <div className="flex ml-5 flex-row justify-center items-center">
        <Link
          href="/gift"
          className="text-[#d1d5db] font-extrabold ml-4 text-[14px]"
        >
          送禮專區
        </Link>
        <Link
          href="/qa"
          className="text-[#d1d5db] font-extrabold ml-10 text-[14px]"
        >
          購物說明
        </Link>
        <Link
          href="/about"
          className="ml-10 text-[#d1d5db] font-extrabold text-[14px]"
        >
          關於我們
        </Link>
        <Link
          href="/size"
          className="ml-10 text-[#d1d5db] font-extrabold text-[14px]"
        >
          尺寸參考
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
