import React from "react";
import EmblaCarousel from "./EmblaCarousel";
import Header from "./Header";
import Footer from "./Footer";

const OPTIONS = { dragFree: true, loop: true };

// Define an array of slide objects with iframe content
const SLIDES = [
  {
    image: "https://bearbrick.audio/assets/rear-1e018b36.png",
    title: "Fourth Slide",
    description: "Description for the fourth slide.",
  },
  {
    image: "https://bearbrick.audio/assets/rear-1e018b36.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "https://bearbrick.audio/assets/rear-1e018b36.png",
    title: "Third Slide",
    description: "Description for the third slide.",
  },
  {
    image: "https://bearbrick.audio/assets/rear-1e018b36.png",
    title: "Fourth Slide",
    description: "Description for the fourth slide.",
  },
  {
    image: "https://bearbrick.audio/assets/rear-1e018b36.png",
    title: "Fifth Slide",
    description: "Description for the fifth slide.",
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
