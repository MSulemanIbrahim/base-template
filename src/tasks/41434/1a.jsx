import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const shapes = [
  { shape: 'triangle', color: 'red' },
  { shape: 'circle', color: 'blue' },
  { shape: 'square', color: 'yellow' },
  { shape: 'diamond', color: 'green' },
  { shape: 'star', color: 'purple' },
];

const difficulties = {
  easy: { speed: 5000, time: 60 },
  medium: { speed: 3000, time: 45 },
  hard: { speed: 2000, time: 30 }
};

function Shape({ shape, color, size }) {
  const style = {
    width: size,
    height: size,
    backgroundColor: color,
    clipPath: shape === 'circle' ? 'circle(50%)' : 
              shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
              shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 
              shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'square(100%)'
  };

  return <div style={{...style, position: 'absolute', left: '-100px', transition: 'left linear'}} />;
}

function Game() {
  const [difficulty, setDifficulty] = useState('easy');
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentShape, setCurrentShape] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [bonusShape, setBonusShape] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const boxRef = useRef(null);
  const shapeRef = useRef(null);
  const timerRef = useRef(null);
  const speedRef = useRef(difficulties[difficulty].speed);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        if (!isPaused) {
          setTimeLeft(prevTime => prevTime > 0 ? prevTime - 1 : 0);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, isPaused]);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(moveShape, speedRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, difficulty]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(difficulties[difficulty].time);
    setScore(0);
    setMultiplier(1);
  };

  const moveShape = () => {
    if (Math.random() < 0.1) setBonusShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setTimeout(() => {
      setCurrentShape(null);
      setBonusShape(null);
    }, speedRef.current);
  };

  const handleClick = () => {
    if (shapeRef.current && boxRef.current) {
      const shapeRect = shapeRef.current.getBoundingClientRect();
      const boxRect = boxRef.current.getBoundingClientRect();
      if (shapeRect.left >= boxRect.left && shapeRect.right <= boxRect.right) {
        const isBonus = !!bonusShape;
        setScore(prev => prev + (isBonus ? 5 : 1) * multiplier);
        if (!isBonus) {
          setMultiplier(prev => prev < 3 ? prev + 1 : prev);
        }
      } else {
        endGame();
      }
    }
  };

  const endGame = () => {
    setGameState('over');
    setLeaderboard(prev => [...prev, score].sort((a, b) => b - a).slice(0, 5));
    clearInterval(timerRef.current);
  };

  const pauseGame = () => {
    setIsPaused(prev => !prev);
  };

  const restartGame = () => {
    setGameState('start');
    setTimeLeft(difficulties[difficulty].time);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-4">
      {gameState === 'start' && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Shape Clicker</CardTitle>
          </CardHeader>
          <CardContent>
            <select onChange={(e) => setDifficulty(e.target.value)} className="mb-4 w-full">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <Button onClick={startGame}>Start Game</Button>
          </CardContent>
        </Card>
      )}

      {gameState === 'playing' && (
        <div className="relative w-full max-w-lg">
          <Card className="mb-4">
            <CardContent>
              <div className="flex justify-between">
                <div>Score: {score}</div>
                <div>Multiplier: x{multiplier}</div>
                <div>Time: {timeLeft}s</div>
              </div>
            </CardContent>
          </Card>
          <div ref={boxRef} className="border-2 border-dashed border-gray-500 h-40 mb-4 relative">
            {currentShape && <Shape ref={shapeRef} {...currentShape} size="20" />}
            {bonusShape && <Shape {...bonusShape} color="gold" size="20" />}
          </div>
          <Button onClick={handleClick} className="mb-2 w-full">Push</Button>
          <Button onClick={pauseGame} variant="secondary" className="w-full">{isPaused ? 'Resume' : 'Pause'}</Button>
        </div>
      )}

      {gameState === 'over' && (
        <Card>
          <CardHeader>
            <CardTitle>Game Over</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your Score: {score}</p>
            <Button onClick={restartGame} className="mt-4">Restart</Button>
            <h3 className="mt-4 font-bold">Leaderboard</h3>
            <ol className="list-decimal pl-5">
              {leaderboard.map((score, index) => <li key={index}>{score}</li>)}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function App() {
  return <Game />;
}