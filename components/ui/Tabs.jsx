import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

const tabs = [
  {
    id: "熱銷品01",
    label: "熱銷品01",
    content: (
      <div className="flex  overflow-x-auto border border-black w-[400px]  gap-4">
        {" "}
        {/* 使用 flex-row 使卡片横向排列 */}
        <Card className="py-0 my-0 w-[300px] mx-0  border border-gray-200 m-1 p-3">
          <CardBody className="overflow-hidden py-0 my-0 mx-0 px-0">
            <Image
              alt="Card background"
              className=" "
              src="/images/截圖-2024-12-05-晚上9.47.11.png"
              width={250}
            />
          </CardBody>
          <CardHeader className="p-8 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Daily Mix</p>
            <small className="text-default-500">12 Tracks</small>
            <h4 className="font-bold text-large">Frontend Radio</h4>
          </CardHeader>
        </Card>
        <Card className="py-0 my-0 w-[300px] mx-0  border border-gray-200 m-1 p-3">
          <CardBody className="overflow-hidden py-0 my-0 mx-0 px-0">
            <Image
              alt="Card background"
              className=" "
              src="/images/截圖-2024-12-05-晚上9.47.11.png"
              width={250}
            />
          </CardBody>
          <CardHeader className="p-8 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Daily Mix</p>
            <small className="text-default-500">12 Tracks</small>
            <h4 className="font-bold text-large">Frontend Radio</h4>
          </CardHeader>
        </Card>
        <Card className="py-0 my-0 w-[300px] mx-0  border border-gray-200 m-1 p-3">
          <CardBody className="overflow-hidden py-0 my-0 mx-0 px-0">
            <Image
              alt="Card background"
              className=" "
              src="/images/截圖-2024-12-05-晚上9.47.11.png"
              width={250}
            />
          </CardBody>
          <CardHeader className="p-8 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Daily Mix</p>
            <small className="text-default-500">12 Tracks</small>
            <h4 className="font-bold text-large">Frontend Radio</h4>
          </CardHeader>
        </Card>
      </div>
    ),
  },
  {
    id: "熱銷品02",
    label: "熱銷品02",
    content: (
      <Card className="py-0 my-0 w-[300px] mx-0 ">
        <CardBody className="overflow-hidden py-0 my-0 mx-0 px-0">
          <Image
            alt="Card background"
            className=" "
            src="/images/截圖-2024-12-05-晚上9.47.32.png"
            width={250}
          />
        </CardBody>
        <CardHeader className="p-8 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">Frontend Radio</h4>
        </CardHeader>
      </Card>
    ),
  },
  {
    id: "熱銷品03",
    label: "熱銷品03",
    content: (
      <Card className="py-0 my-0 w-[300px] mx-0 ">
        <CardBody className="overflow-hidden py-0 my-0 mx-0 px-0">
          <Image
            alt="Card background"
            className=" "
            src="/images/截圖-2024-12-05-晚上9.46.54.png"
            width={250}
          />
        </CardBody>
        <CardHeader className="p-8 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">Frontend Radio</h4>
        </CardHeader>
      </Card>
    ),
  },
];

const TabCardExample = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);

  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  return (
    <div className="px-[10px] mx-auto">
      {/* Tabs 部分 */}
      <div className="flex flex-col lg:flex-row">
        <div className="TabsTitle   w-full lg:w-1/2 flex justify-start items-start flex-col">
          <h2>童裝，親膚膏質感！</h2>
          <h4 className="text-[28px] font-semibold">
            令人瞠目一新的技巧和教程
          </h4>
          <p className="mt-5">
            限制不存在。
            從中性色到令人震驚的明亮，在我們的指甲油顏色系列中表達你的色調。
          </p>
        </div>
        <div className="w-full mt-8 lg:mt-0 lg:w-1/2">
          <Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange}>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                title={tab.label}
                className="border" // 确保没有其他额外的样式影响
              ></Tab>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Card 部分 */}
      <div className="mt-4 flex overflow-x-auto whitespace-nowrap">
        {tabs
          .filter((tab) => tab.id === selectedTab)
          .map((tab) => (
            <div key={tab.id} className="inline-block flex-shrink-0">
              {tab.content}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TabCardExample;
