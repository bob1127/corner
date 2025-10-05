'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'



import 'swiper/css'
const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH2-Gas/${src}?w=${width}?p=${placeholder}`
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
                                src='UH2-GAS+UX100.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='The Schematic diagram of pH measurement of ultramicro liquid samples with the calibration-free ultramicro disposable pH electrode/Humming Probe UH2'


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
                                src='UH2-05-即插即測.webp'

                                priority={true}
                                loading='eager'

                                alt='The detailed drawing of the pH electrode socket of  the calibration-free ultramicro disposable pH electrode/Humming Probe UH2E'

                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='UH2-GAS-氣體圖.webp'

                                priority={true}
                                loading='eager'

                                alt='alt="The Schematic diagram of the pH electrode extension cable for the calibration-free ultramicro disposable pH electrode/Humming Probe UH2"'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UH2-Gas-03.webp'

                                priority={true}
                                loading='eager'

                                alt='The calibration-free ultramicro disposable pH electrode/Humming Probe pH electrode UH2 can be steadily stored in dry vials/Humming Probe pH electrode/Humming Probe UH2'

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
                                src='UH2gas-01-商品1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The outer packaging of the calibration-free ultramicro disposable pH electrode/Humming Probe pH electrode/Humming Probe UH2/UltraE  '

                                className=''
                            />
                        </div>
                    </SwiperSlide>

                </Swiper>


                <Swiper

                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={12}
               
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className='thumbs   mt-3 w-full '
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
                >

                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={300}
                                src='UH2-GAS+UX100.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='The detailed drawing of the pH electrode socket of  the calibration-free ultramicro disposable pH electrode/Humming Probe UH2'


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
                                src='UH2-05-即插即測.webp'

                                priority={true}
                                loading='eager'

                                alt='The detailed drawing of the pH electrode socket of  the calibration-free ultramicro disposable pH electrode/Humming Probe UH2'

                            />

                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='UH2-GAS-氣體圖.webp'

                                priority={true}
                                loading='eager'

                                alt='The Schematic diagram of the pH electrode extension cable for the calibration-free ultramicro disposable pH electrode/Humming Probe UH2'
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='UH2-Gas-03.webp'

                                priority={true}
                                loading='eager'

                                alt='The calibration-free ultramicro disposable pH electrode/Humming Probe pH electrode UH2 can be steadily stored in dry vials/Humming Probe pH electrode/Humming Probe UH2'

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
                                src='UH2gas-01-商品1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='The outer packaging of the calibration-free ultramicro disposable pH electrode/Humming Probe pH electrode/Humming Probe UH2/UltraE  '

                                className=''
                            />
                        </button>



                    </SwiperSlide>


                </Swiper>
            </div>
        </section>
    )
}
