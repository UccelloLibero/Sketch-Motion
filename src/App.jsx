import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

const App = () => {
    return (
        <>
        <Navbar />
        <Hero />
        <Features />
        <Benefits />
        <HowItWorks />
        <CTA />
        <Footer />
        </>
    );
};

export default App;