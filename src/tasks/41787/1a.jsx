import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const BMI_CATEGORIES = {
  underweight: { min: 0, max: 18.4, label: "Underweight", color: "blue" },
  normal: { min: 18.5, max: 24.9, label: "Normal weight", color: "green" },
  overweight: { min: 25, max: 29.9, label: "Overweight", color: "orange" },
  obese: { min: 30, max: Infinity, label: "Obesity", color: "red" },
};

function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unitSystem, setUnitSystem] = useState('metric');
  const [bmi, setBMI] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const calculateBMI = () => {
    if (!weight || !height) return null;
    let w = parseFloat(weight);
    let h = parseFloat(height);
    if (unitSystem === 'imperial') {
      h /= 39.37; // inches to meters
      w *= 0.453592; // lbs to kg
    } else {
      h /= 100; // cm to meters
    }
    const calculatedBMI = w / (h * h);
    return calculatedBMI.toFixed(1);
  };

  useEffect(() => {
    const newBMI = calculateBMI();
    setBMI(newBMI);
  }, [weight, height, unitSystem]);

  const saveBMI = () => {
    if (bmi) {
      setBmiHistory(prev => [...prev, { bmi, date: new Date().toLocaleString() }]);
    }
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setBMI(null);
  };

  const getHealthTips = () => {
    if (!bmi) return "Enter your details to get health tips.";
    if (bmi < 18.5) return "Consider gaining weight through a healthy diet.";
    if (bmi < 25) return "Maintain a balanced diet and regular exercise.";
    if (bmi < 30) return "Focus on losing weight with diet and exercise.";
    return "Consult a nutritionist or doctor for a weight management plan.";
  };

  const bmiCategory = Object.values(BMI_CATEGORIES).find(cat => bmi >= cat.min && bmi <= cat.max);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4 w-full max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Calculate your Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="unitSystem">Unit System:</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{unitSystem === 'metric' ? 'Metric' : 'Imperial'}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Choose Unit</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setUnitSystem('metric')}>Metric (kg, cm)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUnitSystem('imperial')}>Imperial (lbs, in)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Input 
              type="number" 
              placeholder={unitSystem === 'metric' ? "Weight in kg" : "Weight in lbs"} 
              value={weight} 
              onChange={e => setWeight(e.target.value)} 
              className="w-full"
            />
            <Input 
              type="number" 
              placeholder={unitSystem === 'metric' ? "Height in cm" : "Height in inches"} 
              value={height} 
              onChange={e => setHeight(e.target.value)} 
              className="w-full"
            />
          </div>
          {bmi && (
            <div className="mt-4 text-center">
              <p className="text-xl">Your BMI: <span className={`font-bold text-${bmiCategory?.color}-500`}>{bmi}</span></p>
              <p className={`text-${bmiCategory?.color}-500`}>{bmiCategory?.label}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={saveBMI}>Save BMI</Button>
          <Button onClick={reset} variant="destructive">Reset</Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-4 w-full">
        <CardHeader>
          <CardTitle onClick={() => setExpanded(!expanded)} className="cursor-pointer">Health Tips & History</CardTitle>
        </CardHeader>
        {expanded && (
          <CardContent>
            <p>{getHealthTips()}</p>
            <Button className="mt-2" onClick={() => alert("Here would be more detailed health tips.")}>More Tips</Button>
            <div className="mt-4">
              <h3 className="font-bold">BMI History</h3>
              {bmiHistory.map((entry, idx) => (
                <div key={idx} className="text-sm mt-1">{entry.date} - BMI: {entry.bmi}</div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="text-sm text-center mt-4">
        <p>BMI is a useful measure but has limitations as it doesn't account for muscle mass, bone density, or body shape.</p>
      </div>
    </div>
  );
}

export default App;