import BreakingNewsTicker from "@/components/layout/BreakingNewsTicker";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import PopularNewsSection from "@/components/home/PopularNewsSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import BentoGrid from "@/components/home/BentoGrid";

export default function HomePage() {
  return (
    <>
      <BreakingNewsTicker />
      <HeroSection />
      <CategorySection />
      <PopularNewsSection />
      <LatestNewsSection />
      <BentoGrid />
    </>
  );
}