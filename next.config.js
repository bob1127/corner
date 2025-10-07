// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "inf.fjg.mybluehost.me", pathname: "/**" },
      { protocol: "https", hostname: "i0.wp.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  trailingSlash: true,

  // ✅ 開啟 i18n，預設英文；網址會是 /en 與 /cn
  i18n: {
    locales: ["en", "cn"],
    defaultLocale: "en",
    localeDetection: false, // 我們自己控制（避免自動跳轉）
  },

  webpackDevMiddleware: (config) => {
    config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    return config;
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: ["babel-loader", "babel-plugin-glsl"],
    });
    return config;
  },
};
