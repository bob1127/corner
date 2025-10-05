const crypto = require("crypto");
const qs = require("querystring");

// ✅ 這是正確寫法，不要用 hex！
const HASH_KEY = Buffer.from("FnDByoo3m9U4nVi29UciIbAHVQRQogHG", "utf8");
const HASH_IV = Buffer.from("PtgsjF33nlm8q2kC", "utf8");

function padPKCS7(str) {
  const blockSize = 32;
  const pad = blockSize - (Buffer.byteLength(str, "utf8") % blockSize);
  return str + String.fromCharCode(pad).repeat(pad);
}

function encryptToHex(paddedStr, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.setAutoPadding(false);
  return cipher.update(paddedStr, "utf8", "hex") + cipher.final("hex");
}

const data = {
  RespondType: "JSON",
  Version: "1.5",
  TimeStamp: Math.floor(Date.now() / 1000).toString(),
  MerchantOrderNo: "TEST20250725001",
  Status: "1",
  Category: "B2C",
  BuyerName: "測試客戶",
  BuyerEmail: "test@example.com",
  PrintFlag: "Y",
  TaxType: "1",
  TaxRate: 5,
  Amt: 100,
  TaxAmt: 5,
  TotalAmt: 105,
  ItemName: "商品一|商品二",
  ItemCount: "1|2",
  ItemUnit: "個|個",
  ItemPrice: "50|25",
  ItemAmt: "50|50",
  Comment: "測試發票",
};

const postDataStr = qs.stringify(data, null, null, {
  encodeURIComponent: (str) => str,
});

const padded = padPKCS7(postDataStr);
const encryptedHex = encryptToHex(padded, HASH_KEY, HASH_IV);

console.log("✅ PostData_ (hex):\n", encryptedHex);
