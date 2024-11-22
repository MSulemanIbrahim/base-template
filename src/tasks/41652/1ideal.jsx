import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// List of emojis used in the game
const emojis = [
  "😀", "😂", "😍", "🤔", "😎", "🥳", "😴", "🤯", "🥶", "🤠",
  "👽", "👻", "🤖", "🎃", "🦄", "🐶", "🐱", "🐼", "🦊", "🦁",
  "🐸", "🐙", "🦋", "🌈", "🌞", "🌙", "⭐", "🍕", "🍦", "🎈"
];

// Constants for game settings
const GRID_SIZE = 4;
const INITIAL_TIME = 30;
const CORRECT_POINTS = 10;
const INCORRECT_POINTS = -5;
const TIME_PENALTY = 2;

// Utility function to shuffle an array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Component to render the grid of emojis
function EmojiGrid({ gridEmojis, targetEmoji, onEmojiClick, clickedEmoji }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {gridEmojis.map((emoji, index) => (
        <Button
          key={index}
          className={`text-4xl sm:text-5xl p-2 sm:p-4 h-auto aspect-square ${
            clickedEmoji === emoji ? "border-4 border-red-500" : ""
          }`}
          onClick={() => onEmojiClick(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}

// Component to display the game-over dialog
function GameOverDialog({ isOpen, score, onRestart }) {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Over!</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Your Score: {score}</p>
        </div>
        <DialogFooter>
          <Button onClick={onRestart}>Restart Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main app component
export default function App() {
  const [gameState, setGameState] = useState("initial"); // Tracks game state
  const [score, setScore] = useState(0); // Tracks player's score
  const [time, setTime] = useState(INITIAL_TIME); // Tracks remaining time
  const [gridEmojis, setGridEmojis] = useState([]); // Grid of emojis
  const [targetEmoji, setTargetEmoji] = useState(""); // Target emoji
  const [isGameOver, setIsGameOver] = useState(false); // Tracks if game is over
  const [clickedEmoji, setClickedEmoji] = useState(null); // Tracks clicked emoji

  // Generates a new grid and target emoji
  const generateNewGrid = useCallback(() => {
    const shuffled = shuffleArray(emojis);
    const newGridEmojis = shuffled.slice(0, GRID_SIZE * GRID_SIZE);
    const newTargetEmoji = newGridEmojis[Math.floor(Math.random() * newGridEmojis.length)];
    setGridEmojis(newGridEmojis);
    setTargetEmoji(newTargetEmoji);
    setClickedEmoji(null); // Reset clicked emoji
  }, []);

  // Starts or restarts the game
  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setTime(INITIAL_TIME);
    generateNewGrid();
    setIsGameOver(false);
  }, [generateNewGrid]);

  // Timer logic to decrement time during gameplay
  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  // Handles emoji clicks
  const handleEmojiClick = useCallback(
    (clickedEmoji) => {
      setClickedEmoji(clickedEmoji); // Highlight the clicked emoji temporarily
      if (clickedEmoji === targetEmoji) {
        setScore((prevScore) => prevScore + CORRECT_POINTS);
        generateNewGrid(); // Generate a new grid if correct
      } else {
        setScore((prevScore) => prevScore + INCORRECT_POINTS);
        setTime((prevTime) => Math.max(prevTime - TIME_PENALTY, 0)); // Apply time penalty
        setTimeout(() => setClickedEmoji(null), 500); // Remove highlight after 0.5 seconds
      }
    },
    [targetEmoji, generateNewGrid]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Emoji Picker Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === "initial" ? (
            // Initial screen with instructions and start button
            <div className="text-center">
              <p className="mb-4">
                Find the target emoji as quickly as possible! You have 30 seconds.
                Correct picks give you 10 points, wrong picks cost 5 points and 2 seconds.
              </p>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          ) : (
            // Gameplay screen
            <>
              <div className="flex justify-between mb-4">
                <span>Score: {score}</span>
                <span>Time: {time}s</span>
              </div>
              <div className="text-center mb-4">
                <p className="text-lg">Find this emoji!</p>
                <span className="text-6xl">{targetEmoji}</span>
              </div>
              <EmojiGrid
                gridEmojis={gridEmojis}
                targetEmoji={targetEmoji}
                onEmojiClick={handleEmojiClick}
                clickedEmoji={clickedEmoji}
              />
            </>
          )}
        </CardContent>
      </Card>
      <GameOverDialog
        isOpen={isGameOver}
        score={score}
        onRestart={startGame}
      />
    </div>
  );
}
