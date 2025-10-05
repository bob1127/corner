import React, { useEffect, useState } from "react";
import Swipe from "react-easy-swipe";
import "./index.css";
import Image from "next/image";
import ExportedImage from "next-image-export-optimizer";
import { motion } from "framer-motion";
// import fetch from "isomorphic-unfetch";
import Link from "next/link";
// import ModalBrn from "../../components/ModalBtn.jsx"
import ModalBtn from "../../components/ModalBtn-2.jsx"

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

        <div className="flex justify-center items-center">


            <div style={style} className="px-5 flex w-[80%] md:w-full  box overflow-hidden justify-center  py-20  flex-col md:flex-row ">

                <div

                    className="section-right  pl-5 md:pl-20"

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

                           


                            className="carousel-container "
                            style={{
                                height: height ? height : "400px",

                                height: height ? height : "400px",

                                borderRadius: radius,
                            }}
                        >
                            {data.map((item, index) => {
                                return (
                                    <div
                                        className="carousel-item fade "
                                        // style={{
                                        //     maxWidth: width ? width : "600px",
                                        //     maxHeight: height ? height : "600px",
                                        // }}
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

                                        <Image placeholder="empty" loading='eager' alt={item.caption} priority={true} src={item.image} width={400} height={400} style={{
                                            borderRadius: radius,
                                            objectFit: slideImageFit ? slideImageFit : "cover",
                                        }} className="carousel-image" />



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
                <div className="mobile-div block md:hidden mb-4">

                    {thumbnails && (
                        <div
                            className="thumbnails"

                            style={{ maxWidth: width }}
                        >
                            {data.map((item, index) => {
                                return (



                                    <Image

                                        height={100}
                                        priority={true}
                                        placeholder="empty"
                                        loading='eager' 
                                      
                                        width={100}
                                        src={item.image}
                                        alt={item.caption}
                                        className="thumbnail"
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

                <div className="section-left px-0 md:px-10 flex justify-between flex-col">

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
                            <motion.h1 className="text-[26px] text-[#333333]  font-black leading-[31px]" variants={fadeInUp}>      極安簡測-胃幽門桿菌尿素呼氣檢測系統<br></br> <p className="text-[24px] text-orange-500 font-bold ">(UBT-Pro)</p>
                            </motion.h1>
                            <motion.p className="dark: text-slate-300 " variants={fadeInUp}>


                                <ul className="mt-6 ml-0 pl-0">
                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・非侵入檢測方式</li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・30分鐘立即獲得檢測成果</li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2"> ・可用於評估治療前後效果</li>
                                    <li className="text-m font-normal dark:text-white text-black mt-2">   ・自動判讀檢測成果</li>
                                </ul>
                                {/* <CelebrateBTN/> */}


                                <div className="btn-wrap">
                                    <ModalBtn/>
                                </div>






                            </motion.p>

                            <motion.div variants={fadeInUp} className='btn-row'>


                            </motion.div>

                        </motion.div>


                    </motion.div>






                    {thumbnails && (
                        <div
                            className="thumbnails hidden md:block"
                            id="thumbnail-div"
                            style={{ maxWidth: width }}
                        >
                            {data.map((item, index) => {
                                return (



                                    <Image

                                        height={100}
                                        loading='eager' 
                                        priority={true}
                                        placeholder="empty"
                                        width={100}
                                        src={item.image}
                                        alt={item.caption}
                                        className="thumbnail"
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
