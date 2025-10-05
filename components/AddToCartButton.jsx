"use client";
import { useState } from "react";
import { addToCart } from "@/lib/api";

const AddToCartButton = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    setLoading(true);
    const res = await addToCart(productId);
    setMessage(res.message || "已加入購物車");
    setLoading(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2"
    >
      {loading ? "加入中..." : "加入購物車"}
    </button>
  );
};

export default AddToCartButton;
