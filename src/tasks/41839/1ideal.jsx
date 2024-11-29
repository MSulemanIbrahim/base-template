import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define available categories for grocery items
const categories = ["Dairy", "Vegetables", "Fruits", "Meats", "Grains", "Snacks", "Beverages"];

// Component for individual grocery items
function GroceryItem({ item, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
  const [editedName, setEditedName] = useState(item.name); // State for edited item name
  const [editedCategory, setEditedCategory] = useState(item.category); // State for edited item category

  // Handle saving edited changes
  const handleSave = () => {
    onEdit(item.id, editedName, editedCategory);
    setIsEditing(false); // Exit editing mode
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      {isEditing ? (
        <>
          {/* Editable input for name */}
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="flex-grow"
          />
          {/* Editable dropdown for category */}
          <Select value={editedCategory} onValueChange={setEditedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>Save</Button>
        </>
      ) : (
        <>
          {/* Checkbox to mark item as checked */}
          <Checkbox
            checked={item.checked}
            onCheckedChange={() => onToggle(item.id)}
            id={`item-${item.id}`}
          />
          <label
            htmlFor={`item-${item.id}`}
            className={`flex-grow ${item.checked ? "line-through text-gray-400" : ""}`}
          >
            {item.name}
          </label>
          {/* Buttons for editing and deleting */}
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
            Delete
          </Button>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]); // State for list of items
  const [newItemName, setNewItemName] = useState(""); // State for new item name
  const [newItemCategory, setNewItemCategory] = useState(""); // State for new item category

  // Function to add a new item to the list
  const addItem = () => {
    if (newItemName && newItemCategory) {
      setItems([
        ...items,
        {
          id: Date.now(), // Unique ID for item
          name: newItemName,
          category: newItemCategory,
          checked: false, // Default to unchecked
        },
      ]);
      setNewItemName(""); // Clear input
      setNewItemCategory(""); // Clear category
    }
  };

  // Function to toggle item's checked state
  const toggleItem = (id) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  // Function to edit an item
  const editItem = (id, newName, newCategory) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name: newName, category: newCategory } : item
      )
    );
  };

  // Function to delete an item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Function to clear all checked items
  const clearCheckedItems = () => {
    setItems(items.filter((item) => !item.checked));
  };

  // Function to reset the entire list
  const resetList = () => {
    setItems([]);
  };

  // Group items by category for display
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Grocery List Maker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Input section for new item */}
            <div className="flex space-x-2">
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add new item"
                className="flex-grow"
              />
              <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addItem}>Add</Button>
            </div>

            {/* Accordion for grouped items */}
            <Accordion type="multiple" className="w-full">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger>{category}</AccordionTrigger>
                  <AccordionContent>
                    {categoryItems.map((item) => (
                      <GroceryItem
                        key={item.id}
                        item={item}
                        onToggle={toggleItem}
                        onEdit={editItem}
                        onDelete={deleteItem}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Actions */}
            <div className="flex justify-between">
              <Button onClick={clearCheckedItems}>Clear Checked Items</Button>
              <Button variant="destructive" onClick={resetList}>
                Reset List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
