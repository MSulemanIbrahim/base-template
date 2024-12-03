import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem } from "@/components/ui/select";

function App() {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [tipPercentage, setTipPercentage] = useState(0);
  const [isRounded, setIsRounded] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const currencies = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const calculateShare = () => {
    const bill = parseFloat(totalBill) || 0;
    const people = parseInt(numPeople, 10) || 1;
    const tip = bill * (tipPercentage / 100);
    const total = bill + tip;
    let share = total / people;
    
    if (isRounded) {
      share = Math.ceil(share);
    }

    return {
      total: total.toFixed(2),
      tip: tip.toFixed(2),
      share: share.toFixed(2),
    };
  };

  const resetForm = () => {
    setTotalBill('');
    setNumPeople('');
    setTipPercentage(0);
    setIsRounded(false);
  };

  const { total, tip, share } = calculateShare();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Quick Currency Splitter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="totalBill">Total Bill</Label>
            <Input 
              id="totalBill" 
              type="number" 
              value={totalBill} 
              onChange={(e) => setTotalBill(e.target.value)} 
              placeholder="Enter total bill" 
            />
          </div>
          <div>
            <Label htmlFor="numPeople">Number of People</Label>
            <Input 
              id="numPeople" 
              type="number" 
              value={numPeople} 
              onChange={(e) => setNumPeople(e.target.value)} 
              placeholder="How many people?" 
            />
          </div>
          <div>
            <Label htmlFor="tipPercentage">Tip Percentage</Label>
            <Input 
              id="tipPercentage" 
              type="number" 
              value={tipPercentage} 
              onChange={(e) => setTipPercentage(e.target.value)} 
              placeholder="Tip % (e.g., 10)" 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Round Up?</Label>
            <Switch checked={isRounded} onCheckedChange={setIsRounded} />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <select value={currency} onValueChange={setCurrency}>
              {Object.keys(currencies).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Bill: {currencies[currency]}{total}</p>
            <p className="text-sm text-gray-600">Tip: {currencies[currency]}{tip}</p>
            <p className="font-bold">Each Pays: {currencies[currency]}{share}</p>
          </div>
          <Button onClick={resetForm} variant="destructive">Reset</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;