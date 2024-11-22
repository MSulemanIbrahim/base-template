import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const shapes = ['triangle', 'circle', 'star'];

const Placeholder = ({ shape, onDrop, children }) => (
  <div 
    className="w-20 h-20 border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center"
    onDrop={onDrop} 
    onDragOver={(e) => e.preventDefault()}
  >
    {children}
  </div>
);

const ShapeCard = ({ shape, draggable, onDragStart }) => (
  <Card className="w-20 h-20 border border-black bg-white cursor-pointer">
    <CardContent className="p-2 flex items-center justify-center">
      <div 
        className={`w-12 h-12 ${shape === 'triangle' ? 'border-b-4 border-r-4 border-gray-500 transform rotate-45' : 
        shape === 'circle' ? 'rounded-full bg-gray-500' : 
        'clip-path-star'}`}
        draggable={draggable} 
        onDragStart={onDragStart}
      ></div>
    </CardContent>
  </Card>
);

export default function App() {
  const [gameState, setGameState] = useState('instructions');
  const [shapePositions, setShapePositions] = useState([]);
  const [correctPlacements, setCorrectPlacements] = useState([false, false, false]);

  useEffect(() => {
    if (gameState === 'play') {
      const randomizeShapes = () => {
        const newPositions = [...shapes].sort(() => Math.random() - 0.5);
        setShapePositions(newPositions);
        setCorrectPlacements([false, false, false]);
      };
      randomizeShapes();
    }
  }, [gameState]);

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const shapeDropped = event.dataTransfer.getData("shape");
    const correctShape = shapes[index];
    if (shapeDropped === correctShape) {
      setCorrectPlacements(prev => {
        const newCorrect = [...prev];
        newCorrect[index] = true;
        return newCorrect;
      });
    } else {
      // Animate back to original position - for simplicity, we'll just change border here
      event.target.style.borderColor = 'red';
      setTimeout(() => event.target.style.borderColor = 'gray', 300);
    }
  };

  const checkWin = () => {
    if (correctPlacements.every(Boolean)) {
      alert("You Won!");
      setTimeout(() => setGameState('instructions'), 2000);
    }
  };

  useEffect(checkWin, [correctPlacements]);

  const dragStart = (e, shape) => {
    e.dataTransfer.setData("shape", shape);
  };

  if (gameState === 'instructions') {
    return (
      <div className="flex flex-col items-center space-y-4 p-4">
        <h1 className="text-2xl font-bold">Shape Matching Game</h1>
        <p>Match the shapes by dragging them to their placeholders!</p>
        <Button onClick={() => setGameState('play')}>Start Game</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {shapes.map((shape, index) => (
          <Placeholder key={index} shape={shape} onDrop={handleDrop(index)}>
            {correctPlacements[index] ? <ShapeCard shape={shape} draggable={false} /> : 
            <div className={`w-12 h-12 opacity-30 ${shape === 'triangle' ? 'border-b-4 border-r-4 border-gray-500 transform rotate-45' : 
            shape === 'circle' ? 'rounded-full bg-gray-500' : 
            'clip-path-star'}`} />}
          </Placeholder>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {shapePositions.map((shape, index) => (
          <ShapeCard key={index} shape={shape} draggable onDragStart={(e) => dragStart(e, shape)} />
        ))}
      </div>
      <Button onClick={() => setGameState('instructions')}>Restart Game</Button>
    </div>
  );
}