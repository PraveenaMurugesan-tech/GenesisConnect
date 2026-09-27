import React, { useState, useEffect } from "react";
import { HeroSection } from "../components/home/HeroSection";
import { CompanyIntroSection } from "../components/home/CompanyIntroSection";
import { FeaturedProductsSection } from "../components/home/FeaturedProductsSection";
import { ServicesOverviewSection } from "../components/home/ServicesOverviewSection";
import { WhyGenesisSection } from "../components/home/WhyGenesisSection";
import { HomeCTASection } from "../components/home/HomeCTASection";
import { apiClient } from "../services/api";
import { HomepageContent } from "../types";

export const HomePage: React.FC = () => {
  const [cmsContent, setCmsContent] = useState<HomepageContent | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<HomepageContent>("/content/homepage")
      .then((res) => {
        if (isMounted) setCmsContent(res.data);
      })
      .catch(() => {
        // Fallback silently to built-in authentic defaults
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection content={cmsContent || undefined} />

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
