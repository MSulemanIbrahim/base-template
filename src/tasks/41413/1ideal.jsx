import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sentences = [
  { sentence: "He ___ there yesterday.", options: ["is", "has", "was", "at"], correct: "was" },
  { sentence: "They ___ to the park.", options: ["go", "went", "gone", "going"], correct: "went" },
  { sentence: "She ___ a book.", options: ["read", "reads", "reading", "readed"], correct: "reads" },
  { sentence: "We ___ dinner now.", options: ["have", "has", "are having", "had"], correct: "are having" },
  { sentence: "The cat ___ on the roof.", options: ["sit", "sits", "sitting", "sat"], correct: "sits" },
  { sentence: "I ___ to music.", options: ["listen", "listens", "listening", "listened"], correct: "listen" },
  { sentence: "You ___ very tall.", options: ["is", "are", "am", "be"], correct: "are" },
  { sentence: "They ___ a new car.", options: ["buy", "buys", "buying", "bought"], correct: "bought" },
  { sentence: "He ___ his homework.", options: ["do", "does", "doing", "did"], correct: "does" },
  { sentence: "We ___ to the beach.", options: ["go", "goes", "going", "went"], correct: "went" },
];

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

function Instructions({ onStart, questionCount, setQuestionCount }) {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>How to Play</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2">
          <li>Choose the number of questions you want to play.</li>
          <li>Click "Start" to begin the game.</li>
          <li>Click on a word to fill it in the blank.</li>
          <li>Use hints if needed (limited uses available).</li>
          <li>Submit your answer and move to the next question.</li>
        </ol>
        <div className="mt-4 space-y-4">
          <Select onValueChange={(value) => setQuestionCount(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select question count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="8">8 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onStart} disabled={!questionCount} className="w-full">
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Game({ questionCount, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintsRemaining, setHintsRemaining] = useState(
    questionCount <= 5 ? 2 : questionCount <= 8 ? 3 : 4
  );
  const [highlightedOption, setHighlightedOption] = useState(null);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(sentences).slice(0, questionCount);
    setQuestions(shuffledQuestions);
  }, [questionCount]);

  if (!questions.length) {
    return (
      <div className="text-center mt-8">
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentSentence = questions[currentQuestion];

  const handleWordClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (selectedAnswer === currentSentence.correct) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questionCount) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setIsCorrect(null);
    } else {
      setCurrentQuestion(questionCount);
    }
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setHighlightedOption(currentSentence.correct);
      setHintsRemaining(hintsRemaining - 1);
      setTimeout(() => setHighlightedOption(null), 2000);
    }
  };

  const formatSentence = (sentence, selectedWord) => {
    return sentence.replace(
      "___",
      selectedWord ? `<b>${selectedWord}</b>` : "___"
    );
  };

  if (currentQuestion >= questionCount) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8 text-center">
        <CardHeader>
          <CardTitle>Game Over</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">You completed the game!</p>
          <Button onClick={onRestart} className="mt-4">
            Restart
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>
          Question {currentQuestion + 1}/{questionCount}
        </CardTitle>
        <Button
          onClick={handleHint}
          disabled={hintsRemaining === 0}
          size="sm"
          variant="outline"
          className="ml-auto"
        >
          Show Hint ({hintsRemaining})
        </Button>
      </CardHeader>
      <CardContent>
        <p
          className="text-lg mb-4"
          dangerouslySetInnerHTML={{
            __html: formatSentence(currentSentence.sentence, selectedAnswer),
          }}
        />
        <div className="grid grid-cols-2 gap-2">
          {currentSentence.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleWordClick(option)}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`${
                highlightedOption === option ? "bg-yellow-200" : ""
              } hover:bg-gray-100`}
            >
              {option}
            </Button>
          ))}
        </div>
        {isCorrect === null ? (
          <Button onClick={handleSubmit} className="w-full mt-4" disabled={!selectedAnswer}>
            Submit
          </Button>
        ) : (
          <div className="mt-4">
            <p className={`text-center text-lg ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Incorrect!"}
            </p>
            <Button onClick={handleNext} className="w-full mt-2">
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(null);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setQuestionCount(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!gameStarted ? (
        <Instructions
          onStart={handleStart}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
        />
      ) : (
        <Game questionCount={questionCount} onRestart={handleRestart} />
      )}
    </div>
  );
}
