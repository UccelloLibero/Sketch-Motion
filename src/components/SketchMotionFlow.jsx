import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Image, Circle, Rect, RegularPolygon } from "react-konva";
import useImage from "use-image"; // Import useImage hook from react-konva for loading images
import { useNavigate } from "react-router";
import { FaUndo, FaRedo, FaTrash } from "react-icons/fa";
import Konva from "konva"; // Import Konva for animation

// Helper function to scale points for animation
// This function takes an array of points and a scale factor, and returns a new array of points scaled around their center
// It calculates the center of the points by averaging the x and y coordinates separately
// Then, it scales each point by the scale factor, keeping the center point unchanged
// The scaling is done by subtracting the center from each point, multiplying by the scale factor, and adding the center back
// This allows for smooth scaling of the points in the animation
// The function returns the new array of scaled points
// The points are expected to be in the format [x1, y1, x2, y2, ...] where x and y coordinates are alternating
const scalePoints = (points, scale) => {
    const centerX = points.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0) / (points.length / 2);
    const centerY = points.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0) / (points.length / 2);
    return points.map((val, idx) => {
        const center = idx % 2 === 0 ? centerX : centerY;
        return (val - center) * scale + center;
    });
};

// Helper function that returns a random color in HSL format
const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;

// Helper function to calculate the center of a set of points
const getCenter = (points) => {
    const xs = points.filter((_, i) => i % 2 === 0);
    const ys = points.filter((_, i) => i % 2 === 1);
    const x = xs.reduce((a, b) => a + b, 0) / xs.length;
    const y = ys.reduce((a, b) => a + b, 0) / ys.length;
    return { x, y };
};


