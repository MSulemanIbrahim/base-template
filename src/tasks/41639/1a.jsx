import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "@/components/ui/toaster";
import { useClipboard } from "@/components/ui/use-clipboard";

function PasswordStrengthIndicator({ password }) {
  const getStrength = () => {
    if (password.length < 8) return 'Weak';
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'Medium';
    return 'Strong';
  };

  const strength = getStrength();

  return (
    <div className="text-sm font-medium">
      Password Strength: <span className={`text-${strength === 'Weak' ? 'red-500' : strength === 'Medium' ? 'yellow-500' : 'green-500'}`}>{strength}</span>
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const { copy } = useClipboard();

  const generatePassword = useCallback(() => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!useUppercase && !useNumbers && !useSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
      });
      return;
    }

    let newPassword = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n));
    }

    // Ensure at least one character from each selected category
    if (useUppercase) newPassword = newPassword.replace(/.$/, c => c + 'A'.replace(/A/, () => charset.match(/[A-Z]/)[0]));
    if (useNumbers) newPassword = newPassword.replace(/.$/, c => c + '0'.replace(/0/, () => charset.match(/[0-9]/)[0]));
    if (useSymbols) newPassword = newPassword.replace(/.$/, c => c + '!'.replace(/!/, () => charset.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)[0]));

    setPassword(newPassword);
  }, [length, useUppercase, useNumbers, useSymbols]);

  const resetOptions = () => {
    setLength(12);
    setUseUppercase(true);
    setUseNumbers(true);
    setUseSymbols(true);
    setPassword('');
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Password Length: {length}</Label>
            <Slider 
              value={[length]} 
              onValueChange={(value) => setLength(value[0])} 
              min={6} 
              max={32} 
              className="mt-2"
            />
          </div>
          <div className="space-y-2">
            <Checkbox checked={useUppercase} onCheckedChange={setUseUppercase}>Include Uppercase</Checkbox>
            <Checkbox checked={useNumbers} onCheckedChange={setUseNumbers}>Include Numbers</Checkbox>
            <Checkbox checked={useSymbols} onCheckedChange={setUseSymbols}>Include Symbols</Checkbox>
          </div>
          {password && (
            <div className="mt-4">
              <PasswordStrengthIndicator password={password} />
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center break-all">
                {password}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={resetOptions}>Reset Options</Button>
          <Button onClick={generatePassword}>Generate Password</Button>
          {password && <Button onClick={() => copy(password)}>Copy to Clipboard</Button>}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  return <PasswordGenerator />;
}