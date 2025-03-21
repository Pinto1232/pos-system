"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Import Slick’s default styles (these must be imported in the same file or globally)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import your own CSS last so you can override slick defaults
import styles from "./FeaturesSlider.module.css";

// Dynamically import react-slick to avoid SSR issues
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

// Example slide data
const slidesData = [
  {
    icon: "/icons/integrated.svg",
    title: "Fully integrated",
    description:
      "Offer a single omni-channel platform that integrates products, stock, payments, finance and more."
  },
  {
    icon: "/icons/comprehensive.svg",
    title: "Comprehensive",
    description:
      "Provide a comprehensive suite of tools that address the needs of each merchant, enhancing their operational efficiency."
  },
  {
    icon: "/icons/realtime.svg",
    title: "Real time data",
    description:
      "Give your merchants power over their data with the ability to create custom dashboards and monitor key metrics."
  },
  // ... add more slides if needed
];

export default function FeaturesSlider() {
  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000, // rotate every 3 seconds
    slidesToShow: 3,     // show 3 columns at once
    slidesToScroll: 1,
    arrows: false,       // hide left/right arrows (optional)
    pauseOnHover: true,
    responsive: [
      {
        // When screen width < 768px, show only 1 item
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {slidesData.map((item, index) => (
          <div key={index} className={styles.slideItem}>
            <div className={styles.iconWrapper}>
              <Image src={item.icon} alt={item.title} className={styles.icon} width={50} height={50} />
              <Image src={item.icon} alt={item.title} className={styles.icon} width={50} height={50} />
            </div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
