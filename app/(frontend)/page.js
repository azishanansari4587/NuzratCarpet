import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import ProductGrid from "@/components/ProductGrid";
import Project from "@/components/Project";
import TextSection from "@/components/TextSection";
import CookieConsent from "@/components/CookieConsent";

export default function Home() {
  return (
    <>
      <CookieConsent />
      <Header/>
      <Banner/>
      <TextSection/>
      <ProductGrid/>
      <Project/>
      <Newsletter/>
      <Footer/>
    </>
  );
}
