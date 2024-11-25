import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function CalendarHeader({ date, setDate, view, setView }) {
  const handlePrev = () => {
    const newDate = new Date(date);
    if (view === "daily") newDate.setDate(date.getDate() - 1);
    else if (view === "weekly") newDate.setDate(date.getDate() - 7);
    else newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "daily") newDate.setDate(date.getDate() + 1);
    else if (view === "weekly") newDate.setDate(date.getDate() + 7);
    else newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Button onClick={handlePrev}>Prev</Button>
      <h2 className="text-2xl font-bold">
        {MONTHS[date.getMonth()]} {date.getFullYear()}
      </h2>
      <Button onClick={handleNext}>Next</Button>
      <Select value={view} onChange={(e) => setView(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </Select>
      <Button onClick={() => setDate(new Date())}>Today</Button>
    </div>
  );
}

function DailyView({ date, events, onEventClick, onTimeClick }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 gap-1">
      {hours.map((hour) => (
        <div key={hour} className="flex items-center border-b py-2">
          <span className="w-16 text-right pr-2">{hour}:00</span>
          <div className="flex-grow relative h-12" onClick={() => onTimeClick(new Date(date.setHours(hour)))}>
            {events
              .filter((event) => new Date(event.start).getHours() === hour)
              .map((event) => (
                <div
                  key={event.id}
                  className="absolute top-0 left-0 right-0 bg-blue-200 p-1 rounded"
                  style={{ height: `${(new Date(event.end) - new Date(event.start)) / (60 * 1000)}px` }}
                  onClick={() => onEventClick(event)}
                >
                  {event.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeeklyView({ date, events, onEventClick, onTimeClick }) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  return (
    <div className="grid grid-cols-8 gap-1">
      <div></div>
      {DAYS.map((day) => (
        <div key={day} className="text-center font-bold">
          {day}
        </div>
      ))}
      {Array.from({ length: 24 }, (_, hour) => (
        <React.Fragment key={hour}>
          <div className="text-right pr-2">{hour}:00</div>
          {DAYS.map((_, dayIndex) => {
            const cellDate = new Date(startOfWeek);
            cellDate.setDate(startOfWeek.getDate() + dayIndex);
            cellDate.setHours(hour);
            return (
              <div
                key={dayIndex}
                className="border relative h-8"
                onClick={() => onTimeClick(cellDate)}
              >
                {events
                  .filter(
                    (event) =>
                      new Date(event.start).getDate() === cellDate.getDate() &&
                      new Date(event.start).getHours() === hour
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="absolute top-0 left-0 right-0 bg-blue-200 p-1 text-xs overflow-hidden"
                      style={{
                        height: `${(new Date(event.end) - new Date(event.start)) / (60 * 1000)}px`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function MonthlyView({ date, events, onEventClick, onDateClick }) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  let currentDate = new Date(startDate);

  while (currentDate <= lastDayOfMonth || days.length % 7 !== 0) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {DAYS.map((day) => (
        <div key={day} className="text-center font-bold">
          {day}
        </div>
      ))}
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className={`border p-1 ${
            day.getMonth() !== date.getMonth() ? "bg-gray-100" : ""
          }`}
          onClick={() => onDateClick(day)}
        >
          <div className="text-right">{day.getDate()}</div>
          {events
            .filter(
              (event) =>
                new Date(event.start).toDateString() === day.toDateString()
            )
            .map((event) => (
              <div
                key={event.id}
                className="bg-blue-200 p-1 mt-1 text-xs rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {event.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

function EventDialog({ event, isOpen, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [start, setStart] = useState(event?.start || "");
  const [end, setEnd] = useState(event?.end || "");
  const [location, setLocation] = useState(event?.location || "");
  const [color, setColor] = useState(event?.color || "#3B82F6");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setStart(event.start || "");
      setEnd(event.end || "");
      setLocation(event.location || "");
      setColor(event.color || "#3B82F6");
    }
  }, [event]);

  const handleSave = () => {
    onSave({ id: event?.id, title, description, start, end, location, color });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <Input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
          {event && <Button onClick={() => onDelete(event.id)}>Delete</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleTimeClick = (clickedDate) => {
    setSelectedEvent({
      start: clickedDate.toISOString(),
      end: new Date(clickedDate.getTime() + 60 * 60 * 1000).toISOString(),
    });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = (event) => {
    if (event.id) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, { ...event, id: Date.now() }]);
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <CalendarHeader date={date} setDate={setDate} view={view} setView={setView} />
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {view === "daily" && (
            <DailyView
              date={date}
              events={events}
              onEventClick={handleEventClick}
              onTimeClick={handleTimeClick}
            />
          )}
          {view === "weekly" && (
            <WeeklyView
              date={date}
              events={events}
              onEventClick={handleEventClick}
              onTimeClick={handleTimeClick}
            />
          )}
          {view === "monthly" && (
            <MonthlyView
              date={date}
              events={events}
              onEventClick={handleEventClick}
              onDateClick={handleTimeClick}
            />
          )}
        </CardContent>
      </Card>
      <EventDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}