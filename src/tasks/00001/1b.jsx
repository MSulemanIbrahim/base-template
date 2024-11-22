import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const COLORS = ["red", "blue", "yellow", "orange", "pink", "black", "purple"];
const DIFFICULTIES = {
  easy: { circles: 3, speed: 1, promptInterval: 5000 },
  medium: { circles: 5, speed: 2, promptInterval: 5000 },
  hard: { circles: 7, speed: 3, promptInterval: 3000 },
};

function Circle({ color, position, onClick }) {
  return (
    <div
      className={`absolute w-12 h-12 rounded-full cursor-pointer bg-${color}-500`}
      style={{ left: position.x, top: position.y }}
      onClick={onClick}
    />
  );
}

function Lives({ lives }) {
  return (
    <Card className="w-32">
      <CardContent className="flex justify-center items-center p-2">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`text-2xl ${i < lives ? "text-red-500" : "text-gray-300"}`}>
            ❤️
          </span>
        ))}
      </CardContent>
    </Card>
  );
}

function Score({ score }) {
  return (
    <Card className="w-32 bg-black text-white">
      <CardContent className="flex justify-center items-center p-2">
        <span className="text-xl font-bold">Score: {score}</span>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [gameState, setGameState] = useState("menu");
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [circles, setCircles] = useState([]);
  const [targetColor, setTargetColor] = useState("");
  const gameAreaRef = useRef(null);

  useEffect(() => {
    if (gameState === "playing") {
      initGame();
      const intervalId = setInterval(updateGame, 16);
      return () => clearInterval(intervalId);
    }
  }, [gameState, difficulty]);

  const initGame = () => {
    const { circles: circleCount, speed } = DIFFICULTIES[difficulty];
    const newCircles = [];
    const gameArea = gameAreaRef.current.getBoundingClientRect();

    for (let i = 0; i < circleCount; i++) {
      newCircles.push({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        position: {
          x: Math.random() * (gameArea.width - 48),
          y: Math.random() * (gameArea.height - 48),
        },
        velocity: {
          x: (Math.random() - 0.5) * speed,
          y: (Math.random() - 0.5) * speed,
        },
      });
    }

    setCircles(newCircles);
    setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setScore(0);
    setLives(3);

    setInterval(() => {
      setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }, DIFFICULTIES[difficulty].promptInterval);
  };

  const updateGame = () => {
    setCircles((prevCircles) => {
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      return prevCircles.map((circle) => {
        let { x, y } = circle.position;
        let { x: vx, y: vy } = circle.velocity;

        x += vx;
        y += vy;

        if (x <= 0 || x >= gameArea.width - 48) vx = -vx;
        if (y <= 0 || y >= gameArea.height - 48) vy = -vy;

        return {
          ...circle,
          position: { x, y },
          velocity: { x: vx, y: vy },
        };
      });
    });
  };

  const handleCircleClick = (clickedColor) => {
    if (clickedColor === targetColor) {
      setScore((prevScore) => prevScore + 10);
    } else {
      setLives((prevLives) => prevLives - 1);
      if (lives === 1) setGameState("gameOver");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      {gameState === "menu" && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Color Click Challenge</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500">
              Click on the circles matching the color shown at the top. Score points and avoid losing lives!
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
            <DialogFooter>
              <Button onClick={() => setGameState("playing")}>Start Game</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {gameState === "playing" && (
        <>
          <div className="w-full flex justify-between p-4">
            <Lives lives={lives} />
            <Alert className="w-64">
              <AlertTitle>Click on</AlertTitle>
              <AlertDescription className={`font-bold text-${targetColor}-500`}>
                {targetColor.toUpperCase()}
              </AlertDescription>
            </Alert>
            <Score score={score} />
          </div>
          <div
            ref={gameAreaRef}
            className="flex-grow w-full relative bg-gray-200 overflow-hidden"
            onClick={() => setLives((prevLives) => prevLives - 1)}
          >
            {circles.map((circle, index) => (
              <Circle
                key={index}
                color={circle.color}
                position={circle.position}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCircleClick(circle.color);
                }}
              />
            ))}
          </div>
        </>
      )}

      {gameState === "gameOver" && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game Over</DialogTitle>
            </DialogHeader>
            <p className="text-lg font-semibold">Your final score: {score}</p>
            <DialogFooter>
              <Button onClick={() => setGameState("menu")}>Main Menu</Button>
              <Button onClick={() => setGameState("playing")}>Play Again</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}