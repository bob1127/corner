import React, { useState, useEffect } from "react";
import Image from "next/image";
const PopupAd = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 在组件挂载后5秒显示广告
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // 5000ms = 5秒

    // 清除定时器，避免组件卸载后定时器仍然存在
    return () => clearTimeout(timer);
  }, []);

  // 关闭广告
  const closeAd = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="popup-overlay">
          <div className="popup-container w-[95%] md:w-[60%] 2xl:w-[55%]">
            <div className="popup-header ">
              <h2></h2>
              <button className="close-btn  " onClick={closeAd}>
                X
              </button>
            </div>
            <div className="popup-body">
              <Image
                src="/images/hot_sale/S__4579335.jpg"
                alt="popup-ad"
                placeholder="empty"
                loading="lazy"
                width={800}
                height={600}
              ></Image>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999999999;
        }

        .popup-container {
          background: transparent;
          border-radius: 8px;
          padding: 20px;

          animation: popup 0.5s ease-in-out;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding-bottom: 10px;
        }

        .popup-body {
          margin: 10px 0;
        }

        .popup-footer {
          display: flex;
          justify-content: flex-end;
        }

        .close-btn {
          background: #ff4444;
          color: white;
          border: none;
          width: 25px;
          height: 25px;

          border-radius: 4px;
          cursor: pointer;
        }

        .close-btn:hover {
          background: #ff2222;
        }

        @keyframes popup {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default PopupAd;
