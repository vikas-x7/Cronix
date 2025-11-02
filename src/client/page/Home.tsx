import Hero from "@/src/client/page/components/Hero";
import IntegrationSection from "@/src/client/page/components/IntegrationSection";
import Navbar from "@/src/client/page/components/Navbar";
import UseCases from "@/src/client/page/components/UseCases";
import React from "react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <IntegrationSection />
      <UseCases />
    </>
  );
}
