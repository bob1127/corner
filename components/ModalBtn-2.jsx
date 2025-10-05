import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import Image from "next/image";
const myLoader01 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/1920x768/TW/${src}?w=${width}&q=${quality || 75}`
}
const myLoader02 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/640x640/TW/${src}?w=${width}&q=${quality || 75}`
}

export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");

    return (
        <div className=" w-full md:w-1/2 pr-0 md:pr-3 ">
        
                   
                    <Button onPress={onOpen} className="h-auto w-full p-0 m-0  border-2 hover:bg-gray-800 duration-250 hover:text-white  border-gray-500  bg-transparent rounded-full px-4 py-3 my-3">

                       Contact Us



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
                className='z-50  p-0 m-0  '
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Contact Us - Inquire Now</ModalHeader>
                            <ModalBody>
                                <iframe title='contact-forms' src="https://www.ultraehp.com/customized-iframe-en.html" loading="lazy" className="w-full md:w-[400px] h-[500px]" strategy='lazyOnload' frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>

                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>



            <Modal
                isOpen={isOpen}
                placement={modalPlacement}
                onOpenChange={onOpenChange}
                className='z-[99999999]  '
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Contact Us - Inquire Now</ModalHeader>
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
