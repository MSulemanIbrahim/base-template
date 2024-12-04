import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const shapes = ['circle', 'square', 'star'];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Shape({ type, size, x, y, opacity = 1 }) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}px`,
    top: `${y}px`,
    opacity: opacity,
  };

  return (
    <div className={`absolute ${type === 'circle' ? 'rounded-full' : type === 'star' ? 'star' : ''} bg-blue-500`} style={style}></div>
  );
}

function ShapeSelector({ selectedShape, onSelect }) {
  return (
    <div className="flex justify-center space-x-4 p-4">
      {shapes.map(shape => (
        <div 
          key={shape}
          onClick={() => onSelect(shape)}
          className={`cursor-pointer w-12 h-12 ${shape === 'circle' ? 'rounded-full' : ''} bg-blue-200 ${selectedShape === shape ? 'border-2 border-blue-500' : ''}`}
        ></div>
      ))}
    </div>
  );
}

export default function App() {
  const [currentShape, setCurrentShape] = useState(null);
  const [placeholder, setPlaceholder] = useState({ shape: 'circle', size: 100, x: 50, y: 50 });
  const [userShape, setUserShape] = useState({ size: 50, x: 0, y: 0 });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const newPlaceholder = {
      shape: shapes[randomIntFromInterval(0, 2)],
      size: randomIntFromInterval(60, 150),
      x: randomIntFromInterval(20, 280),
      y: randomIntFromInterval(20, 380),
    };
    setPlaceholder(newPlaceholder);
    setSuccess(false);
  }, [success]);

  const checkSuccess = () => {
    const sizeDiff = Math.abs(placeholder.size - userShape.size);
    const posDiff = Math.sqrt((placeholder.x - userShape.x)**2 + (placeholder.y - userShape.y)**2);
    if (sizeDiff < 10 && posDiff < 10 && currentShape === placeholder.shape) {
      setSuccess(true);
    }
  };

  useEffect(checkSuccess, [userShape, currentShape]);

  const handleNext = () => {
    setCurrentShape(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:p-4">
      <Card className="w-full max-w-lg p-4 relative bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Shape Matcher</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 border border-gray-300 bg-gray-50 mb-4">
            <Shape type={placeholder.shape} size={placeholder.size} x={placeholder.x} y={placeholder.y} opacity={0.5} />
            {currentShape && 
              <Shape type={currentShape} {...userShape} />}
          </div>
          <div className="flex space-x-4 mb-4">
            <Slider
              defaultValue={[userShape.x]}
              max={300}
              onValueChange={(v) => setUserShape(prev => ({...prev, x: v[0]}))}
              className="flex-1"
            />
            <Slider
              defaultValue={[userShape.y]}
              max={400}
              onValueChange={(v) => setUserShape(prev => ({...prev, y: v[0]}))}
              className="flex-1"
            />
          </div>
          <Slider
            defaultValue={[userShape.size]}
            max={200}
            onValueChange={(v) => setUserShape(prev => ({...prev, size: v[0]}))}
            className="mb-4"
          />
          <ShapeSelector selectedShape={currentShape} onSelect={setCurrentShape} />
        </CardContent>
        {success && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
            <p className="text-xl font-bold text-green-500 mb-4">Nicely done!</p>
            <Button onClick={handleNext}>Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
}