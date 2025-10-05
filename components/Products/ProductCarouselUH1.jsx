import React, { useEffect, useState } from "react";
import Swipe from "react-easy-swipe";
import "./index.css";
import Image from "next/image";
import ExportedImage from "next-image-export-optimizer";
import { motion } from "framer-motion";
// import fetch from "isomorphic-unfetch";
import Link from "next/link";
// import ModalBrn from "../../components/ModalBtn.jsx"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";


const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-1/${src}?w=${width}?p=${placeholder}`
}
// const myLoader01 = ({ src, width, quality, placeholder }) => {
//     return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/${src}?w=${width}?p=${placeholder}`
// }
const textAnimate = {
    offscreen: { y: 100, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: 1
        }
    }

}
const title01 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: 1.4,
            delay: 0,
        }
    }

}
const title02 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: 1.4,
            delay: .3,
        }
    }

}
const title03 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: 1,
            delay: .9,
        }
    }

}

const card01
    = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: .8,
            delay: 0,
        }
    }

}
const card02 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: .8,
            delay: .3,
        }
    }

}
const card03 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: .8,
            delay: .6,
        }
    }

}
const card04 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: .8,
            delay: .9,
        }
    }

}
const card05 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: .8,
            delay: 1.2,
        }
    }

}
const card06 = {
    offscreen: { y: 150, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: .8,
            delay: 1.5,
        }
    }

}
const ImageAnimate = {
    offscreen: { y: 200, opacity: 0 },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: "FadeUp",
            bounce: 0.4,
            duration: 1.4,
            delay: 0.5,
        }
    }

}

const gallery = [
    { id: 1, imgUrl: "/images/Bed-1.webp" },
    { id: 2, imgUrl: "/images/Bed-2.webp" },
    { id: 3, imgUrl: "/images/Bed-3.webp" },
    { id: 4, imgUrl: "/images/Oak.webp" },
];



let easing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

const fadeInUp = {
    initial: {
        y: 60,
        opacity: 0,
        transition: { duration: 0.6, ease: easing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easing
        }
    }
};



