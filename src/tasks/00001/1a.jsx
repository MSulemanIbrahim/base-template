import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const colors = ['red', 'blue', 'yellow', 'orange', 'pink', 'black', 'purple'];
const difficulties = {
  easy: { circles: 3, speed: 1, colorChange: 7000 },
  medium: { circles: 5, speed: 1.5, colorChange: 5000 },
  hard: { circles: 7, speed: 2, colorChange: 3000 }
};

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('medium');
  const [circles, setCircles] = useState([]);
  const [currentColor, setCurrentColor] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameSpeed, setGameSpeed] = useState(1);

  const startGame = () => {
    setGameState('playing');
    setCircles(generateCircles());
    setScore(0);
    setLives(3);
    setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const generateCircles = () => {
    const { circles: numCircles, speed } = difficulties[difficulty];
    return Array.from({ length: numCircles }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * (window.innerWidth - 50),
      y: Math.random() * (window.innerHeight - 100),
      dx: (Math.random() - 0.5) * speed,
      dy: (Math.random() - 0.5) * speed,
    }));
  };

  const moveCircles = useCallback(() => {
    setCircles(prevCircles => 
      prevCircles.map(circle => {
        let { x, y, dx, dy } = circle;
        if (x < 0 || x > window.innerWidth - 50) dx = -dx;
        if (y < 0 || y > window.innerHeight - 100) dy = -dy;
        return { ...circle, x: x + dx * gameSpeed, y: y + dy * gameSpeed };
      })
    );
  }, [gameSpeed]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(moveCircles, 16);
      const colorChangeInterval = setInterval(() => {
        setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
      }, difficulties[difficulty].colorChange);
      return () => {
        clearInterval(interval);
        clearInterval(colorChangeInterval);
      };
    }
  }, [gameState, moveCircles, difficulty]);

  const handleClick = (clickedColor) => {
    if (clickedColor === currentColor) {
      setScore(score => score + 10);
      setGameSpeed(speed => Math.min(speed + 0.05, 3));
    } else {
      setLives(lives => lives - 1);
    }
  };

  const handleRestart = () => {
    setGameState('menu');
  };

  if (gameState === 'gameover') {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
            <DialogDescription>Your score: {score}</DialogDescription>
          </DialogHeader>
          <Button onClick={handleRestart}>Restart</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {gameState === 'menu' && (
        <Card className="m-4 self-center w-full max-w-sm">
          <CardHeader>
            <CardTitle>Color Clicker</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setDifficulty}>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </Select>
            <Button onClick={startGame} className="mt-4">Start Game</Button>
          </CardContent>
        </Card>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col flex-1">
          <div className="flex justify-between p-4">
            <Card className="w-24">
              <CardContent className="p-2 text-center">
                <CardTitle className="text-xs">Score</CardTitle>
                <div>{score}</div>
              </CardContent>
            </Card>
            <Card className="w-24">
              <CardContent className="p-2 text-center">
                <CardTitle className="text-xs">Lives</CardTitle>
                <div>{Array(lives).fill('❤️').join('')}</div>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1 relative">
            <div className={`text-${currentColor}-500 text-center text-2xl font-bold`}>
              {currentColor.toUpperCase()}
            </div>
            {circles.map(circle => (
              <div 
                key={circle.id}
                onClick={() => handleClick(circle.color)}
                className={`absolute w-10 h-10 rounded-full cursor-pointer`}
                style={{
                  backgroundColor: circle.color,
                  left: `${circle.x}px`,
                  top: `${circle.y}px`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      {lives === 0 && setGameState('gameover')}
    </div>
  );
}