import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PasswordStrengthIndicator = ({ strength }) => {
  const getColor = () => {
    switch (strength) {
      case "Weak":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="mt-4">
      <div className="text-sm font-medium mb-1">Password Strength: {strength}</div>
      <div className={`h-2 w-full rounded-full ${getColor()}`}></div>
    </div>
  );
};

export default function App() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lowercase;
    let result = "";

    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure at least one character from each selected category
    if (includeUppercase) result = ensureCharType(result, uppercase);
    if (includeNumbers) result = ensureCharType(result, numbers);
    if (includeSymbols) result = ensureCharType(result, symbols);

    setPassword(result);
  };

  const ensureCharType = (str, charSet) => {
    const randomIndex = Math.floor(Math.random() * str.length);
    const randomChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
    return str.substring(0, randomIndex) + randomChar + str.substring(randomIndex + 1);
  };

  const calculateStrength = () => {
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score < 3) return "Weak";
    if (score < 5) return "Medium";
    return "Strong";
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    setStrength(calculateStrength());
  }, [password]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetOptions = () => {
    setLength(12);
    setIncludeUppercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Random Password Generator</CardTitle>
          <CardDescription>Generate a secure random password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="length">Password Length: {length}</Label>
              <Slider
                id="length"
                min={6}
                max={32}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                className="mt-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
                <Label htmlFor="uppercase">Include Uppercase Letters</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
                <Label htmlFor="numbers">Include Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
                <Label htmlFor="symbols">Include Symbols</Label>
              </div>
            </div>
            <Input
              value={password}
              readOnly
              className="font-mono text-lg"
            />
            <PasswordStrengthIndicator strength={strength} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex space-x-2 w-full">
            <Button onClick={generatePassword} className="flex-1">Generate</Button>
            <Button onClick={copyToClipboard} className="flex-1">
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
          <Button onClick={resetOptions} variant="outline" className="w-full">
            Reset Options
          </Button>
        </CardFooter>
      </Card>
      {(!includeUppercase && !includeNumbers && !includeSymbols) && (
        <Alert className="mt-4 max-w-md">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Please select at least one option (Uppercase, Numbers, or Symbols).
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}