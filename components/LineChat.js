import { useEffect } from "react";

export default function LineChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="ml-10  line-it-chat border w-[400px] border-red-500"
      data-acc="@391huutså"
      data-chat-title="聯絡我們"
      data-chat-subtitle="即時回覆"
      data-env="REAL"
    >Line</div>
  );
}
