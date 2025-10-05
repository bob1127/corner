import { useEffect, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

const Slider = () => {
  const [currentImg, setCurrentImg] = useState(1);
  const totalSlides = 5;

  useEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop",
      "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );

    const sliderImages = document.querySelector(".slider-images");
    const counter = document.querySelector(".counter");
    const titles = document.querySelector(".slider-title-wrapper");
    const indicators = document.querySelectorAll(".slider-indicators p");
    const prevSlides = document.querySelectorAll(".slider-preview .preview");
    const slidePreview = document.querySelector(".slider-preview");

    let indicatorRotation = 0;

    function updateCounterAndTitlePosition() {
      const counterY = -20 * (currentImg - 1);
      const titleY = -60 * (currentImg - 1);

      gsap.to(counter, {
        y: counterY,
        duration: 1,
        ease: "hop",
      });

      gsap.to(titles, {
        y: titleY,
        duration: 1,
        ease: "hop",
      });
    }

    function updateActiveSlidePreview() {
      prevSlides.forEach((prev) => prev.classList.remove("active"));
      prevSlides[currentImg - 1].classList.add("active");
    }

    function animateSlide(direction) {
      const currentSlide =
        document.querySelectorAll(".img")[
          document.querySelectorAll(".img").length - 1
        ];

      const slideImg = document.createElement("div");
      slideImg.classList.add("img");

      const slideImgElem = document.createElement("img");
      slideImgElem.src = `./assets/img${currentImg}.jpg`;
      gsap.set(slideImgElem, { x: direction === "left" ? -500 : 500 });

      slideImg.appendChild(slideImgElem);
      sliderImages.appendChild(slideImg);

      gsap.to(currentSlide.querySelector("img"), {
        x: direction === "left" ? 500 : -500,
        duration: 1.5,
        ease: "hop",
      });

      gsap.fromTo(
        slideImg,
        {
          clipPath:
            direction === "left"
              ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
              : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "hop",
        }
      );
      gsap.to(slideImgElem, {
        x: 0,
        duration: 1.5,
        ease: "hop",
      });

      cleanupSlides();

      indicatorRotation += direction === "left" ? -90 : 90;
      gsap.to(indicators, {
        rotate: indicatorRotation,
        duration: 1,
        ease: "hop",
      });
    }

    function cleanupSlides() {
      const imgElements = document.querySelectorAll(".slider-images .img");
      if (imgElements.length > totalSlides) {
        imgElements[0].remove();
      }
    }

    const handleClick = (event) => {
      const sliderWidth = document.querySelector(".slider").clientWidth;
      const clickPosition = event.clientX;

      if (slidePreview.contains(event.target)) {
        const clickedPrev = event.target.closest(".preview");

        if (clickedPrev) {
          const clickedIndex = Array.from(prevSlides).indexOf(clickedPrev) + 1;

          if (clickedIndex !== currentImg) {
            if (clickedIndex < currentImg) {
              setCurrentImg(clickedIndex);
              animateSlide("left");
            } else {
              setCurrentImg(clickedIndex);
              animateSlide("right");
            }
            updateActiveSlidePreview();
            updateCounterAndTitlePosition();
          }
        }
        return;
      }

      if (clickPosition < sliderWidth / 2 && currentImg !== 1) {
        setCurrentImg(currentImg - 1);
        animateSlide("left");
      } else if (
        clickPosition > sliderWidth / 2 &&
        currentImg !== totalSlides
      ) {
        setCurrentImg(currentImg + 1);
        animateSlide("right");
      }

      updateActiveSlidePreview();
      updateCounterAndTitlePosition();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [currentImg]);

  return (
    <div>
      <div className="slider">
        <nav>
          <a href="#" id="active">
            Work
          </a>
          <a href="#">About</a>
        </nav>

        <div className="slider-images">
          <div className="img">
            <img src={`./assets/img${currentImg}.jpg`} alt="" />
          </div>
        </div>

        <div className="slider-title">
          <div className="slider-title-wrapper">
            <p className="">The Revival Ensemble</p>
            <p className="">Above The Canvas</p>
            <p className="">Harmony in Every Note</p>
            <p className="">Redefining Imagination</p>
            <p className="">From Earth to Expression</p>
          </div>
        </div>

        <div className="slider-counter">
          <div className="counter">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
          </div>
          <div>
            <p>&mdash;</p>
          </div>
          <div>
            <p>5</p>
          </div>
        </div>

        <div className="slider-preview">
          {[...Array(totalSlides)].map((_, index) => (
            <div
              key={index}
              className={`preview ${currentImg === index + 1 ? "active" : ""}`}
            >
              <img src={`./assets/img${index + 1}.jpg`} alt="" />
            </div>
          ))}
        </div>

        <div className="slider-indicators">
          <p>+</p>
          <p>+</p>
        </div>
      </div>
      <style jsx>{``}</style>
    </div>
  );
};

export default Slider;
