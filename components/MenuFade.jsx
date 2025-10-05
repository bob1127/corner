import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
const MenuFade = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div>
      {/* Navbar Section */}
      <section className="Navbar fixed bg-white top-0 left-0 z-[999999] w-[100vw] pb-[20px] border border-black flex flex-col">
        <div className=" bg-[#eeee22] mb-[20px] py-1  w-full top-slider">
          <Marquee>
            <a href="" className="flex">
              <p className="mr-4 font-normal text-[14px]">Taiwan🇵🇷</p>
              <p className="mr-4 font-normal text-[14px]">Taipei🇲🇵</p>
              <p className="mr-4 font-normal text-[14px]">Koushung🇨🇦</p>
              <p className="mr-4 font-normal text-[14px]">Taichung🇱🇮</p>
            </a>
          </Marquee>
        </div>
        <div className="flex">
          <div className="w-1/3"></div>
          <div className="w-1/3 flex justify-center">
            <div className="logo font-extrabold">TRAVEL</div>
          </div>
          <div className="w-1/3 flex justify-end">
            <div
              className="toggle-btn mr-[100px] cursor-pointer"
              onClick={toggleMenu}
            >
              X
            </div>
          </div>
        </div>
      </section>

      {/* MenuToggle Section */}
      <div
        className={`MenuToggle mt-[-10px] bg-[#f3f3f3] flex w-[100vw] h-[95vh] fixed top-[10%] left-0 z-[999998] transition-all duration-500 ${
          menuVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="left w-1/2 flex flex-col ">
          <div className="h-1/2 w-full top bg-white relative flex justify-center items-center">
            <div className="absolute top-8 left-0 w-full">
              <div className="flex justify-between px-5">
                <b className="text-[20px]"> 叫車服務</b>
                <b>REVERATION</b>
              </div>
            </div>
            <div>
              <img
                className="w-[400px]"
                src="https://www.ponyrent.com.tw/upload/202109011223251.png"
                alt=""
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full">
              <div className="flex justify-between px-5">
                <b className="text-[34px] text-[#fc4e2b]">BOOKING</b>
                <b className="text-[30px]">➣</b>
              </div>
            </div>
          </div>
          <div className="h-1/2 w-full bottom bg-[#1b1513] relative flex justify-center items-center">
            <div className="absolute top-8 left-0 w-full">
              <div className="flex justify-between px-5">
                <b className="text-[20px] text-[#f7e8dc]"> 購物市集</b>
                <b className="text-[#f7e8dc]">SHOP NOW</b>
              </div>
            </div>
            <div>
              <img
                className="w-[200px] rotate-12 rounded-[40px]"
                src="/images/800x (8).webp"
                alt=""
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full">
              <div className="flex justify-between px-5">
                <b className="text-[34px] text-[#fc4e2b]">SHOP</b>
                <b className="text-[30px]">➣</b>
              </div>
            </div>
          </div>
        </div>
        <div className="right  w-1/2 border">
          <div className="categories">
            <div className="top-title flex py-6 px-[50px] justify-between">
              <h4 className="text-[22px]">◉ CATEGORIES</h4>
              <h4 className="text-[16px]">View All</h4>
            </div>
            <div className="categories-wall grid grid-cols-3">
              {/* Example category items */}
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_2.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_1.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_6.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_10.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_9.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_8.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_7.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_3.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              <div
                className="w-full group relative bg-cover bg-center transition-all duration-500"
                style={{
                  aspectRatio: "4 / 3",
                  backgroundImage:
                    "url('https://transit.jp/wp-content/uploads/2024/09/category_thumb_5.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full transition-all duration-1000 hover:brightness-75">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_50%,rgba(0,0,0,0.2)_100%)] opacity-0 transition-opacity duration-1000 hover:opacity-100"></div>
                </div>
                <div className="txt absolute z-[99] bottom-0 w-full">
                  <div className="left pl-5 pb-4 w-1/2 overflow-hidden relative">
                    <p className="font-extrabold text-white text-[22px] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-white after:origin-left after:transition-all after:duration-500 group-hover:after:w-full">
                      旅遊行程
                    </p>
                    <p className="text-[14px] text-white">路線</p>
                  </div>
                </div>
              </div>
              {/* Add other categories as needed */}
            </div>
          </div>
          <div className="about relative">
            <Image
              src="/images/sss.jpg"
              width={1200}
              height={600}
              alt=""
              className=" top-0 left-0 z-[9]"
              placeholder="empty"
              loading="lazy"
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MenuFade;
