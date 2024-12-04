import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toast } from "@/components/ui/toast";

const shapes = ["circle", "square", "star"];


const Shape = ({ type, size, position, opacity }) => {
  const shapeStyles = {
    circle: "rounded-full",
    square: "",
    star: "clip-path-star",
  };

  return (
    <div
      className={`absolute ${shapeStyles[type]} bg-blue-500`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
      }}
    />
  );
};

const ShapeSelector = ({ onSelect }) => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {shapes.map((shape) => (
        <Button key={shape} onClick={() => onSelect(shape)}>
          {shape}
        </Button>
      ))}
    </div>
  );
};

const ControlPanel = ({ position, size, onPositionChange, onSizeChange }) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="block mb-2">X Position: {position.x}</label>
        <Slider
          min={0}
          max={280}
          step={1}
          value={[position.x]}
          onValueChange={(value) => onPositionChange({ x: value[0], y: position.y })}
        />
      </div>
      <div>
        <label className="block mb-2">Y Position: {position.y}</label>
        <Slider
          min={0}
          max={280}
          step={1}
          value={[position.y]}
          onValueChange={(value) => onPositionChange({ x: position.x, y: value[0] })}
        />
      </div>
      <div>
        <label className="block mb-2">Size: {size}</label>
        <Slider
          min={20}
          max={100}
          step={1}
          value={[size]}
          onValueChange={(value) => onSizeChange(value[0])}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [placeholderShape, setPlaceholderShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [userSize, setUserSize] = useState(50);
  const [success, setSuccess] = useState(false);

  const generatePlaceholderShape = () => {
    const type = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    const x = Math.floor(Math.random() * (280 - size));
    const y = Math.floor(Math.random() * (280 - size));
    return { type, size, position: { x, y } };
  };

  useEffect(() => {
    setPlaceholderShape(generatePlaceholderShape());
  }, []);

  useEffect(() => {
    if (selectedShape && placeholderShape) {
      const xDiff = Math.abs(userPosition.x - placeholderShape.position.x);
      const yDiff = Math.abs(userPosition.y - placeholderShape.position.y);
      const sizeDiff = Math.abs(userSize - placeholderShape.size);

      if (
        xDiff < 10 &&
        yDiff < 10 &&
        sizeDiff < 10 &&
        selectedShape === placeholderShape.type
      ) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    }
  }, [selectedShape, userPosition, userSize, placeholderShape]);

  const handleShapeSelect = (shape) => {
    setSelectedShape(shape);
    setUserPosition({ x: 0, y: 0 });
    setUserSize(50);
  };

  const handleNextRound = () => {
    setPlaceholderShape(generatePlaceholderShape());
    setSelectedShape(null);
    setUserPosition({ x: 0, y: 0 });
    setUserSize(50);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-md mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Shape Matching Game</h1>
          <div className="relative w-72 h-72 bg-gray-200 border-2 border-gray-300 mb-4">
            {placeholderShape && (
              <Shape
                type={placeholderShape.type}
                size={placeholderShape.size}
                position={placeholderShape.position}
                opacity={0.5}
              />
            )}
            {selectedShape && (
              <Shape
                type={selectedShape}
                size={userSize}
                position={userPosition}
                opacity={1}
              />
            )}
          </div>
          {selectedShape ? (
            <ControlPanel
              position={userPosition}
              size={userSize}
              onPositionChange={setUserPosition}
              onSizeChange={setUserSize}
            />
          ) : (
            <ShapeSelector onSelect={handleShapeSelect} />
          )}
        </CardContent>
        <CardFooter>
          {success && (
            <div className="w-full text-center">
              <p className="text-green-500 font-bold mb-2">Nicely done!</p>
              <Button onClick={handleNextRound}>Next</Button>
            </div>
          )}
        </CardFooter>
      </Card>
      <Toast open={success} onOpenChange={setSuccess}>
        <div className="bg-green-500 text-white p-4 rounded-md">
          Nicely done! You matched the shape.
        </div>
      </Toast>
    </div>
  );
}