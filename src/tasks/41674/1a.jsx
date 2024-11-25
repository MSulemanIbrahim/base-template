import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const timeFormatOptions = [
  { value: '12', label: '12-hour' },
  { value: '24', label: '24-hour' }
];

const defaultViewOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

function App() {
  const [view, setView] = useState('daily');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: new Date(), end: new Date(), category: 'work' });
  const [timeFormat, setTimeFormat] = useState('12');
  const [defaultView, setDefaultView] = useState('daily');

  const addEvent = () => {
    if (newEvent.title) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ title: '', description: '', start: new Date(), end: new Date(), category: 'work' });
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const formatTime = (date) => {
    return timeFormat === '12' 
      ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const changeView = (newView) => {
    setView(newView);
    setDefaultView(newView);
  };

  const renderDailyView = () => (
    <div className="grid grid-cols-1 gap-4">
      {[...Array(24)].map((_, i) => {
        const hour = new Date(date);
        hour.setHours(i, 0, 0, 0);
        return (
          <div key={i} className="border-t border-gray-200 pt-2">
            <h3>{formatTime(hour)}</h3>
            {events.filter(e => e.start.getHours() === i).map(event => (
              <div key={event.id} className="bg-blue-100 p-2 mb-2 rounded">
                <p>{event.title}</p>
                <Button onClick={() => deleteEvent(event.id)}>Delete</Button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  const renderWeeklyView = () => {
    // Simplified weekly view
    return <div>Weekly View Placeholder</div>;
  };

  const renderMonthlyView = () => {
    // Simplified monthly view
    return <div>Monthly View Placeholder</div>;
  };

  return (
    <div className="p-4 max-w-lg mx-auto sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={timeFormat} onChange={setTimeFormat}>
            {timeFormatOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
          <Select value={defaultView} onChange={changeView}>
            {defaultViewOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
          <div className="mt-4 space-x-2">
            <Button onClick={() => setDate(new Date())}>Today</Button>
            <Button onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}>Previous</Button>
            <Button onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}>Next</Button>
          </div>
          <div className="mt-4">
            {view === 'daily' && renderDailyView()}
            {view === 'weekly' && renderWeeklyView()}
            {view === 'monthly' && renderMonthlyView()}
          </div>
          <div className="mt-4">
            <Input 
              value={newEvent.title} 
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
              placeholder="Event Title" 
            />
            {/* Add more inputs for description, start, end, etc. */}
            <Button onClick={addEvent}>Add Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;