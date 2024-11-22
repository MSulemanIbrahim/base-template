import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Reusable CurrencyInput component for handling numeric inputs
const CurrencyInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Input
      type="number"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)} // Parse input to float or default to 0
      className="w-full"
    />
  </div>
);

// Chart component to display a visual breakdown of savings progress
const Chart = ({ saved, remaining }) => {
  const total = saved + remaining;

  // Ensure no division by 0, fallback to 0% if total is 0
  const savedPercentage = total > 0 ? (saved / total) * 100 : 0;
  const remainingPercentage = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="w-full h-20 bg-gray-200 rounded-lg overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-500 ease-in-out"
        style={{ width: `${savedPercentage}%` }}
      >
        {/* Display the saved percentage within the progress bar */}
        <span className="text-white text-xs font-bold p-2">
          {savedPercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

// Main application component
export default function App() {
  const [goal, setGoal] = useState(0); // Total savings goal
  const [monthlyContribution, setMonthlyContribution] = useState(0); // Monthly contribution
  const [currentSavings, setCurrentSavings] = useState(0); // Current saved amount
  const [monthsToGoal, setMonthsToGoal] = useState(0); // Estimated months to reach the goal
  const [progressPercentage, setProgressPercentage] = useState(0); // Savings progress as a percentage

  // Update calculations whenever goal, monthly contribution, or current savings change
  useEffect(() => {
    if (goal > 0 && monthlyContribution > 0) {
      const remainingAmount = Math.max(0, goal - currentSavings); // Remaining amount to reach goal
      const months = Math.ceil(remainingAmount / monthlyContribution); // Calculate months needed
      setMonthsToGoal(months);

      // Calculate progress percentage (ensure no division by 0)
      const progress = goal > 0 ? (currentSavings / goal) * 100 : 0;
      setProgressPercentage(Math.min(100, Math.max(0, progress))); // Clamp percentage between 0 and 100
    } else {
      // Reset calculations if input values are invalid or zero
      setMonthsToGoal(0);
      setProgressPercentage(0);
    }
  }, [goal, monthlyContribution, currentSavings]);

  // Reset all input fields and calculated values
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
          {/* Input for savings goal */}
          <CurrencyInput
            label="Enter your savings goal in USD"
            value={goal}
            onChange={setGoal}
          />
          {/* Input for monthly contribution */}
          <CurrencyInput
            label="Enter your monthly contribution in USD"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
          />
          {/* Input for current savings */}
          <CurrencyInput
            label="Current Savings (optional)"
            value={currentSavings}
            onChange={setCurrentSavings}
          />

          {/* Display estimated months to goal and progress if valid */}
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

          {/* Display the visual breakdown of progress */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Progress Breakdown</h3>
            <Chart
              saved={currentSavings}
              remaining={Math.max(0, goal - currentSavings)}
            />
          </div>

          {/* Reset button to clear all inputs and calculated values */}
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
