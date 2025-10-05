
"use client"
import { useEffect } from "react";
import { useState } from "react";
import './Carousel.css'
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import  Image  from "next/image";
const myLoader03 = ({ src, width, quality, placeholder }) => {
    return `https://new-design.jp/imgs/index/${src}?w=${width}?p=${placeholder}`
}

const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.dot-st.com/static/docs/nikoand/pages/2022_city_creek_v2/assets/images/${src}?w=${width}?p=${placeholder}`
}

const textAnimate = {
    offscreen: { y: 100, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 1
        }
    }

}
function Carousel({ images}) {
    const [current, setCurrent] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    let timeOut = null;

    useEffect(() => {
        timeOut =
            autoPlay &&
            setTimeout(() => {
                slideRight();
            }, 4500);
    });

    const slideRight = () => {
        setCurrent(current === images.length - 1 ? 0 : current + 1);
    };

    const slideLeft = () => {
        setCurrent(current === 0 ? images.length - 1 : current - 1);
    };
    console.log(current);
    return (
        <div
            className="carousel w-full  h-[310px] md:h-[800px] 2xl:h-[868px] relative"
            onMouseEnter={() => {
                setAutoPlay(false);
                clearTimeout(timeOut);
            }}
            onMouseLeave={() => {
                setAutoPlay(true);
            }}
        >
            <div className="rightUi">
                
            </div>
           
            <div className="carousel_wrapper  ">
                
              
              
                <div className="carousel_arrow_left" onClick={slideLeft}>
                    &lsaquo;
                </div>
                <div className="carousel_arrow_right" onClick={slideRight}>
                    &rsaquo;
                </div>
                <div className="carousel_pagination">
                    
                  
                </div>
            </div>
        </div>
    );
}

export default Carousel;
