import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Image from "next/image";
const Navbar = () => {
  const [categories, setCategories] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
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

        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleSubcategories = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const renderCategories = (parentId) => {
    const subCategories =
      categories?.filter((category) => category.parent === parentId) || [];

    if (!subCategories.length) return null;

    return (
      <ul className="pl-4 flex flex-col space-y-2">
        {subCategories.map((category) => (
          <li className="flex" key={category.id}>
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
            {renderCategories(category.id)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className="relative flex flex-col justify-center items-start">
      <ul className="border-b-1 w-full border-white py-3">
        <li className="font-bold text-[18px] text-gray-600 hover:text-black duration-200">
          <Link href="/qa">Q&A</Link>
        </li>
      </ul>
      <ul className="flex flex-col space-y-4">
        {categories &&
          categories
            .filter((category) => category.parent === 0)
            .map((category) => (
              <li className="relative text-gray-600 duration-150 my-2 font-bold">
                <button
                  onClick={() => toggleSubcategories(category.id)}
                  className="flex items-center gap-2 w-full hover:text-black"
                >
                  <Link href={`/category/${category.slug}`} passHref>
                    {category.name}
                  </Link>
                  <span className="ml-2">
                    {activeCategory === category.id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </span>
                </button>

                {activeCategory === category.id && (
                  <div className="mt-2">{renderCategories(category.id)}</div>
                )}
              </li>
            ))}
      </ul>
      <div className="MobileIcons flex mt-10 w-full">
        <a
          href="https://www.facebook.com/profile.php?id=61569146001285"
          className="flex justify-center items-center mr-3 "
        >
          <Image
            src="/images/facebook-app-symbol.png"
            placeholder="empty"
            alt="icon"
            loading="lazy"
            className="w-[45px] h-[45px]"
            width={45}
            height={45}
          ></Image>
        </a>
        <a
          href="https://www.instagram.com/starisland_baby2022?igsh=MXVkeWExOXBsdWx1NQ%3D%3D&utm_source=qr"
          className="flex justify-center items-center mr-5 "
        >
          <Image
            src="/images/instagram (1).png"
            placeholder="empty"
            alt="icon"
            loading="lazy"
            className="w-[45px] h-[45px]"
            width={45}
            height={45}
          ></Image>
        </a>
        <a
          href="https://line.me/R/ti/p/@391huuts"
          className="flex justify-center items-center mr-3 "
        >
          <Image
            src="/images/line (2).png"
            placeholder="empty"
            alt="icon"
            loading="lazy"
            className="w-[45px] h-[45px]"
            width={45}
            height={45}
          ></Image>
        </a>
      </div>
      <div className="mt-8 flex justify-center w-full"></div>
    </nav>
  );
};

export default Navbar;
