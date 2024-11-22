import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

function IngredientInput({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [substitution, setSubstitution] = useState("");

  const handleAdd = () => {
    if (name && quantity && unit) {
      onAdd({ name, quantity, unit, substitution });
      setName("");
      setQuantity("");
      setUnit("");
      setSubstitution("");
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Ingredient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Ingredient name"
      />
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          aria-label="Quantity"
        />
        <Input
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          aria-label="Unit"
        />
      </div>
      <Input
        placeholder="Substitution (optional)"
        value={substitution}
        onChange={(e) => setSubstitution(e.target.value)}
        aria-label="Substitution"
      />
      <Button onClick={handleAdd}>Add Ingredient</Button>
    </div>
  );
}

function StepInput({ onAdd }) {
  const [instruction, setInstruction] = useState("");
  const [timer, setTimer] = useState("");

  const handleAdd = () => {
    if (instruction) {
      onAdd({ instruction, timer: timer ? parseInt(timer) : null });
      setInstruction("");
      setTimer("");
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Cooking instruction"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        aria-label="Cooking instruction"
      />
      <Input
        type="number"
        placeholder="Timer in minutes (optional)"
        value={timer}
        onChange={(e) => setTimer(e.target.value)}
        aria-label="Timer"
      />
      <Button onClick={handleAdd}>Add Step</Button>
    </div>
  );
}

function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</Button>
      <span>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</span>
    </div>
  );
}

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [shoppingMode, setShoppingMode] = useState(false);

  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, { ...ingredient, purchased: false }]);
  };

  const addStep = (step) => {
    setSteps([...steps, step]);
  };

  const togglePurchased = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].purchased = !updatedIngredients[index].purchased;
    setIngredients(updatedIngredients);
  };

  const handleTimerComplete = (index) => {
    alert(`Timer for step ${index + 1} is complete!`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Recipe Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="shopping-mode"
              checked={shoppingMode}
              onCheckedChange={setShoppingMode}
            />
            <Label htmlFor="shopping-mode">Shopping Mode</Label>
          </div>

          {!shoppingMode && (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                <IngredientInput onAdd={addIngredient} />
                <ul className="mt-4 space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                      {ingredient.substitution && (
                        <Accordion type="single" collapsible>
                          <AccordionItem value={`substitution-${index}`}>
                            <AccordionTrigger>Substitution</AccordionTrigger>
                            <AccordionContent>{ingredient.substitution}</AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">Steps</h2>
                <StepInput onAdd={addStep} />
                <ol className="mt-4 space-y-4">
                  {steps.map((step, index) => (
                    <li key={index} className="flex flex-col space-y-2">
                      <span>{step.instruction}</span>
                      {step.timer && (
                        <Timer
                          duration={step.timer}
                          onComplete={() => handleTimerComplete(index)}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          {shoppingMode && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Shopping List</h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ingredient-${index}`}
                      checked={ingredient.purchased}
                      onCheckedChange={() => togglePurchased(index)}
                    />
                    <Label htmlFor={`ingredient-${index}`} className={ingredient.purchased ? "line-through" : ""}>
                      {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                    </Label>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Toggle between Recipe Editing and Shopping Mode using the switch at the top.</li>
            <li>In Recipe Editing mode:
              <ul className="list-disc list-inside ml-4">
                <li>Add ingredients with quantities, units, and optional substitutions.</li>
                <li>Add cooking steps with instructions and optional timers.</li>
                <li>Use the timer feature for steps that require precise timing.</li>
              </ul>
            </li>
            <li>In Shopping Mode:
              <ul className="list-disc list-inside ml-4">
                <li>View your ingredients as a shopping list.</li>
                <li>Check off items as you purchase them.</li>
              </ul>
            </li>
            <li>The app updates dynamically as you add or modify ingredients and steps.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}