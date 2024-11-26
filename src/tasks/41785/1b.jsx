import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ArrowRightLeft, RotateCcw } from "lucide-react";

const timeZones = [
  { value: "America/New_York", label: "New York" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Europe/London", label: "London" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
];

function TimeZoneSelector({ value, onChange, label }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time zone" />
        </SelectTrigger>
        <SelectContent>
          {timeZones.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TimeInput({ value, onChange }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
}

function ConvertedTime({ sourceTime, sourceZone, targetZone }) {
  const [convertedTime, setConvertedTime] = useState("");

  useEffect(() => {
    if (sourceTime && sourceZone && targetZone) {
      const date = new Date();
      const [hours, minutes] = sourceTime.split(":");
      date.setHours(hours);
      date.setMinutes(minutes);

      const sourceOffset = new Date().toLocaleString("en-US", { timeZone: sourceZone, timeZoneName: "short" }).split(" ")[2];
      const targetOffset = new Date().toLocaleString("en-US", { timeZone: targetZone, timeZoneName: "short" }).split(" ")[2];

      const sourceOffsetMinutes = parseOffset(sourceOffset);
      const targetOffsetMinutes = parseOffset(targetOffset);
      const diffMinutes = targetOffsetMinutes - sourceOffsetMinutes;

      date.setMinutes(date.getMinutes() + diffMinutes);
      setConvertedTime(date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }
  }, [sourceTime, sourceZone, targetZone]);

  return (
    <div className="flex items-center">
      <Clock className="mr-2" size={20} />
      <span className="text-lg font-semibold">{convertedTime || "--:--"}</span>
    </div>
  );
}

function parseOffset(offset) {
  const [hours, minutes] = offset.replace("GMT", "").split(":");
  return parseInt(hours) * 60 + (minutes ? parseInt(minutes) : 0);
}

function CurrentTime({ timeZone }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeZone]);

  return <div className="text-sm text-gray-600">Current time: {currentTime}</div>;
}

export default function App() {
  const [sourceZone, setSourceZone] = useState("");
  const [targetZone, setTargetZone] = useState("");
  const [sourceTime, setSourceTime] = useState("");

  const handleSwap = () => {
    setSourceZone(targetZone);
    setTargetZone(sourceZone);
  };

  const handleReset = () => {
    setSourceZone("");
    setTargetZone("");
    setSourceTime("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Time Zone Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <TimeZoneSelector
              value={sourceZone}
              onChange={setSourceZone}
              label="Source Time Zone"
            />
            <TimeZoneSelector
              value={targetZone}
              onChange={setTargetZone}
              label="Target Time Zone"
            />
          </div>
          <TimeInput value={sourceTime} onChange={setSourceTime} />
          <div className="flex justify-between items-center">
            <Button onClick={handleSwap} variant="outline" size="sm">
              <ArrowRightLeft className="mr-2" size={16} />
              Swap
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="mr-2" size={16} />
              Reset
            </Button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Converted Time:</h3>
            <ConvertedTime sourceTime={sourceTime} sourceZone={sourceZone} targetZone={targetZone} />
          </div>
          {sourceZone && <CurrentTime timeZone={sourceZone} />}
          {targetZone && <CurrentTime timeZone={targetZone} />}
        </CardContent>
      </Card>
    </div>
  );
}