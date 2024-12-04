import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Timer = ({ isRunning, time, activity, onStart, onPause, onStop, onReset, onActivityChange }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Timer</CardTitle>
    </CardHeader>
    <CardContent>
      <Input
        type="text"
        placeholder="Activity name"
        value={activity}
        onChange={(e) => onActivityChange(e.target.value)}
        className="mb-2"
      />
      <div className="text-4xl font-bold mb-2">{formatTime(time)}</div>
      <div className="flex space-x-2">
        {!isRunning ? (
          <Button onClick={onStart}>Start</Button>
        ) : (
          <Button onClick={onPause}>Pause</Button>
        )}
        <Button onClick={onStop}>Stop</Button>
        <Button onClick={onReset}>Reset</Button>
      </div>
    </CardContent>
  </Card>
);

const ActivityList = ({ activities, onDelete, onEdit, filter, sort }) => {
  const filteredActivities = activities
    .filter((activity) => !filter || activity.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sort === "duration") return b.duration - a.duration;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.startTime - a.startTime;
    });

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{new Date(activity.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(activity.endTime).toLocaleString()}</TableCell>
                <TableCell>{formatTime(activity.duration)}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(index)} className="mr-2">Edit</Button>
                  <Button onClick={() => onDelete(index)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const Summary = ({ activities }) => {
  const totalTime = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const avgDuration = activities.length ? totalTime / activities.length : 0;
  const mostFrequent = activities.length
    ? activities.reduce(
        (acc, activity) => {
          acc[activity.name] = (acc[activity.name] || 0) + 1;
          return acc[activity.name] > acc.max ? { name: activity.name, max: acc[activity.name] } : acc;
        },
        { max: 0 }
      ).name
    : "N/A";

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Summary Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Time: {formatTime(totalTime)}</p>
        <p>Average Duration: {formatTime(Math.round(avgDuration))}</p>
        <p>Most Frequent Activity: {mostFrequent}</p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("time");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    if (time > 0) {
      setActivities([
        ...activities,
        {
          name: activity || "Unnamed Activity",
          startTime: Date.now() - time * 1000,
          endTime: Date.now(),
          duration: time,
        },
      ]);
      handleReset();
    }
  };
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setActivity("");
  };

  const handleDelete = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const newName = prompt("Enter new activity name:", activities[index].name);
    if (newName) {
      setActivities(
        activities.map((activity, i) => (i === index ? { ...activity, name: newName } : activity))
      );
    }
  };

  const handleClearAll = () => {
    setActivities([]);
    handleReset();
  };

  const handleDownload = () => {
    const csv = [
      ["Activity", "Start Time", "End Time", "Duration"],
      ...activities.map((a) => [
        a.name,
        new Date(a.startTime).toLocaleString(),
        new Date(a.endTime).toLocaleString(),
        formatTime(a.duration),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "time_tracker_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white"}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Time Interval Tracker</h1>
          <div className="flex items-center">
            <span className="mr-2">Dark Mode</span>
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          </div>
        </div>

        <Timer
          isRunning={isRunning}
          time={time}
          activity={activity}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          onReset={handleReset}
          onActivityChange={setActivity}
        />

        <Summary activities={activities} />

        <div className="mb-4 flex space-x-2">
          <Input
            type="text"
            placeholder="Filter activities"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow"
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time Logged</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ActivityList
          activities={activities}
          onDelete={handleDelete}
          onEdit={handleEdit}
          filter={filter}
          sort={sort}
        />

        <div className="flex space-x-2">
          <Button onClick={handleClearAll} variant="destructive">Clear All</Button>
          <Button onClick={handleDownload}>Download Report</Button>
        </div>
      </div>
    </div>
  );
}