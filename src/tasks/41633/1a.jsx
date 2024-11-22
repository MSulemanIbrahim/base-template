import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const activityLevels = [
  { value: "sedentary", label: "Sedentary", factor: 1 },
  { value: "moderate", label: "Moderate", factor: 1.1 },
  { value: "active", label: "Active", factor: 1.2 },
];

const weatherConditions = [
  { value: "cold", label: "Cold", factor: 1 },
  { value: "mild", label: "Mild", factor: 1 },
  { value: "hot", label: "Hot", factor: 1.1 },
];

const WaterIntakeCalculator = ({ onCalculate }) => {
  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [activity, setActivity] = useState("sedentary");
  const [weather, setWeather] = useState("mild");

  const handleCalculate = () => {
    const weightInKg = weightUnit === "lbs" ? weight * 0.45359237 : weight;
    const baseIntake = weightInKg * 35;
    const activityFactor = activityLevels.find((a) => a.value === activity).factor;
    const weatherFactor = weatherConditions.find((w) => w.value === weather).factor;
    const totalIntake = Math.round(baseIntake * activityFactor * weatherFactor);
    onCalculate(totalIntake);
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle>Calculate Daily Water Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-24"
          />
          <Select value={weightUnit} onValueChange={setWeightUnit}>
            <SelectTrigger className="w-24">
              <SelectValue>{weightUnit}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger>
            <SelectValue>
              {activityLevels.find((a) => a.value === activity)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {activityLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={weather} onValueChange={setWeather}>
          <SelectTrigger>
            <SelectValue>
              {weatherConditions.find((w) => w.value === weather)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {weatherConditions.map((condition) => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCalculate}>Calculate</Button>
      </CardContent>
    </Card>
  );
};

const WaterIntakeTracker = ({ dailyGoal }) => {
  const [intake, setIntake] = useState(0);
  const progress = Math.min((intake / dailyGoal) * 100, 100);

  const addWater = (amount) => {
    setIntake((prev) => Math.min(prev + amount, dailyGoal));
  };

  const resetIntake = () => {
    setIntake(0);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Water Intake Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-center">
          {intake} / {dailyGoal} ml ({Math.round(progress)}%)
        </p>
        <div className="flex justify-center space-x-2">
          <Button onClick={() => addWater(250)}>+250 ml</Button>
          <Button onClick={() => addWater(500)}>+500 ml</Button>
        </div>
        <Button onClick={resetIntake} variant="outline" className="w-full">
          Reset
        </Button>
        {progress >= 100 && (
          <p className="text-green-500 text-center font-bold">
            Great job! You've reached your daily water intake goal!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const MotivationalMessage = () => {
  const messages = [
    "Stay hydrated, stay healthy!",
    "Water is the driving force of all nature.",
    "Drink water and feel better!",
    "Keep it up! You're staying hydrated!",
    "Your body will thank you for drinking water!",
  ];

  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="text-center text-lg font-semibold text-blue-600 my-4">
      {message}
    </div>
  );
};

export default function App() {
  const [dailyGoal, setDailyGoal] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Water Intake Tracker</h1>
      <WaterIntakeCalculator onCalculate={setDailyGoal} />
      {dailyGoal > 0 && (
        <>
          <MotivationalMessage />
          <WaterIntakeTracker dailyGoal={dailyGoal} />
        </>
      )}
    </div>
  );
}