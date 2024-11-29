import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = ["pen", "eraser", "rectangle", "circle", "line"];

export default function App() {
  const [selectedTool, setSelectedTool] = useState("pen"); // Tracks the selected tool
  const [selectedColor, setSelectedColor] = useState("#000000"); // Tracks the selected color
  const [brushSize, setBrushSize] = useState(5); // Tracks the brush size
  const [showGrid, setShowGrid] = useState(false); // Determines if grid is displayed
  const [isDrawing, setIsDrawing] = useState(false); // Tracks drawing state
  const [fillShape, setFillShape] = useState(false); // Determines if shapes should be filled
  const [startPoint, setStartPoint] = useState(null); // Tracks the starting point for shapes
  const [history, setHistory] = useState([]); // Tracks canvas history for undo/redo
  const [historyIndex, setHistoryIndex] = useState(-1); // Tracks the current history index

  const canvasRef = useRef(null); // Ref for the canvas element
  const ctxRef = useRef(null); // Ref for the canvas context

  // Initialize the canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
    saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, []);

  // Save the current canvas state to history
  const saveToHistory = (imageData) => {
    const newHistory = history.slice(0, historyIndex + 1); // Trim future history
    newHistory.push(imageData); // Add current state
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1); // Update the history index
  };

  // Start drawing on the canvas
  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e); // Get the canvas-relative coordinates
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setStartPoint({ x: offsetX, y: offsetY }); // Set the starting point for shapes
    setIsDrawing(true);
  };

  // Draw on the canvas based on the selected tool
  const draw = (e) => {
    if (!isDrawing) return; // Only draw when the mouse is down
    const { offsetX, offsetY } = getCoordinates(e);

    switch (selectedTool) {
      case "pen":
      case "eraser":
        // Draw lines for pen or eraser
        ctxRef.current.lineTo(offsetX, offsetY);
        ctxRef.current.stroke();
        break;
      case "rectangle":
      case "circle":
      case "line":
        // Clear previous temporary drawings and redraw the shape
        const canvas = canvasRef.current;
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        ctxRef.current.putImageData(history[historyIndex], 0, 0); // Restore previous state
        drawShape(offsetX, offsetY);
        break;
    }
  };

  // Stop drawing and save the canvas state
  const stopDrawing = () => {
    if (selectedTool !== "fill") {
      ctxRef.current.closePath();
    }
    setIsDrawing(false);
    if (selectedTool !== "fill") {
      saveToHistory(
        ctxRef.current.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )
      );
    }
  };

  // Get canvas-relative coordinates from a mouse or touch event
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY,
    };
  };

  // Draw shapes on the canvas (rectangle, circle, or line)
  const drawShape = (endX, endY) => {
    const { x: startX, y: startY } = startPoint; // Use the starting point
    ctxRef.current.beginPath();
    switch (selectedTool) {
      case "rectangle":
        if (fillShape) {
          // Fill the rectangle with the selected color
          ctxRef.current.fillStyle = selectedColor;
          ctxRef.current.fillRect(startX, startY, endX - startX, endY - startY);
        } else {
          // Draw the rectangle outline
          ctxRef.current.rect(startX, startY, endX - startX, endY - startY);
        }
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        if (fillShape) {
          // Fill the circle with the selected color
          ctxRef.current.fillStyle = selectedColor;
          ctxRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctxRef.current.fill();
        } else {
          // Draw the circle outline
          ctxRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
        }
        break;
      case "line":
        ctxRef.current.moveTo(startX, startY);
        ctxRef.current.lineTo(endX, endY);
        break;
    }
    ctxRef.current.stroke();
  };

  // Get the color of a pixel at (x, y)
  const getPixel = (imageData, x, y) => {
    const index = (y * imageData.width + x) * 4;
    return imageData.data.slice(index, index + 4);
  };

  // Set the color of a pixel at (x, y)
  const setPixel = (imageData, x, y, color) => {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = 255; // Alpha channel
  };

  // Check if two colors match
  const colorsMatch = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  // Convert a hex color to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  // Handle tool selection
  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    ctxRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : selectedColor;
    ctxRef.current.lineWidth = brushSize;
  };

  // Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (selectedTool !== "eraser") {
      ctxRef.current.strokeStyle = color;
    }
  };

  // Handle brush size change
  const handleBrushSizeChange = (value) => {
    setBrushSize(value);
    ctxRef.current.lineWidth = value;
  };

  // Undo the last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      ctxRef.current.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  // Redo the last undone action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      ctxRef.current.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  // Save the canvas content as an image
  const handleSave = () => {
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  // Clear the canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory(
      ctxRef.current.getImageData(0, 0, canvas.width, canvas.height)
    );
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Art Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tool Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tools.map((tool) => (
              <Button
                key={tool}
                onClick={() => handleToolChange(tool)}
                variant={selectedTool === tool ? "default" : "outline"}
              >
                {tool}
              </Button>
            ))}
          </div>
          {/* Color Picker, Brush Size Slider, Grid Toggle, and Fill Checkbox */}
          <div className="flex items-center gap-4 mb-4">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-10 border-none"
            />
            <Slider
              value={[brushSize]}
              onValueChange={(value) => handleBrushSizeChange(value[0])}
              min={1}
              max={50}
              step={1}
              className="w-48"
            />
            <Toggle pressed={showGrid} onPressedChange={setShowGrid}>
              Grid
            </Toggle>
            {/* Show fill checkbox only for shapes */}
            {(selectedTool === "rectangle" || selectedTool === "circle") && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fillShape}
                  onChange={(e) => setFillShape(e.target.checked)}
                />
                <label>Fill Shape</label>
              </div>
            )}
          </div>
          {/* Canvas */}
          <div
            className="relative mb-4"
            style={{
              backgroundImage: showGrid
                ? "repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%)"
                : "none",
              backgroundSize: "20px 20px",
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="border border-gray-300 w-full h-auto"
            />
          </div>
          {/* Undo, Redo, Save, and Clear Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleUndo}>Undo</Button>
            <Button onClick={handleRedo}>Redo</Button>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleClear} variant="destructive">
              Clear Canvas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
