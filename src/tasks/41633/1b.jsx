import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

function App() {
  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [activityLevel, setActivityLevel] = useState(1);
  const [weather, setWeather] = useState('Mild');
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);

  const activityLevels = ['Sedentary', 'Moderate', 'Active'];
  const weatherConditions = ['Cold', 'Mild', 'Hot'];
  const waterIncrements = [250, 500];

  useEffect(() => {
    let base = weightUnit === 'kg' ? weight * 35 : weight * 35 / 0.453592; // Convert lbs to kg
    let adjustment = 1;
    if (activityLevel === 1) adjustment += 0.1;
    if (activityLevel === 2) adjustment += 0.2;
    if (weather === 'Hot') adjustment += 0.1;
    
    setDailyGoal(Math.round(base * adjustment));
  }, [weight, weightUnit, activityLevel, weather]);

  const handleIncrement = (increment) => {
    setWaterIntake(prev => Math.min(prev + increment, dailyGoal));
  };

  const resetTracker = () => {
    setWaterIntake(0);
  };

  const motivationalMessages = [
    "Keep it up! You're staying hydrated!",
    "Great job! Hydration is key!",
    "You're doing fantastic with your water intake!",
  ];

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:max-w-md sm:mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Water Intake Tracker</CardTitle>
          <CardDescription>Stay hydrated for better health!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))} 
              placeholder="Weight"
              className="mb-2"
            />
            <Select value={weightUnit} onValueChange={setWeightUnit}>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </Select>
            <Slider 
              defaultValue={[activityLevel]} 
              min={0} 
              max={2} 
              step={1}
              onValueChange={(value) => setActivityLevel(value[0])}
              className="mb-2"
            />
            <div className="text-sm mb-2">Activity: {activityLevels[activityLevel]}</div>
            <Select value={weather} onValueChange={setWeather}>
              {weatherConditions.map(condition => <SelectItem key={condition} value={condition}>{condition}</SelectItem>)}
            </Select>
            <Progress value={(waterIntake / dailyGoal) * 100} className="mt-4"/>
            <div className="text-center text-sm">Goal: {dailyGoal} ml</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {waterIncrements.map(increment => (
            <Button key={increment} onClick={() => handleIncrement(increment)} variant="outline">
              +{increment} ml
            </Button>
          ))}
          <Button onClick={resetTracker}>Reset</Button>
        </CardFooter>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
      </div>
    </div>
  );
}

export default App;