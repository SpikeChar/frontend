import React from 'react';
import Hero from '../Sections/Hero';
import BentoAbout from '../Sections/BentoAbout';
import WorkshopDemo from '../Sections/WorkshopDemo';
import Specs from '../Sections/Specs';
import Process from '../Sections/Process';
import ServicesSection from '../Sections/ServicesSection';
import PricingSection from '../Sections/PricingSection';
import Testimonials from '../Sections/Testimonials';
import CTA from '../Sections/CTA';

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <BentoAbout />
            <WorkshopDemo />
            <Specs />
            <Process />
            <ServicesSection />
            <PricingSection />
            <Testimonials />
            <CTA />
        </>
    );
};

export default Home;