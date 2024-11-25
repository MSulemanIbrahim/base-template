import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const ColorPicker = ({ color, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-full h-12 rounded-md"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8"
        />
      </PopoverContent>
    </Popover>
  );
};

const ColorPalette = ({ colors, onColorChange, onCopyColor }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {colors.map((color, index) => (
        <div key={index} className="flex flex-col items-center">
          <ColorPicker
            color={color}
            onChange={(newColor) => onColorChange(index, newColor)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopyColor(color)}
            className="mt-1 text-xs"
          >
            {color}
          </Button>
        </div>
      ))}
    </div>
  );
};

const SavedPalette = ({ name, colors, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{name}</CardTitle>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [currentPalette, setCurrentPalette] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [paletteName, setPaletteName] = useState("");

  useEffect(() => {
    randomizePalette();
  }, []);

  const randomizePalette = () => {
    setCurrentPalette(Array(5).fill().map(generateRandomColor));
  };

  const handleColorChange = (index, newColor) => {
    const newPalette = [...currentPalette];
    newPalette[index] = newColor;
    setCurrentPalette(newPalette);
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  const savePalette = () => {
    if (paletteName.trim() === "") {
      alert("Please enter a name for the palette.");
      return;
    }
    setSavedPalettes([...savedPalettes, { name: paletteName, colors: currentPalette }]);
    setPaletteName("");
  };

  const deletePalette = (index) => {
    const newSavedPalettes = [...savedPalettes];
    newSavedPalettes.splice(index, 1);
    setSavedPalettes(newSavedPalettes);
  };

  const clearAll = () => {
    setSavedPalettes([]);
    randomizePalette();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Color Palette Generator</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <ColorPalette
            colors={currentPalette}
            onColorChange={handleColorChange}
            onCopyColor={copyColor}
          />
          <div className="flex space-x-2 mt-4">
            <Button onClick={randomizePalette}>Randomize</Button>
            <Input
              placeholder="Palette Name"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={savePalette}>Save Palette</Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Saved Palettes</h2>
      {savedPalettes.map((palette, index) => (
        <SavedPalette
          key={index}
          name={palette.name}
          colors={palette.colors}
          onDelete={() => deletePalette(index)}
        />
      ))}

      {savedPalettes.length > 0 && (
        <Button variant="outline" onClick={clearAll} className="mt-4">
          Clear All and Start Over
        </Button>
      )}
    </div>
  );
}