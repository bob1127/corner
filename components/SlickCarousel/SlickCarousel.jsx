import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Styles from "./slick.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.globalwork.jp//static/pages/women/2023aw_lightwarm_outerseries/assets/images/${src}?w=${width}&p=${placeholder}`;
};

const myLoader02 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/carousel-img/1024x576/${src}?w=${width}&p=${placeholder}`;
};

const myLoader03 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/carousel-img/640x640/${src}?w=${width}&p=${placeholder}`;
};

class ImageGalleryComponent extends React.Component {
    render() {
        return (
            <div className="  relative">
                 <div className="txt-wrap z-[99999] flex flex-col justify-center items-center absolute left-[0%] bottom-[15%]">
                <h3 className="text-[40px] font-normal text-[#fe5426]">LIGHT WARM</h3>
                <p className="text-[16px] font-bold text-center text-[#fe5426]">輕薄、保暖、可機洗。</p>
                 <h3 className="text-[40px] font-normal text-[#fe5426]">OUTER</h3>
                 <a href="" className="border-white border-2 rounded-[30px] w-[100px] text-white text-center">Series</a>
                 <p className="text-[13px] w-2/3 mt-5 text-white text-center">本產品採用了獨特開發的「Air Thermal®」隔熱材質，具有輕薄、耐穿、保暖三大要素。</p>
             </div>
                <Carousel
                    infiniteLoop
                    transitionTime={500}
                    showArrows={false} // hide arrows
                    showThumbs={false} // hide dots
                     showDots={false} // hide dots
                    autoPlay // enable autoplay
                    interval={3000} // autoplay interval in milliseconds
                    stopOnLastSlide={true} // continue looping when reaching the last slide
                    className=""
                >
                    <div>
                        <Image
                            className="hidden"
                            loader={myLoader}
                            loading='eager'
                            alt='Why choose calibration-free micro disposable pH electrode/Humming Probe for pH value detection?'
                            priority={true}
                            width={1920}
                            height={768}
                            src='bg_kv_05_sp.jpg'
                        />
                    </div>
                    <div>
                        <Image
                            className="hidden"
                            loader={myLoader}
                            loading='eager'
                            alt='Why choose calibration-free micro disposable pH electrode/Humming Probe for pH value detection?'
                            priority={true}
                            width={1920}
                            height={768}
                            src='bg_kv_04.jpg'
                        />
                    </div>
                    <div>
                        <Image
                            className="hidden"
                            loader={myLoader}
                            loading='eager'
                            alt='Why choose calibration-free micro disposable pH electrode/Humming Probe for pH value detection?'
                            priority={true}
                            width={1920}
                            height={768}
                            src='bg_kv_06.jpg'
                        />
                    </div>
                </Carousel>
            </div>
        );
    }
}

export default ImageGalleryComponent;
