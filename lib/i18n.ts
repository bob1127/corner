// lib/i18n.ts
import { useRouter } from "next/router";

type Dict = Record<string, string>;

const en: Dict = {
    "ty.title": "Thank you for your order!",
"ty.subtitle": "We've received your order and will process it shortly.",
"ty.missingId": "Missing order id",
"ty.error": "Failed to load order",
"ty.orderInfo": "Order Info",
"ty.orderNo": "Order #",
"ty.orderDate": "Order Date",
"ty.payment": "Payment",
"ty.total": "Total",
"ty.recipientInfo": "Recipient Info",
"ty.items": "Items",
"ty.qty": "Qty",
"ty.noItems": "No items",
"ty.orderTotal": "Order Total",
"ty.loading": "Loading…",
"ty.contact": "If you have any questions, please contact our customer support.",
"ty.backHome": "Home",
"ty.viewMore": "or browse more products.",

    "cart.items": "items",
  // ===== Navbar / User =====
  "nav.order": "ORDER｜Online Order",
  "user.login": "Login",
  "user.register": "Register",
  "user.account": "Account / Orders",
  "user.logout": "Log out",

  // ===== Cart panel =====
  "cart.title": "Cart",
  "cart.close": "Close",
  "cart.orderSummary": "Order Summary",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Shipping",
  "cart.shipping.calc": "Calculated at checkout",
  "cart.total": "Total",
  "cart.goCheckout": "Go to Checkout",
  "cart.continue": "Continue Shopping",
  "cart.noItems": "No items yet",
  "cart.delete": "Delete",

  // ===== Product / Carousel =====
  "prod.view": "View",
  "prod.addToCart": "Add to Cart",

  // Product page
  "pd.loading": "Loading…",
  "pd.addToCart": "Add to Cart",
  "pd.other": "You may also like",
  "pd.desc": "Description",

  // Product toast
  "pd.toast.added": "Added to cart:",
  "pd.toast.qty": "Qty",
  "pd.toast.close": "Close",

  // Carousel a11y
  "carousel.prev": "Previous",
  "carousel.next": "Next",

  // ===== Checkout (co.*) =====
  "co.contact": "Contact Information",
  "co.email": "Email",
  "co.recipient": "Recipient",
  "co.name": "Name",
  "co.phone": "Phone",
  "co.wechatOpt": "WeChat (Optional)",
  "co.otherContact": "Other contact info",
  "co.deliveryArea": "Delivery Area",
  "co.addrPlaceholder": "Address (street, number, city, postal code)",
  "co.paymentMethod": "Payment Method",
  "co.payHint": "Payment details will be provided by customer service.",
  "co.tax": "Tax",
  "co.freeOver": "Free over",
  "co.freeShipping": "shipping",
  "co.creating": "Creating order…",
  "co.placeOrder": "Place Order",

  // Checkout alerts
  "co.alert.empty": "Cart is empty",
  "co.alert.fillBasic": "Please enter name, phone, and email",
  "co.alert.choosePay": "Please select a payment method",
  "co.alert.chooseArea": "Please select a delivery area",
  "co.alert.fullAddr": "Please enter a full address",
  "co.alert.min80": "Order minimum is CA$80 for delivery",
  "co.alert.noWoo": "No response from WooCommerce",
  "co.alert.failed": "Order failed: ",
  "co.alert.error": "Something went wrong. Please try again later.",

  // Checkout areas
  "co.area.vancouver":
    "Vancouver City (Includes West Side, East Van, UBC) — Excludes Downtown & North Van",
  "co.area.burnaby": "Burnaby",
  "co.area.surrey": "White Rock / South Surrey / North Surrey",
  // ==== Home (categories, UI) ====
  "home.cat.all": "All",

"home.cat.snacks": "Snacks",
"home.cat.soups": "Soups",
"home.cat.noodleSoups": "Noodle Soups",
"home.cat.hotPot": "Hot Pot",
"home.cat.friedRice": "Fried Rice",
"home.cat.desserts": "Desserts",
"home.cat.beverages": "Beverages",
"home.cat.ready": "Ready to Enjoy",
"home.loading": "Loading products…",
"home.noMatch": "No matching products",
"home.prev": "Prev",
"home.next": "Next",
"home.details": "Product Details",
"pd.thisProduct": "This Product",
"hp.error": "Failed to load: ",
"hp.empty": "No other products for now",
"hp.leftNote": "Seasonal",
"hp.rightNote": "Craft Lager",
"home.bannerAlt": "homepage banner",
};

