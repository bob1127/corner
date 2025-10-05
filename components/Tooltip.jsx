"use client"
import React from "react";

import { Tooltip, Button } from "@nextui-org/react";

export default function App() {
    return (
        <Tooltip
            content={
                <div className="p-6 border border-black w-80">
                    <div className="text-small font-bold">Custom Content</div>
                    <div className="text-tiny">This is a custom tooltip content</div>

                    <img className="w-full" src="https://www.ritualzeroproof.com/cdn/shop/articles/Bitters_4576e29a-9d5f-43ac-95c6-7ea247c8561b_2048x.jpg?v=1655914171" alt="" />
                </div>
            }
        >
            <a variant="" classNames={{
                base: "py-2 px-4 shadow-xl text-black bg-gradient-to-br from-white to-neutral-400",
                arrow: "bg-neutral-400 dark:bg-white",
            }} >
                <a className=" bg-black text-white px-3 py-1 rounded-full text-xs">集氣袋插口</a>
            </a>
        </Tooltip>
    );
}
