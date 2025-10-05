import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import Image from "next/image";
import ArticlesCarousel from './ReactSlick/ImageSlider5'
import OthersProducts from './ReactSlick/ImageSlider2'
export default function App() {

    return (
        <div className="  flex flex-col justify-center items-center md:px-[40px] px-[20px]  xl:px-[120px] ">

            <div className="txt">
                <h2 className="mt-[30px]">Our Products</h2>
                {/* <p className="text-center">Products</p> */}
            </div>
            <OthersProducts/>
            <div className="txt ">
                <h2 className="">Articles</h2>
              
            </div>
                <ArticlesCarousel />
     
         


         
        </div>
    );
}
