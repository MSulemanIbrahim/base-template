import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function App() {
  const [recipe, setRecipe] = useState({ steps: [], ingredients: [] });
  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const timerRef = useRef(null);

  const handleAddIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '', alternatives: [] }]
    }));
  };

  const handleAddStep = () => {
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, { instruction: '', time: 0 }]
    }));
  };

  const handleTimer = (index) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let timeLeft = recipe.steps[index].time * 60;
    timerRef.current = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        setRecipe(prev => {
          const newSteps = [...prev.steps];
          newSteps[index] = { ...newSteps[index], timeLeft };
          return { ...prev, steps: newSteps };
        });
      } else {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  const toggleShoppingMode = () => {
    setIsShoppingMode(!isShoppingMode);
  };

  return (
    <div className="p-4 space-y-4 sm:max-w-lg sm:mx-auto">
      <h1 className="text-2xl font-bold">Interactive Recipe Builder</h1>
      <Button onClick={toggleShoppingMode}>
        {isShoppingMode ? "Edit Recipe" : "Shopping Mode"}
      </Button>

      {!isShoppingMode ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <Input 
                    label="Ingredient Name"
                    value={ingredient.name} 
                    onChange={e => {
                      const newIngredients = [...recipe.ingredients];
                      newIngredients[idx].name = e.target.value;
                      setRecipe({...recipe, ingredients: newIngredients});
                    }}
                  />
                  <Input 
                    label="Quantity"
                    type="number" 
                    value={ingredient.quantity} 
                    onChange={e => {
                      const newIngredients = [...recipe.ingredients];
                      newIngredients[idx].quantity = e.target.value;
                      setRecipe({...recipe, ingredients: newIngredients});
                    }}
                  />
                  <Input 
                    label="Unit"
                    value={ingredient.unit} 
                    onChange={e => {
                      const newIngredients = [...recipe.ingredients];
                      newIngredients[idx].unit = e.target.value;
                      setRecipe({...recipe, ingredients: newIngredients});
                    }}
                  />
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${idx}`}>
                      <AccordionTrigger>Substitutions</AccordionTrigger>
                      <AccordionContent>
                        {/* Here you would handle adding substitutions */}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
              <Button onClick={handleAddIngredient}>Add Ingredient</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <Input 
                    label="Instruction"
                    value={step.instruction} 
                    onChange={e => {
                      const newSteps = [...recipe.steps];
                      newSteps[idx].instruction = e.target.value;
                      setRecipe({...recipe, steps: newSteps});
                    }}
                  />
                  <Input 
                    label="Time (minutes)"
                    type="number" 
                    value={step.time} 
                    onChange={e => {
                      const newSteps = [...recipe.steps];
                      newSteps[idx].time = e.target.value;
                      setRecipe({...recipe, steps: newSteps});
                    }}
                  />
                  <Button onClick={() => handleTimer(idx)}>
                    {step.timeLeft ? `Pause ${step.timeLeft}s` : 'Start Timer'}
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddStep}>Add Step</Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Shopping List</CardTitle>
          </CardHeader>
          <CardContent>
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox />
                <label>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;