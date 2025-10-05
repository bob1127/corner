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
        <div className="  ">

            <Button onPress={onOpen} className="h-full w-full  shadow-xl bg-white border-none mr-3">

                 <div className="  ">
                    <Image loader={myLoader01} height={500} alt='go-shopping-icon' className="" width={500} src='goShopping.webp'></Image>

                    <div className="txt flex flex-col justify-center items-center ">
                        <p className="font-extrabold text-black  text-[30px]">Buy Now </p>
                        <b className="text-[18px] mt-[20px]">Buy Now</b>
                        <span>Only Taiwan Area</span>
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
                className='z-50'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">請選擇您要購買的管道(限台灣地區)</ModalHeader>
                            <ModalBody>
                                <div className="buyWrap grid grid-cols-2">
                                
                                    <a href="https://www.pcstore.com.tw/hummingprobe/"><Image width={400} height={400} alt='pchome' loader={myLoader02} loading="lazy" src='pchome.png' placeholder='empty' /></a>

                                 
                                
                                        <a href="https://shopee.tw/ultrae2020?categoryId=100636&itemId=5625103925">
                                        <Image width={400} height={400} loader={myLoader02} loading="lazy" alt='蝦皮購物' src='蝦皮購物.png' placeholder='empty' />
                                        </a>
                                    

                                        <a href="https://www.sciket.com/product/2640897">
                                        <Image width={400} alt='科研市集' height={400} loader={myLoader02} loading="lazy" src='科研市集.png' placeholder='empty' />
                                        </a>
                                      


                                </div>

                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
