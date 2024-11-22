import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const SkillCard = ({ skill, onAddHours, onDelete }) => {
  const [timer, setTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartStopTimer = () => {
    if (timer) {
      const hours = timerSeconds / 3600;
      onAddHours(skill.id, hours);
      setTimer(null);
      setTimerSeconds(0);
    } else {
      setTimer(Date.now());
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    const hours = parseFloat(e.target.hours.value);
    const minutes = parseFloat(e.target.minutes.value);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0) {
      alert("Please enter valid positive numbers.");
      return;
    }
    const totalHours = hours + minutes / 60;
    if (totalHours > skill.remainingHours) {
      alert("Cannot add more than remaining hours.");
      return;
    }
    onAddHours(skill.id, totalHours);
    e.target.reset();
  };

  const progress = (skill.completedHours / skill.requiredHours) * 100;

  return (
    <Card className="w-full max-w-sm mx-auto mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {skill.title}
          {progress >= 100 && (
            <Badge className="bg-green-500 text-white">Completed</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} className="w-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div>
            Required: {skill.requiredHours.toFixed(2)}h
          </div>
          <div>
            Completed: {skill.completedHours.toFixed(2)}h
          </div>
          <div>
            Remaining: {skill.remainingHours.toFixed(2)}h
          </div>
        </div>
        {progress < 100 && (
          <>
            <form onSubmit={handleManualAdd} className="mb-4">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  name="hours"
                  placeholder="Hours"
                  step="0.01"
                  min="0"
                  className="w-1/2"
                />
                <Input
                  type="number"
                  name="minutes"
                  placeholder="Minutes"
                  step="1"
                  min="0"
                  max="59"
                  className="w-1/2"
                />
              </div>
              <Button type="submit" className="w-full mt-2">
                Add Time
              </Button>
            </form>
            <div className="flex justify-between items-center">
              <Button onClick={handleStartStopTimer} className="w-full">
                {timer ? "Stop Timer" : "Start Timer"}
              </Button>
              {timer && (
                <div className="ml-2 text-lg font-bold">
                  {formatTime(timerSeconds)}
                </div>
              )}
            </div>
          </>
        )}
        <Button
          onClick={() => onDelete(skill.id)}
          variant="destructive"
          className="w-full mt-4"
        >
          Delete Skill
        </Button>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [skills, setSkills] = useState([]);

  const addSkill = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const requiredHours = parseFloat(e.target.requiredHours.value);
    if (!title || isNaN(requiredHours) || requiredHours <= 0) {
      alert("Please enter a valid title and positive number of hours.");
      return;
    }
    const newSkill = {
      id: Date.now(),
      title,
      requiredHours,
      completedHours: 0,
      remainingHours: requiredHours,
    };
    setSkills((prev) => [...prev, newSkill]);
    e.target.reset();
  };

  const addHours = (id, hours) => {
    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id === id) {
          const newCompletedHours = Math.min(
            skill.completedHours + hours,
            skill.requiredHours
          );
          return {
            ...skill,
            completedHours: newCompletedHours,
            remainingHours: skill.requiredHours - newCompletedHours,
          };
        }
        return skill;
      })
    );
  };

  const deleteSkill = (id) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Target Skills Tracker</h1>
      <form onSubmit={addSkill} className="mb-8">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            name="title"
            placeholder="Skill Title"
            className="flex-grow"
          />
          <Input
            type="number"
            name="requiredHours"
            placeholder="Required Hours"
            step="0.01"
            min="0.01"
            className="w-full sm:w-40"
          />
          <Button type="submit">Add Skill</Button>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onAddHours={addHours}
            onDelete={deleteSkill}
          />
        ))}
      </div>
    </div>
  );
}