const SketchMotionFlow = () => {
    const [step, setStep] = useState(1); // Track current step (1, 2 or 3)
    const [lines, setLines] = useState([]); // Track lines drawn by user
    const [history, setHistory] = useState([]); // Track drawing history for undo/redo
    const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
    const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image
    const [strokeWidth, setStrokeWidth] = useState(3); // Default stroke width
    const [strokeColor, setStrokeColor] = useState("#000000"); // Default stroke color
    const [showOverlay, setShowOverlay] = useState(true); // Show overlay before drawing starts
    const [shouldAnimate, setShouldAnimate] = useState(false); // Track if animation should be applied
    const [animationType, setAnimationType] = useState("bounce"); // Default animation type
    const [isAnimating, setIsAnimating] = useState(true); // Control animation state pause/resume
    const [speed, setSpeed] = useState(1); // Animation speed (1 = normal speed)
    const [shapes, setShapes] = useState([]); // Store shapes for animation
    const [selectedShape, setSelectedShape] = useState("circle"); // Store selected shape for editing
    const [selectedShapeIndex, setSelectedShapeIndex] = useState(null); // Store selected shape index for editing color
    const stageRef = useRef(null); // Create reference to Konva stage
    const layerRef = useRef(null); // Create reference to Konva layer
    const navigate = useNavigate(); // Initialize navigate function

    // Load the uploaded image using useImage hook always even when uploadedImage is empty
    const [image] = useImage(uploadedImage || "");

    useEffect(() => {
        if (!isAnimating || !layerRef.current) return;

        const layer = layerRef.current;
        const angularSpeed = 30 * speed;
        const movementSpeed = 20 * speed;

        const anim = new window.Konva.Animation((frame) => {
            const diff = (angularSpeed * frame.timeDiff) / 1000;
            const moveDiff = (movementSpeed * frame.timeDiff) / 1000;
            layer.getChildren().forEach((shape) => {
                switch (animationType) {
                    case "rotate":
                        shape.rotate(diff);
                        break;
                    case "scatter":
                        shape.x(shape.x() + (Math.random() - 0.5) * moveDiff);
                        shape.y(shape.y() + (Math.random() - 0.5) * moveDiff);
                        break;
                    case "bounce":
                        shape.y((shape.y() + moveDiff) % 600);
                        break;
                    case "walk":
                        shape.x((shape.x() + moveDiff) % 800);
                        break;
                    case "breathe":
                        const scale = 1 + 0.01 * Math.sin(frame.time / 100);
                        shape.scale({ x: scale, y: scale });
                        break;
                    default:
                        break;
                }
            });
        }, layer);

        anim.start();
        return () => anim.stop();
    }, [isAnimating, animationType, speed]);

    const lineRefs = useRef([]); // Create reference to store line references
    lineRefs.current = []; // Initialize lineRefs to an empty array

    const addToRefs = (el) => {
        if (el && !lineRefs.current.includes(el)) {
            lineRefs.current.push(el); // Add line reference to lineRefs
        }
    };
    
    // Function to handle drawing start
    const getPointerPosition = (e) => {
        if (!e) return { x: 0, y: 0 }; // Make sure event object exists
        const stage = e.target.getStage();
        const point = e.evt.touches ? e.evt.touches[0] : e.evt;
        return stage.getPointerPosition() || { x: point.clientX, y: point.clientY };
    };

    // Function to handle drawing start 
    const handleStart = (e) => {
        e.evt.preventDefault(); // Prevent scrolling on touch devices
        setIsDrawing(true); // Set drawing state to true
        const { x, y } = getPointerPosition(e); // Get pointer position
        setLines([...lines, { 
            points: [x, y], 
            strokeWidth: parseInt(strokeWidth, 10), 
            strokeColor: strokeColor || "#000000" 
        }]); // Add new line to lines array
    };

    // Function to update the last line with new points
    const handleMove = (e) => {
        if (!isDrawing) return; // Exit if not drawing
        const { x, y } = getPointerPosition(e); // Get pointer position

        setLines((previousLines) => {
            const updatedLines = [...previousLines]; // Copy previous lines
            updatedLines[updatedLines.length - 1] = { // Update last line
                ...updatedLines[updatedLines.length - 1],
                points: [...updatedLines[updatedLines.length - 1].points, x, y]
            };
            return updatedLines; // Return updated lines
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
        resetAnimation(); // Reset animation state
    };

    // Redo last drawing
    const handleRedo = () => {
        if (history.length === 0) return; // Exit if no history to redo
        const lastState = history[history.length - 1]; // Get last state
        setLines(lastState); // Update lines array
        setHistory(history.slice(0, history.length - 1)); // Update history array
        resetAnimation(); // Reset animation state
    };

    // Clear canvas
    const clearCanvas = () => {
        setLines([]); // Clear lines array
        setShapes([]); // Clear shapes array
        setHistory([]); // Clear history array
        resetAnimation(); // Reset animation state
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

    // Handle animation type selection
    const handleAnimateClick = () => {
        setIsAnimating(true);
    };

    const handleAddShape = () => {
        const newShape = {
            type: selectedShape,
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
            size: Math.random() * 40 + 20,
            color: strokeColor,
            borderColor: strokeColor,
            rotation: 0,
        };
        setShapes(prev => [...prev, newShape]);
    };

    const renderShape = (shape, i) => {
        const isSelected = i === selectedShapeIndex;
    
        const shapeProps = {
            x: shape.x,
            y: shape.y,
            offsetX: shape.size / 2,
            offsetY: shape.size / 2,
            fill: shape.color,
            stroke: shape.borderColor,
            strokeWidth: 2,
            rotation: shape.rotation,
            draggable: true,
            listening: true,
            onClick: () => setSelectedShapeIndex(i),
            onTap: () => setSelectedShapeIndex(i),
            onDragEnd: (e) => {
                const updated = [...shapes];
                updated[i] = {
                    ...updated[i],
                    x: e.target.x(),
                    y: e.target.y(),
                };
                setShapes(updated);
            },
        };
    
        if (shape.type === "circle") return <Circle key={i} radius={shape.size / 2} {...shapeProps} />;
        if (shape.type === "square") return <Rect key={i} width={shape.size} height={shape.size} {...shapeProps} />;
        if (shape.type === "hexagon") return <RegularPolygon key={i} sides={6} radius={shape.size / 2} {...shapeProps} />;
        if (shape.type === "triangle") return <RegularPolygon key={i} sides={3} radius={shape.size / 2} {...shapeProps} />;
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="main-container">
                {/* Left panel for stroke, color, and other controls */}
                <div className="p-3 bg-light border-end tool-panel" style={{ width: "200px" }}>
                    <h4>Tools</h4>
                    <label>Stroke Thinkness:</label>
                    <input type="range" min="1" max="10" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} className="form-range" />
                    <label>Stroke & Shape Color:</label>
                    <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="form-control form-control-color" />
                    <button className="btn btn-secondary w-100 my-2" onClick={handleUndo}> <FaUndo/> Undo</button>
                    <button className="btn btn-secondary w-100 my-2" onClick={handleRedo}> <FaRedo /> Redo</button>
                    <button className="btn btn-danger w-100" onClick={clearCanvas}> <FaTrash /> Clear</button>
                    <label>Shape Type:</label>
                    <select className="form-select mb-2" value={selectedShape} onChange={(e) => setSelectedShape(e.target.value)}>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="hexagon">Hexagon</option>
                        <option value="triangle">Triangle</option>
                    </select>
                    <button className="btn btn-outline-secondary w-100 mb-2" onClick={handleAddShape}>Add Shape</button>
                    <label>Animation Type:</label>
                    <select className="form-select" value={animationType} onChange={(e) => setAnimationType(e.target.value)}>
                        <option value="bounce">Bounce</option>
                        <option value="breathe">Breathe</option>
                        <option value="walk">Walk</option>
                        <option value="scatter">Scatter</option>
                        <option value="rotate">Rotate</option>
                    </select>
                    <button className="btn btn-primary w-100 my-2" onClick={handleAnimateClick}>Animate</button>
                    <label>Animation Speed:</label>
                    <input type="range" min="0.1" max="5" step="0.1" value={speed} onChange={(e) => setSpeed(e.target.value)} className="form-range" />
                    <button className="btn btn-primary w-100 mt-2" onClick={() => setIsAnimating(!isAnimating)}>
                        {isAnimating ? "Pause Animation" : "Resume Animation"}
                    </button>
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
                            ref={stageRef}
                            style={{ border: "1px solid black", margin: "0 auto" }}
                        >
                            <Layer ref={layerRef}>
                                {image && <Image image={image} width={500} height={400} />}
                                {lines.map((line, i) => (
                                    <Line key={i} points={line.points} stroke={line.strokeColor} strokeWidth={line.strokeWidth} tension={0.5} lineCap="round" />
                                ))}
                                {shapes.map(renderShape)}
                            </Layer>
                        </Stage>

                            {/* Navigation buttons */}
                            <button className="btn btn-primary mt-3" onClick={() => { handleAnimateClick(); setStep(2)}}>Next: Animate</button>
                        </>
                    )}

                    {/* Step 2: Add Animation Effects */}
                    {step === 2 && (
                        <>
                        <h2>Step 2: Animate Your Drawing</h2>
                        <p>Apply animations to bring your artwork to life.</p>

                        <div className="animation-preview">
                            <p>✨ Your drawing is now animated! ✨</p>
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