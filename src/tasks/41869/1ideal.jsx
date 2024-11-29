import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TextCaseConverter = () => {
  // State to manage input text, output text, history, history index, and other UI states
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  // Function to update the input text and maintain history for undo/redo functionality
  const updateText = useCallback(
    (newText) => {
      setInputText(newText);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newText]); // Ensure history is updated correctly
      setHistoryIndex((prev) => prev + 1); // Move to the next index in history
    },
    [historyIndex]
  );

  // Function to handle case conversion based on the selected type
  const convertCase = (type) => {
    let result = inputText;
    switch (type) {
      case "upper":
        result = inputText.toUpperCase();
        break;
      case "lower":
        result = inputText.toLowerCase();
        break;
      case "title":
        // Capitalize the first letter of each word
        result = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case "sentence":
        // Capitalize the first letter of the input text and make the rest lowercase
        result = inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
        break;
      case "reverse":
        // Reverse the entire input string
        result = inputText.split("").reverse().join("");
        break;
      case "removeSpaces":
        // Remove extra spaces and trim leading/trailing spaces
        result = inputText.replace(/\s+/g, " ").trim();
        break;
      default:
        break;
    }
    setOutputText(result); // Update the output text with the result
  };

  // Function to copy output text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText); // Write text to clipboard
    setCopied(true); // Show "copied" tooltip
    setTimeout(() => setCopied(false), 2000); // Hide tooltip after 2 seconds
  };

  // Function to clear input and output text and reset history
  const clearText = () => {
    setInputText("");
    setOutputText("");
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Undo functionality to revert to the previous state
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setInputText(history[historyIndex - 1]);
    }
  };

  // Redo functionality to move forward in the history
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setInputText(history[historyIndex + 1]);
    }
  };

  // Counts for words, characters, sentences, and paragraphs
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length; // Count non-empty words
  const charCount = inputText.length; // Total character count
  const sentenceCount = inputText.split(/[.!?]+\s/).filter(Boolean).length; // Approximate sentence count
  const paragraphCount = inputText.split(/\n+/).filter(Boolean).length; // Count paragraphs

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Text Case Converter</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Input Textarea for user input */}
          <Textarea
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => updateText(e.target.value)} // Update text on input change
            className="w-full h-40 mb-4"
          />
          {/* Buttons for various operations */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => convertCase("upper")}>Uppercase</Button>
            <Button onClick={() => convertCase("lower")}>Lowercase</Button>
            <Button onClick={() => convertCase("title")}>Title Case</Button>
            <Button onClick={() => convertCase("sentence")}>Sentence Case</Button>
            <Button onClick={() => convertCase("reverse")}>Reverse</Button>
            <Button onClick={() => convertCase("removeSpaces")}>Remove Spaces</Button>
            <Button onClick={clearText}>Clear Text</Button>
            <Button onClick={undo} disabled={historyIndex <= 0}>Undo</Button>
            <Button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</Button>
            <Button onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
          {/* Display text statistics */}
          <div className="mb-4">
            <p>Words: {wordCount} | Characters: {charCount}</p>
            <p>Sentences: {sentenceCount} | Paragraphs: {paragraphCount}</p>
          </div>
          {/* Preview of input text */}
          {showPreview && (
            <div className="border p-4 mb-4 whitespace-pre-wrap">{inputText}</div>
          )}
          {/* Output Textarea for converted text */}
          <Textarea
            value={outputText}
            readOnly
            className="w-full h-40 mb-4"
          />
          {/* Tooltip for copy button */}
          <TooltipProvider>
            <Tooltip open={copied}>
              <TooltipTrigger asChild>
                <Button onClick={copyToClipboard}>Copy Result</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text copied!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <TextCaseConverter />;
}