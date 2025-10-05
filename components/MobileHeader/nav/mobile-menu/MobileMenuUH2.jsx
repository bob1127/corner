import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { MonitorMobileIcon } from "./MonitorMobileIcon";
import { ShieldSecurityIcon } from "./ShieldSecurityIcon";
import { InfoIcon } from "./InfoIcon";
import { InvalidCardIcon } from "./InvalidCardIcon";
import Image from "next/image";

const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}?p=${placeholder}`
}
export default function App() {
    const itemClasses = {
        base: "py-0 w-full",
        title: "font-normal text-medium",
        trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
        indicator: "text-medium",
        content: "text-small px-2",
    };

    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";


    return (
        <Accordion
            showDivider={false}
            className=" h-full  px-2 pt-[70px] flex flex-col gap-1 w-full  mt-[-40px] border  z-50 fixed"
            variant="shadow"
            itemClasses={itemClasses}
        >
            <AccordionItem
                key="1"
                aria-label="Our Products"
               
                
                title="Our Products"
            >

                <Image quality={100} loading="lazy" placeholder="empty" loader={myLoader} alt="running people" src='ultraP-logo-banner01.webp' width={100} height={50} className="" />

                <ul className="link-item mt-4">
                    <li className="my-4 text-left">
                        <a href="https://www.ultraehp.com/ultrapeace/en/" className="text-black text-normal dark:text-white">UBTiw - Pro|Instant H.pylori test kit(Pro version)</a>
                    </li>
                    <li className="my-4 text-left">
                           
                        <a href="https://www.ultraehp.com/ultrapeace/en/" className="text-black text-normal dark:text-white">UBTiw-Home|Instant H.pylori test kit(Self test version)</a>
                    </li>
                
                
                </ul>


                <Image  loading="lazy" placeholder="empty" loader={myLoader} alt="running people" src='company-logo-mobile01.webp' width={130} height={67} className="" />

                <ul className="link-item mt-4">
                    <li className="my-4 text-left">
                        <a href="https://www.ultraehp.com/hummingprobe/en/UX100.html" className="text-black text-normal dark:text-white">UX100丨CALIBRATION-FREE pH METER</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/hummingprobe/en/UX200.html " className="text-black text-normal dark:text-white">UX200丨CALIBRATION-FREE pH METER</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/hummingprobe/en/CS200.html" className="text-black text-normal dark:text-white">CS200丨MAGNET INVERTER MIXER</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/hummingprobe/en/UH1.html" className="text-black text-normal dark:text-white">UH1｜pH STRIP ELECTRODE</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/hummingprobe/en/UH2.html" className="text-black text-normal dark:text-white">UH2｜pH STRIP ELECTRODE</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/hummingprobe/en/UH2-GAS.html" className="text-black text-normal dark:text-white">UH2-Gas丨pH Strip Electrode for Gas</a>
                    </li>


                </ul>


              
                    
            





             

              
            </AccordionItem>
            <AccordionItem
                key="2"
                aria-label="Apps Permissions"
             
                title=""
                subtitle={
                    <p className="flex">
                        Service
                    </p>
                }
            >
                <ul className="link-item mt-4">
                    <li className="my-4 text-left">
                        <a href="https://www.ultraehp.com/en/Policy.html" className="text-black text-normal dark:text-white ">Policy</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/en/ArticleList.html" className="text-black text-normal dark:text-white">Blog</a>
                    </li>
                    <li className="my-4 text-left">

                        <a href="https://www.ultraehp.com/en/Download.html" className="text-black text-normal dark:text-white">Download</a>
                    </li>
             


                </ul>

              
            </AccordionItem>
            <AccordionItem
                key="3"
             
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'https://www.ultraehp.com/en/aboutUs.html';
                }}
               
               
                title=""
                subtitle={
                    <p className="flex">
                         About Us
                    </p>
                }
            >
              
            </AccordionItem>
            <AccordionItem

                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = 'https://www.ultraehp.com/en/ContactUs.html';
                }}
             
               
                subtitle={
                    <p className="flex">
                        Contact Us
                    </p>
                }
                title=''
            >
            
            </AccordionItem>
            <AccordionItem

                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/en';
                }}


                subtitle={
                    <p className="flex">
                       English
                    </p>
                }
                title=''
            >

            </AccordionItem>
            <AccordionItem

                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                }}


                subtitle={
                    <p className="flex">
                       繁體中文
                    </p>
                }
                title=''
            >

            </AccordionItem>
        </Accordion>
    );
}
