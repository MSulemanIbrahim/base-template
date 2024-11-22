import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function EmojiGrid({ size, onEmojiClick, targetEmoji }) {
  const gridEmojis = shuffleArray(emojis).slice(0, size * size);
  const [highlighted, setHighlighted] = useState(null);

  const handleClick = (emoji) => {
    setHighlighted(emoji);
    onEmojiClick(emoji);
    setTimeout(() => setHighlighted(null), 200);
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {gridEmojis.map((emoji, idx) => (
        <div 
          key={idx} 
          className={`p-4 text-4xl border rounded transition-all duration-300 ${highlighted === emoji ? 'border-red-500' : ''} ${emoji === targetEmoji ? 'animate-bounce' : ''}`}
          onClick={() => handleClick(emoji)}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [targetEmoji, setTargetEmoji] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTargetEmoji(shuffleArray(emojis)[0]);
    setScore(0);
    setTimeLeft(30);
  };

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const handleEmojiClick = (emoji) => {
    if (emoji === targetEmoji) {
      setScore(s => s + 10);
      setTargetEmoji(shuffleArray(emojis)[0]);
    } else {
      setScore(s => s > 0 ? s - 5 : 0);
      setTimeLeft(t => t > 2 ? t - 2 : 0);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    startGame();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-2">
      <Card className="w-full max-w-sm sm:max-w-lg p-4">
        <CardHeader>
          <CardTitle>Emoji Finder</CardTitle>
        </CardHeader>
        <CardContent>
          {!gameStarted ? (
            <>
              <p>Find the target emoji in the grid before time runs out!</p>
              <Button onClick={startGame} className="mt-4">Start Game</Button>
            </>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
              </div>
              <div className="text-5xl mb-4 text-center">Find this emoji: {targetEmoji}</div>
              <EmojiGrid size={4} onEmojiClick={handleEmojiClick} targetEmoji={targetEmoji} />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={gameOver} onOpenChange={setGameOver}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">
            Your Score: {score}
          </div>
          <DialogFooter>
            <Button onClick={restartGame}>Restart Game</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}