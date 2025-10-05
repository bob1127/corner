'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

export default function Home() {

    const firstText = useRef(null);
    const secondText = useRef(null);
    const slider = useRef(null);
    let xPercent = 0;
    let direction = -1;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(slider.current, {
            scrollTrigger: {
                trigger: document.documentElement,
                scrub: 0.25,
                start: 0,
                end: window.innerHeight,
                onUpdate: e => direction = e.direction * -1
            },
            x: "-500px",
        })
        requestAnimationFrame(animate);
    }, [])

    const animate = () => {
        if (xPercent < -100) {
            xPercent = 0;
        }
        else if (xPercent > 0) {
            xPercent = -100;
        }
        gsap.set(firstText.current, { xPercent: xPercent })
        gsap.set(secondText.current, { xPercent: xPercent })
        requestAnimationFrame(animate);
        xPercent += 0.1 * direction;
    }

    return (
        <main className={styles.main}>
            {/* <Image
                src="/images/background.jpg"
                fill={true}
                alt="background"
                
            /> */}
            <div className={styles.sliderContainer}>


                
                <Image
                 
                    src="/A2343211_TD03_V1_3078x-2_dvhoa5.webp"
                    width={1400}
                  
                    height={560}
                    loading='lazy'
                />
              
                <div ref={slider} className={styles.slider}>
                    <p className='text-rose-400 dark:text-slate-100 text-xl lg:text-2xl hidden md:block' ref={firstText}>Instant Helicobacter  Kit -
</p>
                    <p className='text-rose-400 hidden md:block dark:text-slate-100  hidden lg:block' ref={secondText}>Non-invasiveNon-invasive
</p>

                 
                </div>
            </div>
        </main>
    )
}
