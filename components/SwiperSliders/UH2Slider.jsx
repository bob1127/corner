'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'



import 'swiper/css'
const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-2/${src}?w=${width}?p=${placeholder}`
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
                                src='UH2-4-一滴量測1000x1000.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'


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
                                src='UH2-05-即插即測1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='UX200機身介紹.webp'

                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='UH2-06-搭配UX100-1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UH2-03.webp'

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'

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
                                src='UH2-07-商品1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'

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
                    className='thumbs  w-full '
                >

                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={300}
                                src='UH2-4-一滴量測1000x1000.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'


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
                                src='UH2-05-即插即測1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='UX200機身介紹.webp'

                            />

                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='UH2-06-搭配UX100-1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UH2-03.webp'

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'

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
                                src='UH2-07-商品1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='無線電化學分析儀/工作站/恆電位儀一鍵控制方便使用及其電源狀態燈-Zensor R&D-ECWP100'

                                className=''
                            />
                        </button>



                    </SwiperSlide>
                   

                </Swiper>
            </div>
        </section>
    )
}
