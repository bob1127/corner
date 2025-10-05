"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Import required Swiper modules
import { Thumbs } from "swiper";

// Function to generate a random image URL
const generateRandomImage = (width = 500, height = 500) => {
  return `https://picsum.photos/${width}/${height}?random=${Math.floor(
    Math.random() * 1000
  )}`;
};

const ThumbnailSlider = ({ images = [] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    // Generate an array of random image URLs when the component mounts
    const randomImagesArray = Array.from({ length: 5 }, () =>
      generateRandomImage(500, 500)
    );
    setRandomImages(randomImagesArray);
  }, []);

  // Fallback to random images if none are provided
  const imagesToDisplay = images.length > 0 ? images : randomImages;

  if (!imagesToDisplay || imagesToDisplay.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 flex flex-col gap-4">
      {/* Main Slider */}
      <div className="w-full h-96">
        <Swiper
          className="h-full"
          grabCursor={true}
          loop={true}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }} // Link the main slider with the thumbs swiper
        >
          {imagesToDisplay.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`slide-${index}`}
                  fill
                  className="object-cover"
                  sizes="70vw"
                  priority={index === 0} // Load the first image with priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Slider */}
      <div className="relative flex justify-center">
        <Swiper
          className="w-full h-14"
          loop={true}
          slidesPerView={4} // Show 4 thumbnails at a time
          spaceBetween={8} // Space between thumbnails
          onSwiper={setThumbsSwiper} // Update thumbsSwiper reference when Swiper is initialized
          freeMode={true} // Enable smooth sliding without snapping
          watchSlidesProgress={true} // Sync with main slider as thumbnails are clicked
        >
          {imagesToDisplay.map((image, index) => (
            <SwiperSlide
              key={index}
              className="cursor-pointer rounded-md border-2 border-transparent hover:border-gray-400"
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`thumbnail-${index}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ThumbnailSlider;
