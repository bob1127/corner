import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.css';
import Image from 'next/image';

export default function ImageSlider() {
    const settings = {
        // autoplay: true,
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
                <div className=' px-1 h-[520px]'>
                    <a href="UX100.html" aria-label="Link to product UX100">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={220} placeholder='empty' loading='lazy' alt='UX100' height={400} src="/nav/UX100_loriua" className='mx-auto' />
                            </div>
                              <div className="txt flex  hover:flex flex-col justify-center items-center px-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UH2-Gas<br></br> 免收集氣體酸鹼電極
</p>
                                <ul className='flex flex-col items-start'>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 4.3”彩色觸控屏幕</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 演算法自動終點判斷</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 防水防塵等級</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 雙模式檢測片連結器</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 500萬畫素鏡頭可記錄原始環境資料</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 背面皮革紋防滑設計</li>
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full   mt-4 ' href="">Product Detail</a>
                              


                            </div>
                           
                        </div>
                    </a>
                    
                  
                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="UX200.html" aria-label="Link to product UX200">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image  alt='UX200' width={220} placeholder='empty' loading='lazy' height={400} src="/nav/UX200_jlowcc" className='mx-auto' />
                            </div>
                             <div className="txt flex flex-col justify-center items-center px-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UX200 <br></br>免校正酸鹼檢測儀</p>
                                <ul className='flex flex-col items-start'>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 7.0”彩色觸控屏幕</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 演算法自動終點判斷</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 防水防塵等級</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 雙模式檢測片連結器</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 500萬畫素鏡頭可記錄原始環境資料</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 背面皮革紋防滑設計</li>
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-6 md:w-[120px] text-white duration-400 rounded-full   lg:mt-4 ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="UH2.html" aria-label="Link to product UH2">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={220} placeholder='empty' loading='lazy' alt='UH2' height={400} src="/nav/UH2_fesjdy" className='mx-auto' />
                            </div>
                             <div className="txt flex flex-col justify-center items-center px-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UH2<br></br>免校正超微量酸鹼電極 </p>
                                <ul className='flex flex-col items-start'>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 即開即用，精準免校正</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 樣品使用量業界最少(1~2μL)</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 每片 試片內建溫度感測元件</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 易於攜帶</li>
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full   mt-4 ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="UH2-GAS" aria-label="Link to product UH2-GAS">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={220} placeholder='empty' loading='lazy' height={400} src="/nav/UH2-Gas_u3tdf9" className='mx-auto' />
                            </div>
                             <div className="txt flex flex-col justify-center items-center px-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UH2-Gas<br></br>免收集氣體酸鹼電極</p>
                                <ul className='flex flex-col items-start'>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 即開即用 ，精準免校正</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 適用於氣體樣品</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 拋棄式電極無交叉汙染</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 每片試片內建溫度感測元件</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 易於攜帶</li>
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full   mt-4 ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>


                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="UH1.html">
                          <div className='card-item group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={220} placeholder='empty' loading='lazy' alt='UH1' height={400} src="/nav/UH1_moeaqz" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col justify-center items-center px-[20px]">
                                <p className='text-[16px] font-bold'>Humming Probe UH1<br></br>免校正微量酸鹼電極</p>
                                <ul className='flex flex-col items-start'>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 即開即用 ，精準免校正</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 樣品使用量最少(10~20μL)片</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 拋棄式電極無交叉汙染</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 每片試片內建溫度感測元件</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 易於攜帶</li>
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full   mt-4 ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>

                </div>
                <div className=' px-1 h-[520px]'>
                    <a href="CS200.html">
                        <div className='card-item group flex flex-col justify-start items-center  duration-400 hover:scale-105 '>
                            <div className=" img-wrap">
                                <Image width={220} placeholder='empty' loading='lazy' alt='CS200' height={400} src="/nav/CS200_mnmmsm" className='mx-auto' />
                            </div>
                            <div className="txt flex flex-col justify-center items-center px-[20px]">
                                <p className='text-[16px] font-bold'>CS200 磁石變頻攪拌器 <br></br>(Humming Probe 特制版）
</p>
                                <ul className='flex flex-col items-start'>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 可感測粘度自動調整的恆速磁力攪拌器</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 恆溫定時加熱系統(20 ~ 40°C)</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 轉速數位控制/顯示(400 ~ 1500rpm)</li>
                                    <li className='mt-3 text-left text-[14px] leading-3 font-normal'>- 燒杯適用大小(10 ~ 500 mL)</li>
                                </ul>
                                  <a className='bg-orange-500 font-light text-xs px-2 w-[130px] mt-3 md:w-[120px] text-white duration-400 rounded-full   mt-4 ' href="">Product Detail</a>

                            </div>

                        </div>
                    </a>

                </div>
               
               
            </Slider>
        </div>
    );
}
