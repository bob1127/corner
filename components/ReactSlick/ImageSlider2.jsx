import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.css';
import Image from 'next/image';
const myLoader = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}&q=${quality || 75}`
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
                    slidesToShow: 4,
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
        <div className="image-slider-container">
            <Slider {...settings} className='  '>
                <div className=' px-1 h-[450px]'>
                    <a href="https://www.ultraehp.com/hummingprobe/en/UX100.html" aria-label="Link to product UX100"> 
                          <div className='card-item bg-white group flex flex-col justify-start items-center   '>
                            <div className=" img-wrap  h-[250px] p-[15px]">
                                <Image loader={myLoader} width={220} placeholder='empty' loading='lazy' alt='UX100' height={300} src="UX100.webp" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col h-[350px] justify-start items-start px-[20px] pt-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UX100 <br></br> </p>
                                <ul className='h-[100px]   '>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 4.3” Color Touchscreen</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Waterproof: IP54</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Dual Mode Inspection Design Detail</li>
                                 
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full  py-1 text-center mx-auto ' href="">Product Detail</a>
                              


                            </div>
                           
                        </div>
                    </a>
                    
                  
                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="https://www.ultraehp.com/hummingprobe/en/UX200.html" aria-label="Link to product UX200">
                          <div className='card-item bg-white group flex flex-col justify-start items-center   '>
                            <div className=" img-wrap  h-[250px] p-[15px]">
                                <Image loader={myLoader} alt='UX200' width={220} placeholder='empty' loading='lazy' height={300} src="UX200.webp" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col h-[350px] justify-start items-start px-[20px] pt-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UX200 </p>
                                <ul className='h-[100px]   '>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 7” Color Touchscreen</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Waterproof: IP54</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Dual Mode Inspection Design</li>
                                  
                                </ul>
                                <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full  py-1 text-center mx-auto ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[580px]'>
                    <a href="https://www.ultraehp.com/hummingprobe/en/UH2.html" aria-label="Link to product UH2">
                          <div className='card-item bg-white group flex flex-col justify-start items-center   '>
                            <div className=" img-wrap  h-[250px] p-[15px]">
                                <Image loader={myLoader} width={220} placeholder='empty' loading='lazy' alt='UH2' height={300} src="UH2.webp" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col h-[350px] justify-start items-start px-[20px] pt-[20px]">
                                <p className='text-[16px]  font-bold'>Humming Probe UH2 </p>
                                <ul className='h-[100px]   '>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Calibration-free and ready-to-use</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Ultra small sample requirement (1～2µL).</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Disposable to avoid multi-sample cross-contamination</li>
                                 
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full  py-1 text-center mx-auto ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="https://www.ultraehp.com/hummingprobe/en/UH2-GAS.html" aria-label="Link to product UH2-GAS">
                          <div className='card-item bg-white group flex flex-col justify-start items-center   '>
                            <div className=" img-wrap  h-[250px] p-[15px]">
                                <Image loader={myLoader} alt='UH2_gas' width={220} placeholder='empty' loading='lazy' height={300} src="UH2-Gas.webp" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col h-[350px] justify-start items-start px-[20px] pt-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UH2-Gas</p>
                                <ul className='h-[100px]   '>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Accurate, calibration-free, ready-to-use</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Suitable for gas samples</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Accuracy can reach ±0.1 pH</li>
                                   
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full  py-1 text-center mx-auto ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="https://www.ultraehp.com/hummingprobe/en/UH1.html">
                          <div className='card-item bg-white group flex flex-col justify-start items-center   '>
                            <div className=" img-wrap  h-[250px] p-[15px]">
                                <Image width={220} 
                                loader={myLoader}
                                    placeholder='empty' loading='lazy' alt='UH1' height={300} src="UH1.webp" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col h-[350px] justify-start items-start px-[20px] pt-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UH1</p>
                                <ul className='h-[100px]   '>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Calibration-free and ready-to-use</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Ultra small sample requirement (10～20µL).</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Disposable to avoid multi-sample cross-contamination</li>
                                 
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full  py-1 text-center mx-auto ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>

                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="https://www.ultraehp.com/hummingprobe/en/CS200.html">
                        <div className='card-item bg-white group flex flex-col justify-start items-center   '>
                            <div className=" img-wrap  h-[250px] p-[15px]">
                                <Image loader={myLoader} width={220} placeholder='empty' loading='lazy' alt='CS200' height={300} src="/CS200.webp" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col h-[350px] justify-start items-start px-[20px] pt-[20px]">
                                <p className='text-[16px] font-bold'>CS200  <br></br>MAGNET INVERTER MIXER
</p>
                                <ul className='h-[100px]   '>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Constant Temperature Control (20～40°C)</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- <li>Clockwise &amp; Counter-Clockwise Design</li></li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- Beaker Size Range (10～500 mL)</li>
                                  
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full  py-1 text-center mx-auto ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>

                </div>
           
               
               
            </Slider>
        </div>
    );
}
