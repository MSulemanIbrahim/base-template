import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CurrencyInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Input
      type="number"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full"
    />
  </div>
);

const Chart = ({ saved, remaining }) => {
  const total = saved + remaining;
  const savedPercentage = (saved / total) * 100;
  const remainingPercentage = (remaining / total) * 100;

  return (
    <div className="w-full h-20 bg-gray-200 rounded-lg overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-500 ease-in-out"
        style={{ width: `${savedPercentage}%` }}
      >
        <span className="text-white text-xs font-bold p-2">
          {savedPercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [goal, setGoal] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthsToGoal, setMonthsToGoal] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (goal > 0 && monthlyContribution > 0) {
      const remainingAmount = Math.max(0, goal - currentSavings);
      const months = Math.ceil(remainingAmount / monthlyContribution);
      setMonthsToGoal(months);

      const progress = (currentSavings / goal) * 100;
      setProgressPercentage(Math.min(100, Math.max(0, progress)));
    } else {
      setMonthsToGoal(0);
      setProgressPercentage(0);
    }
  }, [goal, monthlyContribution, currentSavings]);

  const handleReset = () => {
    setGoal(0);
    setMonthlyContribution(0);
    setCurrentSavings(0);
    setMonthsToGoal(0);
    setProgressPercentage(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Savings Goal Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyInput
            label="Enter your savings goal in USD"
            value={goal}
            onChange={setGoal}
          />
          <CurrencyInput
            label="Enter your monthly contribution in USD"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
          />
          <CurrencyInput
            label="Current Savings (optional)"
            value={currentSavings}
            onChange={setCurrentSavings}
          />

          {monthsToGoal > 0 && (
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold mb-2">
                It will take you {monthsToGoal} months to reach your savings goal
              </p>
              <Progress
                value={progressPercentage}
                className="w-full h-2 bg-blue-200"
              />
              <p className="mt-2 text-sm text-gray-600">
                {progressPercentage.toFixed(1)}% saved
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Progress Breakdown</h3>
            <Chart
              saved={currentSavings}
              remaining={Math.max(0, goal - currentSavings)}
            />
          </div>

          <Button
            onClick={handleReset}
            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white"
          >
            Reset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}