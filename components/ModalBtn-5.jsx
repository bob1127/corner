import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import Image from "next/image";


const myLoader01 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com//images/Products-Detail-Img/product-01/${src}?w=${width}&q=${quality || 75}`
}
const myLoader02 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/modal/${src}?w=${width}&q=${quality || 75}`
}

export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");

    return (
        <div className=" ">

            <Button onPress={onOpen} className="h-full shadow-xl bg-white border-none w-full  rounded-2xl ">

                <div className=" flex p-[50px] lg:py-0  lg:flex-row flex-col justify-center items-center rounded-2xl w-full  ">
                    <Image loader={myLoader01}  height={300} alt='聯絡我們' className="" width={300} src='contact-icon.webp'></Image>

                    <div className="txt flex md:pl-[40px] pl-0 flex-col justify-center items-center ">
                        <p className=" text-gray-700  md:text-[32px] font-normal text-[20px]">Contact Us</p>
                        {/* <b className="text-[28px] font-normal text-gray-700 mt-[20px]">聯絡我們</b> */}
                        <span className="opacity-0">Only Taiwan Area</span>
                    </div>


                </div>





            </Button>



            <RadioGroup

                orientation="horizontal"
                value={modalPlacement}
                onValueChange={setModalPlacement}
            >
                {/* <Radio value="auto">auto</Radio>
                <Radio value="top">top</Radio>
                <Radio value="bottom">bottom</Radio>
                <Radio value="center">center</Radio>
                <Radio value="top-center">top-center</Radio>
                <Radio value="bottom-center">bottom-center</Radio> */}
            </RadioGroup>
            <Modal
                isOpen={isOpen}
                placement={modalPlacement}
                onOpenChange={onOpenChange}
                className='z-[99999999]   '
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Contact Us / Buy Now</ModalHeader>
                            <ModalBody>
                                <iframe title='contact-forms' src="https://www.ultraehp.com/customized-iframe-en.html" loading="lazy" className="w-full md:w-[400px] h-[500px]" strategy='lazyOnload' frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>

                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
