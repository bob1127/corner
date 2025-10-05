"use client"

import React from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { slide, opacity, perspective } from './anim';

const anim = (variants) => {
    return {
        initial: "initial",
        animate: "enter",
        exit: "exit",
        variants
    }
}

export default function ({children}) {
    return (
        <div className='inner bg-black border border-red-400'>
            <motion.div className='slide' {...anim(slide)}/>
            <motion.div className='page' {...anim(perspective)}>
                <motion.div {...anim(opacity)}>
                    <div className='header'>
                        <Link className='text-gray-800' href="/toys ">Home003</Link>
                        <Link className='text-gray-800' href="/about">About</Link>
                        <Link className='text-gray-800' href="/contact">Contact</Link>
                    </div>
                    {
                        children
                    }
                </motion.div>
            </motion.div>
        </div>
    )
}