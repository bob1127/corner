import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.css';
import Image from 'next/image';

export default function ImageSlider() {
    const settings = {
        autoplay: true,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 3,
        // autoplay: true,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 730,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
      
    };
    return (
        <div className="">
            <Slider {...settings} className=' '>
                <div className=' '>
                     <img src="https://store.nissin.com/cdn/shop/files/kzm_deli_1080x1080_2_38f096ee-107e-4b38-b36e-0b768af75afe_1000x.png"  className='w-full ' alt="" />
                  
                </div>
                  <div className=' '>
                     <img src="https://store.nissin.com/cdn/shop/files/WEB_1000x.jpg?v=1711929380"  className='w-full ' alt="" />
                  
                </div>
                   <div className=' '>
                     <img src="https://www.beams.co.jp/special/befes/2022/assets/images/city/tokyo/shop_"  className='w-full ' alt="" />
                  
                </div>
               
            </Slider>
        </div>
    );
}
