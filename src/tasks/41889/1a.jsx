import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = ["pen", "eraser", "fill", "rectangle", "circle", "line"];

export default function App() {
  const [selectedTool, setSelectedTool] = useState("pen");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [showGrid, setShowGrid] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

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

  const saveToHistory = (imageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);

    switch (selectedTool) {
      case "pen":
      case "eraser":
        ctxRef.current.lineTo(offsetX, offsetY);
        ctxRef.current.stroke();
        break;
      case "fill":
        floodFill(offsetX, offsetY, selectedColor);
        break;
      case "rectangle":
      case "circle":
      case "line":
        const canvas = canvasRef.current;
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        ctxRef.current.putImageData(history[historyIndex], 0, 0);
        drawShape(offsetX, offsetY);
        break;
    }
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveToHistory(ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
  };

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

  const drawShape = (endX, endY) => {
    const startX = history[historyIndex].width / 2;
    const startY = history[historyIndex].height / 2;
    ctxRef.current.beginPath();
    switch (selectedTool) {
      case "rectangle":
        ctxRef.current.rect(startX, startY, endX - startX, endY - startY);
        break;
      case "circle":
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctxRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
        break;
      case "line":
        ctxRef.current.moveTo(startX, startY);
        ctxRef.current.lineTo(endX, endY);
        break;
    }
    ctxRef.current.stroke();
  };

  const floodFill = (x, y, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixel(imageData, x, y);
    const fillColorRgb = hexToRgb(fillColor);

    if (colorsMatch(targetColor, fillColorRgb)) return;

    const pixelsToCheck = [x, y];
    while (pixelsToCheck.length > 0) {
      const y = pixelsToCheck.pop();
      const x = pixelsToCheck.pop();

      const currentColor = getPixel(imageData, x, y);
      if (colorsMatch(currentColor, targetColor)) {
        setPixel(imageData, x, y, fillColorRgb);
        pixelsToCheck.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixel = (imageData, x, y) => {
    const index = (y * imageData.width + x) * 4;
    return imageData.data.slice(index, index + 4);
  };

  const setPixel = (imageData, x, y, color) => {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = 255;
  };

  const colorsMatch = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    ctxRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : selectedColor;
    ctxRef.current.lineWidth = brushSize;
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (selectedTool !== "eraser") {
      ctxRef.current.strokeStyle = color;
    }
  };

  const handleBrushSizeChange = (value) => {
    setBrushSize(value);
    ctxRef.current.lineWidth = value;
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      ctxRef.current.putImageData(history[historyIndex - 1], 0, 0);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      ctxRef.current.putImageData(history[historyIndex + 1], 0, 0);
    }
  };

  const handleSave = () => {
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctxRef.current.getImageData(0, 0, canvas.width, canvas.height));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Art Canvas</CardTitle>
        </CardHeader>
        <CardContent>
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
          </div>
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