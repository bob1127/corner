import React from "react";
import "../../styles/Overlay.css";
import { motion } from "framer-motion";
const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com//images/Products-Detail-Img/UX200/${src}?w=${width}?p=${placeholder}`
}


const Overlay = ({ children, close }) => {
    const variants = {
        open: { backgroundColor: "rgba(0,0,0,0.6)" },
        closed: { backgroundColor: "rgba(0,0,0,0)" },
    };

    return (
        <motion.div
            className="overlay"
            onClick={close}
            variants={variants}
            initial={"closed"}
            animate={"open"}
            exit={"closed"}
            key="overlay"
            
        >
            {children}
        </motion.div>
    );
};

export default Overlay;
