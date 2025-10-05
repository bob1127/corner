// src/reusable/image-gallery.component.js
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Styles from "./slick.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/carousel-img/1920x768/${src}?w=${width}?p=${placeholder}`
};



const myLoader02 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/carousel-img/1024x576/${src}?w=${width}?p=${placeholder}`
};

const myLoader03 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/carousel-img/640x640/${src}?w=${width}?p=${placeholder}`
};

class ImageGallaryComponent extends React.Component {
    render() {
        return (
            <div className="mt-[60px] relative">
                

                <img className="IMG-slider" src='' ></img>
             
            </div>
        );
    }
}

export default ImageGallaryComponent;
