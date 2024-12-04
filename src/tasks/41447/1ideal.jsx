import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Available shapes
const shapes = ['triangle', 'circle', 'star'];

// Placeholder component for drop targets
const Placeholder = ({ shape, onDrop, highlight }) => (
  <div
    className={`w-20 h-20 border-2 border-dashed ${
      highlight === 'correct'
        ? 'border-green-500'
        : highlight === 'incorrect'
        ? 'border-red-500'
        : 'border-gray-300'
    } bg-gray-100 flex items-center justify-center`}
    onDrop={onDrop}
    onDragOver={(e) => e.preventDefault()}
  >
    <div
      style={
        shape === 'star'
          ? {
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              backgroundColor: highlight === 'correct' ? 'black' : 'gray',
              width: '3rem',
              height: '3rem',
            }
          : {}
      }
      className={`w-12 h-12 ${highlight === 'correct' ? 'opacity-100' : 'opacity-30'} ${
        shape === 'triangle'
          ? `border-l-[24px] border-r-[24px] border-b-[40px] border-transparent ${
              highlight === 'correct' ? 'border-b-black' : 'border-b-gray-500'
            }`
          : shape === 'circle'
          ? `rounded-full ${highlight === 'correct' ? 'bg-black' : 'bg-gray-500'}`
          : ''
      }`}
    ></div>
  </div>
);


// Draggable ShapeCard component
const ShapeCard = ({ shape, draggable, onDragStart }) => (
  <Card className="w-20 h-20 border border-black bg-white cursor-pointer">
    <CardContent className="p-2 flex items-center justify-center">
      <div
        style={
          shape === 'star'
            ? {
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                backgroundColor: 'black',
                width: '3rem',
                height: '3rem',
              }
            : {}
        }
        className={`w-12 h-12 ${
          shape === 'triangle'
            ? 'border-l-[24px] border-r-[24px] border-b-[40px] border-transparent border-b-black'
            : shape === 'circle'
            ? 'rounded-full bg-black'
            : ''
        }`}
        draggable={draggable}
        onDragStart={onDragStart}
      ></div>
    </CardContent>
  </Card>
);

export default function App() {
  const [gameState, setGameState] = useState('instructions'); // Tracks game state
  const [shapePositions, setShapePositions] = useState([]); // Randomized shapes for dragging
  const [correctPlacements, setCorrectPlacements] = useState([false, false, false]); // Tracks if each placeholder is correct
  const [highlightStates, setHighlightStates] = useState(['', '', '']); // Highlight state for each placeholder

  // Randomize shape positions when game starts
  useEffect(() => {
    if (gameState === 'play') {
      const randomizeShapes = () => {
        const newPositions = [...shapes].sort(() => Math.random() - 0.5);
        setShapePositions(newPositions);
        setCorrectPlacements([false, false, false]);
        setHighlightStates(['', '', '']);
      };
      randomizeShapes();
    }
  }, [gameState]);

  // Handles the drop logic
  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const shapeDropped = event.dataTransfer.getData('shape');
    const correctShape = shapes[index];

    if (shapeDropped === correctShape) {
      // Correct placement
      setCorrectPlacements((prev) => {
        const newCorrect = [...prev];
        newCorrect[index] = true;
        return newCorrect;
      });
      setHighlightStates((prev) => {
        const newHighlights = [...prev];
        newHighlights[index] = 'correct';
        return newHighlights;
      });
    } else {
      // Incorrect placement
      setHighlightStates((prev) => {
        const newHighlights = [...prev];
        newHighlights[index] = 'incorrect';
        return newHighlights;
      });
      setTimeout(() => {
        setHighlightStates((prev) => {
          const resetHighlights = [...prev];
          resetHighlights[index] = '';
          return resetHighlights;
        });
      }, 500); // Reset highlight after 500ms
    }
  };

  // Check for win condition
  useEffect(() => {
    if (correctPlacements.every(Boolean)) {
      setTimeout(() => {
        alert('You Won!');
        setGameState('instructions');
      }, 500);
    }
  }, [correctPlacements]);

  // Drag start handler for shapes
  const dragStart = (e, shape) => {
    e.dataTransfer.setData('shape', shape);
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
      {/* Placeholder Grid */}
      <div className="grid grid-cols-3 gap-4">
        {shapes.map((shape, index) => (
          <Placeholder
            key={index}
            shape={shape}
            onDrop={handleDrop(index)}
            highlight={highlightStates[index]}
          >
            {correctPlacements[index] && (
              <ShapeCard shape={shape} draggable={false} />
            )}
          </Placeholder>
        ))}
      </div>

      {/* Draggable Shapes */}
      <div className="grid grid-cols-3 gap-4">
        {shapePositions.map((shape, index) => (
          <ShapeCard
            key={index}
            shape={shape}
            draggable
            onDragStart={(e) => dragStart(e, shape)}
          />
        ))}
      </div>

      {/* Restart Game Button */}
      <Button onClick={() => setGameState('instructions')}>Restart Game</Button>
    </div>
  );
}
