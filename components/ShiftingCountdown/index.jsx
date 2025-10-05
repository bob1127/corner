import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// NOTE: Change this date to whatever date you want to countdown to :)
const COUNTDOWN_FROM = "2025-4-24";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = () => {
  return (
    <div className=" p-1">
      <div className="mx-auto flex w-[150px]  items-center ">
        <CountdownItem unit="Day" text="日" />
        <CountdownItem unit="Hour" text="時" />
        <CountdownItem unit="Minute" text="分" />
        <CountdownItem unit="Second" text="秒" />
      </div>
    </div>
  );
};

const CountdownItem = ({ unit, text }) => {
  const { ref, time } = useTimer(unit);

  return (
    <div className="flex  h-18 xl:h-36 w-1/4 flex-col items-center justify-center  font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-lg xl:text-2xl font-medium text-white md:text-4xl lg:text-6xl xl:text-7xl"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light text-white md:text-sm lg:text-base">
        {text}:
      </span>
    </div>
  );
};

export default ShiftingCountdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
const useTimer = (unit) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    // 等待 ref 綁定後才開始倒數
    const timeout = setTimeout(() => {
      if (ref.current) {
        intervalRef.current = setInterval(handleCountdown, 1000);
      }
    }, 50); // 小延遲讓 ref 有機會綁上

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalRef.current || undefined);
    };
  }, []);

  const handleCountdown = async () => {
    if (!ref.current) return; // ✅ 加入防呆：確保 ref 存在

    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }
  };

  return { ref, time };
};
