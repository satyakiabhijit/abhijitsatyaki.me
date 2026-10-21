"use client";

import { motion } from "framer-motion";
import { ShadowBox } from "./ShadowBox";
import { useRef, useEffect } from "react";

interface AnimatedMobilePhotosProps {
  delay: number;
}

const mobilePhotos = [
  {
    id: 1,
    src: "/abhijit_photo_2.jpg",
    alt: "Abhijit casual outdoors",
    boxWidth: 170,
    boxHeight: 252,
    imgWidth: 163,
    imgHeight: 245,
    rotate: -5,
    isCenter: false,
  },
  {
    id: 2,
    src: "/Abhijit.png",
    alt: "Abhijit Satyaki portrait",
    boxWidth: 188,
    boxHeight: 278,
    imgWidth: 190,
    imgHeight: 280,
    rotate: -7,
    isCenter: true,
  },
  {
    id: 3,
    src: "/abhijit_photo_3.jpg",
    alt: "Abhijit at hackathon conference",
    boxWidth: 170,
    boxHeight: 252,
    imgWidth: 163,
    imgHeight: 245,
    rotate: 8,
    isCenter: false,
  },
  {
    id: 4,
    src: "/abhijit_photo_4.jpg",
    alt: "Abhijit coding workspace",
    boxWidth: 170,
    boxHeight: 252,
    imgWidth: 163,
    imgHeight: 245,
    rotate: -4,
    isCenter: false,
  },
  {
    id: 5,
    src: "/abhijit_photo_5.jpg",
    alt: "Abhijit presentation event",
    boxWidth: 170,
    boxHeight: 252,
    imgWidth: 163,
    imgHeight: 245,
    rotate: 6,
    isCenter: false,
  },
];

export function AnimatedMobilePhotos({ delay }: AnimatedMobilePhotosProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Center the main portrait photo initially on mobile mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const centerItem = scrollContainerRef.current.querySelector<HTMLElement>("[data-center='true']");
        if (centerItem) {
          centerItem.scrollIntoView({
            behavior: "instant" as ScrollBehavior,
            inline: "center",
            block: "nearest",
          });
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
  };

  return (
    <div className="relative w-full lg:hidden overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto overflow-y-visible py-8 px-8 items-center space-x-10 sm:space-x-14 scrollbar-none snap-x snap-mandatory touch-pan-x [-webkit-overflow-scrolling:touch] cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {mobilePhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            data-center={photo.isCenter ? "true" : "false"}
            className="relative shrink-0 snap-center select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: delay + index * 0.08,
            }}
          >
            <div className="relative w-fit">
              <ShadowBox width={photo.boxWidth} height={photo.boxHeight} />
              <img
                className="absolute left-0 top-0 rounded-lg object-cover shadow-lg shadow-black/25 pointer-events-none transition-transform"
                style={{
                  width: `${photo.imgWidth}px`,
                  height: `${photo.imgHeight}px`,
                  transform: `rotate(${photo.rotate}deg)`,
                }}
                src={photo.src}
                alt={photo.alt}
                draggable={false}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
