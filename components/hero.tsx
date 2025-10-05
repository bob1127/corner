
"use client"

import ModalVideo from '@/components/modal-video'
import Carousel from '../components/CarouselSlider/Carousel'
import { countries } from "../components/CarouselSlider/Data";
import React from "react";
import Link from 'next/link'
import { Button } from "@nextui-org/react";
export default function Hero() {
  return (
   <div>
      <section className="relative px-[25px] ">


        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
          <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#EAEAEA" offset="77.402%" />
                <stop stopColor="#DFDFDF" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="url(#illustration-01)" fillRule="evenodd">
              <circle cx="1232" cy="128" r="128" />
              <circle cx="155" cy="443" r="64" />
            </g>
          </svg>
        </div>

        <div className="w-full  mx-auto ">


          <div className=" pt-0  pb-2 ">

            <div className="relative flex justify-center mb-8" data-aos="fade-down" data-aos-delay="450">
              <Carousel images={countries} />
            </div>


          </div>

        </div>
      </section>
   </div>
  )
}