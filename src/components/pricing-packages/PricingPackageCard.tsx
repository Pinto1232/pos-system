"use client";

import React, { memo } from "react";
import styles from "@/components/pricing-packages/PricingPackages.module.css";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button/Button";
import iconMap from "@/utils/icons";

interface PricingPackageProps {
  packageData: {
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type: "starter" | "growth" | "enterprise" | "custom" | "premium";
  };
  onBuyNow: () => void;
}

const PricingPackageCard: React.FC<PricingPackageProps> = memo(({ packageData, onBuyNow }) => {
  const IconComponent = iconMap[packageData.icon] || iconMap["MUI:DefaultIcon"];

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        {IconComponent && React.createElement(IconComponent, { className: styles.icon, fontSize: "large" })}

        <h2 className={styles.title}>{packageData.title}</h2>
      </CardHeader>

      <CardContent className={styles.content}>
        <ul>
          {packageData.description.split(". ").map((desc, index) => (
            <li key={index}>{desc.replace(/[^a-zA-Z0-9\s]/g, " ")}</li>
          ))}
        </ul>
      </CardContent>

      <div className={styles.priceSection}>
        <div className={styles.trial}>{packageData.testPeriodDays} days free trial</div>
        <div className={styles.price}>${packageData.price}/mo</div>
      </div>

      <CardFooter className={styles.footer}>
        <Button className={styles.button} onClick={onBuyNow}>Buy now</Button>
      </CardFooter>
    </Card>
  );
});

PricingPackageCard.displayName = "PricingPackageCard";
export default PricingPackageCard;
