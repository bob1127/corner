// scripts/fetchPlans.js
const fs = require("fs");
const fetch = require("node-fetch");

async function main() {
  const res = await fetch("https://www.wmesim.com/api/esim/plans");
  const plans = await res.json();

  const map = {};

  for (const p of plans) {
    if (p.channel_dataplan_name && p.channel_dataplan_id) {
      const cleanedKey = p.channel_dataplan_name
        .trim()
        .replace(/\u200B/g, "") // 移除 Zero-Width Space
        .replace(/,/g, "-")      // 將逗號換成 -
        .replace(/\s+/g, "-")    // 將空格換成 -
        .replace(/-+/g, "-");    // 合併多個 -

      map[cleanedKey] = p.channel_dataplan_id;
    }
  }

  const content =
    "// ⚠️ 自動生成，勿手動編輯\n" +
    "const PLAN_ID_MAP: Record<string, string> = " +
    JSON.stringify(map, null, 2) +
    ";\n\nexport default PLAN_ID_MAP;\n";

  fs.writeFileSync("lib/esim/planMap.ts", content);
  console.log("✅ 已成功產出 lib/esim/planMap.ts");
}

main().catch(console.error);
