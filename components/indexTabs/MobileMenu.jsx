import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { MonitorMobileIcon } from "./MonitorMobileIcon";
import { ShieldSecurityIcon } from "./ShieldSecurityIcon";
import { InfoIcon } from "./InfoIcon";
import { InvalidCardIcon } from "./InvalidCardIcon";

export default function App() {
    const itemClasses = {
        base: "py-0 w-full",
        title: "font-normal text-medium",
        trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
        indicator: "text-medium",
        content: "text-small px-2",
    };

    const defaultContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";


    return (
        <Accordion
            showDivider={false}
            className=" h-full px-2 pt-[70px] flex flex-col gap-1 w-full  mt-[-40px] border  z-50 fixed"
            variant="shadow"
            itemClasses={itemClasses}
        >
            <AccordionItem
                key="1"
                aria-label="Our Products"
                startContent={<MonitorMobileIcon className="text-primary" />}
                subtitle={
                    <p className="flex">
                        2 issues to <p className="text-primary ml-1">fix now</p>
                    </p>
                }
                title="Our Products"
            >
                {/* {defaultContent} */}

                <Accordion>
                    <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
                       
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                       
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                       
                    </AccordionItem>
                </Accordion>
            </AccordionItem>
            <AccordionItem
                key="2"
                aria-label="Apps Permissions"
                startContent={<ShieldSecurityIcon />}
                subtitle="3 apps have read permissions"
                title="Apps Permissions"
            >
                {defaultContent}
            </AccordionItem>
            <AccordionItem
                key="3"
                aria-label="Pending tasks"
                classNames={{ subtitle: "text-warning" }}
                startContent={<InfoIcon className="text-warning" />}
                subtitle="Complete your profile"
                title="Pending tasks"
            >
                {defaultContent}
            </AccordionItem>
            <AccordionItem
                key="4"
                aria-label="Card expired"
                classNames={{ subtitle: "text-danger" }}
                startContent={<InvalidCardIcon className="text-danger" />}
                subtitle="Please, update now"
                title={
                    <p className="flex gap-1 items-center">
                        Card expired
                        <p className="text-default-400 text-small">*4812</p>
                    </p>
                }
            >
                {defaultContent}
            </AccordionItem>
        </Accordion>
    );
}
