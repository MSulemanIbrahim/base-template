import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Default color palette
const defaultPalette = ['#FF5733', '#33FF57', '#3357FF', '#F4C542', '#42F4C5'];

// Utility function to generate a random hex color
function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Component for rendering individual colors with a color picker and copy functionality
function ColorBox({ color, onColorChange, onCopy }) {
  return (
    <div className="relative w-full sm:w-1/4">
      {/* Display the color with the background */}
      <div
        className="h-24 rounded-lg cursor-pointer border border-gray-300"
        style={{ backgroundColor: color }}
      />
      {/* Display color hex and action buttons */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm">{color}</span>
        <div className="flex items-center gap-2">
          {/* Native color picker */}
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-8 w-8 border-0 cursor-pointer"
          />
          {/* Copy button */}
          <Button
            onClick={() => {
              navigator.clipboard.writeText(color);
              onCopy();
            }}
            variant="ghost"
            size="icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  // State for the current palette
  const [currentPalette, setCurrentPalette] = useState([...defaultPalette]);
  // State for saved palettes
  const [savedPalettes, setSavedPalettes] = useState([]);
  // State for the palette name input
  const [paletteName, setPaletteName] = useState('');

  // Function to generate a random palette
  const handleRandomize = () => {
    setCurrentPalette(currentPalette.map(generateRandomColor));
  };

  // Function to update a specific color in the palette
  const handleColorChange = (index, color) => {
    const newPalette = [...currentPalette];
    newPalette[index] = color;
    setCurrentPalette(newPalette);
  };

  // Function to save the current palette with a name
  const savePalette = () => {
    if (paletteName && !savedPalettes.some((p) => p.name === paletteName)) {
      setSavedPalettes([
        ...savedPalettes,
        { name: paletteName, colors: currentPalette },
      ]);
      setPaletteName('');
    }
  };

  // Function to reset the palette to the default and clear saved palettes
  const clearAll = () => {
    setCurrentPalette([...defaultPalette]);
    setSavedPalettes([]);
  };

  // Function to handle copy action feedback
  const handleCopy = useCallback(() => {
    alert('Color copied to clipboard!');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Current Palette Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Palette</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {currentPalette.map((color, index) => (
            <ColorBox
              key={index}
              color={color}
              onColorChange={(color) => handleColorChange(index, color)}
              onCopy={handleCopy}
            />
          ))}
        </CardContent>
        <CardContent className="flex gap-2">
          <Button onClick={handleRandomize}>Randomize</Button>
          <Button onClick={clearAll} variant="destructive">
            Reset to Default
          </Button>
        </CardContent>
      </Card>

      {/* Save Palette Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Save Palette</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Input
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            placeholder="Palette Name"
          />
          <Button onClick={savePalette}>Save</Button>
        </CardContent>
      </Card>

      {/* Saved Palettes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Palettes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {savedPalettes.map((palette, idx) => (
            <div key={idx} className="w-full sm:w-1/2 p-2">
              <Card>
                <CardHeader>
                  <CardTitle>{palette.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex">
                  {palette.colors.map((color, colorIdx) => (
                    <div
                      key={colorIdx}
                      className="w-1/5 h-16"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
