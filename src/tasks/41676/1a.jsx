import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DIFFICULTY_LEVELS = {
  easy: { size: 3, label: "Easy" },
  medium: { size: 5, label: "Medium" },
  hard: { size: 7, label: "Hard" },
};

const INITIAL_LIVES = 3;
const INITIAL_HIGHLIGHT_TIME = 1000;
const INITIAL_GAP_TIME = 2000;

function HomeScreen({ onStart, difficulty, setDifficulty }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Memory and Reaction Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Click the highlighted square as quickly as possible. Be careful, you only have 3 lives!</p>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DIFFICULTY_LEVELS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onStart} className="w-full">
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
}

function GameBoard({ size, onSquareClick, highlightedSquare }) {
  return (
    <div className={`grid gap-2 grid-cols-${size} grid-rows-${size}`}>
      {Array.from({ length: size * size }).map((_, index) => (
        <button
          key={index}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md transition-colors duration-200 ${
            highlightedSquare === index
              ? "bg-blue-500"
              : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
          }`}
          onClick={() => onSquareClick(index)}
        />
      ))}
    </div>
  );
}

function GameOverScreen({ score, onRestart }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Game Over</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-bold">Final Score: {score}</p>
        <Button onClick={onRestart} className="w-full">
          Restart
        </Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [gameState, setGameState] = useState("home");
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const [canClick, setCanClick] = useState(false);
  const [highlightTime, setHighlightTime] = useState(INITIAL_HIGHLIGHT_TIME);
  const [gapTime, setGapTime] = useState(INITIAL_GAP_TIME);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setHighlightedSquare(null);
    setCanClick(false);
    setHighlightTime(INITIAL_HIGHLIGHT_TIME);
    setGapTime(INITIAL_GAP_TIME);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState("playing");
  }, [resetGame]);

  const handleSquareClick = useCallback(
    (index) => {
      if (!canClick) return;

      if (index === highlightedSquare) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setLives((prevLives) => prevLives - 1);
      }
      setHighlightedSquare(null);
      setCanClick(false);
    },
    [canClick, highlightedSquare]
  );

  useEffect(() => {
    if (lives === 0) {
      setGameState("gameOver");
    }
  }, [lives]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const highlightSquare = () => {
      const randomSquare = Math.floor(Math.random() * DIFFICULTY_LEVELS[difficulty].size ** 2);
      setHighlightedSquare(randomSquare);
      setCanClick(false);

      setTimeout(() => {
        setHighlightedSquare(null);
        setTimeout(() => {
          setCanClick(true);
        }, gapTime);
      }, highlightTime);
    };

    const timer = setTimeout(highlightSquare, 1000);

    return () => clearTimeout(timer);
  }, [gameState, difficulty, highlightedSquare, canClick, highlightTime, gapTime]);

  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setHighlightTime((prevTime) => Math.max(prevTime * 0.9, 300));
      setGapTime((prevTime) => Math.max(prevTime * 0.9, 500));
    }
  }, [score]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {gameState === "home" && (
        <HomeScreen onStart={startGame} difficulty={difficulty} setDifficulty={setDifficulty} />
      )}
      {gameState === "playing" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-1">
              {Array.from({ length: INITIAL_LIVES }).map((_, index) => (
                <span key={index} className={`text-2xl ${index < lives ? "text-red-500" : "text-gray-300"}`}>
                  ❤️
                </span>
              ))}
            </div>
            <div className="text-2xl font-bold">Score: {score}</div>
          </div>
          <GameBoard
            size={DIFFICULTY_LEVELS[difficulty].size}
            onSquareClick={handleSquareClick}
            highlightedSquare={highlightedSquare}
          />
        </div>
      )}
      {gameState === "gameOver" && <GameOverScreen score={score} onRestart={() => setGameState("home")} />}
    </div>
  );
}