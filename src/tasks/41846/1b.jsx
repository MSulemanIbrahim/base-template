import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const WORK_COLOR = "bg-red-500";
const BREAK_COLOR = "bg-green-500";
const LONG_BREAK_COLOR = "bg-blue-500";

const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;
const DEFAULT_LONG_BREAK_TIME = 15 * 60;
const POMODOROS_BEFORE_LONG_BREAK = 4;

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

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function App() {
  const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_TIME);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorking, setIsWorking] = useState(true);
  const [completedPomodoros, setCompletedPomodoros] = useState(3);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [message, setMessage] = useState("");

  const isLongBreak = completedPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0 && !isWorking;

  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsWorking(true);
    setTimeLeft(workTime);
    setMessage("");
  }, [workTime]);

  const resetSessionTracker = useCallback(() => {
    setCompletedPomodoros(0);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (isWorking) {
        setCompletedPomodoros((prev) => prev + 1);
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        toggleTimer();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer]);

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
            <div className={`text-6xl font-bold text-center p-8 rounded-lg ${
              isWorking ? WORK_COLOR : isLongBreak ? LONG_BREAK_COLOR : BREAK_COLOR
            } text-white`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center space-x-2">
              <Button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</Button>
              <Button onClick={resetTimer}>Reset</Button>
            </div>
            <div className="text-center text-sm text-gray-600">{message}</div>
            <div className="flex items-center justify-between">
              <span>Alerts</span>
              <Switch
                checked={alertsEnabled}
                onCheckedChange={setAlertsEnabled}
              />
            </div>
            <div>
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
                  onChange={(e) => setWorkTime(e.target.value * 60)}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Break Time (minutes)</label>
                <Input
                  type="number"
                  value={breakTime / 60}
                  onChange={(e) => setBreakTime(e.target.value * 60)}
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
                onChange={(e) => setLongBreakTime(e.target.value * 60)}
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