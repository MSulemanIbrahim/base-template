import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const sentences = [
  { sentence: "He ___ there yesterday.", correct: "was" },
  { sentence: "She ___ the book last week.", correct: "read" },
  // Add more sentences here...
];

function SentenceGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedWord, setSelectedWord] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintAvailable, setHintAvailable] = useState(3);
  const [questionsCount, setQuestionsCount] = useState(5);
  const [showHint, setShowHint] = useState(false);

  const sentence = sentences[currentQuestion % sentences.length];
  const words = ["is", "has", "was", "at", sentence.correct].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (questionsCount === 5) setHintAvailable(2);
    else if (questionsCount === 8) setHintAvailable(3);
    else if (questionsCount === 10) setHintAvailable(4);
  }, [questionsCount]);

  const handleWordSelect = (word) => {
    setSelectedWord(word);
    setShowHint(false);
  };

  const handleSubmit = () => {
    setIsCorrect(selectedWord === sentence.correct);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedWord('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const giveHint = () => {
    if (hintsUsed < hintAvailable) {
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  return (
    <Card className="sm:max-w-lg mx-auto mt-5">
      <CardHeader>
        <CardTitle>Word Game</CardTitle>
        <Button 
          onClick={giveHint} 
          disabled={hintsUsed >= hintAvailable}
          className="absolute top-2 right-2"
        >
          Show Hint ({hintAvailable - hintsUsed} left)
        </Button>
      </CardHeader>
      <CardContent>
        <p>{sentence.sentence.replace('___', <span className="font-bold">{selectedWord || '___'}</span>)}</p>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {words.map((word, idx) => (
            <Button 
              key={idx} 
              onClick={() => handleWordSelect(word)} 
              variant={showHint && word === sentence.correct ? "outline" : "default"}
              className={`hover:bg-primary hover:text-white ${selectedWord === word ? 'bg-primary text-white' : ''}`}
            >
              {word}
            </Button>
          ))}
        </div>
        <Button onClick={handleSubmit} className="mt-4 w-full">Submit</Button>
        {isCorrect !== null && (
          <div className={`mt-2 text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Wrong!'}
            {isCorrect && <Button onClick={nextQuestion} className="mt-2">Next</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);

  return (
    <div className="p-4">
      {!gameStarted ? (
        <Card className="sm:max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Welcome to the Word Game</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Choose how many questions you want to answer:</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{questionCount}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Number of Questions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[5, 8, 10].map(num => (
                  <DropdownMenuItem key={num} onClick={() => setQuestionCount(num)}>
                    {num}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
          <Button onClick={() => setGameStarted(true)} className="mt-4">Start</Button>
        </Card>
      ) : (
        <SentenceGame questionsCount={questionCount} />
      )}
    </div>
  );
}