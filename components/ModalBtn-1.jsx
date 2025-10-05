import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import Image from "next/image";
const myLoader01 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/1920x768/EN/${src}?w=${width}&q=${quality || 75}`
}
const myLoader02 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX100/640x640/TW/${src}?w=${width}&q=${quality || 75}`
}

export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");

    return (
        <div className=" ">
            <Button onPress={onOpen} className="w-full p-0 m-0 h-[600px] lg:h-[700px] bg-transparent">

                <Image placeholder="empty" src='UX200-1920X768-促銷活動-02.webp' className="lazy hidden md:block" loader={myLoader01} loading="lazy" alt="免校正微量拋棄式pH酸鹼檢測電極/蜂鳥探針可提供微升級的樣品測試/Humming Probe UH1/超極生技UltraE"  width={1920} height={600} />

                <Image className="block md:hidden" loader={myLoader01} loading="lazy" alt="免校正微量拋棄式pH酸鹼檢測電極/蜂鳥探針可提供微升級的樣品測試/Humming Probe UH1/超極生技UltraE" src='UX200-1920X768-促銷活動-02.webp' width={640} height={640} />



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
