"use client";

import { useEffect, useState, useRef } from "react";

interface IframeWrapperProps {
  src: string;
}

export default function IframeWrapper({ src }: IframeWrapperProps) {
  const [iframeHeight, setIframeHeight] = useState("100vh");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(src).origin) return; // 確保只有可信的來源可以改變高度
      if (event.data.type === "updateHeight") {
        setIframeHeight(event.data.height + "px");
      }
    };

    window.addEventListener("message", handleMessage);

    const checkIframeLoaded = () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          { type: "requestHeight" },
          new URL(src).origin
        );
      }
    };

    const interval = setInterval(checkIframeLoaded, 1000); // 每秒發送一次請求高度

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [src]);

  return (
    <div className="relative pt-[200px] pb-[150px] w-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src={src}
        scrolling="no"
        style={{
          width: "100%",
          height: iframeHeight,
          border: "none",
          overflow: "hidden",
        }}
        className="w-full no-scrollbar"
      />
    </div>
  );
}
