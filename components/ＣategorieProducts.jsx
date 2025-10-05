import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import "aos/dist/aos.css";
import Image from "next/image";
import EasyProduct from "../components/easyProduct.jsx";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { FollowerPointerCard } from "../components/ui/following-pointer.tsx";

async function fetchAllProducts() {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_WP_API_BASE_URL}wp-json/wc/v3/products?consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}&per_page=100`;
    const response = await fetch(productUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // 每頁顯示4個產品

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await fetchAllProducts();
      const filteredProducts = fetchedProducts.filter((product) =>
        product.categories.some((category) => category.slug === "categories")
      );
      setProducts(filteredProducts);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-10 text-xl">該分類下尚未有產品</div>;
  }

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="container w-full 2xl:w-[85%] flex flex-col mx-auto py-1 px-4">
      <Image
        data-aos="zoom-in"
        src="/images/S__4972561.jpg"
        placeholder="empty"
        loading="lazy"
        className="mx-auto max-w-[700px]"
        width={700}
        height={300}
        alt="for__title"
      ></Image>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {/* Previous Page Button */}
          <button
            className="px-4 py-2 rotate-180 rounded-lg disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <Image
              src="/images/right-arrow.png"
              width={50}
              className="xl:w-[50px] w-[40px]"
              height={50}
              alt="arrow"
              placeholder="empty"
              loading="lazy"
            />
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 border w-[45px] h-[45px] !rounded-xl transition duration-200 ${
                  currentPage === index + 1
                    ? "bg-gray-300 text-black" // Current page has gray background
                    : "bg-white text-black hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Next Page Button */}
          <button
            className="px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <Image
              src="/images/right-arrow.png"
              width={50}
              className="xl:w-[50px] w-[40px]"
              height={50}
              alt="arrow"
              placeholder="empty"
              loading="lazy"
            />
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpen = () => {
    setSelectedProduct(product);
    onOpen();
  };

  return (
    <div className="group block ">
      <FollowerPointerCard
        title={
          <TitleComponent
            className="!text-[12px]"
            title={product.name}
            avatar={blogContent.authorAvatar}
          />
        }
      >
        <Button
          onPress={handleOpen}
          className="w-full p-2 !bg-transparent h-full !focus:outline-none !cursor-default"
        >
          <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
            <div className="w-full aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
              <Image
                src={product.images[0]?.src || "/images/default.jpg"}
                alt={product.name}
                width={400}
                height={300}
                className="object-cover group-hover:scale-95 group-hover:rounded-2xl transition-transform duration-200"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold my-4 text-lg text-zinc-700">
                {product.name}
              </h2>
              <h2 className="font-normal my-4 text-sm text-zinc-500">
                Price: ${product.price}
              </h2>
              <div className="flex flex-row justify-between items-center mt-10"></div>
            </div>
          </div>
        </Button>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="full"
          className="flex items-center justify-center !rounded-[27px] min-h-auto !h-auto !min-h-auto"
        >
          <ModalContent className="w-full max-w-7xl 2xl:p-10 md:p-5 p-0">
            <ModalBody className="bg-white !w-[90vw] !rounded-[27px] max-w-7xl">
              {selectedProduct && <EasyProduct product={selectedProduct} />}
            </ModalBody>
          </ModalContent>
        </Modal>
      </FollowerPointerCard>
    </div>
  );
}
const blogContent = {
  slug: "amazing-tailwindcss-grid-layouts",
  author: "BUY NOW",
  date: "28th March, 2023",
  title: "Amazing Tailwindcss Grid Layout Examples",
  description:
    "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcss grid and React.",
  image: "/images/24c1dd94a78c0b8aee23aa767051e8fd.png",
  authorAvatar: "/images/24c1dd94a78c0b8aee23aa767051e8fd.png",
};

const TitleComponent = ({ title, avatar }) => (
  <div className="flex space-x-2 items-center">
    <Image
      src="/images/24c1dd94a78c0b8aee23aa767051e8fd.png"
      height={20}
      width={20}
      alt="thumbnail"
      className="rounded-full border-2 border-white"
    />
    <p>{title}</p>
  </div>
);
