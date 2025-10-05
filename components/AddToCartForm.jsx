import { useState } from "react";

const AddToCartForm = () => {
  // 設定購物車商品清單
  const [cartItems, setCartItems] = useState([
    { id: 2820, quantity: 2 },
    { id: 2816, quantity: 3 },
  ]);

  return (
    <form action="https://starislandbaby.com/test/cart/" method="POST">
      {cartItems.map((item, index) => (
        <div key={index}>
          <input
            type="hidden"
            name={`cart[${index}][product_id]`}
            value={item.id}
          />
          <input
            type="hidden"
            name={`cart[${index}][quantity]`}
            value={item.quantity}
          />
        </div>
      ))}
      <button type="submit">加入購物車</button>
    </form>
  );
};

export default AddToCartForm;
