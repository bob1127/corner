// hooks/useWooCart.ts

const API_BASE = process.env.NEXT_PUBLIC_WC_URL || "https://starislandbaby.com/test";
const CART_KEY_STORAGE = "cocart_cart_key";

export const useWooCart = () => {
  const getCartKey = () => {
    return localStorage.getItem(CART_KEY_STORAGE);
  };

  const setCartKey = (key: string) => {
    localStorage.setItem(CART_KEY_STORAGE, key);
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    const res = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId, quantity }),
      credentials: "include", // 嘗試使用 cookie
    });

    const data = await res.json();

    if (data.key) {
      setCartKey(data.key);
    }

    return data;
  };

  const getCart = async () => {
    const cartKey = getCartKey();

    const res = await fetch(`${API_BASE}/wp-json/cocart/v2/cart`, {
      method: "GET",
      headers: cartKey
        ? {
            Authorization: `Bearer ${cartKey}`,
          }
        : {},
    });

    const data = await res.json();
    return data;
  };

  const removeItem = async (itemKey: string) => {
    const cartKey = getCartKey();

    const res = await fetch(`${API_BASE}/wp-json/cocart/v2/cart/item/${itemKey}`, {
      method: "DELETE",
      headers: cartKey
        ? {
            Authorization: `Bearer ${cartKey}`,
          }
        : {},
    });

    const data = await res.json();
    return data;
  };

  return {
    addToCart,
    getCart,
    removeItem,
  };
};