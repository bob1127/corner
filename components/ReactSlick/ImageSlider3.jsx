import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.css';
import Image from 'next/image';

export default function ImageSlider() {
    const settings = {
        autoplay: true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
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
                breakpoint: 880,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 670,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
      
    };
    return (
        <div className="image-slider-container pt-3">
            <Slider {...settings} className='  '>
                <div className=' px-1 h-[520px]'>
                    <a href="UX100.html" aria-label="Link to product UX100">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400  '>
                            <div className=" p-3 rounded-m border border-black rounded-xl img-wrap">
                               <img src="https://hugmug.jp/uploads/2024/07/snap_240729_top-320x441.jpg" alt="" className='w-[270px] h-auto' />
                            </div>
                            <div className="bottom-txt mt-3">
                                <p className='text-[12px] text-black text-center mt-4 w-2/3 mx-auto'>『ZARA』でつくるリゾートコーデ！ プチプラMIXのテクがお見事</p>
                            </div>
                            
                           
                        </div>
                    </a>
                    
                  
                </div>
              <div className=' px-1 h-[520px]'>
                    <a href="UX100.html" aria-label="Link to product UX100">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400  '>
                            <div className=" p-3 rounded-m border border-black rounded-xl img-wrap">
                               <img src="https://hugmug.jp/uploads/2024/07/snap_240729_top-320x441.jpg" alt="" className='w-[270px] h-auto' />
                            </div>
                            <div className="bottom-txt mt-3">
                                <p className='text-[12px] text-black text-center mt-4 w-2/3 mx-auto'>『ZARA』でつくるリゾートコーデ！ プチプラMIXのテクがお見事</p>
                            </div>
                            
                           
                        </div>
                    </a>
                    
                  
                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="UX100.html" aria-label="Link to product UX100">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400  '>
                            <div className=" p-3 rounded-m border border-black rounded-xl img-wrap">
                               <img src="https://store.united-arrows.co.jp/s/brand/by/feature/2023/23aw_komatsu_down_men/assets/img/webp/5_2.webp" alt="" className='w-[270px] h-auto' />
                            </div>
                            <div className="bottom-txt mt-3">
                                <p className='text-[12px] text-black text-center mt-4 w-2/3 mx-auto'>『ZARA』でつくるリゾートコーデ！ プチプラMIXのテクがお見事</p>
                            </div>
                            
                           
                        </div>
                    </a>
                    
                  
                </div>
                <div className=' px-1 p-4 border h-[520px]'>
                    <a href="UX100.html" aria-label="Link to product UX100">
                          <div className='card-item group flex flex-col justify-start items-center overflow-hidden duration-400  '>
                            <div className=" p-3 relative rounded-m border border-black rounded-xl img-wrap">
                                <div className="date border rounded-[3px]  absolute p-0 top-[12px] right-[12px] bg-[#c9b1df]">
                                    <span className='text-white border-1 border-black text-center '>2023.10.05</span>
                                </div>
                               <img src="https://store.united-arrows.co.jp/s/brand/by/feature/2023/23aw_komatsu_down_men/assets/img/webp/4_3.webp" alt="" className='w-[270px] h-auto' />
                            </div>
                            <div className="bottom-txt mt-3">
                                <p className='text-[12px] text-black text-center mt-4 w-2/3 mx-auto'>『ZARA』でつくるリゾートコーデ！ プチプラMIXのテクがお見事</p>
                            </div>
                            
                           
                        </div>
                    </a>
                    
                  
                </div>
               
            </Slider>
        </div>
    );
}
