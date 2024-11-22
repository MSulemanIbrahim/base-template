import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Game />
    </div>
  );
}

function Game() {
  const [gameState, setGameState] = useState("instructions");
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [highlighted, setHighlighted] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(3);

  useEffect(() => {
    if (gameState === "computerTurn" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "computerTurn" && countdown === 0) {
      startComputerSequence();
    }
  }, [gameState, countdown]);

  const generateSequence = (length) =>
    Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);

  const startGame = () => {
    setSequence(generateSequence(currentRound));
    setUserSequence([]);
    setCountdown(3);
    setGameState("computerTurn");
  };

  const startComputerSequence = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < sequence.length) {
        setHighlighted(sequence[index]);
        setTimeout(() => setHighlighted(null), 800);
        index++;
      } else {
        clearInterval(interval);
        setGameState("userTurn");
      }
    }, 1000);
  };

  const handleButtonClick = (num) => {
    if (gameState !== "userTurn") return;

    setUserSequence((prev) => [...prev, num]);

    if (sequence[userSequence.length] !== num) {
      setGameState("gameOver");
    } else if (userSequence.length + 1 === sequence.length) {
      setScore((prev) => prev + 10);
      setGameState("roundWon");
    }
  };

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setSequence(generateSequence(currentRound + 1));
    setUserSequence([]);
    setCountdown(3);
    setGameState("computerTurn");
  };

  const resetGame = () => {
    setSequence([]);
    setUserSequence([]);
    setHighlighted(null);
    setCountdown(3);
    setScore(0);
    setCurrentRound(3);
    setGameState("instructions");
  };

  return (
    <Card className="w-full max-w-sm sm:max-w-lg">
      <CardHeader>
        <CardTitle>{gameState === "gameOver" ? "Game Over" : "Memory Game"}</CardTitle>
      </CardHeader>
      <CardContent>
        {gameState === "instructions" && (
          <>
            <p>
              Memorize the sequence of numbers highlighted by the computer.
              Repeat the sequence by clicking the buttons in order.
            </p>
            <Button onClick={startGame} className="mt-4">
              Start Game
            </Button>
          </>
        )}
        {gameState === "computerTurn" && countdown === 0 && <p className="text-left">Computer Turn</p>}
        {gameState === "userTurn" && <p className="text-right">Your turn!</p>}
        {gameState === "computerTurn" && countdown !== 0 && <p className="text-left">Computer turn starts in {countdown}...</p>}
        
        <div className="text-lg font-bold my-2">Score: {score}</div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
            <Button
              key={num}
              onClick={() => handleButtonClick(num)}
              className={`w-auto max-w-[150px] h-[50px] rounded ${
                highlighted === num ? "bg-green-500" : "bg-white"
              } text-black border border-black`}
            >
              {num}
            </Button>
          ))}
        </div>
        {gameState === "roundWon" && (
          <div className="mt-4">
            <p>You won this round!</p>
            <Button onClick={nextRound}>Next Round</Button>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="mt-4">
            <p>Game Over! Your final score: {score}</p>
            <Button onClick={resetGame}>Restart Game</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
