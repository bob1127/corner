import { useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

const AnimatedScroll = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const stickySection = document.querySelector(".sticky");
    const stickyHeader = document.querySelector(".sticky-header");
    const cards = document.querySelectorAll(".card");
    const stickyHeight = window.innerHeight * 5;

    const transforms = [
      [
        [10, 50, -10, 10],
        [20, -10, -45, 20],
      ],
      [
        [0, 47.5, -10, 15],
        [-25, 15, -45, 30],
      ],
      [
        [0, 52.5, -10, 5],
        [15, -5, -40, 60],
      ],
      [
        [0, 50, 30, -80],
        [20, -10, 60, 5],
      ],
      [
        [0, 55, -15, 30],
        [25, -15, 60, 95],
      ],
    ];

    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;

        const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
        const translateX = -progress * maxTranslate;
        gsap.set(stickyHeader, { x: translateX });

        cards.forEach((card, index) => {
          const delay = index * 0.1125;
          const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

          if (cardProgress > 0) {
            const cardStartX = 25;
            const cardEndX = -650;
            const yPos = transforms[index][0];
            const rotations = transforms[index][1];

            const cardX = gsap.utils.interpolate(
              cardStartX,
              cardEndX,
              cardProgress
            );

            const yProgress = cardProgress * 3;
            const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
            const yInterpolation = yProgress - yIndex;
            const cardY = gsap.utils.interpolate(
              yPos[yIndex],
              yPos[yIndex + 1],
              yInterpolation
            );

            const cardRotation = gsap.utils.interpolate(
              rotations[yIndex],
              rotations[yIndex + 1],
              yInterpolation
            );

            gsap.set(card, {
              xPercent: cardX,
              yPercent: cardY,
              rotation: cardRotation,
              opacity: 1,
            });
          } else {
            gsap.set(card, { opacity: 0 });
          }
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.globalTimeline.clear();
    };
  }, []);

  return (
    <div className="relative">
      <section className="sticky relative bg-gray-100 h-screen">
        <div className="sticky-header absolute top-0 left-0 w-[250vw] h-full flex justify-center items-center">
          <h1 className="text-[20vw] font-light text-black">
            Welcome to Taiwan
          </h1>
        </div>

        <div className="hover:scale-95 duration-500 hover:shadow-xl">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="card absolute top-[10%] left-[100%] w-[325px] h-auto bg-black rounded-[60px] overflow-hidden text-white"
            >
              <div className="card-img w-full h-[200px] rounded-lg overflow-hidden">
                <img
                  src={`./assets/img${index + 1}.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="card-content relative p-10 flex flex-col justify-between ">
                <h2 className="text-2xl font-light text-white">
                  Taiwan {index + 1}
                </h2>
                <p className="text-lg text-center font-light text-white">
                  Travel is Life {index + 1}.
                </p>
                <div className="dot bg-white z-[99] w-[20px] h-[20px] rounded-full absolute bottom-6 right-6"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnimatedScroll;
