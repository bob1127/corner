'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'



import 'swiper/css'
const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/CS200/${src}?w=${width}?p=${placeholder}`
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
                                src='CS200-首圖機身1000x1000.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器/Humming Probe 特制版CS200外觀/超極生技UltraE'


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
                                src='CS200-02-固定按鈕1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的pH電極專用支架/Humming Probe 特制版CS200/超極生技UltraE'

                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='CS200-01-UX100機身介紹1000x1000.gif'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的可自由調節pH電極專用支架gif/Humming Probe 特制版CS200/超極生技UltraE'
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='CS200-05-可拔除電線1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的電源線/Humming Probe 特制版CS200/超極生技UltraE'

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
                                src='CS200-03-液晶顯示1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的pH電極專用支架結構/Humming Probe 特制版CS200/超極生技UltraE'

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
                    className='thumbs mt-3 w-full '
                >

                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={300}
                                src='CS200-首圖機身1000x1000.webp'
                                loader={myLoader}

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器/Humming Probe 特制版CS200外觀/超極生技UltraE'


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
                                src='CS200-02-固定按鈕1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的pH電極專用支架/Humming Probe 特制版CS200/超極生技UltraE'

                            />

                        </button>



                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                loader={myLoader}
                                height={400}
                                src='CS200-01-UX100機身介紹1000x1000.gif'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的可自由調節pH電極專用支架gif/Humming Probe 特制版CS200/超極生技UltraE'
                            />
                        </button>



                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='CS200-05-可拔除電線1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的電源線/Humming Probe 特制版CS200/超極生技UltraE'

                                className=''
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <button className='flex h-full w-full items-center justify-center'>
                            <Image
                                width={400}
                                height={400}
                                loader={myLoader}
                                src='CS200-03-液晶顯示1000x1000.webp'

                                priority={true}
                                loading='eager'

                                alt='恆速磁石變頻攪拌器的pH電極專用支架結構/Humming Probe 特制版CS200/超極生技UltraE'

                                className=''
                            />
                        </button>



                    </SwiperSlide>


                </Swiper>
            </div>
        </section>
    )
}
