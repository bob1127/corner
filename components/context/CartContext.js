import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const addToCart = (product) => {
    if (
      ("color" in product && !product.color) ||
      ("size" in product && !product.size)
    ) {
      return;
    }

    const existingItem = cartItems.find((item) => {
      return (
        item.id === product.id &&
        (item.color ?? null) === (product.color ?? null) &&
        (item.size ?? null) === (product.size ?? null)
      );
    });

    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id &&
          (item.color ?? null) === (product.color ?? null) &&
          (item.size ?? null) === (product.size ?? null)
            ? {
                ...item,
                quantity: item.quantity + product.quantity,
              }
            : item
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...product }]);
    }

    setIsOpen(true);
  };

  const removeFromCart = (productId, color, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          item.id !== productId ||
          (item.color ?? null) !== (color ?? null) ||
          (item.size ?? null) !== (size ?? null)
      )
    );
  };

  const updateQuantity = (productId, color, size, newQuantity) => {
    if (newQuantity <= 0) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId &&
        (item.color ?? null) === (color ?? null) &&
        (item.size ?? null) === (size ?? null)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    setIsOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        isOpen,
        setIsOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
