import HeroSection from "@/components/homepage/hero-section";
import MarketingCards from "@/components/homepage/marketing-cards";
import SideBySide from "@/components/homepage/side-by-side";
import FAQSection from "@/components/homepage/faq-section";
import PageWrapper from "@/components/wrapper/page-wrapper";
import AutoplayVideo from "@/components/autoplay-video";

export default async function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-4">
        <HeroSection />
      </div>
      <div className="flex my-[8rem] w-full justify-center items-center">
        <SideBySide />
      </div>
      <FAQSection />
      {/* <div className="flex flex-col w-full justify-center items-center mb-16">
        <AutoplayVideo />
      </div> */}
      {/* <div className="flex flex-col p-2 w-full justify-center items-center">
        <MarketingCards />
      </div> */}
    </PageWrapper>
  );
}
