import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import ProductGrid from "@/components/ProductGrid";
import Project from "@/components/Project";
import TextSection from "@/components/TextSection";
import CookieConsent from "@/components/CookieConsent";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      <CookieConsent />
      <Banner/>
      <TextSection/>
      {/* <ProductCard/> */}
      <ProductGrid/>
      <Project/>
      <Newsletter/>
    </>
  );
}
