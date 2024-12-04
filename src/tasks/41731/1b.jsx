import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#121212] flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-sm px-4">
        <SwitchMode />
        <Tabs defaultValue="stopwatch" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
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
      </div>
    </div>
  );
}

function SwitchMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="mb-4 flex justify-end">
      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
    </div>
  );
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTime(prevTime => prevTime + 10), 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleLap = () => {
    if (running) {
      setLaps([...laps, time]);
    }
  };

  const reset = () => {
    setTime(0);
    setLaps([]);
  };

  const formatTime = (ms) => {
    const pad = (n, z = 2) => ('00' + n).slice(-z);
    const hours = pad(Math.floor((ms/3.6e6) % 60));
    const minutes = pad(Math.floor((ms/60000) % 60));
    const seconds = pad(Math.floor((ms/1000) % 60));
    const milliseconds = pad(ms % 1000, 3);
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-4xl font-bold">{formatTime(time)}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center space-x-2">
        <Button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</Button>
        <Button onClick={handleLap} disabled={!running}>Lap</Button>
        <Button onClick={reset}>Reset</Button>
      </CardContent>
      <CardContent>
        {laps.map((lap, index) => (
          <div key={index} className="text-sm text-muted-foreground mb-1 flex justify-between">
            <span>Lap {laps.length - index}</span>
            <span>{formatTime(lap)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Timer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [running, setRunning] = useState(false);
  const [alert, setAlert] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && !alert) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          let { hours, minutes, seconds } = prev;
          if (hours === 0 && minutes === 0 && seconds === 0) {
            setAlert(true);
            setRunning(false);
            return { hours, minutes, seconds };
          }
          if (seconds > 0) seconds--;
          else {
            if (minutes > 0) {
              minutes--;
              seconds = 59;
            } else if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            }
          }
          return { hours, minutes, seconds };
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, alert]);

  const startTimer = () => {
    if (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) {
      setRunning(true);
      setAlert(false);
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setAlert(false);
    setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
  };

  const handleChange = (e, type) => {
    const value = Math.max(0, Math.min(Number(e.target.value), type === 'hours' ? 23 : 59));
    setTimeLeft(prev => ({ ...prev, [type]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-4xl font-bold">
          {alert ? 'Time Up!' : 
          `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center space-x-2">
        {!running && !alert && ['hours', 'minutes', 'seconds'].map(type => (
          <Input 
            key={type} 
            type="number" 
            min="0" 
            value={timeLeft[type]} 
            onChange={(e) => handleChange(e, type)} 
            className="w-20 text-center"
            placeholder={`00`}
          />
        ))}
        <Button onClick={startTimer} disabled={running || alert}>Start</Button>
        <Button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Resume'}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </CardContent>
    </Card>
  );
}

export default App;