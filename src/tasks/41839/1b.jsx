import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = ["Dairy", "Vegetables", "Fruits", "Meats", "Grains", "Snacks", "Beverages"];

function GroceryItem({ item, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedCategory, setEditedCategory] = useState(item.category);

  const handleSave = () => {
    onEdit(item.id, editedName, editedCategory);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      {isEditing ? (
        <>
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="flex-grow"
          />
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
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");

  const addItem = () => {
    if (newItemName && newItemCategory) {
      setItems([
        ...items,
        {
          id: Date.now(),
          name: newItemName,
          category: newItemCategory,
          checked: false,
        },
      ]);
      setNewItemName("");
      setNewItemCategory("");
    }
  };

  const toggleItem = (id) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const editItem = (id, newName, newCategory) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, name: newName, category: newCategory } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearCheckedItems = () => {
    setItems(items.filter((item) => !item.checked));
  };

  const resetList = () => {
    setItems([]);
  };

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