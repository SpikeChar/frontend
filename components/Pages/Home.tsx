import React from 'react';
import Hero from '../Sections/Hero';
import BuilderTeaser from '../Sections/BuilderTeaser';
import DevFeatures from '../Sections/DevFeatures';
import Ecosystem from '../Sections/Ecosystem';
import ProductShowcase from '../Sections/ProductShowcase';
import Workflow from '../Sections/Workflow';
import InteractivePreview from '../Sections/InteractivePreview';
import Technology from '../Sections/Technology';
import SocialProof from '../Sections/SocialProof';
import CTA from '../Sections/CTA';

const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <BuilderTeaser />
            <DevFeatures />
            <ProductShowcase />
            <Workflow />
            <InteractivePreview />
            <Technology />
            <SocialProof />
            <CTA />
        </>
    );
};

export default Home;
