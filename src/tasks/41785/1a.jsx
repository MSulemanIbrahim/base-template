import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

const timeZones = [
  { label: "New York (EST)", value: "America/New_York" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "London (GMT)", value: "Europe/London" },
  // Add more time zones as needed
];

const TimeZoneConverter = () => {
  const [sourceTime, setSourceTime] = useState(new Date());
  const [sourceZone, setSourceZone] = useState(timeZones[0].value);
  const [targetZone, setTargetZone] = useState(timeZones[1].value);
  const [savedPairs, setSavedPairs] = useState([]);

  const convertTime = () => {
    const sourceDate = new Date(sourceTime);
    const targetDate = new Date(sourceDate.toLocaleString("en-US", { timeZone: targetZone }));
    return targetDate;
  };

  const swapZones = () => {
    setSourceZone(targetZone);
    setTargetZone(sourceZone);
  };

  const reset = () => {
    setSourceTime(new Date());
    setSourceZone(timeZones[0].value);
    setTargetZone(timeZones[1].value);
  };

  const savePair = () => {
    const pair = { source: sourceZone, target: targetZone };
    if (!savedPairs.some(p => p.source === pair.source && p.target === pair.target)) {
      setSavedPairs([...savedPairs, pair]);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSourceTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Time Zone Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select 
              value={sourceZone} 
              onValueChange={setSourceZone}
            >
              {timeZones.map(zone => (
                <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
              ))}
            </Select>
            <Select 
              value={targetZone} 
              onValueChange={setTargetZone}
            >
              {timeZones.map(zone => (
                <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
              ))}
            </Select>
          </div>

          <Input 
            type="time" 
            value={sourceTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} 
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newTime = new Date(sourceTime);
              newTime.setHours(hours, minutes);
              setSourceTime(newTime);
            }} 
          />

          <div className="flex justify-between items-center">
            <Button onClick={swapZones}>Swap Time Zones</Button>
            <Button onClick={reset}>Reset</Button>
            <Button onClick={savePair}>Save Pair</Button>
          </div>

          <div className="flex items-center space-x-4">
            <Clock className="h-4 w-4"/>
            <span>Converted Time: {convertTime().toLocaleTimeString()}</span>
          </div>

          <div>
            <h4 className="font-bold mb-2">Current Times:</h4>
            <p>Source: {new Date().toLocaleTimeString("en-US", { timeZone: sourceZone })}</p>
            <p>Target: {new Date().toLocaleTimeString("en-US", { timeZone: targetZone })}</p>
          </div>

          {savedPairs.length > 0 && (
            <div>
              <h4 className="font-bold mb-2">Saved Pairs:</h4>
              {savedPairs.map((pair, index) => (
                <Button 
                  key={index} 
                  onClick={() => {
                    setSourceZone(pair.source);
                    setTargetZone(pair.target);
                  }} 
                  className="mb-2 mr-2"
                >
                  {timeZones.find(z => z.value === pair.source)?.label} to {timeZones.find(z => z.value === pair.target)?.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <TimeZoneConverter />;
}