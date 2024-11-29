import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TextCaseConverter = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateText = useCallback((newText) => {
    setInputText(newText);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newText]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

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
        result = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case "sentence":
        result = inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
        break;
      case "reverse":
        result = inputText.split("").reverse().join("");
        break;
      case "removeSpaces":
        result = inputText.replace(/\s+/g, " ").trim();
        break;
      default:
        break;
    }
    setOutputText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setInputText(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setInputText(history[historyIndex + 1]);
    }
  };

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = inputText.length;
  const sentenceCount = inputText.split(/[.!?]+\s/).filter(Boolean).length;
  const paragraphCount = inputText.split(/\n+/).filter(Boolean).length;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Text Case Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your text here..."
            value={inputText}
            onChange={(e) => updateText(e.target.value)}
            className="w-full h-40 mb-4"
          />
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
          <div className="mb-4">
            <p>Words: {wordCount} | Characters: {charCount}</p>
            <p>Sentences: {sentenceCount} | Paragraphs: {paragraphCount}</p>
          </div>
          {showPreview && (
            <div className="border p-4 mb-4 whitespace-pre-wrap">{inputText}</div>
          )}
          <Textarea
            value={outputText}
            readOnly
            className="w-full h-40 mb-4"
          />
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