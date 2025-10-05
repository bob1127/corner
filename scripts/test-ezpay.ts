import axios from "axios";
import qs from "qs";

const HASH_KEY = "EVzPWdQgju7kNFeByoOUuYdxCxayLD46";
const HASH_IV = "CQlLg7x2WQmVoDZP";

const generateCheckMacValue = (params: Record<string, string>): string => {
  const query = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const raw = `HashKey=${HASH_KEY}&${query}&HashIV=${HASH_IV}`;
  const encoded = encodeURIComponent(raw).toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%21/g, "!")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2a/g, "*");
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(encoded).digest("hex").toUpperCase();
};

(async () => {
  const payload = {
    RespondType: "JSON",
    Version: "1.4",
    TimeStamp: `${Math.floor(Date.now() / 1000)}`,
    TransNum: "",
    MerchantOrderNo: "INVTEST20250716A",
    Status: "1",
    Category: "B2C",
    BuyerName: "測試人員",
    PrintFlag: "Y",
    TaxType: "1",
    TaxRate: "5",
    Amt: "100",
    TaxAmt: "5",
    TotalAmt: "105",
    ItemName: "測試商品",
    ItemCount: "1",
    ItemUnit: "個",
    ItemPrice: "100",
    ItemAmt: "100",
    Comment: "測試開立發票",
    MerchantID: "你的 MerchantID"
  };

  const checkMacValue = generateCheckMacValue(payload);
  const form = {
    ...payload,
    CheckMacValue: checkMacValue
  };

  const res = await axios.post(
    "https://cinv.ezpay.com.tw/Api_invoice_issue",
    qs.stringify(form),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }
  );

  console.log("回傳結果：", res.data);
})();
