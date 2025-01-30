import React from "react";
import heroImage from "../assets/images/hero-animation.gif";

const Hero = () => {
    return (
        <header className="text-white text-center py-5">
            <div className="container">
                <img src={heroImage} alt="Sketch Motion Animation Example" className="img-fluid w-100 heroImage"/>
                <h1 className="display-4 fw-bold mt-4">Unleash Your Creativity with Sketch Motion</h1>
                <p className="lead">
                    Sketch Motion allows you to transform your drawings into captivating animations effortlessly.
                    Whether you're a hobbyinst or a seasonsed creator, our platform makes animation easy and fun.
                </p>
                <a href="#create" className="btn btn-light me-2">Get Started</a>
                <a href="#learn" className="btn learn">Learn More</a>
            </div>
        </header>
    );
};

export default Hero;