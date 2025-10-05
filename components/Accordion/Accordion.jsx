import { useState } from "react";

const AccordionItem = ({ id, title, children, isOpen, toggle }) => {
  return (
    <div>
      <h2 id={`accordion-heading-${id}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200  focus:bg-[#aaddc1] dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-[#aaddc1] dark:hover:bg-gray-800 gap-3"
          onClick={() => toggle(id)}
          aria-expanded={isOpen}
          aria-controls={`accordion-body-${id}`}
        >
          <span>{title}</span>
          <svg
            className={`w-3 h-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      {isOpen && (
        <div
          id={`accordion-body-${id}`}
          className="p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
        >
          {children}
        </div>
      )}
    </div>
  );
};

const Accordion = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div id="accordion-color">
      <AccordionItem
        id={1}
        title="關於付款方式？"
        isOpen={openItem === 1}
        toggle={toggle}
      >
        <p className="mb-2 text-gray-500 dark:text-gray-400">
          Flowbite is an open-source library of interactive components built on
          top of Tailwind CSS including buttons, dropdowns, modals, navbars, and
          more.
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Check out this guide to learn how to{" "}
          <a
            href="/docs/getting-started/introduction/"
            className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            get started
          </a>{" "}
          and start developing websites even faster.
        </p>
      </AccordionItem>
      <AccordionItem
        id={2}
        title="退換貨"
        isOpen={openItem === 2}
        toggle={toggle}
      >
        <p className="mb-2 text-gray-500 dark:text-gray-400">
          Flowbite is first conceptualized and designed using the Figma software
          so everything you see in the library has a design equivalent in our
          Figma file.
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Check out the{" "}
          <a
            href="https://flowbite.com/figma/"
            className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            Figma design system
          </a>{" "}
          based on Tailwind CSS.
        </p>
      </AccordionItem>
      <AccordionItem
        id={3}
        title="其他優惠和注意事項"
        isOpen={openItem === 3}
        toggle={toggle}
      >
        <p className="mb-2 text-gray-500 dark:text-gray-400">
          The main difference is that Flowbite is open source under the MIT
          license, whereas Tailwind UI is a paid product.
        </p>
        <p className="mb-2 text-gray-500 dark:text-gray-400">
          However, we recommend using both for the best of two worlds.
        </p>
        <p className="mb-2 text-gray-500 dark:text-gray-400">Learn more:</p>
        <ul className="ps-5 text-gray-500 list-disc dark:text-gray-400">
          <li>
            <a
              href="https://flowbite.com/pro/"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Flowbite Pro
            </a>
          </li>
          <li>
            <a
              href="https://tailwindui.com/"
              rel="nofollow"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Tailwind UI
            </a>
          </li>
        </ul>
      </AccordionItem>
    </div>
  );
};

export default Accordion;
