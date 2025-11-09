"use client";

import CTASection from "@/app/(marketing)/components/CTASection";
import Footer from "@/app/(marketing)/components/Footer";
import Hero from "@/app/(marketing)/components/Hero";
import IntegrationSection from "@/app/(marketing)/components/IntegrationSection";
import Navbar from "@/app/(marketing)/components/Navbar";
import UseCases from "@/app/(marketing)/components/UseCases";
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
