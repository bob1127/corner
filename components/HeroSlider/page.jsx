import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const FullScreenSlider = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slidesRef = useRef([]);
  const slideInterval = useRef(null);
  const progressBarRef = useRef(null);
  const progressBarTimeline = useRef(null);

  const slideNames = [
    "PhotoGraphy",
    "EtherShift-Demo",
    "Website Design",
    "Website Seo",
    "Ether Shift Mode",
  ];

  const slideYears = ["2023", "2021", "2022", "2023", "2017"];

  const slideDuration = 3000; // Slide duration in milliseconds

  useEffect(() => {
    const slides = slidesRef.current;

    const showSlide = (index) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const slide = slides[index];
      const img = slide.querySelector("img");

      gsap.fromTo(
        img,
        { scale: 1.2, top: "4em" },
        {
          scale: 1,
          top: "0%",
          duration: 2.5,
          ease: "power3.inOut",
        }
      );

      gsap.to(slide, {
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
        duration: 2,
        ease: "power4.inOut",
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      gsap.fromTo(
        ".slide-name, .slide-year",
        { y: "30px", opacity: 0 },
        {
          y: "0px",
          opacity: 1,
          duration: 1.6,
          ease: "power3.inOut",
          stagger: 0.1,
        }
      );
    };

    const hideSlide = (index) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const slide = slides[index];
      const img = slide.querySelector("img");

      gsap.to(slide, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        duration: 4,

        ease: "power4.inOut",
      });

      gsap.to(img, {
        scale: 2,
        top: "4em",
        duration: 3,

        ease: "power3.inOut",
      });

      gsap.to(".slide-name, .slide-year", {
        y: "-40px",
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        stagger: 0.1,
      });
    };

    const startSlideShow = () => {
      // Create and start progress bar timeline
      progressBarTimeline.current = gsap.timeline({ repeat: -1 });

      progressBarTimeline.current
        .to(progressBarRef.current, {
          width: "100%",
          duration: slideDuration / 1000,
          ease: "none",
        })
        .set(progressBarRef.current, { width: "0%" });

      slideInterval.current = setInterval(() => {
        if (!isAnimating) {
          const nextSlideIndex = (currentSlideIndex + 1) % slides.length;
          hideSlide(currentSlideIndex);
          setTimeout(() => {
            setCurrentSlideIndex(nextSlideIndex);
            showSlide(nextSlideIndex);
          }, 0); // Slight delay for smoother transition
        }
      }, slideDuration);

      // Play progress bar animation
      progressBarTimeline.current.play();
    };

    startSlideShow();

    return () => {
      clearInterval(slideInterval.current);
      if (progressBarTimeline.current) {
        progressBarTimeline.current.kill();
      }
    };
  }, [isAnimating, currentSlideIndex]);

  useEffect(() => {
    // Reset progress bar timeline each time currentSlideIndex changes
    if (progressBarTimeline.current) {
      progressBarTimeline.current.restart();
    }
  }, [currentSlideIndex]);

  return (
    <div className="relative w-screen  h-[95vh]">
      <div className="txt w-full text-[rgb(213,213,213)] ">
        <p className="text-[#f3f3f3] leading-[15px] z-[9999999999] w-1/2 absolute bottom-[50px] left-[126px] font-light">
          Lorem ipsum, dolor sit amet <br /> consectetur adipisicing elit.
          Minima <br /> quis quaerat consequuntur
        </p>
      </div>
      <div className="slider-content   bg-black-opacity ">
        <div className="slide-number absolute top-1/2 left-10 transform -translate-x-1/2 -translate-y-1/2 flex gap-1 text-white uppercase text-lg"></div>

        <div className="slide-name absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-white uppercase text-lg">
          <div className="names flex flex-col items-center">
            <div>{slideNames[currentSlideIndex]}</div>
          </div>
        </div>

        <div className="slide-year absolute top-1/2 right-1/5 transform -translate-x-1/2 -translate-y-1/2 text-white uppercase text-[32px]">
          <div className="years flex flex-col items-center">
            <div>{slideYears[currentSlideIndex]}</div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-full">
        {[1, 2, 3, 4, 5].map((num, idx) => (
          <div
            key={num}
            ref={(el) => (slidesRef.current[idx] = el)}
            className={`slide clip-path-slide ${
              currentSlideIndex === idx ? "active" : ""
            }`}
            id={`slide-${num}`}
          >
            <img src={`/images/img-${num}.jpg`} alt={`Slide ${num}`} />
          </div>
        ))}
        <div className="spacer"></div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container absolute bottom-4 right-4 w-32 h-2 bg-gray-300">
        <div
          ref={progressBarRef}
          className="progress-bar h-full bg-white"
        ></div>
      </div>
    </div>
  );
};

export default FullScreenSlider;
