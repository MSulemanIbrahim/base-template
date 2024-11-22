import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function generateRandomColor() {
  return {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 100),
    b: Math.floor(Math.random() * 100),
  };
}

const ColorDisplay = ({ color, title }) => (
  <div className="w-1/2 h-24 rounded-lg" style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.b}%)` }}>
    <p className="text-center text-white p-2">{title}</p>
  </div>
);

const ColorSlider = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <Slider 
      value={[value]} 
      onValueChange={onChange} 
      max={label === 'Hue' ? 360 : 100}
      className="w-full"
    />
  </div>
);

const Feedback = ({ difference }) => {
  let message;
  if (difference < 1) message = "Perfect Match!";
  else if (difference < 5) message = "Very Close!";
  else if (difference < 10) message = "Close!";
  else message = "Keep Trying!";

  return <p className="text-center mt-4">{message}</p>;
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState(generateRandomColor());
  const [userColor, setUserColor] = useState({ h: 0, s: 0, b: 50 });
  const [errorMargin, setErrorMargin] = useState(10);

  useEffect(() => {
    if (level > 1) {
      setErrorMargin(prev => prev - 1); // Increase difficulty
    }
  }, [level]);

  const colorDifference = Math.sqrt(
    Math.pow(targetColor.h - userColor.h, 2) +
    Math.pow(targetColor.s - userColor.s, 2) +
    Math.pow(targetColor.b - userColor.b, 2)
  );

  const handleMatch = () => {
    if (colorDifference <= errorMargin) {
      setScore(prevScore => prevScore + Math.max(100 - Math.floor(colorDifference), 10));
      setLevel(prevLevel => prevLevel + 1);
      setTargetColor(generateRandomColor());
      setUserColor({ h: 0, s: 0, b: 50 });
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setTargetColor(generateRandomColor());
    setUserColor({ h: 0, s: 0, b: 50 });
    setErrorMargin(10);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Color Match Challenge</CardTitle>
          <CardDescription>Level: {level} | Score: {score}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <ColorDisplay color={targetColor} title="Target Color" />
            <ColorDisplay color={userColor} title="Your Color" />
          </div>
          <ColorSlider 
            label="Hue" 
            value={userColor.h} 
            onChange={v => setUserColor(prev => ({...prev, h: v[0]}))} 
          />
          <ColorSlider 
            label="Saturation" 
            value={userColor.s} 
            onChange={v => setUserColor(prev => ({...prev, s: v[0]}))} 
          />
          <ColorSlider 
            label="Brightness" 
            value={userColor.b} 
            onChange={v => setUserColor(prev => ({...prev, b: v[0]}))} 
          />
          <Feedback difference={colorDifference} />
          <Button onClick={handleMatch} disabled={colorDifference > errorMargin}>
            Check Match
          </Button>
          <Button onClick={resetGame} variant="secondary">
            Restart Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}