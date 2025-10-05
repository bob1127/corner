import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.css';
import Image from 'next/image';


const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com//images/Products-Detail-Img/Index/${src}?w=${width}?p=${placeholder}`
}





export default function ImageSlider() {
    const settings = {
         autoplay: true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 3,
        // autoplay: true,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 880,
                settings: {
                    slidesToShow: 2,
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
        <div className="image-slider-container mt-[100px] ">
            <Slider {...settings} >
                <div className=' px-1 h-[510px]'>
                    <a href="Article02.html" aria-label="Link to product UX100">
                        <div className='card-item bg-white group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={280} 
                                    loader={myLoader}
                                    
                                
                                    placeholder='empty' loading='lazy' alt='UX100' height={400} src="UH1-12-試片一滴720x540.webp" className='mx-auto rounded-xl' />
                            </div>
                            <div className="txt flex  hover:flex flex-col justify-center items-center mt-[20px] px-[40px]">
                                <p className='text-[16px] font-bold'>How to use a single drop to measuring pH value with micro sample?

                                </p>
                                <ul className='flex flex-col items-start'>
                                    In the laboratory or manufacturing process, samples are sometimes small volumes or expensive ,for example...
                                </ul>
                                <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-6 md:w-[120px] text-white duration-400 rounded-full   mx-auto py-1 text-center ' href="">Detail</a>



                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[300px]'>
                    <a href="Article03.html" aria-label="Link to product UX100">
                        <div className='card-item bg-white group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={280}
                                    loader={myLoader}


                                    placeholder='empty' loading='lazy' alt='UX100' height={400} src="免校正-720x540.jpg" className='mx-auto rounded-xl' />
                            </div>
                            <div className="txt flex  hover:flex flex-col justify-center items-center mt-[20px] px-[40px]">
                                <p className='text-[16px] font-bold'>You don’t need to calibarate your pH meter any more after you read this article
                                </p>
                                <ul className='flex flex-col items-start'>
                                    The precision and the lifetime of the pH meter depends on the pH electrode. Sometimes, the pH ...
                                </ul>
                                <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-6 md:w-[120px] text-white duration-400 rounded-full   mx-auto py-1 text-center ' href="">Detail</a>



                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[300px]'>
                    <a href="Article04.html" aria-label="Link to product UX100">
                        <div className='card-item bg-white group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={280}
                                    loader={myLoader}


                                    placeholder='empty' loading='lazy' alt='UX100' height={400} src="UH1-01-720x540.png" className='mx-auto rounded-xl' />
                            </div>
                            <div className="txt flex  hover:flex flex-col justify-center items-center mt-[20px] px-[40px]">
                                <p className='text-[16px] font-bold'>The relation between Nernst equation and pH meter.
                                </p>
                                <ul className='flex flex-col items-start'>
                                    A testing sample was placed onto the Calibration-free pH Strip Electrode to activate reduction–oxidation reaction on the strip’s ...
                                </ul>
                                <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-6 md:w-[120px] text-white duration-400 rounded-full   mx-auto py-1 text-center ' href="">Detail</a>



                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[300px]'>
                    <a href="Article05.html" aria-label="Link to product UX100">
                        <div className='card-item bg-white group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={280}
                                    loader={myLoader}


                                    placeholder='empty' loading='lazy' alt='UX100' height={400} src="UH1沾凡立水720x540.jpg" className='mx-auto rounded-xl' />
                            </div>
                            <div className="txt flex  hover:flex flex-col justify-center items-center mt-[20px] px-[40px]">
                                <p className='text-[16px] font-bold'>Testing and Control pH Value of water based UL Varnishes
                                </p>
                                <ul className='flex flex-col items-start'>
                                    Varnish is resin. What we want to talk about in this article is the vanish which is applied in insulating processes ...
                                </ul>
                                <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-6 md:w-[120px] text-white duration-400 rounded-full   mx-auto py-1 text-center ' href="">Detail</a>



                            </div>

                        </div>
                    </a>


                </div>
               
               


            </Slider>
        </div>
    );
}
