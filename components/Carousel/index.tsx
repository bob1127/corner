import type { NextPage } from 'next';
import Head from 'next/head';
// import Header from '../components/Header';
import Carousel from './Carousel';

import Image from 'next/image';


import card2 from '../../public/card2.svg';
import card3 from '../../public/card3.svg';
import card4 from '../../public/card4.svg';

const imagesItems = [
    <Image width={700} height={550} src='/業界最小的_無線_電化學分析儀-實擬功能_lofyp6' alt="teste" />,
    <Image width={700} height={550} src='/業界最小的_無線_電化學分析儀-實擬功能_lofyp6' alt="teste" />,
    <Image width={700} height={550} src='/業界最小的_無線_電化學分析儀-實擬功能_lofyp6' alt="teste" />,
    <Image width={700} height={550} src='/' alt="teste" />,
];



const Home: NextPage = () => {
    return (
        <div className="h-screen w-screen overflow-hidden bg-bg text-white">
            <section className='mt-[100px]'>
                <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                    <div className="mb-10 flex justify-center flex-col  items-center space-y-6">
                        <h1 className="text-4xl font-bold md:text-5xl w-1/2 leading-none ">超極生技以專利技術開發的免校正拋棄式 pH meter 酸鹼度計</h1>
                       
                    </div>
                    <Carousel items={imagesItems} />
                </main>
            </section>
           
            
        </div>
    );
};

export default Home;
