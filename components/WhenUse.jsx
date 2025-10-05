import React from 'react';
import Image from 'next/image';
import ReadMoreReact from 'read-more-react';
import logo from '../public/logo.svg';

import Link from 'next/link';
import { Card, CardHeader, CardBody, Tooltip, Button } from "@nextui-org/react";
const myLoader02 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/product-01/${src}?w=${width}?p=${placeholder}`
}
const myLoader03 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/${src}?w=${width}?p=${placeholder}`
}
const myLoader01 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/Products-Detail-Img/UH-1/${src}?w=${width}?p=${placeholder}`
}
const myLoader05 = ({ src, width, quality, placeholder }) => {
    return `https://www.ultraehp.com/images/index/${src}?w=${width}?p=${placeholder}`
}

export default function Header() {
    return (
        <div>
            <section className="px-[20px] md:px-0  flex center ">
                <div className=" container mx-auto md:px-10 lg:px-10">

                    <h1 className="mt-2  text-center text-4xl font-bold uppercase">


                    </h1>

                    <h2 id='fff' className="h2-u">  When should I use the Humming Probe <br/> pH Measurement System?



                    </h2>



                    <div className="  flex w-full  mt-[20px] justify-center">
                        <div className="card-wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:px-[50px] px-0">

                            <div className="border">
                                <Card className="py-4">
                                    <CardHeader className="pb-0 pt-2 px-4 flex-col  items-start">
                                        <b className="font-bold text-[18px] text-large">Biological lab

                                        </b>
                                        <ReadMoreReact text="The pH value for culture media or buffer solutions are usually adjusted to within 0.1 pH. Our product, the Humming Probe, is able to monitor the pH value of culture media at any time by directly insertion to make sure the cells and bacteria are growing under the correct environment.
"
                                            min={70}
                                            ideal={80}
                                            duration={500}
                                            max={100}
                                            readMoreText="...." />
                                
                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            loader={myLoader02}
                                            alt="Biological lab-UltraE"
                                            className="object-cover rounded-xl"
                                            placeholder="empty"
                                            loading="lazy"
                                            src="FAQ-01.webp"
                                            width={500}
                                            height={300}
                                        />
                                    </CardBody>
                                </Card>

                            </div>
                            <div>
                                <Card className="py-4">
                                    <CardHeader className="pb-0 pt-2 px-4 flex-col  items-start">
                                        <b className="font-bold text-[18px] text-large">Outdoor on-site inspection
</b>
                                        <ReadMoreReact text="Traditional methods of monitoring outdoor environmental pollution often require samples to be taken to the laboratory for testing. Direct on-site testing is rarely used, and it often takes a long time to detect pollution problems. The Humming Probe pH Measurement System does not require you to carry a variety of calibration solutions, only requiring the pH meter and the pH strips, to perform direct on-site testing. The test results can be obtained quickly, the testing time can be greatly shortened, and the degree of pollution can be understood immediately.
"
                                            min={70}
                                            ideal={80}
                                            duration={500}
                                            max={100}
                                            readMoreText="...." />

                                  

                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            loader={myLoader02}
                                            alt="Outdoor on-site inspection-UltraE
"
                                            className="object-cover rounded-xl"
                                            placeholder="empty"
                                            loading="lazy"
                                            src="FAQ-02.webp"
                                            width={500}
                                            height={300}
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            <div>
                                <Card className="py-4">
                                    <CardHeader className="pb-0 pt-2 px-4 flex-col  items-start">
                                        <b className="font-bold text-[18px] text-large">Biomedical detection field

                                        </b>
                                     

                                        <ReadMoreReact text="Colorimetric methods to measure are commonly used instead of traditional pH meter, due to the low volume of biomedical samples such as blood, urine, or interstitial fluid. However, colorimetric methods are often difficult to obtain accurate data. In contrast, our Humming Probe only requires 1-20 μL volume of sample to perform testing. Moreover, the Humming Probe System can be integrated with other detection sensors through customization.
"
                                            min={120}
                                            ideal={160}
                                            max={200}
                                            readMoreText="...." />

                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            loader={myLoader02}
                                            alt="Biomedical detection field-UltraE"
                                            className="object-cover rounded-xl"
                                            placeholder="empty"
                                            loading="lazy"
                                            src="FAQ-03.webp"
                                            width={500}
                                            height={300}
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            <div>
                                <Card className="py-4">
                                    <CardHeader className="pb-0 pt-2 px-4 flex-col   items-start">
                                        <b className="font-bold text-[18px] text-large">Agricultural field

                                        </b>


                                        <ReadMoreReact text="The acidity and alkalinity (pH) of the soil is an important step in planting crops. The Humming Probe pH Measurement System can test soil pH directly in moist soil or using a simple water-soluble medium to assist in plant growth management or soil improvement.
"
                                            min={120}
                                            ideal={160}
                                            max={200}
                                            readMoreText="...." />

                                            
                                 

                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            alt="Agricultural field
-UltraE"
                                            className="object-cover rounded-xl"
                                            placeholder="empty"
                                            loading="lazy"

                                            loader={myLoader02}

                                            src="FAQ-04.webp"
                                            width={500}
                                            height={300}
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                            <div><Card className="py-4">
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start  ">
                                    <b className="font-bold text-[18px] text-large">Food and beverage processing industry

                                    </b>
                                    <ReadMoreReact text="In the process of producing food, pH value will affect the taste, freshness, and shelf-life of the final product. The design of the patented ionic membrane and disposable electrode of the Humming Probe pH strip can overcome the complex composition of the sample, which usually requires a pre-treatment process to accurately measure to provide accurate pH measurements for meat, fish, jam, seafood, milk, cheese, yogurt, dairy products, sauces, teas, etc.

"
                                        min={70}
                                        ideal={80}
                                        duration={500}
                                        max={100}
                                        readMoreText="...." />


                                 
                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Image
                                        loader={myLoader02}
                                        alt="Food and beverage processing industry-UltraE"
                                        className="object-cover rounded-xl"
                                        placeholder="empty"
                                        loading="lazy"
                                        src="FAQ-05.webp"
                                        width={500}
                                        height={300}
                                    />
                                </CardBody>
                            </Card></div>
                            <div><Card className="py-4">
                                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start  ">
                                    <b className="font-bold text-[18px] text-large">Synthesis lab

                                    </b>
                                    <ReadMoreReact text="No matter if you are doing organic, non-organic or polymer synthesis experiments, it is necessary to control the pH value in every phase under different reaction conditions. The Humming Probes pH meter can be directly dipped into small samples at different stages to obtain accurate pH values. Its disposable design can also avoid impurities on the electrodes or introducing contaminants to the system.

"
                                        min={70}
                                        ideal={80}
                                        duration={500}
                                        max={100}
                                        readMoreText="...." />


                                </CardHeader>
                                <CardBody className="overflow-visible py-2">
                                    <Image
                                        loader={myLoader02}
                                        placeholder="empty"
                                        loading="lazy"
                                        alt="Synthesis lab-UltraE"
                                        className="object-cover rounded-xl"
                                        src="FAQ-06.webp"
                                        width={500}
                                        height={300}
                                    />
                                </CardBody>
                            </Card></div>





                        </div>
                    </div>








                    {/* </motion.div> */}


                </div>



            </section>

        </div>
    );
}
