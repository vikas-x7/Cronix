import CTASection from "@/src/client/markating/components/CTASection";
import Footer from "@/src/client/markating/components/Footer";
import Hero from "@/src/client/markating/components/Hero";
import IntegrationSection from "@/src/client/markating/components/IntegrationSection";
import Navbar from "@/src/client/markating/components/Navbar";
import UseCases from "@/src/client/markating/components/UseCases";
import React from "react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <IntegrationSection />
      <UseCases />
      <CTASection />
      <Footer />
    </>
  );
}
