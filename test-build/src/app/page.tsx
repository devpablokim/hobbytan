import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WhyNow from "@/components/sections/WhyNow";
import Problem from "@/components/sections/Problem";
import Curriculum from "@/components/sections/Curriculum";
import Services from "@/components/sections/Services";
import Success from "@/components/sections/Success";
import WhyHobbytan from "@/components/sections/WhyHobbytan";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WhyNow />
      <Problem />
      <Curriculum />
      <Services />
      <Success />
      <WhyHobbytan />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
