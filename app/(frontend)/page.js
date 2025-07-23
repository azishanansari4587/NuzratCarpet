import Banner from "@/components/Banner";
import Newsletter from "@/components/Newsletter";
import ProductGrid from "@/components/ProductGrid";
import Project from "@/components/Project";
import TextSection from "@/components/TextSection";
import CookieConsent from "@/components/CookieConsent";
import Featured from "@/components/Featured";
import CollectionsGrid from "@/components/CollectionsGrid";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      <CookieConsent />
      {/* <Banner/> */}
      <HeroSection/>
      {/* <Featured/> */}
      <CollectionsGrid/>
      <ProductGrid/>
      <TextSection/>
      <Project/>
      <Newsletter/>
    </>
  );
}
