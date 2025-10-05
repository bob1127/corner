import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";

export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");

    return (
        <div className="flex flex-col gap-2">
            <Button onPress={onOpen} className="max-w-fit">Open Modal</Button>
       
            <Modal
                isOpen={isOpen}
                placement={modalPlacement}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <iframe title='contact-form' src="https://www.ultraehp.com/customized-iframe-en.html" 
                                    strategy='lazyOnload'  width="398" height="540" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>
                               
                            </ModalBody>
                            
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
