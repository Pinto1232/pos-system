"use client"; 

import MainHeader from "@components/navbar/MainHeader"; 

export default function Home() {
  const handleMenuClick = () => {
    console.log('Menu icon clicked');
  };

  return (
    <div>
      <main>
        <MainHeader testPeriod="12 days remaining" onMenuClick={handleMenuClick} />
      </main>
    </div>
  );
}
