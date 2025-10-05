import React from 'react';
import Image from 'next/image';
import logo from '../public/logo.svg';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Tooltip, Button } from "@nextui-org/react";

const myLoader03 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/${src}?w=${width}?p=${placeholder}`
}
const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-1/${src}?w=${width}?p=${placeholder}`
}
const myLoader05 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/${src}?w=${width}?p=${placeholder}`
}

export default function Header() {
    return (
       <div>
            <section className=" section_find px-3 xl:px-20 flex  flex-col justify-center items-center">
                <div className="text-center ">
                    <h2 className="h2-u">Find your Humming Probe
</h2>
                </div>
                <div className="w-full  flex flex-wrap  justify-center items-center align-middle">
                    <div className="item border-2  py-5 md:py-0 border-gray-300  rounded-xl md:border-none md:rounded-none flex flex-col mt-[30px ] xl:mt-8 align-middle items-center justify-center w-[400px]">
                        <p className='text-[20px] mb-3'>Most Popular

</p>
                        <div className="line mb-3  mx-auto w-[200px] border-t-1 border-black">

                        </div>
                        <Image loader={myLoader05} src='UH-1.webp' placeholder="empty"
                            loading="lazy" width={70} alt="UH1-蜂鳥探針" height={150}></Image>
                        <div className="txt flex flex-col justify-center items-center">
                            <b className="font-bold text-[20px]">Classic
                            </b>
                            <p>Suitable for most
</p>
                            <b className="text-rose-700 text-normal">UH1 pH STRIP
                            </b>
                        </div>
                        <ul className="mt-4">
                             <li className="mt-2 text-[14px]">
                                Suitable for liquid samples


                            </li>
                             <li className="mt-2 text-[14px]">
                                Ultra small sample requirement:
                                10-20 μL
                            </li>
                             <li className="mt-2 text-[14px]">
                                Suitable for single & continuous test


                            </li>
                        </ul>
                        <Button radius="full" href='#' className="bg-gray-800 mt-3  text-white shadow-lg">
                            <a href="https://www.ultraehp.com/hummingprobe/en/UH1.html" className='font-black'>More</a>

                        </Button>
                    </div>
                    <div className="item border-2  py-5 md:py-0 border-gray-300  rounded-xl md:border-none md:rounded-none flex flex-col mt-[30px] xl:mt-8 align-middle items-center justify-center w-[400px]">
                        <p className='text-[20px] opacity-0 mb-3'>New</p>
                        <div className="line mb-3  mx-auto w-[200px] ">

                        </div>
                        <Image loader={myLoader05} src='UH2.webp' alt='UH2蜂鳥探針' placeholder="empty"
                            loading="lazy" width={70} height={150}></Image>
                        <div className="txt flex flex-col justify-center items-center">
                            <b className="font-bold text-[20px]">Micro-sample

                            </b>
                            <p>
                                Suitable for precious and micro samples
                            </p>
                            <b className="text-rose-700 text-normal">UH2 pH STRIP
                            </b>
                        </div>
                        <ul className="mt-4">
                             <li className="mt-2 text-[14px]">
                                Suitable for liquid samples




                            </li>
                             <li className="mt-2 text-[14px]">
                                Ultra small sample requirement:
                                1-2 μL
                            </li>
                             <li className="mt-2 text-[14px]">
                                Suitable for single & continuous test


                            </li>
                        </ul>
                        <Button radius="full" href='#' className="bg-gray-800 mt-3  text-white shadow-lg">
                            <a href="https://www.ultraehp.com/hummingprobe/en/UH2.html" className='font-black'>More</a>

                        </Button>
                    </div>
                    <div className="item border-2  py-5 md:py-0 border-gray-300  rounded-xl md:border-none md:rounded-none flex flex-col mt-[30px] xl:mt-8 align-middle items-center justify-center w-[400px]">
                        <p className='text-[20px] mb-3'>New</p>
                        <div className="line mb-3  mx-auto w-[200px] border-t-1 border-black">
                            
                        </div>
                        <Image loader={myLoader05} src='UH2-Gas.webp' placeholder="empty"
                            loading="lazy" alt="UH2-Gas" width={70} height={150}></Image>
                        <div className="txt flex flex-col justify-center  items-center">
                            <h4 className="font-bold text-[20px]">Gas

                            </h4>
                            <p>Suitable for
                                gas samples

</p>
                            <b className="text-rose-700 text-normal">UH2-Gas pH STRIP
                            </b>
                        </div>
                        <ul className="">
                            <li className="mt-2 text-[14px]">
                                Suitable for gas samples


                            </li>
                            <li className="mt-2 text-[14px]">
                                Lower limit of detection

                            </li>
                            <li className="mt-2 text-[14px]">
                                Suitable for single & continuous test
                            </li>
                        </ul>
                        <Button radius="full" href='#' className="bg-gray-800 mt-3  text-white shadow-lg">
                            <a href="https://www.ultraehp.com/hummingprobe/en/UH2-GAS.html" className='font-black'>More</a>

                        </Button>
                    </div>
                </div>

            </section>
            <section className="section_find px-[20px] xl:px-20  flex  flex-col justify-center items-center">
                <div className="text-center ">
                    <h2 className="h2-u">Find your meter and accessories
</h2>
                </div>
                <div className="w-full  flex flex-wrap justify-center items-center align-middle">
                    <div className="item border-2  py-5 md:py-0 border-gray-300  rounded-xl md:border-none md:rounded-none flex flex-col mt-5 align-middle items-center justify-center w-[400px]">

                        <div >
                            <h4 className="font-bold text-[20px]">UX100 pH Meter

                            </h4>
                            {/* <p>適用於大部分的檢測需求</p>
                            <b className="text-rose-700 text-normal">UH1 pH STRIP
                            </b> */}
                        </div>
                        <ul className="mt-4">
                            <li className="mt-2 text-[14px]">
                                4.3” Color Waterproof Touchscreen

                            </li>
                            <li className="mt-2 text-[14px]">
                                Waterproof: IP54

                            </li>
                            <li className="mt-2 text-[14px]">
                                Dual Mode Inspection Design

                            </li>
                            <li className="mt-2 text-[14px]">
                                Built-In 5M Pixels Camera, Data Editable

                            </li>
                        </ul>
                        <Button radius="full" href='#' className="bg-gray-800 mt-3  text-white shadow-lg">
                            <a href="https://www.ultraehp.com/hummingprobe/en/UX100.html" className='font-black'>More</a>

                        </Button>
                        <Image loader={myLoader01} src='UX100.webp' placeholder="empty" width={470}
                            alt="UX100免校正酸鹼檢測儀" loading="lazy" height={470}></Image>

                    </div>
                    <div className="item border-2  py-5 md:py-0 border-gray-300  rounded-xl md:border-none md:rounded-none flex flex-col mt-5 align-middle items-center justify-center w-[400px]">

                        <div >
                            <h4 className="font-bold text-[20px]">UX200 pH Meter

                            </h4>
                            {/* <p>適用於大部分的檢測需求</p>
                            <b className="text-rose-700 text-normal">UH1 pH STRIP
                            </b> */}
                        </div>
                        <ul className="">
                            <li className="mt-2 text-[14px]">
                                pH chart

                            </li>
                            <li className="mt-2 text-[14px]">
                                7” Color Touchscreen

                            </li>
                            <li className="mt-2 text-[14px]">
                                Waterproof: IP54
                            </li>
                            <li className="mt-2 text-[14px]">
                                Dual Mode Inspection Design

                            </li>
                            <li className="mt-2 text-[14px]">
                                Built-In 5M Pixels Camera, Data Editable

                            </li>
                         
                        </ul>
                        <Button radius="full" href='#' className="bg-gray-800 mt-3  text-white shadow-lg">
                            <a href="https://www.ultraehp.com/hummingprobe/en/UX200.html" className='font-black'>More</a>

                        </Button>
                        <Image loader={myLoader01} loading="lazy" placeholder="empty" src='UX200-en.webp' width={470} alt="UX200免校正酸鹼檢測儀" height={470}></Image>

                    </div>
                    <div className="item border-2  py-5 md:py-0 border-gray-300  rounded-xl md:border-none md:rounded-none flex flex-col mt-5 align-middle items-center justify-center w-[400px]">

                        <div >
                            <h4 className="font-bold text-[20px]">CS200 MAGNET INVERTER MIXER

                            </h4>
                            {/* <p>適用於大部分的檢測需求</p>
                            <b className="text-rose-700 text-normal">UH1 pH STRIP
                            </b> */}
                        </div>
                        <ul >
                            <li className="mt-2 text-[14px]">
                                Constant Temperature Control (20-40°C)

                            </li>
                            <li className="mt-2 text-[14px]">
                                Digital Speed Control/Display (400-1500rpm)

                            </li>
                            <li className="mt-2 text-[14px]">
                                Clockwise & Counter-Clockwise Design

                            </li>
                            <li className="mt-2 text-[14px]">
                                Beaker Size Range (10-500 mL)


                            </li>
                        </ul>
                        <Button radius="full" href='#' className="bg-gray-800 mt-3  text-white shadow-lg">
                            <a href="https://www.ultraehp.com/hummingprobe/en/CS200.html" className='font-black'>More</a>

                        </Button>
                        <Image loader={myLoader01} loading="lazy" placeholder="empty" src='CS200-en.webp' width={470} alt="CS200 磁石變頻攪拌器" height={470}></Image>

                    </div>
                </div>

            </section>
       </div>
    );
}
