import HeroSection from "../app/sections/HeroSection";
import AboutSection from "../app/sections/AboutSection";
import ProductSearch from "../app/sections/ProductSearch";
import PYQSection from "../app/sections/Pyqsection";
import ServicesPreview from "../app/sections/ServicePreview";
import StationeryPreview from "../app/sections/StationeryPreview";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesPreview />
      {/* <ProductSearch /> */}
      <StationeryPreview />
      <PYQSection />
      {/* <AboutSection /> */}
    </main>
  );
}
