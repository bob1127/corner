// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    // 只允許實際用到的遠端圖源；"**" 會失敗，需明確主機
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inf.fjg.mybluehost.me",
        pathname: "/**", // 你的 WP 子目錄與 uploads 會被包含
      },
      {
        protocol: "https",
        hostname: "i0.wp.com", // Jetpack/WordPress.com 圖片 CDN
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"], // 可選：更省流量
  },

  trailingSlash: true,

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
