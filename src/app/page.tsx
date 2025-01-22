"use client";

import React from "react";
import Jumbotron from "@components/banner/Jumbotron";
import PricingPackagesList from "@components/package/PricingPackagesList";
import MainHeader from "@/components/globalLayout/Layout";

export default function Home() {
  return (
    <div>
      <main>
        <MainHeader>
          {/* You can place any children components here if needed */}
          <></>
        </MainHeader>
        <Jumbotron
          title="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
          subtitle="Streamline Sales, Manage Inventory, and Grow with Confidence!"
          backgroundImage="/assets/banner-pos.png"
        />
        <div>
          <PricingPackagesList />
        </div>
      </main>
    </div>
  );
}