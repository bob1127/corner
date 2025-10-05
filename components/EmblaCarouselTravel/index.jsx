import React from "react";
import EmblaCarousel from "./EmblaCarousel";
import Header from "./Header";
import Footer from "./Footer";

const OPTIONS = { dragFree: true, loop: true };

// Define an array of slide objects with iframe content
const SLIDES = [
  {
    image: "/images/去背/割包.png",
    title: "台灣傳統割包",
    description:
      "鬆軟白饅頭夾著滷得入味的五花肉，花生粉與酸菜點綴，鹹甜酸香一次到位，台式經典手握美味。",
  },
  {
    image: "/images/去背/麥仔煎.png",
    title: "純香濃郁麥仔煎",
    description:
      "外層金黃香酥，裡頭包著濃濃麥香與鹹甜交織的滋味，一口咬下是老台灣的溫暖記憶。",
  },
  {
    image: "/images/去背/胡椒餅.png",
    title: "胡椒餅",
    description:
      "炭火烘烤的焦脆餅皮，鎖住滿滿肉汁與胡椒香，熱騰騰咬下去，爆出的是鹹香與熱辣的痛快。",
  },
  {
    image: "/images/去背/割包.png",
    title: "台灣傳統割包",
    description:
      "鬆軟白饅頭夾著滷得入味的五花肉，花生粉與酸菜點綴，鹹甜酸香一次到位，台式經典手握美味。",
  },
  {
    image: "/images/去背/麥仔煎.png",
    title: "純香濃郁麥仔煎",
    description:
      "外層金黃香酥，裡頭包著濃濃麥香與鹹甜交織的滋味，一口咬下是老台灣的溫暖記憶。",
  },
  {
    image: "/images/去背/胡椒餅.png",
    title: "胡椒餅",
    description:
      "炭火烘烤的焦脆餅皮，鎖住滿滿肉汁與胡椒香，熱騰騰咬下去，爆出的是鹹香與熱辣的痛快。",
  },
];

const App = () => (
  <>
    {/* Uncomment the lines below if you have header and footer components */}
    {/* <Header /> */}
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    {/* <Footer /> */}
  </>
);

export default App;
