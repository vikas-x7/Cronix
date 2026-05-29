import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Feature from './components/Feature';
import UseCases from './components/UseCases';
import Integration from './components/Integration';
import TrafficChart from './components/TrafficChart';
import AnimatedText from './components/AnimatedText';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import MovingHeading from './components/MovingHeading';

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <MovingHeading />
      <Feature />

      <Integration />
      <UseCases />
      <AnimatedText />
      <TrafficChart />
      <CTASection />
      <FAQ />
      <Footer />
    </>
  );
}
