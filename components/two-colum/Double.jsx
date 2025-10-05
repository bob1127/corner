"use client";
import styles from "./style.module.scss";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";

const myLoader00 = ({ src, width, quality, placeholder }) => {
  return `https://www.nikoand.jp/wp-content/uploads/2023/10/${src}?w=${width}?p=${placeholder}`;
};
const myLoader01 = ({ src, width, quality, placeholder }) => {
  return `https://www.nikoand.jp/wp-content/uploads/2023/09/${src}?w=${width}?p=${placeholder}`;
};
const myLoader02 = ({ src, width, quality, placeholder }) => {
  return `https://www.nikoand.jp/wp-content/uploads/2024/05/${src}?w=${width}?p=${placeholder}`;
};
export default function Index({ projects, reversed }) {
  const firstImage = useRef(null);
  const secondImage = useRef(null);
  let requestAnimationFrameId = null;
  let xPercent = reversed ? 100 : 0;
  let currentXPercent = reversed ? 100 : 0;
  const speed = 0.15;

  const manageMouseMove = (e) => {
    const { clientX } = e;
    xPercent = (clientX / window.innerWidth) * 100;

    if (!requestAnimationFrameId) {
      requestAnimationFrameId = window.requestAnimationFrame(animate);
    }
  };

  const animate = () => {
    //Add easing to the animation
    const xPercentDelta = xPercent - currentXPercent;
    currentXPercent = currentXPercent + xPercentDelta * speed;

    //Change width of images between 33.33% and 66.66% based on cursor
    const firstImagePercent = 66 - currentXPercent * 0.33;
    const secondImagePercent = 33 + currentXPercent * 0.33;
    console.log(secondImagePercent);
    firstImage.current.style.width = `${firstImagePercent}%`;
    secondImage.current.style.width = `${secondImagePercent}%`;

    if (Math.round(xPercent) == Math.round(currentXPercent)) {
      window.cancelAnimationFrame(requestAnimationFrameId);
      requestAnimationFrameId = null;
    } else {
      window.requestAnimationFrame(animate);
    }
  };

  return (
    <div
      onMouseMove={(e) => {
        manageMouseMove(e);
      }}
      className="p-[15px] lg:p-[40px] flex flex-col md:flex-row border-2 w-full border-red"
    >
      <div className="txt w-full  md:w-[50%] p-[15px]  lg:p-8">
        <div className="border-2 border-green-400">
          <h1 className="text-black text-[40px]">特價商品，現實搶購 </h1>
          <p className="mt-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem,
            neque alias voluptates aliquam vitae officia fuga repudiandae fugit
            explicabo, nobis tempora ratione nulla maiores fugiat sit illum
            nihil iste temporibus.
          </p>

          {/* <div className='border-2 p-4 border-black rounded-xl '>
                    
                     <div className='mt-4'>
                       
                        <Image quality={100} className='rounded-[10px]' loader={myLoader02}  placeholder="empty" loading="lazy" alt="running people" src='/逕ｻ蜒十24FW_NK_Minions_banner_02_NK0012008_F6jpg.jpg' width={1000} height={400}  />
                          
                     </div>
                  </div> */}
        </div>
      </div>

      <div ref={firstImage} className={styles.imageContainer}>
        <div className="mx-auto flex flex-row justify-center items-center border"></div>
        <div className={styles.stretchyWrapper}>
          <Link className="w-full border border-white" href="/UltraE">
            {/* <Image
                        loading='lazy'
                        src={`/images/${projects[0].src}`}
                        fill={true}
                        alt={"image"}
                    /> */}

            <Image
              quality={100}
              loader={myLoader00}
              placeholder="empty"
              loading="lazy"
              alt="running people"
              src="/1080ﾃ・080_01-1.jpg"
              width={1000}
              height={400}
              className=""
            />
          </Link>
        </div>
      </div>

      <div ref={secondImage} className={styles.imageContainer}>
        <div className="mx-auto flex flex-row justify-center items-center border"></div>
        <div className={styles.stretchyWrapper}>
          <Link className="w-full border border-white" href="/UltraE">
            <p></p>

            <Image
              quality={100}
              loader={myLoader01}
              placeholder="empty"
              loading="lazy"
              alt="running people"
              src="/23SS_NK_TOKYOUNITE_esports_04_NK0011708_F.jpg"
              width={1000}
              height={400}
              className=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
