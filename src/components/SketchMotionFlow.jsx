import React, { useState } from "react";
import { Stage, Layer, Line} from "react-konva";
import { useNavigate } from "react-router";

const SketchMotionFlow = () => {
    const [step, setStep] = useState(1); // Track current step (1, 2 or 3)
    const [lines, setLines] = useState([]); // Track lines drawn by user
    const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
    const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image
    const navigate = useNavigate(); // Initialize navigate function
    
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
        setLines([...lines, { points: [x, y] }]); // Add new line to lines array
    };

    // Drawing movement
    const handleMove = (e) => {
        if (!isDrawing) return; // Exit if not drawing
        const { x, y } = getPointerPosition(e); // Get pointer position
        let lastLine = lines[lines.length - 1]; // Get last line
        if (!lastLine) return; // Avoid modifying an empty array
        lastLine.points = lastLine.points.concat([x, y]); // Add new points to line
        setLines([...lines.slice(0, lines.lenght -1), lastLine]); // Update line and lines array
    };

    // Stop drawing
    const handleEnd = () => {
        setIsDrawing(false); // Set drawing state to false
    };

    // Clear canvas
    // const clearCanvas = () => {
    //     setLines([]); // Clear lines array
    // };

    // Upload image
    const handleImageUpload = (e) => {
        const file = event.target.files[0]; // Get uploaded file
        if (file) {
            const reader = new FileReader(); // Initialize file reader
            reader.onload = (e) => {
                setUploadedImage(e.target.result); // Set uploaded image
            };
            reader.readAsDataURL(file); // Read file as data URL
        }
    };

    return (
        <div className="container text-center mt-5">
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
                            {lines.map((line, i) => (
                                <Line key={i} points={line.points} stroke="black" strokeWidth={3} tension={0.5} lineCap="round" />
                            ))}
                        </Layer>
                    </Stage>

                    {/* Upload image input */}
                    {uploadedImage && (
                        <div>
                            <p>Upload Image:</p>
                            <img src={uploadedImage} alt="UploadedDrawing" className="img-fluid" style={{ maxWidth: "400px" }} />
                        </div>
                    )}

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
    );
};

export default SketchMotionFlow;