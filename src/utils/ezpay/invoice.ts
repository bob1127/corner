import crypto from "crypto";
import qs from "querystring";
import axios from "axios";

const EZPAY_MERCHANT_ID = "345049107";
const EZPAY_HASH_KEY = "FnDByoo3m9U4nVi29UciIbAHVQRQogHG";
const EZPAY_HASH_IV = "PtgsjF33nlm8q2kC";
const EZPAY_URL = "https://inv.ezpay.com.tw/Api/invoice_issue";

function padPKCS7(str: string) {
  const blockSize = 32;
  const pad = blockSize - (Buffer.byteLength(str, "utf8") % blockSize);
  return str + String.fromCharCode(pad).repeat(pad);
}

function encryptToHex(paddedStr: string, key: string, iv: string): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );
  cipher.setAutoPadding(false);
  return cipher.update(paddedStr, "utf8", "hex") + cipher.final("hex");
}

export async function issueEzpayInvoice({
  orderNo,
  amount,
  email,
  items,
}: {
  orderNo: string;
  amount: number;
  email: string;
  items: { name: string; qty: number; price: number }[];
}) {
  const now = Math.floor(Date.now() / 1000);

  const itemNames = items.map(i => i.name).join("|");
  const itemCounts = items.map(i => i.qty).join("|");
  const itemPrices = items.map(i => i.price).join("|");
  const itemAmts = items.map(i => i.qty * i.price).join("|");
  const itemUnits = items.map(() => "個").join("|");

  const rawData = {
    RespondType: "JSON",
    Version: "1.5",
    TimeStamp: now.toString(),
    MerchantOrderNo: orderNo,
    Status: "1",
    Category: "B2C",
    BuyerName: "網路顧客",
    BuyerEmail: email,
    PrintFlag: "Y",
    TaxType: "1",
    TaxRate: 5,
    Amt: Math.round(amount / 1.05),
    TaxAmt: Math.round(amount - amount / 1.05),
    TotalAmt: Math.round(amount),
    ItemName: itemNames,
    ItemCount: itemCounts,
    ItemUnit: itemUnits,
    ItemPrice: itemPrices,
    ItemAmt: itemAmts,
    Comment: "自動開立",
  };

function customStringify(obj: Record<string, any>) {
  return Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
}

const queryStr = customStringify(rawData);
const padded = padPKCS7(queryStr);
const encrypted = encryptToHex(padded, EZPAY_HASH_KEY, EZPAY_HASH_IV);


  const res = await axios.post(
    EZPAY_URL,
    new URLSearchParams({
      MerchantID_: EZPAY_MERCHANT_ID,
      PostData_: encrypted,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const responseData = res.data;
  if (responseData.Status === "SUCCESS") {
    const result = JSON.parse(responseData.Result);
    return {
      Status: "SUCCESS",
      InvoiceNumber: result.InvoiceNumber,
      RandomNum: result.RandomNum,
      CheckCode: result.CheckCode,
    };
  }

  return {
    Status: responseData.Status,
    Message: responseData.Message,
  };
}
