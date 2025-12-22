"use client";

import CTASection from "@/client/marketing/components/CTASection";
import Footer from "@/client/marketing/components/Footer";
import Hero from "@/client/marketing/components/Hero";
import IntegrationSection from "@/client/marketing/components/IntegrationSection";
import Navbar from "@/client/marketing/components/Navbar";
import UseCases from "@/client/marketing/components/UseCases";
import React from "react";
import FAQ from "./components/Faq";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <IntegrationSection />
      <UseCases />
      <FAQ />
      <CTASection />

      <Footer />
    </>
  );
}
