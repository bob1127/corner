import React from "react";
import { CldVideoPlayer } from 'next-cloudinary';
import { Tabs, Tab, Card, CardBody, CardFooter, CardHeader, Button } from "@nextui-org/react";
import Image from 'next/image';
const myLoader = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/nav/${src}?w=${width}?p=${placeholder}`
}
const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UP100/${src}?w=${width}?p=${placeholder}`
}
const myLoader02 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/about/${src}?w=${width}?p=${placeholder}`
}
export default function App() {
    return (
        <div>
            <div className="grid grid-cols-1  lg:grid-cols-2">


                <div>
                    <div className="img  pr-0 md:pr-[30px]">
                        <div className="txt">
                            <p>UltraE Co., Ltd. was established in 2016, with a team dedicating 30 years of experience in the development and mass production of biosensors. Leveraging its patented Potentiostrip® technology platform, the company focuses on the research, development, and manufacturing of water quality testing and in vitro diagnostic (IVD) medical devices. In 2019, UltraE Co., Ltd. launched its first brand, Humming Probe, a calibration-free disposable micro-electrode pH measurement system, providing solutions to the challenges of cumbersome pH meter calibration and micro-sample measurement.</p> <br/>
                            <p >
                                In 2021, the company introduced its second brand, UltraPeace, the Instant H. pylori Urea Breath Test Kit System. This non-invasive system can accurately detect H. pylori infection within 30 minutes, enabling medical professionals to quickly diagnose, determine the appropriate medications, and conduct follow-up testing after treatment.
                            </p><br/>

                            <p>
                                UltraE Co., Ltd. upholds the entrepreneurial spirit of "Ultra-Micro Electrode, Ultra-Healthy Life" as its core value and guiding principle, aiming to develop sustainable businesses that contribute to human health.
                            </p>

                        </div>
                        
                    </div>
                    <div className="txt">
                        
                    </div>
                    {/* <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
                        <Card className="col-span-12 sm:col-span-4 h-[300px]">
                            <CardHeader className="absolute z-1 top-1 flex-col !items-start">
                                <p className="text-tiny text-white/60 uppercase font-bold">What to watch</p>
                                <h4 className="text-white font-medium text-large">Stream the Acme event</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Card background"
                                className="z-0 w-full h-full object-cover"
                                src="https://www.ultraehp.com/images/SG01-Camera.png"
                            />
                        </Card>
                        <Card className="col-span-12 sm:col-span-4 h-[300px]">
                            <CardHeader className="absolute z-1 top-1 flex-col !items-start">
                                <p className="text-tiny text-white/60 uppercase font-bold">Plant a tree</p>
                                <h4 className="text-white font-medium text-large">Contribute to the planet</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Card background"
                                className="z-0 w-full h-full object-cover"
                                src="https://cdn.shopify.com/s/files/1/0493/9834/9974/files/A9129111_TD03_V1-1280x1280_2878x.jpg?v=1696753050"
                            />
                        </Card>
                        <Card className="col-span-12 sm:col-span-4 h-[300px]">
                            <CardHeader className="absolute z-1 top-1 flex-col !items-start">
                                <p className="text-tiny text-white/60 uppercase font-bold">主辦單位：台北市儀器商業同業公會

</p>
                                <h4 className="text-white font-medium text-large">第十五屆台北國際儀器展
</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Card background"
                                className="z-0 w-full h-full object-cover"
                                src="https://cdn.shopify.com/s/files/1/0493/9834/9974/files/A9129111_TD02_V1-1280x1280_2878x.jpg?v=1696753050"
                            />
                        </Card>
                        <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
                            <CardHeader className="absolute z-1 top-1 flex-col items-start">
                             

                                <p className="text-tiny text-white/60 uppercase font-bold">New</p>
                                <h4 className="text-black font-medium text-2xl">Acme camera</h4>
                         
                            </CardHeader>

                            <div className="relative flex-col pl-20 flex justify-center mb-8 aos-init aos-animate" data-aos="zoom-in-up" data-aos-delay="450">
                            <Image
                                removeWrapper
                                alt="Card example background"
                                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                                src="https://cdn.shopify.com/s/files/1/0493/9834/9974/files/A1289011_TD03_V1_4e2cb9bf-58f8-4dc3-81b2-4d6cf73f1683_2878x.jpg?v=1683699565"
                            />
                            </div>


                            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-1 justify-between">
                                <div>
                                    <p className="text-black text-tiny">Available soon.</p>
                                    <p className="text-black text-tiny">Get notified.</p>
                                </div>
                                <Button className="text-tiny" color="primary" radius="full" size="sm">
                                    Notify Me
                                </Button>
                            </CardFooter>
                        </Card>
                        <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
                            <CardHeader className="absolute z-1 top-1 flex-col items-start">
                                <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
                                <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Relaxing app background"
                                className="z-0 w-full h-full object-cover"
                                src="https://cdn.shopify.com/s/files/1/0493/9834/9974/files/A1289011_TD05_V1_35bed047-d425-4ab9-bb1a-624e83c4b96d_2878x.jpg?v=1683699565"
                            />
                            <CardFooter className="absolute bg-black/40 bottom-0 z-1 border-t-1 border-default-600 dark:border-default-100">
                                <div className="flex flex-grow gap-2 items-center">
                                    <Image
                                        alt="Breathing app icon"
                                        className="rounded-full w-10 h-11 bg-black"
                                        src="/images/breathing-app-icon.jpeg"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-tiny text-white/60">Breathing App</p>
                                        <p className="text-tiny text-white/60">Get a good night's sleep.</p>
                                    </div>
                                </div>
                                <Button radius="full" size="sm">Get App</Button>
                            </CardFooter>
                        </Card>
                    </div> */}

                </div>
                <div className="mt-[30px] md:mt-0">
                  
                    <div className="flex w-full md:mt-0 justify-center items-center align-middle flex-col   rounded-2xl   ">
                     
                        <Tabs aria-label=" flex bg-white justify-center  Options">
                         
                            <Tab key="music" className="border-none bg-transparent" title="Quality Management">
                                <Card className="border-none bg-transparent bg-white">

                                    <CardBody>
                                        <div className="grid  grid-cols-1  ">
                                            <disv className="relative flex justify-center mb-8" data-aos="fade-up" data-aos-duration='4000' data-aos-delay="50">
                                                <div className="border rounded-2xl overflow-hidden">
                                                    <Image width={400} height={300} src='20210714-20210714_031832000_iOS.jpg' alt='家用版' loader={myLoader02} ></Image>
                                                </div>
                                            </disv>
                                            <div className="relative flex justify-center mb-8" data-aos="fade-up" data-aos-delay="450">
                                                <div className="border rounded-2xl  p-5">

                                                    <h2 className="dark:text-white  text-[18px] font-bold">
                                                        Quality Management

                                                    </h2>
                                                    <p className="text-[14px] dark:text-white ">In May, 2021, Chaotix Biotech officially passed the international validation of ISO 9001:2015 quality management system and obtained the certificate. Comprehensive quality control, automated production equipment, and strict production process control are our business philosophy.

</p>
                                                    {/* <img src={img01} alt="" className="w-full " /> */}
                                                    {/* <span className="text-5xl after:content-['min '] text-orange-500">
                                                        30
                                                    </span> */}




                                                </div>
                                            </div>


                                        </div>

                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="
                            " className=" text-white" title=" Professional
                            ">
                                <Card>
                                    <CardBody>
                                        <div className="grid  grid-cols-1  ">
                                            <disv className="relative flex justify-center  mb-8" data-aos="fade-up" data-aos-duration='4000' data-aos-delay="50">
                                            <div className=" rounded-xl">
                                                    <Image width={400} height={300} src='蜂鳥圖.webp' alt='家用版' loader={myLoader} ></Image>
                                                
                                            </div>
                                            </disv>
                                           <div className="relative flex justify-center mb-8" data-aos="fade-up" data-aos-delay="450">
                                            <div className="border rounded-2xl  p-5">

                                                <h2 className="dark:text-white  text-[18px] font-bold">
                                                        Professional, serious, meet your needs


                                                </h2>
                                                    <p className="text-[14px] dark:text-white ">We will work harder and harder to provide quality products and services, and to ensure the ultimate in quality and standardized processes to our partners.

</p>
                                                <img src="
                                                " alt="" />
                                                {/* <span className="text-5xl after:content-['min '] text-orange-500">
                                                    30
                                                </span> */}
                                             

                                                

                                            </div>
                                            </div>

                                            
                                        </div>
                                       
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
