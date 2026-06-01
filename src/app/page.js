import Banner from "@/components/Home/Banner";
import FeaturedFacilities from "@/components/Home/FeaturedFacilities";
import HowItWorks from "@/components/Home/HowItWorks";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

export default function Home() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto justify-center">
      <Banner />
      <FeaturedFacilities />
      <HowItWorks />
      <WhyChooseUs />
    </div>
  );
}
