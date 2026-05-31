import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Feature from './components/Feature';

import Integration from './components/Integration';
import TrafficChart from './components/TrafficChart';

import FAQ from './components/FAQ';

import Footer from './components/Footer';
import MovingHeading from './components/MovingHeading';

import KnowCronix from './components/KnowCronix';

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <MovingHeading />
      <KnowCronix />
      <TrafficChart />
      <Integration />
      <FAQ />
      <Footer />
    </>
  );
}