const cn: Dict = {
  // ===== Navbar / User =====
  "nav.order": "ORDER｜線上訂購",
  "user.login": "登入",
  "user.register": "註冊",
  "user.account": "我的帳戶 / 訂單",
  "user.logout": "登出",

  // ===== Cart panel =====
  "cart.title": "購物車",
  "cart.close": "關閉",
  "cart.orderSummary": "訂單摘要",
  "cart.subtotal": "小計",
  "cart.shipping": "運費",
  "cart.shipping.calc": "依配送計算",
  "cart.total": "總計",
  "cart.goCheckout": "前往結帳",
  "cart.continue": "繼續購物",
  "cart.noItems": "目前沒有商品",
  "cart.delete": "移除",

  // ===== Product / Carousel =====
  "prod.view": "查看",
  "prod.addToCart": "加入購物車",

  // Product page
  "pd.loading": "載入中…",
  "pd.addToCart": "加入購物車",
  "pd.other": "其他推薦產品",
  "pd.desc": "商品介紹",

  // Product toast
  "pd.toast.added": "已加入購物車：",
  "pd.toast.qty": "數量",
  "pd.toast.close": "關閉",

  // Carousel a11y
  "carousel.prev": "上一個",
  "carousel.next": "下一個",

  // ===== Checkout (co.*) =====
  "co.contact": "聯絡資訊",
  "co.email": "Email",
  "co.recipient": "收件人",
  "co.name": "姓名",
  "co.phone": "電話",
  "co.wechatOpt": "WeChat（選填）",
  "co.otherContact": "其他聯絡資訊",
  "co.deliveryArea": "外送地區",
  "co.addrPlaceholder": "地址（街道、門牌、城市、郵遞區號）",
  "co.paymentMethod": "付款方式",
  "co.payHint": "付款方式將由客服提供匯款資訊。",
  "co.tax": "稅金",
  "co.freeOver": "滿",
  "co.freeShipping": "免運",
  "co.creating": "建立訂單中…",
  "co.placeOrder": "確認下單",

  // Checkout alerts
  "co.alert.empty": "購物車為空",
  "co.alert.fillBasic": "請填寫姓名、電話、Email",
  "co.alert.choosePay": "請選擇付款方式",
  "co.alert.chooseArea": "請選擇外送地區",
  "co.alert.fullAddr": "請輸入詳細地址",
  "co.alert.min80": "訂單金額需達 CA$80 才能配送",
  "co.alert.noWoo": "WooCommerce 無回應",
  "co.alert.failed": "下單失敗：",
  "co.alert.error": "發生錯誤，請稍後再試。",

  // Checkout areas
  "co.area.vancouver":
    "溫哥華市（含西區、東區、UBC）— 不含 Downtown、North Van",
  "co.area.burnaby": "本拿比（Burnaby）",
  "co.area.surrey": "White Rock / 南素里 / 北素里",
  "home.cat.all": "全部",
  // ==== Home (categories, UI) ====
"home.cat.snacks": "小吃",
"home.cat.soups": "湯品",
"home.cat.noodleSoups": "湯麵",
"home.cat.hotPot": "火鍋",
"home.cat.friedRice": "炒飯",
"home.cat.desserts": "甜品",
"home.cat.beverages": "飲品",
"home.cat.ready": "馬上即享",
"home.loading": "載入商品中…",
"home.noMatch": "沒有符合的產品",
"home.prev": "上一頁",
"home.next": "下一頁",
"home.details": "產品資訊",
"pd.thisProduct": "本商品",
"hp.error": "載入失敗：",
"hp.empty": "暫無其他商品",
"hp.leftNote": "季節限定",
"hp.rightNote": "職人拉格",
"home.bannerAlt": "首頁橫幅",
"cart.items": "件",
"ty.title": "感謝您的訂購！",
"ty.subtitle": "我們已收到您的訂單，將盡快為您處理。",
"ty.missingId": "缺少訂單編號",
"ty.error": "讀取訂單失敗",
"ty.orderInfo": "訂單資訊",
"ty.orderNo": "訂單編號",
"ty.orderDate": "下單日期",
"ty.payment": "付款方式",
"ty.total": "總金額",
"ty.recipientInfo": "收件資訊",
"ty.items": "商品清單",
"ty.qty": "數量",
"ty.noItems": "無商品資料",
"ty.orderTotal": "訂單總計",
"ty.loading": "讀取中…",
"ty.contact": "若有任何問題，請隨時聯絡我們的客服。",
"ty.backHome": "首頁",
"ty.viewMore": "瀏覽更多商品。",
  
};

const dictMap: Record<string, Dict> = { en, cn };

export function useT() {
  const { locale } = useRouter();
  const dict = dictMap[locale ?? "en"] ?? en;
  return (key: string, fallback?: string) => dict[key] ?? fallback ?? key;
}
