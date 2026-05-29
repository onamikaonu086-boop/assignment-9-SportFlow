"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const sportSlides = [
  {
    title: "Reserve Your Favourite Turf",
    description: "Experience premium football turfs and sports courts. Book your slot in seconds and elevate your game.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2076&auto=format&fit=crop",
  },
  {
    title: "Play Together, Win Together",
    description: "Discover top-rated badminton, tennis, and swimming facilities in your city. Join the community today.",
    image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Stay Fit, Stay Active",
    description: "From morning matches to evening training, SportFlow makes booking sports venues easier than ever.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sportSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl flex justify-center my-5">
      <div className="w-11/12 md:rounded-2xl overflow-hidden h-[55vh] md:h-[70vh] relative shadow-2xl">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sportSlides.map((slide, index) => (
            <div
              key={index}
              className="w-full shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="h-full w-full bg-black/60 flex flex-col justify-center px-6 md:px-20">
                <h3 className="text-4xl md:text-7xl font-extrabold text-white mb-4 max-w-3xl leading-tight">
                  {slide.title}
                </h3>
                <p className="text-white/90 md:text-xl max-w-xl mb-8 font-medium">
                  {slide.description}
                </p>
                <Link href="/facilities">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-lg font-bold">
                    Explore Facilities
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {sportSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrentSlide(i)}
              className={`w-4 h-4 rounded-full transition-all ${
                i === currentSlide ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;