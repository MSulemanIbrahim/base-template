import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// Define constants for timer colors and defaults
const WORK_COLOR = "bg-red-500";
const BREAK_COLOR = "bg-green-500";
const LONG_BREAK_COLOR = "bg-blue-500";

const DEFAULT_WORK_TIME = 25 * 60; // Default work duration in seconds
const DEFAULT_BREAK_TIME = 5 * 60; // Default break duration in seconds
const DEFAULT_LONG_BREAK_TIME = 15 * 60; // Default long break duration in seconds
const POMODOROS_BEFORE_LONG_BREAK = 4; // Pomodoros before a long break

// Messages for different states
const motivationalMessages = [
  "Stay focused, you're doing great!",
  "Keep pushing, success is near!",
  "You're making progress with every second!",
];

const relaxingMessages = [
  "Take a deep breath and relax.",
  "Stretch your muscles and unwind.",
  "Enjoy your well-deserved break!",
];

// Utility function to format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function App() {
  // State variables for the timer and settings
  const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_TIME);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorking, setIsWorking] = useState(true);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [message, setMessage] = useState("");

  // Determine if it's time for a long break
  const isLongBreak = completedPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0 && !isWorking;

  // Toggle the timer on/off
  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  // Reset the timer to initial values
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsWorking(true);
    setTimeLeft(workTime);
    setMessage("");
  }, [workTime]);

  // Reset the completed Pomodoro counter
  const resetSessionTracker = useCallback(() => {
    setCompletedPomodoros(0);
  }, []);

  // Effect to handle the countdown logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (isWorking) {
        setCompletedPomodoros((prev) => prev + 1); // Increment Pomodoro count
      }
      const nextIsWorking = !isWorking;
      setIsWorking(nextIsWorking);
      setTimeLeft(
        nextIsWorking
          ? workTime
          : isLongBreak
          ? longBreakTime
          : breakTime
      );
      if (alertsEnabled) {
        alert(isWorking ? "Break time!" : "Back to work!");
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWorking, workTime, breakTime, longBreakTime, alertsEnabled, isLongBreak]);

  // Effect to handle keypress for starting/pausing the timer
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        toggleTimer();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer]);

  // Effect to update motivational/relaxing messages when the state changes
  useEffect(() => {
    const messages = isWorking ? motivationalMessages : relaxingMessages;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
  }, [isWorking]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Focus Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Display the timer with dynamic background color */}
            <div
              className={`text-6xl font-bold text-center p-8 rounded-lg ${
                isWorking ? WORK_COLOR : isLongBreak ? LONG_BREAK_COLOR : BREAK_COLOR
              } text-white`}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center space-x-2">
              {/* Buttons for controlling the timer */}
              <Button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</Button>
              <Button onClick={resetTimer}>Reset</Button>
            </div>
            {/* Display the motivational or relaxing message */}
            <div className="text-center text-sm text-gray-600">{message}</div>
            <div className="flex items-center justify-between">
              <span>Alerts</span>
              {/* Switch to enable/disable alerts */}
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
            <div>
              {/* Progress bar for completed Pomodoros */}
              <p className="font-semibold mb-2">Completed Pomodoros: {completedPomodoros}</p>
              <Progress value={(completedPomodoros % POMODOROS_BEFORE_LONG_BREAK) * 25} />
            </div>
            <Button onClick={resetSessionTracker} variant="outline" className="w-full">
              Reset Session Tracker
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Time (minutes)</label>
                <Input
                  type="number"
                  value={workTime / 60}
                  onChange={(e) => setWorkTime(Math.max(1, e.target.value) * 60)}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Break Time (minutes)</label>
                <Input
                  type="number"
                  value={breakTime / 60}
                  onChange={(e) => setBreakTime(Math.max(1, e.target.value) * 60)}
                  min="1"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Long Break Time (minutes)</label>
              <Input
                type="number"
                value={longBreakTime / 60}
                onChange={(e) => setLongBreakTime(Math.max(1, e.target.value) * 60)}
                min="1"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
