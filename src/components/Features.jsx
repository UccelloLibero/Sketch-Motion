import React from "react";
import drawingTool from "../assets/images/drawing-tool.jpg";
import artwork from "../assets/images/artwork.jpg";
import heroAnimation from "../assets/images/hero-animation.gif";

const Features = () => {
    return (
        <section id="features" className="py-5">
            <div className="container text-center">
                <div className="row">
                    <div className="col-lg-4">
                        <img src={drawingTool} alt="Drawing Tool" className="img-fluid mb-3" />
                        <h3>Powerful Drawing Tool</h3>
                        <p>Unleash your creativity with intuitive tools designed to make animation effortless.</p>
                    </div>
                    <div className="col-lg-4">
                        <img src={artwork} alt="Upload Artwork" className="img-fluid mb-3" />
                        <h3>Easily Upload Your Artwork</h3>
                        <p>Upload and animate your creations effortlessly and share them with others.</p>
                    </div>
                    <div className="col-lg-4">
                        <img src={heroAnimation} alt="Animation Example" className="img-fluid mb-3" />
                        <h3>Capture and Animate Drawings</h3>
                        <p>Draw or snap a picture of your hand-drawn sketches and transform them into animations instantly.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;