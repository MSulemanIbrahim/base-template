import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const currencies = [
  { symbol: "$", name: "USD" },
  { symbol: "€", name: "EUR" },
  { symbol: "£", name: "GBP" },
];

function CurrencySelector({ currency, setCurrency }) {
  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.name} value={c.symbol}>
            {c.symbol} {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function InputField({ label, value, onChange, type = "number", min = "0" }) {
  return (
    <div className="mb-4">
      <Label htmlFor={label}>{label}</Label>
      <Input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        step="0.01"
      />
    </div>
  );
}

export default function App() {
  const [billAmount, setBillAmount] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [tipPercentage, setTipPercentage] = useState("");
  const [currency, setCurrency] = useState("$");
  const [roundUp, setRoundUp] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    calculateSplit();
  }, [billAmount, numPeople, tipPercentage, currency, roundUp]);

  const calculateSplit = () => {
    if (!billAmount || !numPeople) {
      setResult(null);
      return;
    }

    const bill = parseFloat(billAmount);
    const people = parseInt(numPeople);
    const tipPercent = parseFloat(tipPercentage) || 0;

    const tipAmount = (bill * tipPercent) / 100;
    const totalBill = bill + tipAmount;
    let perPerson = totalBill / people;

    if (roundUp) {
      perPerson = Math.ceil(perPerson);
    } else {
      perPerson = Math.floor(perPerson * 100) / 100;
    }

    setResult({
      totalBill,
      tipAmount,
      perPerson,
    });
  };

  const resetForm = () => {
    setBillAmount("");
    setNumPeople("");
    setTipPercentage("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quick Currency Splitter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <InputField
            label="Bill Amount"
            value={billAmount}
            onChange={setBillAmount}
          />
          <InputField
            label="Number of People"
            value={numPeople}
            onChange={setNumPeople}
            min="1"
          />
          <InputField
            label="Tip Percentage"
            value={tipPercentage}
            onChange={setTipPercentage}
          />
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="round-up"
              checked={roundUp}
              onCheckedChange={setRoundUp}
            />
            <Label htmlFor="round-up">Round Up</Label>
          </div>
          <Button onClick={resetForm} className="w-full mb-4">
            Reset
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-gray-200 rounded-md">
              <h3 className="font-bold mb-2">Summary:</h3>
              <p>
                Total Bill: {currency}
                {result.totalBill.toFixed(2)}
              </p>
              <p>
                Tip: {currency}
                {result.tipAmount.toFixed(2)}
              </p>
              <p>
                Each Pays: {currency}
                {result.perPerson.toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}