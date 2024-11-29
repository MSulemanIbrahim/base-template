import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Check, Droplet } from "lucide-react";

const PREDEFINED_AMOUNTS = [250, 500, 750]; // ml amounts
const DEFAULT_GOAL = 2000; // ml
const DEFAULT_REMINDER_INTERVAL = 2;

const UNIT_CONVERSIONS = {
  metric: { factor: 1, label: "ml", largeUnit: "liters", largeFactor: 1000 },
  imperial: { factor: 0.033814, label: "oz", largeUnit: "gallons", largeFactor: 128 },
};

function WaterLog({ amount, onLog, unit }) {
  const displayAmount = (amount * unit.factor).toFixed(2); // Convert to selected unit
  return (
    <Button
      onClick={() => onLog(amount)}
      className="flex items-center space-x-2"
    >
      <Droplet size={16} />
      <span>
        {displayAmount} {unit.label}
      </span>
    </Button>
  );
}

function CustomWaterLog({ onLog, current, goal, unit }) {
  const [customAmount, setCustomAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const convertedAmount = parseInt(customAmount / unit.factor);
    if (customAmount && current + convertedAmount <= goal) {
      onLog(convertedAmount);
      setCustomAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="number"
        value={customAmount}
        onChange={(e) => setCustomAmount(e.target.value)}
        placeholder={`Custom amount (${unit.label})`}
        className="w-40"
        min="0"
      />
      <Button type="submit">Add</Button>
    </form>
  );
}

function ProgressBar({ current, goal, unit }) {
  const convertedCurrent = (current * unit.factor).toFixed(2);
  const convertedGoal = (goal * unit.factor).toFixed(2);
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-4" />
      <p className="text-sm text-gray-600">
        {convertedCurrent} {unit.label} / {convertedGoal} {unit.label} (
        {percentage.toFixed(1)}%)
      </p>
    </div>
  );
}

export default function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [unit, setUnit] = useState("metric"); // Default unit
  const [reminderInterval, setReminderInterval] = useState(DEFAULT_REMINDER_INTERVAL);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [history, setHistory] = useState(Array(7).fill(0));
  const [showCelebration, setShowCelebration] = useState(false);

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const unitConfig = UNIT_CONVERSIONS[unit];

  const logWater = (amount) => {
    setWaterIntake((prev) => {
      const newIntake = prev + amount;
      if (newIntake <= goal && (prev < goal / 2 && newIntake >= goal / 2)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      return Math.min(newIntake, goal); // Prevent exceeding goal
    });
  };

  const handleGoalChange = (e) => {
    const newGoal = parseInt(e.target.value / unitConfig.factor) || 0;
    setGoal(Math.max(newGoal, 1)); // Prevent invalid or NaN values
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Daily Water Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Log Water Intake</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="unit-toggle">Units</Label>
                <Switch
                  id="unit-toggle"
                  checked={unit === "imperial"}
                  onCheckedChange={handleUnitToggle}
                />
                <span>{unit === "metric" ? "Metric" : "Imperial"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_AMOUNTS.map((amount) => (
                <WaterLog
                  key={amount}
                  amount={amount}
                  onLog={logWater}
                  unit={unitConfig}
                />
              ))}
            </div>
            <CustomWaterLog
              onLog={logWater}
              current={waterIntake}
              goal={goal}
              unit={unitConfig}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Progress</h3>
            <ProgressBar current={waterIntake} goal={goal} unit={unitConfig} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Daily Goal</h3>
            <Input
              type="number"
              value={(goal * unitConfig.factor).toFixed(2)}
              onChange={handleGoalChange}
              placeholder={`Enter goal (${unitConfig.label})`}
              className="w-full"
            />
          </div>

          <Button onClick={() => setWaterIntake(0)} className="w-full">
            Reset Day
          </Button>
        </CardContent>
      </Card>

      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <Check className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p>You've reached a hydration milestone!</p>
          </div>
        </div>
      )}
    </div>
  );
}
