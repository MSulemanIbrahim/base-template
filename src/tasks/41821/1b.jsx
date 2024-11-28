import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Check, Droplet } from "lucide-react";

const PREDEFINED_AMOUNTS = [250, 500, 750];
const DEFAULT_GOAL = 2000;
const DEFAULT_REMINDER_INTERVAL = 2;

function WaterLog({ amount, onLog }) {
  return (
    <Button
      onClick={() => onLog(amount)}
      className="flex items-center space-x-2"
    >
      <Droplet size={16} />
      <span>{amount}ml</span>
    </Button>
  );
}

function CustomWaterLog({ onLog }) {
  const [customAmount, setCustomAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customAmount) {
      onLog(parseInt(customAmount));
      setCustomAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="number"
        value={customAmount}
        onChange={(e) => setCustomAmount(e.target.value)}
        placeholder="Custom amount (ml)"
        className="w-40"
      />
      <Button type="submit">Add</Button>
    </form>
  );
}

function ProgressBar({ current, goal }) {
  const percentage = Math.min((current / goal) * 100, 100);
  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-4" />
      <p className="text-sm text-gray-600">
        {current}ml / {goal}ml ({percentage.toFixed(1)}%)
      </p>
    </div>
  );
}

function ReminderSettings({ interval, setInterval, enabled, setEnabled }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="reminder-switch"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <Label htmlFor="reminder-switch">Enable reminders</Label>
      </div>
      {enabled && (
        <div className="space-y-2">
          <Label>Reminder interval (hours)</Label>
          <Slider
            value={[interval]}
            onValueChange={(value) => setInterval(value[0])}
            min={1}
            max={6}
            step={0.5}
          />
          <p className="text-sm text-gray-600">
            Reminder every {interval} hours
          </p>
        </div>
      )}
    </div>
  );
}

function History({ data }) {
  const maxIntake = Math.max(...data);
  return (
    <div className="flex items-end space-x-2 h-40">
      {data.map((intake, index) => (
        <div
          key={index}
          className="bg-blue-500 w-8"
          style={{ height: `${(intake / maxIntake) * 100}%` }}
        >
          <span className="text-xs text-white">{intake}ml</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [reminderInterval, setReminderInterval] = useState(
    DEFAULT_REMINDER_INTERVAL
  );
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [history, setHistory] = useState(Array(7).fill(0));
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetDay();
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remindersEnabled) {
      const timer = setInterval(() => {
        alert("Time to drink water!");
      }, reminderInterval * 3600000);

      return () => clearInterval(timer);
    }
  }, [reminderInterval, remindersEnabled]);

  const logWater = (amount) => {
    setWaterIntake((prev) => {
      const newIntake = prev + amount;
      if (
        (prev < goal / 2 && newIntake >= goal / 2) ||
        (prev < goal && newIntake >= goal)
      ) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      return newIntake;
    });
  };

  const resetDay = () => {
    setHistory((prev) => [waterIntake, ...prev.slice(0, 6)]);
    setWaterIntake(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Daily Water Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Log Water Intake</h3>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_AMOUNTS.map((amount) => (
                <WaterLog key={amount} amount={amount} onLog={logWater} />
              ))}
            </div>
            <CustomWaterLog onLog={logWater} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Progress</h3>
            <ProgressBar current={waterIntake} goal={goal} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Daily Goal</h3>
            <Input
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Reminders</h3>
            <ReminderSettings
              interval={reminderInterval}
              setInterval={setReminderInterval}
              enabled={remindersEnabled}
              setEnabled={setRemindersEnabled}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">History</h3>
            <History data={history} />
          </div>

          <Button onClick={resetDay} className="w-full">
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