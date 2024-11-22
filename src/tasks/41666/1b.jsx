import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function App() {
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState('');
  const [hoursRequired, setHoursRequired] = useState('');

  const addSkill = () => {
    if (title && hoursRequired > 0) {
      setSkills([...skills, {
        title,
        required: parseFloat(hoursRequired),
        completed: 0,
        id: Date.now(),
        isTimerRunning: false,
        timer: 0,
      }]);
      setTitle('');
      setHoursRequired('');
    }
  };

  const updateSkill = (id, update) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, ...update } : skill
    ));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4">
        <Input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Skill Title" 
          className="mb-2"
        />
        <Input 
          value={hoursRequired} 
          onChange={e => setHoursRequired(e.target.value)} 
          placeholder="Hours Required" 
          type="number" 
          min="0.1" 
          step="0.1"
        />
        <Button onClick={addSkill} className="mt-2 w-full sm:w-auto">Add Skill</Button>
      </div>
      {skills.map(skill => <SkillCard key={skill.id} skill={skill} updateSkill={updateSkill} />)}
    </div>
  );
}

function SkillCard({ skill, updateSkill }) {
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [seconds, setSeconds] = useState(skill.timer);
  const remaining = Math.max(0, skill.required - skill.completed);

  useEffect(() => {
    let interval = null;
    if (skill.isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds < 1) {
            updateSkill(skill.id, { isTimerRunning: false });
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    } else if (!skill.isTimerRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [skill.isTimerRunning, seconds, skill.id, updateSkill]);

  const startTimer = () => {
    if (!skill.isTimerRunning) {
      updateSkill(skill.id, { isTimerRunning: true });
    }
  };

  const stopTimer = () => {
    updateSkill(skill.id, { 
      isTimerRunning: false, 
      completed: skill.completed + (seconds / 3600), 
      timer: 0 
    });
    setSeconds(0);
  };

  const addManualTime = () => {
    const hours = parseFloat(manualHours) || 0;
    const minutes = parseFloat(manualMinutes) || 0;
    const totalMinutes = hours * 60 + minutes;
    const addedHours = totalMinutes / 60;
    if (addedHours > remaining) {
      alert("Cannot add more hours than remaining!");
      return;
    }
    updateSkill(skill.id, { completed: skill.completed + addedHours });
    setManualHours('');
    setManualMinutes('');
  };

  const progress = skill.required ? ((skill.completed / skill.required) * 100) : 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{skill.title}</CardTitle>
        <CardDescription>
          {skill.completed >= skill.required ? 
            <Badge variant="success">Completed</Badge> :
            `Remaining: ${remaining.toFixed(1)} hours`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-2" />
        <div>Completed: {skill.completed.toFixed(1)} / {skill.required} hours</div>
        {!skill.isTimerRunning && skill.completed < skill.required && (
          <>
            <Input 
              type="number" 
              placeholder="Hours" 
              value={manualHours} 
              onChange={e => setManualHours(e.target.value)} 
              className="mt-2 mr-2 w-full sm:w-auto"
            />
            <Input 
              type="number" 
              placeholder="Minutes" 
              value={manualMinutes} 
              onChange={e => setManualMinutes(e.target.value)} 
              className="mt-2 w-full sm:w-auto"
            />
            <Button onClick={addManualTime} className="mt-2 w-full sm:w-auto">Add Time</Button>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!skill.isTimerRunning && skill.completed < skill.required && (
          <Button onClick={startTimer}>Start Timer</Button>
        )}
        {skill.isTimerRunning && (
          <Button onClick={stopTimer}>Stop Timer</Button>
        )}
        {skill.isTimerRunning && (
          <div className="mt-2 text-sm">
            {Math.floor(seconds / 3600)}:{Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:{(seconds % 60).toString().padStart(2, '0')}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default App;