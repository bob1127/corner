
"use client"
import React from "react";
import { Card, CardHeader, CardBody, Image, Chip } from "@nextui-org/react";

export default function App() {
    return (
        <div className="flex flex-col flex-wrap w-full justify-center items-center ">

            {/* Section header */}
          
            {/* <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                <h1 className=" mb-4">專利技術建構的生態系健康檢測平台</h1>
                <p className="text-xl text-gray-600">多領域應用</p>
            </div> */}


            <div className="cardWrap flex flex-col w-full border justify-center items-start md:flex-row">
                <div className="relative flex justify-center mb-8" data-aos="fade-up" data-aos-delay="450">
                <Card className=" py-4 hover:border duration-1000 m-4 w-full md:1/4 ">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Daily Mix</p>
                        <small className="text-default-500">12 Tracks</small>
                        <h4 className="font-bold text-large">生醫檢測</h4>
                        <div className="flex gap-4 flex-wrap w-full">

                            <Chip color="danger">血糖</Chip>
                            <Chip color="danger">尿液酸鹼</Chip>
                            <Chip color="danger">尿酸</Chip>
                            <Chip color="danger">糖化寫色素</Chip>
                            <Chip color="danger">膽固醇</Chip>

                        </div>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <Image
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src=""
                            width={270}
                        />
                    </CardBody>
                </Card>
                </div>
                <div className="relative flex justify-center mb-8" data-aos="fade-up" data-aos-delay="850">
                <Card className="py-4 hover:border duration-1000 m-4 w-full md:1/4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Daily Mix</p>
                        <small className="text-default-500">12 Tracks</small>
                        <h4 className="font-bold text-large">食品安全</h4>
                        <div className="flex gap-4 flex-wrap w-full">

                            <Chip color="danger">農藥</Chip>
                            <Chip color="danger">亞硝酸鹽</Chip>
                            <Chip color="danger">瘦肉精</Chip>
                            <Chip color="danger">過敏原</Chip>
                            <Chip color="danger">生箘數</Chip>

                        </div>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 w-full border ">
                        <Image
                            alt="Card background"
                            className="object-cover rounded-xl w-full"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO_Q-_5-BStaeoVizbqLPNmMqn73E2FaKV3WquuMbrkWll8oZMKBnqaAlCZckFGgwKXxQ&usqp=CAU"

                        />
                    </CardBody>
                </Card>
                </div>
                <div className="relative flex justify-center mb-8" data-aos="fade-up" data-aos-delay="1250">
                <Card className="py-4 hover:border duration-1000 m-4 w-full md:1/4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Daily Mix</p>
                        <small className="text-default-500">12 Tracks</small>
                        <h4 className="font-bold text-large">環境污染</h4>
                        <div className="flex gap-4 flex-wrap w-full">

                            <Chip color="danger">重金屬</Chip>
                            <Chip color="danger">酸鹼</Chip>
                            <Chip color="danger">多氯聯苯</Chip>
                            <Chip color="danger">甲醛</Chip>
                            <Chip color="danger">氮氣</Chip>

                        </div>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <Image
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO_Q-_5-BStaeoVizbqLPNmMqn73E2FaKV3WquuMbrkWll8oZMKBnqaAlCZckFGgwKXxQ&usqp=CAU"
                            width={270}
                        />
                    </CardBody>
                </Card>
                </div>
            </div>
        </div>
    );
}
