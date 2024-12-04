import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const INTERVAL = 1000; // in milliseconds

const defaultSettings = {
  workTime: 25,
  breakTime: 5,
  longBreakTime: 15,
  sessionsBeforeLongBreak: 4,
};

function Timer({ initialMinutes, onEnd, type }) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current);
            onEnd(type);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, INTERVAL);
    } else if (!isActive && seconds !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds, onEnd, type]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    clearInterval(intervalRef.current);
    setSeconds(initialMinutes * 60);
    setIsActive(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">{type === 'work' ? 'Work' : 'Break'} Time</h2>
      <div className="text-5xl mb-4">{formatTime(seconds)}</div>
      <div className="flex space-x-2">
        <Button onClick={toggle}>{isActive ? 'Pause' : 'Start'}</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [currentSession, setCurrentSession] = useState(0);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [alertOn, setAlertOn] = useState(true);
  const [message, setMessage] = useState('');

  const handleTimerEnd = (type) => {
    if (alertOn) {
      alert(`${type === 'work' ? 'Work' : 'Break'} session ended!`);
    }
    if (type === 'work') {
      setCurrentSession(currentSession + 1);
      if ((currentSession + 1) % settings.sessionsBeforeLongBreak === 0) {
        setIsWorkTime(false);
        setMessage("Take a long break, you've earned it!");
      } else {
        setIsWorkTime(false);
        setMessage("Time for a quick break!");
      }
    } else {
      setIsWorkTime(true);
      setMessage("Back to work! You can do this!");
    }
  };

  const resetDay = () => {
    setCurrentSession(0);
    setIsWorkTime(true);
    setMessage('');
  };

  const TimerComponent = () => (
    <Timer 
      initialMinutes={isWorkTime ? settings.workTime : (currentSession % settings.sessionsBeforeLongBreak === 0 ? settings.longBreakTime : settings.breakTime)}
      onEnd={handleTimerEnd}
      type={isWorkTime ? 'work' : 'break'}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Focus Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimerComponent />
          <Progress value={(currentSession * 100) / settings.sessionsBeforeLongBreak} className="h-4"/>
          <p className="text-center text-sm">Completed {currentSession} session(s)</p>
          <p className="text-center text-lg font-semibold">{message}</p>
          <div className="flex justify-between">
            <Button onClick={() => setAlertOn(!alertOn)} variant={alertOn ? "default" : "outline"}>
              Alerts {alertOn ? 'On' : 'Off'}
            </Button>
            <Button onClick={resetDay}>Reset Day</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}