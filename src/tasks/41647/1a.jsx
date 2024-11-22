import React, { useState, useEffect } from 'react';
import { Input, Button, Progress, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SavingsGoalTracker = () => {
  const [goal, setGoal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthsToGoal, setMonthsToGoal] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const goalAmount = parseFloat(goal) || 0;
    const current = parseFloat(currentSavings) || 0;
    const contribution = parseFloat(monthlyContribution) || 0;
    const remaining = Math.max(goalAmount - current, 0);
    const months = contribution > 0 ? Math.ceil(remaining / contribution) : 0;
    setMonthsToGoal(months);

    // Calculate progress
    const progressPercentage = (current / goalAmount) * 100 || 0;
    setProgress(Math.min(progressPercentage, 100));
  }, [goal, monthlyContribution, currentSavings]);

  const resetAll = () => {
    setGoal('');
    setMonthlyContribution('');
    setCurrentSavings('');
    setMonthsToGoal(null);
    setProgress(0);
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 sm:mt-5">
      <CardHeader>
        <CardTitle>Savings Goal Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          label="Savings Goal (USD)" 
          value={goal} 
          onChange={(e) => setGoal(e.target.value)} 
          type="number" 
          placeholder="Enter your savings goal"
        />
        <Input 
          label="Monthly Contribution (USD)" 
          value={monthlyContribution} 
          onChange={(e) => setMonthlyContribution(e.target.value)} 
          type="number"          placeholder="Enter monthly contribution"
        />
        <Input 
          label="Current Savings (USD)" 
          value={currentSavings} 
          onChange={(e) => setCurrentSavings(e.target.value)} 
          type="number" 
          placeholder="Enter current savings (optional)"
        />
        {monthsToGoal !== null && (
          <div className="text-sm">It will take you {monthsToGoal} months to reach your savings goal.</div>
        )}
        <Progress value={progress} className="h-4 rounded-full"/>
        <div className="mt-2 flex justify-between text-sm">
          <span>{progress.toFixed(2)}% Complete</span>
          <Button onClick={resetAll}>Reset</Button>
        </div>
        {/* Simple Pie Chart Representation */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Saved: {progress.toFixed(2)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-red-600">
                Remaining: {(100 - progress).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300 ease-in-out"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <SavingsGoalTracker />
    </div>
  );
}