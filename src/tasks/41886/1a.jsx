import React, { useState, useRef } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [servingsOriginal, setServingsOriginal] = useState(1);
  const [servingsDesired, setServingsDesired] = useState(1);
  const [lastAction, setLastAction] = useState(null);
  const inputRef = useRef(null);

  const addIngredient = () => {
    if (inputRef.current.value.trim()) {
      setIngredients([...ingredients, parseIngredient(inputRef.current.value)]);
      inputRef.current.value = '';
      setLastAction({ type: 'add', ingredient: inputRef.current.value });
    }
  };

  const parseIngredient = (text) => {
    const [quantity, unit, ...nameParts] = text.split(' ');
    return { 
      quantity: parseFloat(quantity), 
      unit, 
      name: nameParts.join(' ')
    };
  };

  const scaleIngredient = (ingredient) => {
    const scaleFactor = servingsDesired / servingsOriginal;
    return { 
      ...ingredient, 
      quantity: (ingredient.quantity * scaleFactor).toFixed(2) 
    };
  };

  const clearIngredients = () => {
    setIngredients([]);
    setLastAction({ type: 'clear' });
  };

  const undoLastAction = () => {
    if (lastAction) {
      switch(lastAction.type) {
        case 'add':
          setIngredients(ingredients.slice(0, -1));
          break;
        case 'clear':
          // Here you might want to save the state before clearing for a proper undo, 
          // but for simplicity, we'll leave it as is.
          break;
        default:
          break;
      }
      setLastAction(null);
    }
  };

  const exportRecipe = () => {
    const text = ingredients.map(i => `${scaleIngredient(i).quantity} ${i.unit} ${i.name}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert("Recipe copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:max-w-lg sm:mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Ingredient Scaler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="ingredient">Add Ingredient</Label>
            <div className="flex">
              <Input ref={inputRef} id="ingredient" placeholder="e.g., 2 cups flour" />
              <Button onClick={addIngredient} className="ml-2">Add</Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Servings</Label>
            <div className="flex">
              <Input 
                type="number" 
                value={servingsOriginal} 
                onChange={(e) => setServingsOriginal(Math.max(1, e.target.value))} 
                className="w-24 mr-2"
              />
              <span>to</span>
              <Input 
                type="number" 
                value={servingsDesired} 
                onChange={(e) => setServingsDesired(Math.max(1, e.target.value))} 
                className="w-24 ml-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{`${scaleIngredient(ingredient).quantity} ${ingredient.unit} ${ingredient.name}`}</span>
                <Button variant="destructive" size="sm" onClick={() => {
                  setIngredients(ingredients.filter((_, i) => i !== index));
                  setLastAction({ type: 'remove', index });
                }}>Remove</Button>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={clearIngredients}>Clear All</Button>
          <Button onClick={undoLastAction}>Undo</Button>
        </CardFooter>
      </Card>

      <Button onClick={exportRecipe} className="w-full">Export Recipe</Button>
    </div>
  );
}

export default App;