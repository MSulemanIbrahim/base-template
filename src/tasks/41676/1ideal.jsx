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
const INITIAL_HIGHLIGHT_TIME = 1000; // Initial time a square stays highlighted (in ms)
const INITIAL_GAP_TIME = 2000; // Gap time between highlights (in ms)

// Home screen component for selecting difficulty and starting the game
function HomeScreen({ onStart, difficulty, setDifficulty }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Memory and Reaction Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Click the highlighted square as quickly as possible. Be careful, you only have {INITIAL_LIVES} lives!
        </p>
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

// The game board that dynamically renders squares based on difficulty
function GameBoard({ size, onSquareClick, highlightedSquare }) {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
      }}
    >
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

// Game over screen that displays the final score and restart button
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
  const [gameState, setGameState] = useState("home"); // Tracks the current game state
  const [difficulty, setDifficulty] = useState("easy"); // Selected difficulty level
  const [score, setScore] = useState(0); // Player's score
  const [lives, setLives] = useState(INITIAL_LIVES); // Remaining lives
  const [highlightedSquare, setHighlightedSquare] = useState(null); // Index of the highlighted square
  const [canClick, setCanClick] = useState(false); // Controls if the player can click
  const [highlightTime, setHighlightTime] = useState(INITIAL_HIGHLIGHT_TIME);
  const [gapTime, setGapTime] = useState(INITIAL_GAP_TIME);

  // Resets the game state for a new game
  const resetGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setHighlightedSquare(null);
    setCanClick(false);
    setHighlightTime(INITIAL_HIGHLIGHT_TIME);
    setGapTime(INITIAL_GAP_TIME);
  }, []);

  // Starts the game
  const startGame = useCallback(() => {
    resetGame();
    setGameState("playing");
  }, [resetGame]);

  // Handles square clicks
  const handleSquareClick = useCallback(
    (index) => {
      if (index === highlightedSquare) {
        // Increment score for correct click
        setScore((prevScore) => prevScore + 1);
      } else {
        // Deduct a life for incorrect click
        setLives((prevLives) => {
          const updatedLives = prevLives - 1;
          if (updatedLives === 0) {
            setGameState("gameOver");
          }
          return updatedLives;
        });
      }

      // Reset square and disable further clicks
      setHighlightedSquare(null);
      setCanClick(false);
    },
    [canClick, highlightedSquare]
  );

  // Handles the square highlighting logic during gameplay
  useEffect(() => {
    if (gameState !== "playing") return;

    const highlightSquare = () => {
      const randomSquare = Math.floor(Math.random() * DIFFICULTY_LEVELS[difficulty].size ** 2);
      setHighlightedSquare(randomSquare);
      setCanClick(true);

      setTimeout(() => {
        setHighlightedSquare(null);
        setCanClick(false);
      }, highlightTime);
    };

    const timer = setTimeout(highlightSquare, gapTime);

    return () => clearTimeout(timer);
  }, [gameState, difficulty, highlightedSquare, highlightTime, gapTime]);

  // Adjusts difficulty dynamically as the score increases
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setHighlightTime((prevTime) => Math.max(prevTime * 0.9, 300)); // Reduce highlight time
      setGapTime((prevTime) => Math.max(prevTime * 0.9, 500)); // Reduce gap time
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
            {/* Display lives */}
            <div className="flex">
              {[1,2,3].map((l) => (
                <span
                  key={l}
                >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth="1.5"
                     stroke="currentColor"
                     className={`size-6 ${l <= lives ? "text-red-500" : "text-gray-300"}`}
                  >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                     />
                  </svg> 
                </span>
              ))}
            </div>
            {/* Display score */}
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
