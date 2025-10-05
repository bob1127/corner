
"use client"

import ModalVideo from '@/components/modal-video'
import ReadMoreReact from 'read-more-react';
import Carousel from '../components/CarouselSlider/Carousel'
import { countries } from "../components/CarouselSlider/Data";
import Image from 'next/image';
import React from "react";
import Link from 'next/link'
import { Button } from "@nextui-org/react";

//Image Loader 
const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-2/${src}?w=${width}?p=${placeholder}`
}

const myLoader001 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}?p=${placeholder}`
}
const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-1/${src}?w=${width}?p=${placeholder}`
}
const myLoader02 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/iso certification/${src}?w=${width}?p=${placeholder}`
}
const myLoader03 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/brand/${src}?w=${width}?p=${placeholder}`
}
const myLoader04 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/product-01/${src}?w=${width}?p=${placeholder}`
}

export default function Hero() {
    return (
        <div>
            <section className=" seection_fit px-[20px] md:px-0">
                <h2 className="h2-u">Why is the Humming Probe pH Measurement <br /> System/pH Meter Calibration-free?



                </h2>
                <div className="card bg-white-wrap flex flex-wrap justify-center items-center  px-0 xl:px-20">
                    <div className="card bg-white mt-4 md:m-4   py-4   w-full md:w-[42%]  border rounded-2xl">
                        <div className="h-auto lg:h-auto  2xl:h-[210px]    txt p-8 flex flex-col justify-start items-center">

                            <div className="title">
                                <h3 className="font-bold text-center text-black text-[22px]">Patented hydrogen ion exchange film design


                                </h3>
                                <p className="text-orange-500 text-center font-bold">
                                    Supply electrodes with fixed reaction area

                                </p>
                                <ReadMoreReact text="We use the patented hydrogen ion adsorption film, in addition to selectively allowing hydrogen ions in the sample to pass through, to avoid the passivation caused by the adsorption of other matrices in the sample on the surface of the electrode and simplifies the sample processing steps. Furthermore, the surface-exchangeable hydrogen ion content in the Nernst equation, which affects the Ek' value, can be precisely controlled by the design of the hydrogen ion adsorption film.
"
                                    min={120}
                                    ideal={160}
                                    duration={500}
                                    max={200}
                                    readMoreText="...." />
                            </div>



                        </div>
                        <div className="img">
                            <Image loader={myLoader01} width={500} placeholder="empty" loading='lazy' alt='Calibration principle and Nernst equation principle and application for the calibration-free micro disposable pH electrode/Humming Probe pH electrode/Humming Probe UH1/UltraE   ' className='mx-auto rounded-xl' height={300} src='UH1-01-720x540.webp'></Image>
                        </div>
                    </div>
                    <div className="card bg-white md:m-4 py-4 mt-4 h-full  w-full md:w-[42%]  border rounded-2xl">
                        <div className="  2 2xl:h-[210px]    txt p-8 flex flex-col justify-start items-center">


                            <div className="title">
                                <h3 className="font-bold text-center text-black text-[22px]">Automated production technology


                                </h3>
                                <p className="text-orange-500 text-center font-bold">
                                    Make every electrode look "the same"

                                </p>
                                <ReadMoreReact text="Automated production machine can quickly introduce R&D results into the production process for the most efficient bridging of R&D and production. The automatic production machine (G1) can achieve a CV value of 3~5% for the production stability of test strips through automated production model. In addition, we have developed different types of automated machines for different manufacturing process requirements, such as temperature sensing component assembly machines, to increase production stability and consistent quality.
"
                                    min={120}
                                    ideal={160}
                                    max={200}
                                    readMoreText="...." />
                            </div>





                        </div>
                        <div className="img">
                            <Image loader={myLoader01} width={500} placeholder="empty" loading='lazy' alt='Automatic production process of  the calibration-free micro disposable pH electrode/Humming Probe pH electrode/Humming Probe UH1/UltraE ' height={300} className='mx-auto rounded-xl' src='UH1-09-製程操控720x540.webp'></Image>
                        </div>
                    </div>

                    <div className="card bg-white md:m-4 py-4 mt-4 h-full  w-full md:w-[42%]  border rounded-2xl">
                        <div className="  2 2xl:h-[210px]    txt p-8 flex flex-col justify-start items-center">

                            <div className="title flex flex-col items-center">
                                <b className="text-center text-[20px]">Calibration before leaving the factory

                                </b>
                                <p className="text-orange-500 text-center font-bold">Each test strip has been calibrated

                                </p>

                                <ReadMoreReact text="Each test strip has been calibrated and verified using NIST traceability standards before leaving the factory, so you can simply take the test strip out of the vial and test pH directly. verified using NIST traceability standards before leaving the factory, so you can simply take the test strip out of the vial and test pH directly.
"
                                    min={120}
                                    ideal={160}
                                    max={200}
                                    readMoreText="...." />

                            </div>


                        </div>
                        <div className="img">
                            <Image loader={myLoader01} width={500} placeholder="empty" loading='lazy' alt='How the calibration-free micro disposable pH electrodes/Humming Probe pH electrodes are accurately calibrated before leaving the factory /Humming Probe UH1/UltraE ' height={300} className='mx-auto rounded-xl' src='UH1-09-製料720x540.webp'></Image>
                        </div>
                    </div>

                    <div className="card bg-white md:m-4 py-4 mt-4 h-full  w-full md:w-[42%]  border rounded-2xl">
                        <div className="  2 2xl:h-[210px]    txt p-8 flex flex-col justify-start items-center">
                            <div className="title flex flex-col items-center">
                                <b className=" text-[20px] text-center">Each strip is equipped with independent temperature sensing element
                                </b>
                                <p className="text-orange-500 text-center font-bold">Smart temperature compensation for every test
                                </p>
                                <ReadMoreReact text="Each test strip is embedded with an independent small-volume temperature sensing element. When the sample temperature is within the range of 10-40 degrees, even with a small quantity of sample, it also has automatic temperature compensation (ATC), and the resolution can reach ±0.01 pH.01pH。
"
                                    min={120}
                                    ideal={160}
                                    max={200}
                                    readMoreText="...." />

                            </div>



                        </div>
                        <div className="img">
                            <Image loader={myLoader01} width={500} placeholder="empty" loading='lazy' alt='The temperature compensation element of the calibration-free micro disposable pH electrode/Humming Probe pH electrodes/Humming Probe UH1/UltraE' className='mx-auto rounded-xl' height={300} src='UH1-07-感測元件720x540.webp'></Image>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}