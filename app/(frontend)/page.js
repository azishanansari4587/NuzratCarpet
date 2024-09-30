import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import ProductGrid from "@/components/ProductGrid";
import Project from "@/components/Project";
import TextSection from "@/components/TextSection";

export default function Home() {
  return (
    <>
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
