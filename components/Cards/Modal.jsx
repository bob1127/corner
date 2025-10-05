import React from "react";
import Style from "../../styles/Modal.css";
import Feature from "./Feature";
import { IoCloseCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const Modal = ({ data, close }) => {
    const {
     
        imageUrl01,
        price,
        address,
        description,
        numBedroom,
        numWashrooms,
        livingSpace,
        Link
    } = data;

    const modalVariants = {
        open: {
            opacity: 1,
            transition: { staggerChildren: 0.5, delayChildren: 0.2 },
        },
        closed: { opacity: 0 },
    };

    const imageVariants = {
        open: { opacity: 1, y: "0vh" },
        closed: { opacity: 0, y: "-10vh" },
    };

    const modalInfoVariants = {
        open: { opacity: 1, transition: { staggerChildren: 0.2 } },
        closed: { opacity: 0 },
    };

    const modalRowVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "10%" },
    };

    return (
        <div className="ModalWrap">
            <motion.div
                className="modal grid grid-cols-1 md:grid-cols-2"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <motion.img
                    className="modal__image"
                    alt="real estate mansion"
                    src={imageUrl01}
                    variants={imageVariants}
                ></motion.img>
                <motion.div className="modal__info" variants={modalInfoVariants}>
                    <motion.div className="modal__row" variants={modalRowVariants}>
                        <span className="modal__price font-bold text-[20px]">{price}</span>
                    </motion.div>
                    <motion.div className="modal__row" variants={modalRowVariants}>
                        <span className="modal__address mb-2">{address}</span>
                    </motion.div>
                    <motion.div className="modal__row" variants={modalRowVariants}>
                        <Feature iconName={"FaBed"} iconLabel={numBedroom} />
                        <Feature iconName={"FaShower"} iconLabel={numWashrooms} />
                        <Feature iconName={"FaRuler"} iconLabel={livingSpace} />
                    </motion.div>
                    <motion.div
                        className="modal__description-wrapper"
                        variants={modalRowVariants}
                    >
                        <p className="modal__description  text-xs">{description}</p>
                    </motion.div>
                    <motion.div className="modal__row py-2 rounded-full flex justify-center items-center" variants={modalRowVariants}>
                        <a href={Link} className="modal__link flex justify-center items-center  mb-2 h-[50px]   text-[16px]">Product Link</a>
                    </motion.div>
                    
                    <motion.button
                        className="modal__close-wrapper"
                        whileHover={{ scale: 1.2 }}
                        onClick={close}
                    >
                        <IoCloseCircleOutline className="modal__close-icon" />
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Modal;
