import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const emojis = [
  "😀", "😂", "😍", "🤔", "😎", "🥳", "😴", "🤯", "🥶", "🤠",
  "👽", "👻", "🤖", "🎃", "🦄", "🐶", "🐱", "🐼", "🦊", "🦁",
  "🐸", "🐙", "🦋", "🌈", "🌞", "🌙", "⭐", "🍕", "🍦", "🎈"
];

const GRID_SIZE = 4;
const INITIAL_TIME = 30;
const CORRECT_POINTS = 10;
const INCORRECT_POINTS = -5;
const TIME_PENALTY = 2;

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function EmojiGrid({ gridEmojis, targetEmoji, onEmojiClick }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {gridEmojis.map((emoji, index) => (
        <Button
          key={index}
          className="text-4xl sm:text-5xl p-2 sm:p-4 h-auto aspect-square"
          onClick={() => onEmojiClick(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}

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

export default function App() {
  const [gameState, setGameState] = useState("initial");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(INITIAL_TIME);
  const [gridEmojis, setGridEmojis] = useState([]);
  const [targetEmoji, setTargetEmoji] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const generateNewGrid = useCallback(() => {
    const shuffled = shuffleArray(emojis);
    const newGridEmojis = shuffled.slice(0, GRID_SIZE * GRID_SIZE);
    const newTargetEmoji = newGridEmojis[Math.floor(Math.random() * newGridEmojis.length)];
    setGridEmojis(newGridEmojis);
    setTargetEmoji(newTargetEmoji);
  }, []);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setTime(INITIAL_TIME);
    generateNewGrid();
    setIsGameOver(false);
  }, [generateNewGrid]);

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

  const handleEmojiClick = useCallback((clickedEmoji) => {
    if (clickedEmoji === targetEmoji) {
      setScore((prevScore) => prevScore + CORRECT_POINTS);
      generateNewGrid();
    } else {
      setScore((prevScore) => prevScore + INCORRECT_POINTS);
      setTime((prevTime) => Math.max(prevTime - TIME_PENALTY, 0));
    }
  }, [targetEmoji, generateNewGrid]);

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
            <div className="text-center">
              <p className="mb-4">
                Find the target emoji as quickly as possible! You have 30 seconds.
                Correct picks give you 10 points, wrong picks cost 5 points and 2 seconds.
              </p>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          ) : (
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