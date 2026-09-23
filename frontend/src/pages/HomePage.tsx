import React from "react";
import { HeroSection } from "../components/home/HeroSection";
import { CompanyIntroSection } from "../components/home/CompanyIntroSection";
import { FeaturedProductsSection } from "../components/home/FeaturedProductsSection";
import { ServicesOverviewSection } from "../components/home/ServicesOverviewSection";
import { WhyGenesisSection } from "../components/home/WhyGenesisSection";
import { HomeCTASection } from "../components/home/HomeCTASection";

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Company Introduction */}
      <CompanyIntroSection />

      {/* 3. Featured Products Catalogue */}
      <FeaturedProductsSection />

      {/* 4. Services Overview */}
      <ServicesOverviewSection />

      {/* 5. Why Genesis */}
      <WhyGenesisSection />

      {/* 6. Call To Action */}
      <HomeCTASection />
    </div>
  );
};

export default HomePage;
