import React from "react";
import { Card, CardHeader, CardBody, Image, Chip } from "@nextui-org/react";

export default function App() {
    return (
        <div className="flex flex-wrap w-full justify-center">


            <Card className="py-4 hover:border duration-1000 m-4 w-1/4">
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
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO_Q-_5-BStaeoVizbqLPNmMqn73E2FaKV3WquuMbrkWll8oZMKBnqaAlCZckFGgwKXxQ&usqp=CAU"
                        width={270}
                    />
                </CardBody>
            </Card>
            <Card className="py-4 hover:border duration-1000 m-4 w-1/4">
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
            <Card className="py-4 hover:border duration-1000 m-4 w-1/4">
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
    );
}
