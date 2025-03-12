import React, { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <a className="navbar-brand" href="#">Sketch Motion</a>
                <button className="navbar-toggler" type="button" onClick={toggleNavbar} data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
                        <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
                        <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
                        <li className="nav-item"><a className="btn btn-light text-black" href="/sketch-motion">Get Started</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;