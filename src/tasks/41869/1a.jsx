import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Tooltip } from "@/components/ui";
import { Toaster, toast } from "@/components/ui/toaster";

function App() {
  const [text, setText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const textAreaRef = useRef(null);

  const convertCase = (type) => {
    let result;
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentence':
        result = text.replace(/(^\s*\w|[\.\?!]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'reverse':
        result = text.split('').reverse().join('');
        break;
      default:
        result = text;
    }
    setConvertedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedText).then(() => {
      toast({
        title: "Copied!",
        description: "Text has been copied to clipboard.",
      });
    });
  };

  const handleClear = () => {
    setText('');
    setConvertedText('');
  };

  const handleRemoveExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };

  const countWords = (str) => str.trim().split(/\s+/).length;
  const countParagraphs = (str) => str.split(/\n\n/).length;

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Text Case Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 p-2 border rounded-md resize-none"
            placeholder="Enter your text here..."
          />
          <div className="mt-2 text-sm">
            <p>Words: {countWords(text)} | Characters: {text.length}</p>
            <p>Sentences: {(text.match(/\w[.!?]+/g) || []).length} | Paragraphs: {countParagraphs(text)}</p>
          </div>
          <div className="space-x-2 mt-4">
            {['upper', 'lower', 'title', 'sentence', 'reverse'].map((caseType) => (
              <Button key={caseType} onClick={() => convertCase(caseType)}>{caseType.charAt(0).toUpperCase() + caseType.slice(1)}</Button>
            ))}
            <Button onClick={handleRemoveExtraSpaces}>Remove Extra Spaces</Button>
            <Button onClick={handleClear}>Clear Text</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Converted Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Tooltip content="Copy to clipboard">
              <Button onClick={handleCopy}>Copy Result</Button>
            </Tooltip>
          </div>
          <textarea
            value={convertedText}
            readOnly
            className="w-full h-40 p-2 border rounded-md resize-none"
          />
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
}

export default App;