import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Input, Label, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  Table, TableHeader, TableRow, TableCell, TableBody, TableHead,
  Switch
} from "@/components/ui";

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activity, setActivity] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <Card className="sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="activity">Activity:</Label>
        <Input id="activity" value={activity} onChange={e => setActivity(e.target.value)} placeholder="Enter activity name" />
        <div className="mt-4 text-center text-4xl">{formatTime(seconds)}</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setIsActive(!isActive)}>{isActive ? 'Pause' : 'Start'}</Button>
        <Button onClick={() => { setSeconds(0); setIsActive(false); }}>Reset</Button>
      </CardFooter>
    </Card>
  );
}

function ActivityLog({ activities, onDelete, onEdit }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Activity</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity, index) => (
          <TableRow key={index}>
            <TableCell>{activity.name}</TableCell>
            <TableCell>{activity.start.toLocaleString()}</TableCell>
            <TableCell>{activity.end ? activity.end.toLocaleString() : 'Ongoing'}</TableCell>
            <TableCell>{formatTime(activity.duration)}</TableCell>
            <TableCell>
              <Button onClick={() => onDelete(index)} size="sm">Delete</Button>
              <Button onClick={() => onEdit(index)} size="sm" className="ml-2">Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Statistics({ activities }) {
  const totalTime = activities.reduce((acc, curr) => acc + curr.duration, 0);
  const avgSession = activities.length ? totalTime / activities.length : 0;
  const frequency = activities.reduce((acc, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + 1;
    return acc;
  }, {});
  const mostFrequent = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Time: {formatTime(totalTime)}</p>
        <p>Average Session: {formatTime(avgSession)}</p>
        <p>Most Frequent: {mostFrequent}</p>
      </CardContent>
    </Card>
  );
}

function App() {
  const [activities, setActivities] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  const startActivity = (name) => {
    setCurrentActivity({ name, start: new Date(), duration: 0 });
  };

  const stopActivity = () => {
    if (currentActivity) {
      const end = new Date();
      const updatedActivity = { ...currentActivity, end, duration: Math.floor((end - currentActivity.start) / 1000) };
      setActivities([...activities, updatedActivity]);
      setCurrentActivity(null);
    }
  };

  const deleteActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const editActivity = (index) => {
    const activityToEdit = activities[index];
    setCurrentActivity({...activityToEdit, end: null});
    deleteActivity(index);
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + activities.map(a => `${a.name},${a.start.toISOString()},${a.end ? a.end.toISOString() : 'Ongoing'},${a.duration}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activity_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <Switch 
          checked={darkMode} 
          onCheckedChange={() => setDarkMode(!darkMode)} 
          className="float-right"
        >
          {darkMode ? 'Dark' : 'Light'}
        </Switch>
        <h1 className="text-3xl font-bold mb-8 text-center">Time Interval Tracker</h1>
        <Timer />
        <div className="mt-4 flex justify-center">
          <Button onClick={currentActivity ? stopActivity : () => startActivity(document.getElementById('activity').value)}>
            {currentActivity ? 'Stop' : 'Start New Activity'}
          </Button>
          <Button onClick={downloadCSV} className="ml-2">Download Report</Button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Statistics activities={activities} />
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLog activities={activities} onDelete={deleteActivity} onEdit={editActivity} />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActivities([])}>Clear All</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;