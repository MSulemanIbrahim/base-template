import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const conversionTypes = {
  Length: {
    m: "Meters",
    km: "Kilometers",
    ft: "Feet",
    mi: "Miles"
  },
  Weight: {
    g: "Grams",
    kg: "Kilograms",
    lb: "Pounds",
    oz: "Ounces"
  },
  Temperature: {
    C: "Celsius",
    F: "Fahrenheit",
    K: "Kelvin"
  },
  Currency: {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    INR: "Indian Rupee"
  }
};

const currencyRates = {
  USD: { EUR: 0.85, GBP: 0.72, INR: 74 },
  EUR: { USD: 1.18, GBP: 0.85, INR: 87.06 },
  GBP: { USD: 1.39, EUR: 1.18, INR: 102.78 },
  INR: { USD: 0.0135, EUR: 0.0115, GBP: 0.0097 }
};

function convertTemperature(value, from, to) {
  if (from === to) return value;
  if (from === "C") {
    if (to === "F") return (value * 9/5) + 32;
    if (to === "K") return value + 273.15;
  }
  if (from === "F") {
    if (to === "C") return (value - 32) * 5/9;
    if (to === "K") return (value - 32) * 5/9 + 273.15;
  }
  if (from === "K") {
    if (to === "C") return value - 273.15;
    if (to === "F") return (value - 273.15) * 9/5 + 32;
  }
  return value; // Fallback for invalid units
}

function Converter() {
  const [type, setType] = useState("Length");
  const [fromUnit, setFromUnit] = useState(Object.keys(conversionTypes[type])[0]);
  const [toUnit, setToUnit] = useState(Object.keys(conversionTypes[type])[1]);
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFromUnit(Object.keys(conversionTypes[type])[0]);
    setToUnit(Object.keys(conversionTypes[type])[1]);
    setResult('');
    setError('');
  }, [type]);

  const handleConvert = () => {
    setError('');
    if (!value || isNaN(value)) {
      setError('Please enter a valid number.');
      return;
    }

    let convertedValue;
    switch(type) {
      case 'Length':
      case 'Weight':
        const factor = {
          m: 1, km: 1000, ft: 0.3048, mi: 1609.34,
          g: 1, kg: 1000, lb: 453.592, oz: 28.3495
        }[fromUnit] / {
          m: 1, km: 1000, ft: 0.3048, mi: 1609.34,
          g: 1, kg: 1000, lb: 453.592, oz: 28.3495
        }[toUnit];
        convertedValue = value * factor;
        break;
      case 'Temperature':
        convertedValue = convertTemperature(Number(value), fromUnit, toUnit);
        break;
      case 'Currency':
        convertedValue = value * currencyRates[fromUnit][toUnit];
        break;
    }

    setResult(`${convertedValue.toFixed(2)} ${toUnit}`);
  };

  return (
    <Card className="sm:max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="conversionType">Conversion Type</Label>
          <Select id="conversionType" onValueChange={setType}>
            {Object.keys(conversionTypes).map(t => 
              <SelectItem key={t} value={t}>{t}</SelectItem>
            )}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fromUnit">From</Label>
            <Select id="fromUnit" value={fromUnit} onValueChange={setFromUnit}>
              {Object.entries(conversionTypes[type]).map(([key, name]) => 
                <SelectItem key={key} value={key}>{name}</SelectItem>
              )}
            </Select>
          </div>

          <div>
            <Label htmlFor="toUnit">To</Label>
            <Select id="toUnit" value={toUnit} onValueChange={setToUnit}>
              {Object.entries(conversionTypes[type]).map(([key, name]) => 
                <SelectItem key={key} value={key}>{name}</SelectItem>
              )}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="value">Value</Label>
          <Input id="value" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <Button onClick={handleConvert}>Convert</Button>

        {result && 
          <div>
            <Label>Result</Label>
            <p className="text-lg font-semibold">{result}</p>
          </div>
        }
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Converter />
    </div>
  );
}