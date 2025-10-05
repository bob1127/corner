import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const myLoader = ({ src, width, quality, placeholder }) => {
  return `https://www.zensor.com.tw/images//Products-Detail-Img/ECWP/${src}?w=${width}&p=${placeholder}`;
};

const Listing = ({ data, open }) => {
  // Check if data is defined first
  if (!data) return null; // or handle gracefully

  const { imageUrl, price, address, immageAlt, numBedroom, numWashrooms, livingSpace } = data;

  return (
    <motion.div className="listing" onClick={open} whileHover={{ scale: 1.1 }}>
      <div className="listing__content">
        <div className="listing__image-container">
            sdfisfiodshfioh
          <Image
            width={600}
            height={400}
            loader={myLoader}
            className="listing__image"
            alt={immageAlt}
            src={imageUrl}
            loading="lazy"
            placeholder="empty"
          />
        </div>
        <div className="listing__details">
          <div className="listing__type bg-orange-500 text-black">For Sale</div>
          <div className="listing__row">
            <p className="listing__price">{price}</p>
          </div>
          <div className="listing__row">
            <span className="text-left w-[90%]   listing__address">{address}</span>
          </div>
          {/* Uncomment when data is properly structured */}
          {/* <div className="listing__row">
            <Feature iconName={"FaBed"} iconLabel={numBedroom} />
            <Feature iconName={"FaShower"} iconLabel={numWashrooms} />
            <Feature iconName={"FaRuler"} iconLabel={livingSpace} />
          </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default Listing;
