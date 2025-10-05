import React from "react";
import EmblaCarousel from "./EmblaCarousel";
import Header from "./Header";
import Footer from "./Footer";

const OPTIONS = { dragFree: true, loop: true };

// Define an array of slide objects with iframe content
const SLIDES = [
  {
    image: "/images/IMG_5587.jpg",
    title: "Fourth Slide",
    description: "Description for the fourth slide.",
  },
  {
    image: "/images/截圖-2024-12-05-晚上9.47.11.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/截圖-2024-12-05-晚上9.46.54.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/截圖-2024-12-05-晚上9.47.32.png",
    title: "Fourth Slide",
    description: "Description for the fourth slide.",
  },
  {
    image: "/images/截圖-2024-12-05-晚上9.47.11.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "/images/截圖-2024-12-05-晚上9.46.54.png",
    title: "Third Slide",
    description: "Description for the third slide.",
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
