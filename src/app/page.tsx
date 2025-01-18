"use client";

import React from "react";
import MainHeader from "@components/navbar/MainHeader";
import Jumbotron from "@components/banner/Jumbotron";
import PricingPackagesList from "@components/package/PricingPackagesList";


export default function Home() {
  const handleMenuClick = () => {
    console.log("Menu icon clicked");
  };



  return (
    <div >
      <main>
        <MainHeader
          testPeriod="12 days remaining"
          onMenuClick={handleMenuClick}
        />
        <Jumbotron
          title="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
          subtitle=" Streamline Sales, Manage Inventory, and Grow with Confidence!"
          backgroundImage="/assets/banner-pos.png"
        />
         <div >
          <PricingPackagesList />
        </div>
      </main>
    </div>
  );
}
