import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import Image from "next/image";


const myLoader01 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UX200/1920x768/TW/${src}?w=${width}&q=${quality || 75}`
}
const myLoader02 = ({ src, width, quality }) => {
    return `https://www.ultraehp.com/images/modal/${src}?w=${width}&q=${quality || 75}`
}

export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");

    return (
        <div className=" w-full md:w-1/2 ">
        
                    <Button onPress={onOpen} className="h-auto w-full p-0 m-0  border-2 mr-4 border-gray-500 group  bg-transparent rounded-full px-4 py-3 duration-250 hover:bg-gray-800 hover:text-white my-3">

                        Buy Now
              




                    </Button>
            <p className="text-center   group text-[14px]">Only Taiwan Area</p>
                  

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
                className='z-[99999999] '
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Please select the method you want to buy (Taiwan Area only)</ModalHeader>
                            <ModalBody>
                                <div className="buyWrap grid grid-cols-2">

                                    <a href="https://www.pcstore.com.tw/hummingprobe/"><Image width={400} height={400} alt='pchome' loader={myLoader02} loading="lazy" src='pchome.png' placeholder='empty' /></a>



                                    <a href="https://shopee.tw/ultrae2020?categoryId=100636&itemId=5625103925">
                                        <Image width={400} height={400} loader={myLoader02} loading="lazy" src='蝦皮購物.png' alt='蝦皮購物' placeholder='empty' />
                                    </a>


                                    <a href="https://www.sciket.com/product/2640897">
                                        <Image width={400} height={400} loader={myLoader02} loading="lazy" src='科研市集.png' alt='科研市集' placeholder='empty' />
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
