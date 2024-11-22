import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

// Component to add ingredients dynamically
function IngredientInput({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [substitution, setSubstitution] = useState("");

  const handleAdd = () => {
    // Validate required fields
    if (!name.trim() || !quantity || !unit.trim()) {
      alert("Please fill in all required fields for the ingredient.");
      return;
    }

    // Add ingredient to the list
    onAdd({ name: name.trim(), quantity: parseFloat(quantity), unit: unit.trim(), substitution: substitution.trim() });
    setName("");
    setQuantity("");
    setUnit("");
    setSubstitution("");
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
          min="0"
          step="0.01"
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

// Component to add cooking steps dynamically
function StepInput({ onAdd }) {
  const [instruction, setInstruction] = useState("");
  const [timer, setTimer] = useState("");

  const handleAdd = () => {
    if (!instruction.trim()) {
      alert("Please add a valid cooking instruction.");
      return;
    }

    // Add step with optional timer
    onAdd({ instruction: instruction.trim(), timer: timer ? parseInt(timer, 10) : null });
    setInstruction("");
    setTimer("");
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
        min="0"
        step="1"
      />
      <Button onClick={handleAdd}>Add Step</Button>
    </div>
  );
}

// Component to display and control a timer for cooking steps
function Timer({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      onComplete(); // Notify parent when timer completes
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

// Main application component
export default function App() {
  const [ingredients, setIngredients] = useState([]); // List of ingredients
  const [steps, setSteps] = useState([]); // List of cooking steps
  const [shoppingMode, setShoppingMode] = useState(false); // Mode toggle: Shopping vs Editing

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
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="shopping-mode"
              checked={shoppingMode}
              onCheckedChange={setShoppingMode}
            />
            <Label htmlFor="shopping-mode">Shopping Mode</Label>
          </div>

          {/* Recipe Editing Mode */}
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

          {/* Shopping Mode */}
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
    </div>
  );
}
