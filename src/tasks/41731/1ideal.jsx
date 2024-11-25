import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Helper function to format time in HH:MM:SS format
const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const Stopwatch = () => {
  // State to track stopwatch time, running status, and laps
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      // Update time every second when running
      interval = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    }
    return () => clearInterval(interval); // Cleanup interval on unmount or when stopping
  }, [isRunning]);

  const handleStart = () => setIsRunning(true); // Start stopwatch
  const handlePause = () => setIsRunning(false); // Pause stopwatch
  const handleReset = () => {
    // Reset stopwatch and laps
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => {
    // Add current time to laps
    setLaps((prevLaps) => [...prevLaps, { time, total: formatTime(time) }]);
  };

  return (
    <div className="space-y-4">
      <div className="text-6xl font-bold text-center">{formatTime(time)}</div>
      <div className="flex justify-center space-x-2">
        <Button onClick={isRunning ? handlePause : handleStart}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleLap} disabled={!isRunning}>
          Lap
        </Button>
      </div>
      {laps.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Laps</h3>
          {laps.map((lap, index) => (
            <div key={index} className="flex justify-between">
              <span>Lap {index + 1}</span>
              <span>{formatTime(lap.time)}</span>
              <span>{lap.total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Timer = () => {
  // State to track timer time, running status, and input values
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      // Decrease time every second when running and time > 0
      interval = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (isRunning && time === 0) {
      // Trigger alert only if timer was running and reached 0
      setIsRunning(false);
      alert("Timer finished!");
    }
    return () => clearInterval(interval); // Cleanup interval on unmount or when stopping
  }, [isRunning, time]);

  const handleStart = () => {
    // Start timer only if time is greater than 0
    if (time > 0) setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false); // Pause timer
  const handleReset = () => {
    // Reset timer and input values
    setIsRunning(false);
    setTime(0);
    setInputTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const handleInputChange = (e) => {
    // Update input values for hours, minutes, and seconds
    const { name, value } = e.target;
    setInputTime((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSetTimer = () => {
    // Calculate total seconds from input values and set timer time
    const totalSeconds =
      inputTime.hours * 3600 + inputTime.minutes * 60 + inputTime.seconds;
    setTime(totalSeconds);
  };

  return (
    <div className="space-y-4">
      <div className="text-6xl font-bold text-center">{formatTime(time)}</div>
      <div className="flex justify-center space-x-2">
        <Input
          type="number"
          name="hours"
          placeholder="HH"
          value={inputTime.hours}
          onChange={handleInputChange}
          className="w-20"
        />
        <Input
          type="number"
          name="minutes"
          placeholder="MM"
          value={inputTime.minutes}
          onChange={handleInputChange}
          className="w-20"
        />
        <Input
          type="number"
          name="seconds"
          placeholder="SS"
          value={inputTime.seconds}
          onChange={handleInputChange}
          className="w-20"
        />
        <Button onClick={handleSetTimer}>Set</Button>
      </div>
      <div className="flex justify-center space-x-2">
        <Button onClick={isRunning ? handlePause : handleStart}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Add or remove dark mode class to document element based on state
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "dark" : ""}`}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Stopwatch & Timer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
          <Tabs defaultValue="stopwatch" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
              <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
              <Stopwatch />
            </TabsContent>
            <TabsContent value="timer">
              <Timer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
