import React from "react";
import EmblaCarousel from "./EmblaCarousel";
import Header from "./Header";
import Footer from "./Footer";

const OPTIONS = { dragFree: true, loop: true };

// Define an array of slide objects with iframe content
const SLIDES = [
  {
    image: "/images/japan.jpg", // Image for the first slide
    title: "JAPAN",
    description: "",
  },
  {
    image: "/images/japan.jpg", // Image for the first slide
    title: "JAPAN",
    description: "",
  },
  {
    image: "/images/japan.jpg", // Image for the first slide
    title: "JAPAN",
    description: "",
  },
  {
    image: "/images/japan.jpg", // Image for the first slide
    title: "JAPAN",
    description: "",
  },
  {
    image: "/images/japan.jpg", // Image for the first slide
    title: "JAPAN",
    description: "",
  },
  {
    image: "/images/japan.jpg", // Image for the first slide
    title: "JAPAN",
    description: "",
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
