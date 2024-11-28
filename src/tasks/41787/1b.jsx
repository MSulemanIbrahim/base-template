import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const BMICategory = ({ bmi }) => {
  let category, color;
  if (bmi < 18.5) {
    category = "Underweight";
    color = "bg-blue-500";
  } else if (bmi < 25) {
    category = "Normal weight";
    color = "bg-green-500";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "bg-yellow-500";
  } else {
    category = "Obesity";
    color = "bg-red-500";
  }
  return (
    <div className="mt-4">
      <span className={`px-2 py-1 rounded text-white ${color}`}>{category}</span>
      <Progress value={bmi} max={40} className="mt-2" />
    </div>
  );
};

const HealthTips = ({ category }) => {
  const tips = {
    Underweight: "Focus on nutrient-dense foods and consult a nutritionist for a balanced diet plan.",
    "Normal weight": "Maintain a balanced diet and regular exercise routine to stay healthy.",
    Overweight: "Incorporate more physical activity and focus on portion control in your diet.",
    Obesity: "Consult a healthcare professional for a personalized weight management plan."
  };
  return <p className="mt-2 text-sm text-gray-600">{tips[category] || ""}</p>;
};

export default function App() {
  const [isMetric, setIsMetric] = useState(true);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [savedBMIs, setSavedBMIs] = useState([]);
  const [showMoreTips, setShowMoreTips] = useState(false);

  const calculateBMI = () => {
    if (weight && height) {
      let bmiValue;
      if (isMetric) {
        bmiValue = weight / Math.pow(height / 100, 2);
      } else {
        bmiValue = (weight / Math.pow(height, 2)) * 703;
      }
      setBMI(parseFloat(bmiValue.toFixed(1)));
    } else {
      setBMI(null);
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) > 0)) {
      setWeight(value);
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) > 0)) {
      setHeight(value);
    }
  };

  const handleSave = () => {
    if (bmi) {
      setSavedBMIs([...savedBMIs, { date: new Date().toLocaleDateString(), bmi }]);
    }
  };

  const handleReset = () => {
    setWeight("");
    setHeight("");
    setBMI(null);
    setShowMoreTips(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Calculate your Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="unit-toggle">Unit</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="unit-toggle">{isMetric ? "Metric" : "Imperial"}</Label>
              <Switch id="unit-toggle" checked={!isMetric} onCheckedChange={() => setIsMetric(!isMetric)} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight">Weight ({isMetric ? "kg" : "lbs"})</Label>
              <Input id="weight" type="text" value={weight} onChange={handleWeightChange} placeholder={`Enter weight in ${isMetric ? "kg" : "lbs"}`} />
            </div>
            <div>
              <Label htmlFor="height">Height ({isMetric ? "cm" : "inches"})</Label>
              <Input id="height" type="text" value={height} onChange={handleHeightChange} placeholder={`Enter height in ${isMetric ? "cm" : "inches"}`} />
            </div>
          </div>
          <Button className="w-full mt-4" onClick={calculateBMI}>Calculate BMI</Button>
          {bmi && (
            <div className="mt-4">
              <p className="text-lg font-semibold">Your BMI: {bmi}</p>
              <BMICategory bmi={bmi} />
              <HealthTips category={bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obesity"} />
              <Button className="mt-2" variant="outline" onClick={() => setShowMoreTips(!showMoreTips)}>
                {showMoreTips ? "Hide" : "Show"} More Tips
              </Button>
              {showMoreTips && (
                <p className="mt-2 text-sm text-gray-600">
                  Remember, BMI is just one indicator of health. It doesn't account for factors like muscle mass, bone density, or overall body composition. For a comprehensive health assessment, consult with a healthcare professional.
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex space-x-2 w-full">
            <Button className="flex-1" onClick={handleSave}>Save Result</Button>
            <Button className="flex-1" variant="outline" onClick={handleReset}>Reset</Button>
          </div>
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="saved-bmis">
              <AccordionTrigger>Saved BMI Results</AccordionTrigger>
              <AccordionContent>
                {savedBMIs.length > 0 ? (
                  <ul className="space-y-2">
                    {savedBMIs.map((saved, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{saved.date}</span>
                        <span className="font-semibold">{saved.bmi}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No saved results yet.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </div>
  );
}