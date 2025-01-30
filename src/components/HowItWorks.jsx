import React from "react";
import drawIcon from "../assets/icons/draw.png";
import animateIcon from "../assets/icons/animate.png";
import shareIcon from "../assets/icons/share.png";

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-5">
            <div className="container">
                <h2 className="text-center mb-4">How It Works</h2>
                <div className="row text-left">
                    <div className="col-md-4 text-center">
                        <img src={drawIcon} alt="Draw icons created by Freepik - Flaticon" className="step-icon" />
                        <h3>Step 1: Draw or Upload Your Artwork</h3>
                        <p>Start by creating a new canvas or uploading an existing image.</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <img src={animateIcon} alt="Animation icons created by Freepik - Flaticon" className="step-icon" />
                        <h3>Step 2: Add Animation Effects</h3>
                        <p>Choose from a variety of animation tools to animate your artwork.</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <img src={shareIcon} alt="Online community icons created by dwicon - Flaticon" className="step-icon" />
                        <h3>Step 3: Preview and Share Your Animation</h3>
                        <p>Preview your animation and make any necessary adjustements.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;