const crypto = require("crypto");
const qs = require("querystring");

const HASH_KEY = "OVB4Xd2HgieiLJJcj5RMx9W94sMKgHQx";
const HASH_IV = "PKetlaZYZcZvlMmC";

const tradeInfoObj = {
  MerchantID: "MS12345678",
  Amt: "100",
  ItemDesc: "測試商品",
  MerchantOrderNo: "TEST123456789",
  RespondType: "JSON",
  TimeStamp: Math.floor(Date.now() / 1000).toString(),
  Version: "1.5",
  Email: "test@example.com",
  LoginType: "0",
};

const tradeInfoQuery = qs.stringify(tradeInfoObj);

function encryptAES(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

const encryptedTradeInfo = encryptAES(tradeInfoQuery, HASH_KEY, HASH_IV);

console.log("\n🔐 加密後的 TradeInfo（貼到 callback 測試用）：\n");
console.log(encryptedTradeInfo);

console.log("\n✅ curl 測試指令（可直接複製貼上）：\n");
console.log(`curl -X POST http://localhost:3000/api/newebpay-callback \\
  -H "Content-Type: application/json" \\
  -d '{"TradeInfo":"${encryptedTradeInfo}"}'`);