function Carousel({
    data,
    time,
    width,
    height,
    captionStyle,
    slideNumberStyle,
    radius,
    slideNumber,
    style,
    captionPosition,
    dots,
    automatic,
    pauseIconColor,
    pauseIconSize,
    slideBackgroundColor,
    slideImageFit,
    thumbnails,
    thumbnailWidth,
    showNavBtn = true,
}) {
    //Initialize States
    const [slide, setSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [change, setChange] = useState(0);

    //Function to change slide
    const addSlide = (n) => {
        if (slide + n >= data.length) setSlide(0);
        else if (slide + n < 0) setSlide(data.length - 1);
        else setSlide(slide + n);
    };

    //Start the automatic change of slide
    // useEffect(() => {
    //     if (automatic) {
    //         var index = slide;
    //         const interval = setInterval(
    //             () => {
    //                 if (!isPaused) {
    //                     setSlide(index);
    //                     index++;
    //                     if (index >= data.length) index = 0;
    //                     if (index < 0) index = data.length - 1;
    //                 }
    //             },
    //             time ? time : 2000
    //         );
    //         return () => {
    //             clearInterval(interval);
    //         };
    //     }
    // }, [isPaused, change]);

    function scrollTo(el) {
        const elLeft = el.offsetLeft + el.offsetWidth;
        const elParentLeft = el.parentNode.offsetLeft + el.parentNode.offsetWidth;

        // check if element not in view
        if (elLeft >= elParentLeft + el.parentNode.scrollLeft) {
            el.parentNode.scroll({ left: elLeft - elParentLeft, behavior: "smooth" });
        } else if (elLeft <= el.parentNode.offsetLeft + el.parentNode.scrollLeft) {
            el.parentNode.scroll({
                left: el.offsetLeft - el.parentNode.offsetLeft,
                behavior: "smooth",
            });
        }
    }

    //Listens to slide state changes
    useEffect(() => {
        var slides = document.getElementsByClassName("carousel-item");
        var dots = document.getElementsByClassName("dot");

        var slideIndex = slide;
        var i;
        for (i = 0; i < data.length; i++) {
            slides[i].style.display = "none";
        }
        // for (i = 0; i < dots.length; i++) {
        //     dots[i].className = dots[i].className.replace(" active", "");
        // }
        //If thumbnails are enabled
        if (thumbnails) {
            var thumbnailsArray = document.getElementsByClassName("thumbnail");
            for (i = 0; i < thumbnailsArray.length; i++) {
                thumbnailsArray[i].className = thumbnailsArray[i].className.replace(
                    " active-thumbnail",
                    ""
                );
            }
            if (thumbnailsArray[slideIndex] !== undefined)
                thumbnailsArray[slideIndex].className += " active-thumbnail";
            scrollTo(document.getElementById(`thumbnail-${slideIndex}`));
        }

        if (slides[slideIndex] !== undefined)
            slides[slideIndex].style.display = "block";
        if (dots[slideIndex] !== undefined) dots[slideIndex].className += " active";
    }, [slide, isPaused]);

    return (

        <div className="flex  justify-center mx-auto items-center">


            <div style={style} className="px-0 md:px-5 mx-auto flex w-[100%] md:w-full  box overflow-hidden justify-start  py-20 items-start flex-col md:flex-row ">

                <div className="top-div flex justify-center items-center flex-col">
                    <div

                        className="section-right h-auto px-0 overflow-hidden md:px-[20px]  w-full  "

                    >

                        <Swipe
                            onSwipeRight={() => {
                                addSlide(-1);
                                setChange(!change);
                            }}
                            onSwipeLeft={() => {
                                addSlide(1);
                                setChange(!change);
                            }}
                        >
                            <div
                                className="carousel-container w-full "
                                style={{
                                    height: height ? height : "auto",

                                    height: height ? height : "auto",

                                    borderRadius: radius,
                                }}
                            >
                                {data.map((item, index) => {
                                    return (
                                        <div
                                            className="carousel-item fade mx-auto"
                                            style={{
                                                maxWidth: width ? width : "450px",
                                                maxHeight: height ? height : "450px",
                                            }}
                                            onMouseDown={(e) => {
                                                automatic && setIsPaused(true);
                                            }}
                                            onMouseUp={(e) => {
                                                automatic && setIsPaused(false);
                                            }}
                                            onMouseLeave={(e) => {
                                                automatic && setIsPaused(false);
                                            }}
                                            onTouchStart={(e) => {
                                                automatic && setIsPaused(true);
                                            }}
                                            onTouchEnd={(e) => {
                                                automatic && setIsPaused(false);
                                            }}
                                            key={index}
                                        >
                                            {slideNumber && (
                                                <div className="slide-number" style={slideNumberStyle}>
                                                    {index + 1} / {data.length}
                                                </div>
                                            )}

                                            <Image loader={myLoader} alt={item.caption} src={item.image} width={400} height={400}
                                                loading="eager"

                                                priority={true}
                                                className="carousel-image mx-auto  border rounded-[15px]" />



                                            {isPaused && (
                                                <div
                                                    className="pause-icon pause"
                                                    style={{
                                                        color: pauseIconColor ? pauseIconColor : "white",
                                                        fontSize: pauseIconSize ? pauseIconSize : "40px",
                                                    }}
                                                >
                                                    II
                                                </div>
                                            )}
                                            <div
                                                className={`carousel-caption-${captionPosition ? captionPosition : "bottom"
                                                    }`}
                                                style={captionStyle}
                                                dangerouslySetInnerHTML={{ __html: item.caption }}
                                            ></div>
                                        </div>
                                    );
                                })}

                                {showNavBtn && (
                                    <a
                                        href="#"
                                        className="prev"
                                        onClick={(e) => {
                                            addSlide(-1);
                                            setChange(!change);
                                        }}
                                    >
                                        {/* 
                                <Image priority fetchpriority='high' alt="running people" src='/right-arrow-2-2_vjn2tt.webp' width={60} height={60} className="hidden md:block" /> */}

                                        ←


                                    </a>
                                )}
                                {showNavBtn && (
                                    <a
                                        className="next"
                                        href="#"
                                        onClick={(e) => {
                                            addSlide(1);
                                            setChange(!change);
                                        }}
                                    >
                                        {/* <Image priority fetchpriority='high' alt="running people" src='/right-arrow-2-2_vjn2tt.webp' width={60} height={60} className="hidden md:block" /> */}
                                        →

                                    </a>
                                )}
                                {dots && (
                                    <div className="dots">
                                        {data.map((item, index) => {
                                            return (
                                                <span
                                                    className="dot"
                                                    key={index}
                                                    onClick={(e) => {
                                                        setSlide(index);
                                                        setChange(!change);
                                                    }}
                                                ></span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Swipe>
                    </div>
                    <div className="bottom-div">
                        {thumbnails && (
                            <div
                                className=" thumbnails hidden md:block"
                                id="thumbnail-div"
                                style={{ maxWidth: width }}
                            >
                                {data.map((item, index) => {
                                    return (




                                        <Image

                                            height={100}
                                            loader={myLoader}
                                            priority={true}
                                            loading="eager"
                                            width={100}
                                            src={item.image}
                                            alt={item.caption}
                                            className="thumbnail rounded-[15px] border"
                                            id={`thumbnail-${index}`}
                                            key={index}
                                            onClick={(e) => {
                                                setSlide(index);
                                                setChange(!change);
                                            }}


                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mobile-div hidden mb-4">

                    {thumbnails && (
                        <div
                            className="thumbnails"

                            style={{ maxWidth: width }}
                        >
                            {data.map((item, index) => {
                                return (



                                    <Image

                                        height={100}
                                        loader={myLoader}
                                        priority={true}
                                        loading="eager"
                                        width={100}
                                        src={item.image}
                                        alt={item.caption}
                                        className="thumbnail border rounded-[15px]"
                                        id={`thumbnail-${index}`}
                                        key={index}
                                        onClick={(e) => {
                                            setSlide(index);
                                            setChange(!change);
                                        }}


                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="section-left w-full md:w-1/2 px-0 md:px-10 flex justify-between flex-col">

                    <motion.div className="dark:bg-black bg-gray-100 " initial='initial' animate='animate' exit={{ opacity: 0 }}>
                        <motion.div variants={stagger} className='inner w-full pr-2'>
                            <Link href='../products'>
                                {/* <motion.div variants={fadeInUp}>
                                Back to products
                            </motion.div> */}
                            </Link>
                            {/* <motion.div variants={fadeInUp}>
                            <span className=' '>Humming Probe UX200</span>
                            <Link href='../Products/product01'>CN</Link>
                        </motion.div> */}
                            <motion.h1 className="text-[26px] text-[#333333]  font-black leading-[31px]" variants={fadeInUp}>  Humming Probe UX200
                                免校正酸鹼檢測儀 <br></br> <p className="text-[24px] text-orange-500 font-bold ">pH計/酸鹼度測定計/pH儀器
                                </p>
                            </motion.h1>
                            <motion.p className="dark: text-slate-300 " variants={fadeInUp}>


                                <ul className="mt-6 ml-0 pl-0">
                                    <p>適用於全系列全球首創的免校正pH酸鹼電極
                                    </p>
                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・4.3”彩色觸控屏幕
                                    </li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・演算法自動終點判斷
                                    </li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・防水防塵等級
                                    </li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2">  ・雙模式檢測片連結器
                                    </li>

                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・500萬畫素鏡頭可記錄原始環境資料

                                    </li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2">  ・背面皮革紋防滑設計

                                    </li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2">  ・三角力學設計活動立架


                                    </li>
                                </ul>
                                {/* <CelebrateBTN/> */}






                            </motion.p>

                            <motion.div variants={fadeInUp} className='btn-row'>


                            </motion.div>

                        </motion.div>


                    </motion.div>








                </div>



            </div>
        </div>
    );
}


// Product.getInitialProps = async function (context) {
//     const { id } = context.query;
//     const res = await fetch(
//         `https://my-json-server.typicode.com/wrongakram/demo/products/${id}`
//     );
//     const product = await res.json();
//     return { product };
// };

export default Carousel;
