import React, { useState, useEffect, useCallback } from 'react';
import { Progress, Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Alert } from "@/components/ui/card";

const WaterTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [goal, setGoal] = useState(2000); // Default goal in ml
  const [reminderInterval, setReminderInterval] = useState(2); // in hours
  const [unit, setUnit] = useState('ml');
  const [history, setHistory] = useState(() => {
    const now = new Date();
    return Array(7).fill().map((_, i) => ({
      date: new Date(now.setDate(now.getDate() - 6 + i)).toDateString(),
      amount: 0
    }));
  });

  const addWater = (amount) => {
    setWaterIntake(prev => {
      const newIntake = prev + amount;
      updateHistory(newIntake);
      return newIntake;
    });
  };

  const updateHistory = (newIntake) => {
    const today = new Date().toDateString();
    setHistory(prev => 
      prev.map(day => day.date === today ? { ...day, amount: newIntake } : day)
    );
  };

  const resetDay = () => {
    setWaterIntake(0);
    updateHistory(0);
  };

  useEffect(() => {
    const resetAtMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // next day
        0, 0, 0
      );
      const msToMidnight = night.getTime() - now.getTime();
      setTimeout(() => {
        resetDay();
        setInterval(resetDay, 24 * 60 * 60 * 1000); // Reset every 24 hours
      }, msToMidnight);
    };
    resetAtMidnight();

    const reminder = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('Time for some water!');
      }
    }, reminderInterval * 60 * 60 * 1000);

    return () => {
      clearInterval(reminder);
    };
  }, [reminderInterval]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const progressPercentage = (waterIntake / goal) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Daily Water Tracker</CardTitle>
          <CardDescription>Stay hydrated!</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="text-center mb-4">
            <p>{waterIntake} {unit} / {goal} {unit}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[250, 500].map(amount => (
              <Button key={amount} onClick={() => addWater(amount)}>{amount} {unit}</Button>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <Input 
              type="number" 
              value={customAmount} 
              onChange={(e) => setCustomAmount(e.target.value)} 
              placeholder="Custom ml"
            />
            <Button onClick={() => {
              if (customAmount) addWater(parseInt(customAmount, 10));
              setCustomAmount('');
            }}>Add</Button>
          </div>
          <Button variant="outline" onClick={resetDay}>Reset Day</Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Input 
            type="number" 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)} 
            placeholder="Set Goal (ml)"
          />
          <Button onClick={() => setUnit(unit === 'ml' ? 'oz' : 'ml')}>
            {unit === 'ml' ? 'Switch to oz' : 'Switch to ml'}
          </Button>
        </CardFooter>
      </Card>
      <Card className="max-w-lg mx-auto mt-4">
        <CardHeader>
          <CardTitle>Hydration History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.map(day => (
            <div key={day.date} className="mb-2">
              <p>{day.date}: {day.amount} {unit}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <WaterTracker />;
}