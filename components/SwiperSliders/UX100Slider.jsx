'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'



import 'swiper/css'
const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX100/${src}?w=${width}?p=${placeholder}`
}
const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}?p=${placeholder}`
}


export default function Page() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)

    return (
        <section className=' '>
            <div className='container'>
                <Swiper
                    loop={true}

                    spaceBetween={10}
                    navigation={true}
                    thumbs={{
                        swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                    }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className='h-96 w-full'
                >
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={300}
                                src='UX100.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='The appearance of the Calibration-free micro disposable pH meter/pH measurement system/Humming Probe UX100/UltraE '


                                className=''
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-03-UX100機身介紹1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The introduction of the dimension and the interfaces of the calibration-free micro disposable pH meter/pH measurement system/ Humming Probe UX100/UltraE'

                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='UX100-04-插入電擊1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='Calibration-free micro disposable pH meter/pH measurement system and variable frequency magnetic stirrer for continuous testing/Humming Probe UX100/UltraE '
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-07-雙模式1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='Two kinds of pH electrode interfaces for Calibration-free micro disposable pH meter/pH measurement system/Humming Probe UX100/UltraE'

                                className=''
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-05-500萬畫素1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The camera function of the  Calibration-free micro disposable pH meter/pH measurement system records the field data /Humming Probe UX100/UltraE'

                                className=''
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-06-4.3彩色觸控螢幕1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The touch screen of the  calibration-free micro disposable pH meter/pH measurement system/Humming Probe UX100/UltraE'

                                className=''
                            />
                        </div>
                    </SwiperSlide>


                </Swiper>


                <Swiper

                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={12}
                    breakpoints={{
                        0: {
                            slidesPerView: 4,
                        },

                        768: {
                            slidesPerView: 5,
                        },
                        1920: {
                            slidesPerView: 6,
                        },
                    }}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className='thumbs  mt-3 w-full'
                >

                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={300}
                                src='UX100.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='The appearance of the Calibration-free micro disposable pH meter/pH measurement system/Humming Probe UX100/UltraE'


                                className=''
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-03-UX100機身介紹1000x1000.webp'
                               
                                priority={true}
                                loading='eager'

                                alt='The introduction of the dimension and the interfaces of the calibration-free micro disposable pH meter/pH measurement system/ Humming Probe UX100/UltraE'

                            />

                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='UX100-04-插入電擊1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='Calibration-free micro disposable pH meter/pH measurement system and variable frequency magnetic stirrer for continuous testing/Humming Probe UX100/UltraE'
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-07-雙模式1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='Two kinds of pH electrode interfaces for Calibration-free micro disposable pH meter/pH measurement system/Humming Probe UX100/UltraE'

                                className=''
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-05-500萬畫素1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The camera function of the  Calibration-free micro disposable pH meter/pH measurement system records the field data /Humming Probe UX100/UltraE'

                                className=''
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UX100-06-4.3彩色觸控螢幕1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The touch screen of the  calibration-free micro disposable pH meter/pH measurement system/Humming Probe UX100/UltraE'

                                className=''
                            />
                        </button>



                    </SwiperSlide>

                </Swiper>
            </div>
        </section>
    )
}
