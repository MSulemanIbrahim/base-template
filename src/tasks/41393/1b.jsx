import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Game />
    </div>
  );
}

function Game() {
  const [gameState, setGameState] = useState('instructions');
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(3);

  useEffect(() => {
    if (countdown > 0 && gameState === 'computerTurn') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setGameState('computerHighlight');
      highlightSequence();
    }
  }, [countdown, gameState]);

  const startGame = () => {
    setGameState('computerTurn');
    setSequence(generateSequence(currentRound));
  };

  const generateSequence = (length) => {
    return Array.from({length}, () => Math.floor(Math.random() * 9) + 1);
  };

  const highlightSequence = useCallback(() => {
    let index = 0;
    const highlightInterval = setInterval(() => {
      if (index < sequence.length) {
        const buttonId = `button-${sequence[index]}`;
        document.getElementById(buttonId).classList.add('bg-green-500');
        setTimeout(() => {
          document.getElementById(buttonId).classList.remove('bg-green-500');
        }, 800);
        index++;
      } else {
        clearInterval(highlightInterval);
        setGameState('userTurn');
      }
    }, 1000);
  }, [sequence]);

  const handleButtonClick = (num) => {
    if (gameState !== 'userTurn') return;
    setUserSequence(prev => [...prev, num]);
    if (num !== sequence[userSequence.length]) {
      setGameState('gameOver');
    } else if (userSequence.length + 1 === sequence.length) {
      setScore(score + 10);
      setGameState('roundWon');
    }
  };

  const resetGame = () => {
    setGameState('instructions');
    setSequence([]);
    setUserSequence([]);
    setCountdown(3);
    setScore(0);
    setCurrentRound(3);
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setGameState('computerTurn');
    setSequence(generateSequence(currentRound + 1));
    setUserSequence([]);
  };

  return (
    <Card className="w-full max-w-sm sm:max-w-lg">
      <CardHeader>
        <CardTitle>{gameState === 'gameOver' ? 'Game Over' : gameState === 'roundWon' ? 'Round Won!' : 'Memory Game'}</CardTitle>
      </CardHeader>
      <CardContent>
        {gameState === 'instructions' && (
          <>
            <p>Memorize the sequence of numbers highlighted by the computer. Repeat the sequence by clicking the buttons in order.</p>
            <Button onClick={startGame} className="mt-4">Start Game</Button>
          </>
        )}
        {['computerTurn', 'computerHighlight', 'userTurn'].includes(gameState) && (
          <>
            <div className="mb-4">
              <div>{gameState === 'computerTurn' ? `Computer turn starts in ${countdown}` : gameState === 'userTurn' ? 'Your turn' : ''}</div>
              <div className="text-lg font-bold">Score: {score}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6,7,8,9].map(num => (
                <Button key={num} id={`button-${num}`} onClick={() => handleButtonClick(num)} className="w-12 h-12 sm:w-20 sm:h-20">
                  {num}
                </Button>
              ))}
            </div>
          </>
        )}
        {gameState === 'roundWon' && (
          <>
            <p>You won this round!</p>
            <Button onClick={nextRound}>Next Round</Button>
          </>
        )}
        {gameState === 'gameOver' && (
          <>
            <p>Your final score: {score}</p>
            <Button onClick={resetGame}>Restart Game</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default App;