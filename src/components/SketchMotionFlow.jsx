import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import useImage from "use-image"; // Import useImage hook from react-konva for loading images
import { useNavigate } from "react-router";

const SketchMotionFlow = () => {
    const [step, setStep] = useState(1); // Track current step (1, 2 or 3)
    const [lines, setLines] = useState([]); // Track lines drawn by user
    const [history, setHistory] = useState([]); // Track drawing history for undo/redo
    const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
    const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image
    const [strokeWidth, setStrokeWidth] = useState(3); // Default stroke width
    const [showOverlay, setShowOverlay] = useState(true); // Show overlay before drawing starts
    const stageRef = useRef(null); // Create reference to Konva stage
    const navigate = useNavigate(); // Initialize navigate function

    // Load the uploaded image using useImage hook always even when uploadedImage is empty
    const [image] = useImage(uploadedImage || "");
    
    // Function to handle drawing start
    const getPointerPosition = (e) => {
        if (!e) return { x: 0, y: 0 }; // Make sure event object exists
        const stage = e.target.getStage();
        const point = e.evt.touches ? e.evt.touches[0] : e.evt;
        return stage.getPointerPosition() || { x: point.clientX, y: point.clientY };
    };

    // Start drawing 
    const handleStart = (e) => {
        e.evt.preventDefault(); // Prevent scrolling on touch devices
        setIsDrawing(true); // Set drawing state to true
        const { x, y } = getPointerPosition(e); // Get pointer position
        setLines([...lines, { points: [x, y], strokeWidth: parseInt(strokeWidth) }]); // Add new line to lines array
    };

    // Drawing movement
    const handleMove = (e) => {
        if (!isDrawing) return; // Exit if not drawing
        const { x, y } = getPointerPosition(e); // Get pointer position
        setLines((previousLines) => {
            const lastLine = previousLines[previousLines.length - 1]; // Get last line
            lastLine.points = [...lastLine.points, x, y]; // Add new points
            return [...previousLines];
        });
    };

    // Stop drawing
    const handleEnd = () => {
        setIsDrawing(false); // Set drawing state to false
        setHistory([...history, lines]); // Add lines to history for undo/redo
    };

    // Undo last drawing
    const handleUndo = () => {
        if (lines.length === 0 ) return; // Exit if no lines to undo
        const previousLines = [...lines]; // Get last lines
        const newHistory = [...history, previousLines]; // Add lines to history
        previousLines.pop(); // Remove last line
        setLines(previousLines); // Update lines array
        setHistory(newHistory); // Update history array
    };

    // Redo last drawing
    const handleRedo = () => {
        if (history.length === 0) return; // Exit if no history to redo
        const lastState = history[history.length - 1]; // Get last state
        setLines(lastState); // Update lines array
        setHistory(history.slice(0, history.length - 1)); // Update history array
    };

    // Clear canvas
    const clearCanvas = () => {
        setLines([]); // Clear lines array
        setHistory([]); // Clear history array
    };

    // Upload image
    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // Get uploaded file
        if (file) {
            const reader = new FileReader(); // Initialize file reader
            reader.onload = (e) => {
                setUploadedImage(e.target.result); // Set uploaded image
                setShowOverlay(false); // Hide overlay after image is uploaded
            };
            reader.readAsDataURL(file); // Read file as data URL
        }
    };

    // Close overlay and start drawing
    const handleDrawClick = () => {
        setShowOverlay(false); // Hide overlay
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="main-container">
                {/* Left panel for stroke, color, and other controls */}
                <div className="p-3 bg-light border-end tool-panel" style={{ width: "200px" }}>
                    <h4>Tools</h4>
                    <label>Stroke Thinkness:</label>
                    <input type="range" min="1" max="10" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} className="form-rnage" />
                    <button className="btn btn-secondary w-100 my-2" onClick={handleUndo}>Undo</button>
                    <button className="btn btn-secondary w-100 my-2" onClick={handleRedo}>Redo</button>
                    <button className="btn btn-danger w-100" onClick={clearCanvas}>Clear</button>
                </div>

                {/* Main drawing section */}
                <div className="container text-center mt-5 position-relative stage-container">
                    {/* Overlay before drawing or upload option */}
                    {showOverlay && (
                        <div className="overlay">
                            <h2>Welcome to Sketch Motion</h2>
                            <p>Get started by drawing on the canvas or uploading an image.</p>
                            <button className="btn btn-primary" onClick={handleDrawClick}>Start Drawing</button>
                            <label className="btn btn-success">
                                Upload <input type="file" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    )}

                    {/* Step 1: Draw or Upload */}
                    {step === 1 && (
                        <>
                        <h2>Step 1: Draw or Upload Your Artwork</h2>
                        <p>Use the drawing tool below or upload a drawing.</p>

                        {/* Konva stage */}
                        <Stage
                            width={500}
                            height={400}
                            onMouseDown={handleStart}
                            onMouseMove={handleMove}
                            onMouseUp={handleEnd}
                            onTouchStart={handleStart}
                            onTouchMove={handleMove}
                            onTouchEnd={handleEnd}
                            style={{ border: "1px solid black", marginBottom: "20px"}}
                            >
                                <Layer>
                                    {/* Upload image input */}
                                    <Image image={image} width={500} height={400} />
                                    {lines.map((line, i) => (
                                        <Line key={i} points={line.points} stroke="black" strokeWidth={3} tension={0.5} lineCap="round" />
                                    ))}
                                </Layer>
                            </Stage>

                            {/* Navigation buttons */}
                            <button className="btn btn-primary mt-3" onClick={() => setStep(2)}>Next: Animate</button>
                        </>
                    )}

                    {/* Step 2: Add Animation Effects */}
                    {step === 2 && (
                        <>
                        <h2>Step 2: Animate Your Drawing</h2>
                        <p>Apply animations to bring your artwork to life.</p>

                        <div className="animation-preview">
                            <p>✨ Animation Preview Coming Soon ✨</p>
                        </div>

                        <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>Back</button>
                        <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Save & Share</button>
                        </>
                    )}

                    {/* Step 3: Save & Share */}
                    {step === 3 && (
                        <>
                        <h2>Step 3: Save & Share</h2>
                        <p>Save your animaton to your account or share it with others.</p>

                        <button className="btn btn-success me-2"> Save to Account</button>
                        <button className="btn btn-info">Share with Community</button>

                        <button className="btn btn-secondary mt-3" onClick={() => setStep(2)}>Back</button>
                        <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>Return to Home</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SketchMotionFlow;