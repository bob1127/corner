import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://starislandbaby.com/test/wp-json/wc/v3/products/categories",
          {
            params: {
              consumer_key: "ck_ec41b174efc5977249ffb5ef854f6c1fdba1844b",
              consumer_secret: "cs_d6c8d7ba3031b522ca93e6ee7fb56397b8781d1f",
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const parentCategories = categories.filter((category) => !category.parent);
  const childCategories = categories.filter((category) => category.parent);

  const renderChildCategories = (parentId) => {
    const subCategories = childCategories.filter(
      (child) => child.parent === parentId
    );
    return (
      <ul>
        {subCategories.map((child) => (
          <li key={child.id}>
            <Link href={`/category/${child.slug}`}>{child.name}</Link>
            {renderChildCategories(child.id)} {/* 顯示子分類 */}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav>
      <ul>
        {parentCategories.map((parent) => (
          <li key={parent.id}>
            <a href={`/category/${parent.slug}`}>{parent.name}</a>
            {renderChildCategories(parent.id)} {/* 顯示子分類 */}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
