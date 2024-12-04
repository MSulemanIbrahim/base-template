import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const IngredientInput = ({ onAdd }) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity && unit && name) {
      onAdd({ quantity: parseFloat(quantity), unit, name });
      setQuantity("");
      setUnit("");
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <Input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        required
      />
      <Input
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        placeholder="Unit (e.g., cups, grams)"
        required
      />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ingredient name"
        required
      />
      <Button type="submit">Add Ingredient</Button>
    </form>
  );
};

const IngredientList = ({ ingredients, onEdit, onDelete }) => (
  <ul className="space-y-2">
    {ingredients.map((ingredient, index) => (
      <li key={index} className="flex justify-between items-center">
        <span>
          {ingredient.quantity} {ingredient.unit} {ingredient.name}
        </span>
        <div>
          <Button variant="outline" size="sm" onClick={() => onEdit(index)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
          >
            Delete
          </Button>
        </div>
      </li>
    ))}
  </ul>
);

const ServingsAdjuster = ({ originalServings, desiredServings, onChange }) => (
  <div className="flex space-x-4">
    <div>
      <Label htmlFor="original">Original Servings</Label>
      <Input
        id="original"
        type="number"
        value={originalServings}
        onChange={(e) => onChange("original", e.target.value)}
        min="1"
      />
    </div>
    <div>
      <Label htmlFor="desired">Desired Servings</Label>
      <Input
        id="desired"
        type="number"
        value={desiredServings}
        onChange={(e) => onChange("desired", e.target.value)}
        min="1"
      />
    </div>
  </div>
);

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [originalServings, setOriginalServings] = useState(1);
  const [desiredServings, setDesiredServings] = useState(1);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory((prev) => [...prev, ingredients]);
  }, [ingredients]);

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleEditIngredient = (index) => {
    // Simplified edit: just remove the ingredient
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleServingsChange = (type, value) => {
    if (type === "original") {
      setOriginalServings(parseInt(value) || 1);
    } else {
      setDesiredServings(parseInt(value) || 1);
    }
  };

  const scaleIngredients = () => {
    const scaleFactor = desiredServings / originalServings;
    return ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: (ingredient.quantity * scaleFactor).toFixed(2),
    }));
  };

  const handleClear = () => {
    setIngredients([]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current state
      setIngredients(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  const handleExport = () => {
    const scaledIngredients = scaleIngredients();
    const recipeText = scaledIngredients
      .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
      .join("\n");
    const blob = new Blob([recipeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scaled_recipe.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const scaledIngredients = scaleIngredients();
    const recipeText = scaledIngredients
      .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
      .join("\n");
    navigator.clipboard.writeText(recipeText);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Ingredient Scaler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <IngredientInput onAdd={handleAddIngredient} />
          <IngredientList
            ingredients={ingredients}
            onEdit={handleEditIngredient}
            onDelete={handleDeleteIngredient}
          />
          <ServingsAdjuster
            originalServings={originalServings}
            desiredServings={desiredServings}
            onChange={handleServingsChange}
          />
          <div className="space-y-2">
            <h3 className="font-bold">Scaled Ingredients:</h3>
            <IngredientList ingredients={scaleIngredients()} />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleClear}>Clear All</Button>
            <Button onClick={handleUndo}>Undo</Button>
            <Button onClick={handleExport}>Export</Button>
            <Button onClick={handleCopy}>Copy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}