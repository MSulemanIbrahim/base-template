import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Component to input new ingredients
const IngredientInput = ({ onAdd, editMode, ingredientToEdit, onEditSave }) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [name, setName] = useState("");

  // Update form values when entering edit mode
  useEffect(() => {
    if (editMode && ingredientToEdit) {
      setQuantity(ingredientToEdit.quantity);
      setUnit(ingredientToEdit.unit);
      setName(ingredientToEdit.name);
    } else {
      setQuantity("");
      setUnit("");
      setName("");
    }
  }, [editMode, ingredientToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity && unit && name) {
      if (editMode) {
        // Save the edited ingredient
        onEditSave({ quantity: parseFloat(quantity), unit, name });
      } else {
        // Add a new ingredient
        onAdd({ quantity: parseFloat(quantity), unit, name });
      }
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
        min="0"
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
      <Button type="submit">
        {editMode ? "Save Changes" : "Add Ingredient"}
      </Button>
    </form>
  );
};

// Component to display the list of ingredients
const IngredientList = ({ ingredients, onEdit, onDelete }) => (
  <ul className="space-y-2">
    {ingredients.map((ingredient, index) => (
      <li key={index} className="flex justify-between items-center">
        <span>
          {ingredient.quantity} {ingredient.unit} {ingredient.name}
        </span>
        <div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(index)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(index)}
            >
              Delete
            </Button>
          )}
        </div>
      </li>
    ))}
  </ul>
);

// Component to adjust servings
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
  const [ingredients, setIngredients] = useState([]); // List of ingredients
  const [originalServings, setOriginalServings] = useState(1); // Original servings count
  const [desiredServings, setDesiredServings] = useState(1); // Desired servings count
  const [history, setHistory] = useState([]); // History for undo functionality
  const [editingIndex, setEditingIndex] = useState(null); // Index of the ingredient being edited

  // Update history whenever ingredients change
  useEffect(() => {
    setHistory((prev) => [...prev, ingredients]);
  }, [ingredients]);

  // Handle adding a new ingredient
  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  // Handle editing an ingredient
  const handleEditIngredient = (index) => {
    setEditingIndex(index); // Set the index of the ingredient to edit
  };

  // Save changes to an edited ingredient
  const handleEditSave = (updatedIngredient) => {
    const updatedIngredients = ingredients.map((ingredient, index) =>
      index === editingIndex ? updatedIngredient : ingredient
    );
    setIngredients(updatedIngredients);
    setEditingIndex(null); // Exit edit mode
  };

  // Handle deleting an ingredient
  const handleDeleteIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // Handle changing servings
  const handleServingsChange = (type, value) => {
    if (type === "original") {
      setOriginalServings(parseInt(value) || 1);
    } else {
      setDesiredServings(parseInt(value) || 1);
    }
  };

  // Scale ingredients based on servings
  const scaleIngredients = () => {
    const scaleFactor = desiredServings / originalServings;
    return ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: (ingredient.quantity * scaleFactor).toFixed(2), // Scale and format the quantity
    }));
  };

  // Handle clearing all ingredients
  const handleClear = () => {
    setIngredients([]);
  };

  // Undo last change
  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current state
      setIngredients(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  // Export scaled ingredients as a text file
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

  // Copy scaled ingredients to clipboard
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
          {/* Ingredient Input or Edit Form */}
          <IngredientInput
            onAdd={handleAddIngredient}
            editMode={editingIndex !== null}
            ingredientToEdit={
              editingIndex !== null ? ingredients[editingIndex] : null
            }
            onEditSave={handleEditSave}
          />
          {/* List of Ingredients */}
          <IngredientList
            ingredients={ingredients}
            onEdit={handleEditIngredient}
            onDelete={handleDeleteIngredient}
          />
          {/* Servings Adjuster */}
          <ServingsAdjuster
            originalServings={originalServings}
            desiredServings={desiredServings}
            onChange={handleServingsChange}
          />
          {/* Scaled Ingredients */}
          <div className="space-y-2">
            <h3 className="font-bold">Scaled Ingredients:</h3>
            <IngredientList ingredients={scaleIngredients()} />
          </div>
          {/* Action Buttons */}
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