"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FaCogs, FaToolbox, FaChartLine } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./FeaturesSlider.module.css";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

const slidesData = [
  {
    icon: <FaCogs />, 
    title: "Fully integrated",
    description:
      "Offer a single omni-channel platform that integrates products, stock, payments, finance and more."
  },
  {
    icon: <FaToolbox />,
    title: "Comprehensive",
    description:
      "Provide a comprehensive suite of tools that address the needs of each merchant, enhancing their operational efficiency."
  },
  {
    icon: <FaChartLine />, 
    title: "Real time data",
    description:
      "Give your merchants power over their data with the ability to create custom dashboards and monitor key metrics."
  },
];

export default function FeaturesSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000, 
    slidesToShow: 3,     
    slidesToScroll: 1,
    arrows: false,       
    pauseOnHover: true,
    responsive: [
      {
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
              <div className={styles.icon}>{item.icon}</div>
            </div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
