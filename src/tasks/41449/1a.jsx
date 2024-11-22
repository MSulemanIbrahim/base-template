import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const conversionTypes = ["Length", "Weight", "Temperature", "Currency"];

const units = {
  Length: ["Meters", "Kilometers", "Feet", "Miles"],
  Weight: ["Grams", "Kilograms", "Pounds", "Ounces"],
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  Currency: ["USD", "EUR", "GBP", "INR"],
};

const conversionFactors = {
  Length: {
    Meters: 1,
    Kilometers: 0.001,
    Feet: 3.28084,
    Miles: 0.000621371,
  },
  Weight: {
    Grams: 1,
    Kilograms: 0.001,
    Pounds: 0.00220462,
    Ounces: 0.035274,
  },
  Currency: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    INR: 74,
  },
};

function convertTemperature(value, from, to) {
  if (from === to) return value;
  if (from === "Celsius") {
    if (to === "Fahrenheit") return (value * 9) / 5 + 32;
    if (to === "Kelvin") return value + 273.15;
  }
  if (from === "Fahrenheit") {
    if (to === "Celsius") return ((value - 32) * 5) / 9;
    if (to === "Kelvin") return ((value - 32) * 5) / 9 + 273.15;
  }
  if (from === "Kelvin") {
    if (to === "Celsius") return value - 273.15;
    if (to === "Fahrenheit") return ((value - 273.15) * 9) / 5 + 32;
  }
}

function convert(value, type, from, to) {
  if (type === "Temperature") {
    return convertTemperature(value, from, to);
  }
  return (value / conversionFactors[type][from]) * conversionFactors[type][to];
}

export default function App() {
  const [conversionType, setConversionType] = useState(conversionTypes[0]);
  const [fromUnit, setFromUnit] = useState(units[conversionType][0]);
  const [toUnit, setToUnit] = useState(units[conversionType][1]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = () => {
    setError(null);
    if (isNaN(inputValue) || inputValue === "") {
      setError("Please enter a valid number");
      setResult(null);
      return;
    }
    const convertedValue = convert(parseFloat(inputValue), conversionType, fromUnit, toUnit);
    setResult(convertedValue.toFixed(4));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Unit Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={conversionType} onValueChange={(value) => {
            setConversionType(value);
            setFromUnit(units[value][0]);
            setToUnit(units[value][1]);
            setResult(null);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select conversion type" />
            </SelectTrigger>
            <SelectContent>
              {conversionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {units[conversionType].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {units[conversionType].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="text"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button onClick={handleConvert} className="w-full">
            Convert
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && (
            <div className="text-center">
              <p className="text-lg font-semibold">
                {inputValue} {fromUnit} =
              </p>
              <p className="text-2xl font-bold text-green-600">
                {result} {toUnit}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}