import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";

const GridSquare = ({ index, active, onClick }) => (
    <button
        className={`w-16 h-16 sm:w-20 sm:h-20 border border-gray-300 ${active ? 'bg-blue-500' : 'bg-white hover:bg-gray-100'} transition-all duration-150 ease-in-out`}
        onClick={() => onClick(index)}
    />
);

export default function App() {
    const [difficulty, setDifficulty] = useState('easy');
    const [gridSize, setGridSize] = useState({ rows: 3, cols: 3 });
    const [gameState, setGameState] = useState('home'); // 'home', 'play', 'gameover'
    const [highlighted, setHighlighted] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [speed, setSpeed] = useState(1000);

    useEffect(() => {
        const size = {
            'easy': { rows: 3, cols: 3 },
            'medium': { rows: 5, cols: 5 },
            'hard': { rows: 7, cols: 7 }
        };
        setGridSize(size[difficulty]);
    }, [difficulty]);

    const startGame = () => {
        setGameState('play');
        setScore(0);
        setLives(3);
        setSpeed(1000);
        highlightRandomSquare();
    };

    const highlightRandomSquare = () => {
        const randomIndex = Math.floor(Math.random() * (gridSize.rows * gridSize.cols));
        setHighlighted(randomIndex);
        setTimeout(() => {
            setHighlighted(null);
            setTimeout(() => {
                if (gameState === 'play') {
                    // Allow user to click after this timeout
                }
            }, 2000);
        }, speed);
    };

    const handleClick = (index) => {
        if (gameState !== 'play') return;

        if (index === highlighted) {
            setScore(score + 1);
            const newSpeed = Math.max(300, speed - 50);
            setSpeed(newSpeed);
            highlightRandomSquare();
        } else {
            setLives(lives - 1);
            if (lives - 1 === 0) {
                setGameState('gameover');
            }
        }
    };

    const restartGame = () => {
        setGameState('home');
    };

    const renderGrid = () => {
        let grid = [];
        for (let i = 0; i < gridSize.rows * gridSize.cols; i++) {
            grid.push(
                <GridSquare
                    key={i}
                    index={i}
                    active={i === highlighted}
                    onClick={handleClick}
                />
            );
        }
        return grid;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {gameState === 'home' && (
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Memory Grid Game</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Choose a square that lights up. Get faster as you score!</p>
                        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </Select>
                        <Button onClick={startGame} className="mt-4">Start Game</Button>
                    </CardContent>
                </Card>
            )}

            {gameState === 'play' && (
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center">
                        <p className="mr-4">Score: {score}</p>
                        {[...Array(lives)].map((_, i) => <span key={i} className="text-2xl text-red-500 mr-2">❤️</span>)}
                        {[...Array(3 - lives)].map((_, i) => <span key={i} className="text-2xl text-gray-400 mr-2">🖤</span>)}
                    </div>
                    <div className={`grid grid-cols-${gridSize.cols} gap-2`}>
                        {renderGrid()}
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <Card className="w-full max-w-sm text-center">
                    <CardContent>
                        <CardTitle>Game Over</CardTitle>
                        <p>Your Score: {score}</p>
                        <Button onClick={restartGame}>Restart</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}