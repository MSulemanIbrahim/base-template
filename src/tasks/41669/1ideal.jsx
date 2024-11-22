import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Converts HSB (Hue, Saturation, Brightness) to RGB values
const HSBtoRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)].map(Math.round);
};

// Component to preview a color box with a label
const ColorPreview = ({ color, label }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-24 h-24 rounded-lg shadow-md"
      style={{ backgroundColor: `rgb(${color.join(",")})` }}
    ></div>
    <span className="mt-2 text-sm font-medium">{label}</span>
  </div>
);

// Component for sliders to adjust color properties (Hue, Saturation, Brightness)
const ColorSlider = ({ value, onChange, label }) => (
  <div className="w-full">
    <label className="text-sm font-medium">{label}</label>
    <Slider
      min={0}
      max={label === "Hue" ? 360 : 100} // Hue ranges 0-360, others 0-100
      step={1}
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      className="mt-1"
    />
  </div>
);

// Component to display level and score
const LevelInfo = ({ level, score }) => (
  <div className="flex justify-between w-full">
    <span className="text-sm font-medium">Level: {level}</span>
    <span className="text-sm font-medium">Score: {score}</span>
  </div>
);

// Main game logic component
const ColorMatchGame = () => {
  const [hue, setHue] = useState(0); // User-selected Hue
  const [saturation, setSaturation] = useState(50); // User-selected Saturation
  const [brightness, setBrightness] = useState(50); // User-selected Brightness
  const [targetColor, setTargetColor] = useState([0, 0, 0]); // Target color to match
  const [level, setLevel] = useState(1); // Current game level
  const [score, setScore] = useState(0); // User score
  const [feedback, setFeedback] = useState(""); // Feedback message
  const [isMatched, setIsMatched] = useState(false); // Match status

  // Generate a random target color
  const generateTargetColor = () => {
    const h = Math.floor(Math.random() * 360); // Random Hue
    const s = Math.floor(Math.random() * 101); // Random Saturation
    const b = Math.floor(Math.random() * 101); // Random Brightness
    return HSBtoRGB(h, s, b);
  };

  // Generate a new target color when the level changes
  useEffect(() => {
    setTargetColor(generateTargetColor());
  }, [level]);

  // Convert user-selected HSB to RGB
  const userColor = HSBtoRGB(hue, saturation, brightness);

  // Calculate the color difference using Euclidean distance
  const calculateColorDifference = () => {
    return Math.sqrt(
      targetColor.reduce((sum, v, i) => sum + Math.pow(v - userColor[i], 2), 0)
    );
  };

  // Check if the user's color matches the target color
  const checkMatch = () => {
    const difference = calculateColorDifference();
    const threshold = Math.max(30 - level * 2, 5); // Adjust threshold by level

    if (difference <= threshold) {
      setIsMatched(true);
      setFeedback("Perfect Match!");
      setScore(score + Math.max(100 - Math.floor(difference), 0));
    } else if (difference <= threshold * 2) {
      setFeedback("Close! Adjust and try again.");
    } else {
      setFeedback("Too far off! Try adjusting more.");
    }
  };

  // Proceed to the next level
  const nextLevel = () => {
    setLevel(level + 1);
    setIsMatched(false);
    setFeedback("");
    setHue(0);
    setSaturation(50);
    setBrightness(50);
  };

  // Reset the game
  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setIsMatched(false);
    setFeedback("");
    setHue(0);
    setSaturation(50);
    setBrightness(50);
    setTargetColor(generateTargetColor());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Color Matching Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display current level and score */}
          <LevelInfo level={level} score={score} />

          {/* Display target and user-selected colors */}
          <div className="flex justify-around">
            <ColorPreview color={targetColor} label="Target" />
            <ColorPreview color={userColor} label="Your Color" />
          </div>

          {/* Color adjustment sliders */}
          <div className="space-y-4">
            <ColorSlider value={hue} onChange={setHue} label="Hue" />
            <ColorSlider value={saturation} onChange={setSaturation} label="Saturation" />
            <ColorSlider value={brightness} onChange={setBrightness} label="Brightness" />
          </div>

          {/* Feedback message */}
          <div className="text-center">
            <p className="text-lg font-semibold">{feedback}</p>
          </div>

          {/* Buttons for checking match and proceeding to the next level */}
          <div className="flex justify-center space-x-4">
            <Button onClick={checkMatch} disabled={isMatched}>
              Check Match
            </Button>
            {isMatched && (
              <Button onClick={nextLevel} variant="outline">
                Next Level
              </Button>
            )}
          </div>

          {/* Button to restart the game */}
          <Button onClick={resetGame} variant="outline" className="w-full">
            Restart Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Main App Component
export default function App() {
  return <ColorMatchGame />;
}
