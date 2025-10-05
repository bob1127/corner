import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Image from "next/image";

const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}?p=${placeholder}`
}
export default function App() {
    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    return (
      <div className="pb-[10px] pt-[10px] px-[30px] bg-gray-600 block md:hidden">
            <Accordion >
               
                <AccordionItem
                    key="2"
                  
                    subtitle={
                        <span className="p-0 m-0 text-white  h-[20px] text-[20px]">
                            Products
                        </span>
                    }
                   
                >
                      <ul>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/ultrapeace/en/" className="text-[16px]  text-gray-300">UBT - PROFESSIONAL / UBT-HOME</a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/hummingprobe/UH1.html" className="text-[16px]  text-gray-300">UH1｜pH STRIP ELECTRODE</a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/hummingprobe/UH2.html" className="text-[16px]  text-gray-300">UH2｜ pH STRIP ELECTRODE</a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/hummingprobe/UH2-GAS.html" className="text-[16px]  text-gray-300">UH2-Gas｜ pH Strip Electrode for Gas</a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/hummingprobe/UX100.html" className="text-[16px]  text-gray-300">UX100｜CALIBRATION-FREE pH METER</a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/hummingprobe/UX200.html" className="text-[16px]  text-gray-300">UX200｜CALIBRATION-FREE pH METER</a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.ultraehp.com/hummingprobe/CS200.html" className="text-[16px]  text-gray-300">CS200｜MAGNET INVERTER MIXER</a>
                        </li>
                      </ul>
                </AccordionItem>
                <AccordionItem
                    key="1"
                    
                    subtitle={
                        <span className="text-white text-[20px]">
                            SERVICE
                        </span>
                    }
                   
                >
                    {/* <a href="UH2-GAS.html" className="mt-[20px]">
                        <Image width={400} className="mt-4" height={300} loader={myLoader} src='UX100-03.webp' />
                    </a> */}
                    <a href="https://www.ultraehp.com/en/aboutUs.html" className="mt-[20px]">
                        <Image width={400} className="mt-4" height={300} loader={myLoader} src='UX100-02.webp' />
                    </a>
                    <a href="https://www.ultraehp.com/en/Download.html" className="mt-[20px]">
                        <Image width={400} className="mt-4" height={300} loader={myLoader} src='UX100-05.webp' />
                    </a>
                </AccordionItem>
                
            </Accordion>
            <b className=' text-white text-[16px] mt-[50px]'>Subscribe Us</b>
            <iframe title='contact-form' loading='lazy' src='https://www.ultraehp.com/customized-iframe-footer.html' height={300} className='w-full'></iframe>
      </div>
    );
}
