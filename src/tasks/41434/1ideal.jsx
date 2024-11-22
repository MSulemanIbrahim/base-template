import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Shape definitions with type and color
const shapes = [
  { type: "triangle", color: "red" },
  { type: "circle", color: "blue" },
  { type: "square", color: "yellow" },
  { type: "pentagon", color: "green" },
  { type: "hexagon", color: "purple" },
];

// Difficulty levels with corresponding settings
const difficulties = {
  easy: { speed: 3000, time: 60, shapes: 1 },
  medium: { speed: 2000, time: 45, shapes: 1 },
  hard: { speed: 1000, time: 30, shapes: 2 },
};

// Component to render individual shapes
const Shape = ({ shape, position }) => {
  // Styles for different shapes
  const shapeStyles = {
    triangle: "w-0 h-0 border-b-[25px] border-x-[15px] border-x-transparent",
    circle: "w-[25px] h-[25px] rounded-full",
    square: "w-[25px] h-[25px]",
    pentagon: "w-[25px] h-[25px] clip-path-pentagon",
    hexagon: "w-[25px] h-[25px] clip-path-hexagon",
  };

  return (
    <div
      // Position the shape based on its type and position property
      className={`absolute ${shapeStyles[shape.type]} bg-${shape.color}-500`}
      style={{ left: `${position}%`, top: "50%", transform: "translateY(-50%)" }}
    />
  );
};

// Game screen logic and UI
const GameScreen = ({ difficulty, onGameOver }) => {
  // State variables for game mechanics
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [consecutiveHits, setConsecutiveHits] = useState(0);
  const [currentShapes, setCurrentShapes] = useState([]);
  const [timeLeft, setTimeLeft] = useState(difficulties[difficulty].time);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Function to spawn shapes on the screen
  const spawnShape = useCallback(() => {
    const newShapes = [];
    for (let i = 0; i < difficulties[difficulty].shapes; i++) {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const isBonus = Math.random() < 0.1; // 10% chance for bonus shapes
      newShapes.push({ ...randomShape, position: 0, isBonus });
    }
    setCurrentShapes(newShapes);
  }, [difficulty]);

  // Movement logic for shapes using a game loop
  useEffect(() => {
    if (!isPaused && !gameOver) {
      const interval = setInterval(() => {
        setCurrentShapes((prevShapes) => {
          const updatedShapes = prevShapes.map((shape) => ({
            ...shape,
            position: shape.position + 100 / (difficulties[difficulty].speed / 16.67),
          }));
          // Remove shapes that have moved out and spawn new ones
          if (updatedShapes.every((shape) => shape.position >= 100)) {
            spawnShape();
            return [];
          }
          return updatedShapes;
        });
      }, 16.67); // Frame rate interval for smooth animation
      return () => clearInterval(interval);
    }
  }, [difficulty, isPaused, gameOver, spawnShape]);

  // Countdown timer for the game
  useEffect(() => {
    if (!isPaused && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer); // End the game when time is up
            setGameOver(true);
            onGameOver(score);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Decrease time every second
      return () => clearInterval(timer);
    }
  }, [isPaused, gameOver, score, onGameOver]);

  // Spawn initial shapes when the game starts
  useEffect(() => {
    spawnShape();
  }, [spawnShape]);

  // Logic for the "Push" button to check for shape hits
  const handlePush = () => {
    const hitShape = currentShapes.find((shape) => shape.position >= 40 && shape.position <= 60);
    if (hitShape) {
      const points = hitShape.isBonus ? 5 : 1; // Bonus shapes give more points
      setScore((prevScore) => prevScore + points * multiplier);
      setConsecutiveHits((prev) => {
        const newHits = prev + 1;
        if (newHits % 3 === 0) {
          setMultiplier((prevMultiplier) => prevMultiplier + 1); // Increase multiplier every 3 hits
        }
        return newHits;
      });
    } else {
      // End game if no shape is hit
      setGameOver(true);
      onGameOver(score);
    }
  };

  if (gameOver) return null; // Don't render if the game is over

  return (
    <div className="relative w-full h-[60vh] bg-gray-100 overflow-hidden">
      {/* Score and multiplier display */}
      <Card className="absolute top-2 left-2 z-10">
        <CardHeader>
          <CardTitle>Score: {score}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Multiplier: x{multiplier}</p>
          <p>Time: {timeLeft}s</p>
        </CardContent>
      </Card>

      {/* Pause button */}
      <div className="absolute top-2 right-2 z-10">
        <Button onClick={() => setIsPaused(!isPaused)}>{isPaused ? "Resume" : "Pause"}</Button>
      </div>

      {/* Target rectangle */}
      <div className="absolute left-1/2 top-1/2 w-[100px] h-[50px] border-4 border-black transform -translate-x-1/2 -translate-y-1/2" />

      {/* Render current shapes */}
      {currentShapes.map((shape, index) => (
        <Shape key={index} shape={shape} position={shape.position} />
      ))}

      {/* Push button */}
      <Button className="absolute bottom-4 left-1/2 transform -translate-x-1/2" size="lg" onClick={handlePush}>
        Push
      </Button>
    </div>
  );
};

// Main App component
export default function App() {
  const [gameState, setGameState] = useState("start"); // Start, playing, or end state
  const [difficulty, setDifficulty] = useState("easy"); // Selected difficulty level
  const [scores, setScores] = useState([]); // Top scores leaderboard

  // Handle game over logic
  const handleGameOver = (score) => {
    setScores((prevScores) => [...prevScores, score].sort((a, b) => b - a).slice(0, 5)); // Update leaderboard
    setGameState("end");
  };

  // Restart the game
  const restartGame = () => {
    setGameState("playing");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Start screen */}
      {gameState === "start" && (
        <Card>
          <CardHeader>
            <CardTitle>Shape Clicker Game</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Click the "Push" button when shapes are inside the rectangle. Get 3 in a row to increase your multiplier!
            </p>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Button className="mt-4" onClick={() => setGameState("playing")}>
              Start Game
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game screen */}
      {gameState === "playing" && <GameScreen difficulty={difficulty} onGameOver={handleGameOver} />}

      {/* Game over dialog */}
      <Dialog open={gameState === "end"} onOpenChange={() => setGameState("start")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over!</DialogTitle>
          </DialogHeader>
          <div>
            <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
            <ol className="list-decimal list-inside">
              {scores.map((score, index) => (
                <li key={index}>{score}</li>
              ))}
            </ol>
          </div>
          <Button onClick={restartGame}>Restart</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
