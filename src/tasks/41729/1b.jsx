import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChromePicker } from 'react-color';

function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function ColorBox({ color, onColorChange, onCopy }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative w-full sm:w-1/5 p-2">
      <div 
        className="h-24 rounded-lg" 
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker(!showPicker)}
      >
        {showPicker && (
          <div className="absolute z-10">
            <ChromePicker 
              color={color} 
              onChangeComplete={(color) => onColorChange(color.hex)} 
            />
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span>{color}</span>
        <Button onClick={() => {
          navigator.clipboard.writeText(color);
          onCopy();
        }} variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPalette, setCurrentPalette] = useState(Array(5).fill(null).map(generateRandomColor));
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [paletteName, setPaletteName] = useState('');

  const handleRandomize = () => {
    setCurrentPalette(currentPalette.map(generateRandomColor));
  };

  const handleColorChange = (index, color) => {
    const newPalette = [...currentPalette];
    newPalette[index] = color;
    setCurrentPalette(newPalette);
  };

  const savePalette = () => {
    if (paletteName && !savedPalettes.some(p => p.name === paletteName)) {
      setSavedPalettes([...savedPalettes, { name: paletteName, colors: currentPalette }]);
      setPaletteName('');
    }
  };

  const clearAll = () => {
    setSavedPalettes([]);
    setCurrentPalette(Array(5).fill(null).map(generateRandomColor));
  };

  const handleCopy = useCallback(() => {
    // Simple feedback for copy action, can be expanded with a toast or similar
    alert('Color copied to clipboard!');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Palette</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap">
          {currentPalette.map((color, index) => (
            <ColorBox 
              key={index} 
              color={color} 
              onColorChange={(color) => handleColorChange(index, color)} 
              onCopy={handleCopy}
            />
          ))}
        </CardContent>
        <CardContent>
          <Button onClick={handleRandomize}>Randomize</Button>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Saved Palettes</CardTitle>
          <Button onClick={clearAll} variant="destructive" size="sm">Clear All</Button>
        </CardHeader>
        <CardContent className="flex flex-wrap">
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