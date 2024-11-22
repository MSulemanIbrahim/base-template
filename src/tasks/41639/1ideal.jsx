// Importing required React hooks and UI components
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Component to visually indicate password strength
const PasswordStrengthIndicator = ({ strength }) => {
  // Function to determine color based on strength level
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
      {/* Display password strength text */}
      <div className="text-sm font-medium mb-1">Password Strength: {strength}</div>
      {/* Display a colored bar indicating strength */}
      <div className={`h-2 w-full rounded-full ${getColor()}`}></div>
    </div>
  );
};

// Main component for the password generator application
export default function App() {
  // State variables for password settings and generated password
  const [length, setLength] = useState(12); // Password length
  const [includeUppercase, setIncludeUppercase] = useState(true); // Whether to include uppercase letters
  const [includeNumbers, setIncludeNumbers] = useState(true); // Whether to include numbers
  const [includeSymbols, setIncludeSymbols] = useState(true); // Whether to include symbols
  const [password, setPassword] = useState(""); // Generated password
  const [strength, setStrength] = useState(""); // Password strength level
  const [copied, setCopied] = useState(false); // Whether the password is copied to clipboard

  // Function to generate a random password based on selected options
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lowercase; // Initialize with lowercase characters
    let result = "";

    // Append additional character sets based on selected options
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    // Generate password of the specified length
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure at least one character from each selected category
    if (includeUppercase) result = ensureCharType(result, uppercase);
    if (includeNumbers) result = ensureCharType(result, numbers);
    if (includeSymbols) result = ensureCharType(result, symbols);

    setPassword(result); // Update the password state
  };

  // Function to replace a random character in the password with a character from a specified set
  const ensureCharType = (str, charSet) => {
    const randomIndex = Math.floor(Math.random() * str.length);
    const randomChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
    return str.substring(0, randomIndex) + randomChar + str.substring(randomIndex + 1);
  };

  // Function to calculate password strength based on selected options
  const calculateStrength = () => {
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    // Determine strength level based on score
    if (score < 3) return "Weak";
    if (score < 5) return "Medium";
    return "Strong";
  };

  // Generate a new password when settings change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  // Update password strength whenever the password changes
  useEffect(() => {
    setStrength(calculateStrength());
  }, [password]);

  // Function to copy the password to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true); // Show "Copied!" message
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  // Function to reset all password settings to their default values
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
            {/* Slider for selecting password length */}
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
            {/* Checkboxes for additional password options */}
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
            {(!includeUppercase && !includeNumbers && !includeSymbols) && (
              <span className="text-red-600">Please select at least one option (Uppercase, Numbers, or Symbols).</span>
            )}
            {/* Input field to display the generated password */}
            <Input
              value={password}
              readOnly
              className="font-mono text-lg"
            />
            {/* Component to display password strength */}
            <PasswordStrengthIndicator strength={strength} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {/* Buttons for generating a new password or copying the current one */}
          <div className="flex space-x-2 w-full">
            <Button onClick={generatePassword} className="flex-1">Generate</Button>
            <Button onClick={copyToClipboard} className="flex-1">
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
          {/* Button to reset all options */}
          <Button onClick={resetOptions} variant="outline" className="w-full">
            Reset Options
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
