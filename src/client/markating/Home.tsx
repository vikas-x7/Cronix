import CTASection from "@/client/markating/components/CTASection";
import Footer from "@/client/markating/components/Footer";
import Hero from "@/client/markating/components/Hero";
import IntegrationSection from "@/client/markating/components/IntegrationSection";
import Navbar from "@/client/markating/components/Navbar";
import UseCases from "@/client/markating/components/UseCases";
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
