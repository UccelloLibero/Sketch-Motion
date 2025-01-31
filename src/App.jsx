import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import SketchMotionFlow from "./components/SketchMotionFlow";

const App = () => {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path="/" element={
                <>
                <Hero />
                <Features />
                <Benefits />
                <HowItWorks />
                <CTA />
                </>
            } />
            <Route path="/sketch-motion" element={<SketchMotionFlow />} />
        </Routes>
        <Footer />
        </>
    );
};

export default App;