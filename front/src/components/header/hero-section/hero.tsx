"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HeroProps } from "@/types/hero";

export default function Hero({ heroData, settings }: HeroProps) {
  const {
    autoSlideHero = false,
    primaryColor = "#EF4444",
    secondaryColor = "#111827",
    thirdColor = "#374151",
    button1Color = "#EF4444",
    button2Color = "#DC2626",
    button1TextColor = "#FFFFFF",
    button2TextColor = "#FFFFFF",
    currency = "₹"
  } = settings;

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoSlideHero || heroData.length === 0) return;

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    const slideTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroData.length);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [current, heroData, autoSlideHero]);

  if (heroData.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {heroData.map((slide, index) => (
          <div
            key={index}
            className="relative min-w-full h-[450px] overflow-hidden"
          >
            {/* Image container with padding */}
            <div className="absolute inset-0 px-2 py-2 md:px-2 lg:px-2">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={slide.heroImage}
                  alt={slide.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover object-top-right"
                />

                {/* Banner Content */}
                <div className="absolute bottom-6 left-6 bg-white/80 p-5 rounded-lg w-full md:w-1/2">
                  {/* Semi heading with priColor */}
                  <p 
                    className="text-sm font-medium tracking-widest mb-2"
                    style={{ color: primaryColor }}
                  >
                    {slide.heroSubtitle}
                  </p>
                  
                  {/* Heading with secColor */}
                  <h2 
                    className="text-2xl md:text-4xl font-bold leading-tight mb-2"
                    style={{ color: secondaryColor }}
                  >
                    {slide.heroTitle}
                  </h2>
                  
                  {/* Price with textColor and dynamic currency */}
                  <p className="hidden md:block mb-2">
                    <span style={{ color: secondaryColor }}>
                      {slide.priceText}{" "}
                      <b style={{ color: thirdColor }}>
                        {currency} {slide.price}
                      </b>
                    </span>
                  </p>
                  
                  {/* Button with hover effects */}
                  <a
                    href={slide.heroUrl}
                    className="inline-block text-sm font-semibold px-4 py-2 rounded-md transition"
                    style={{
                      backgroundColor: isHovered ? button2Color : button1Color,
                      color: isHovered ? button2TextColor : button1TextColor
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {slide.buttonText || "Shop now"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots (clickable) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="relative flex items-center justify-center focus:outline-none"
          >
            {current === index ? (
              <div className="w-8 h-1 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}