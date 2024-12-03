import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Default categories for packing items
const defaultCategories = [
  "Clothes",
  "Toiletries",
  "Electronics",
  "Documents",
  "Miscellaneous",
];

// Component for adding a new item
function ItemForm({ onAdd, onAddCategory, categories }) {
  const [name, setName] = useState(""); // Tracks item name
  const [category, setCategory] = useState(""); // Tracks selected category
  const [customCategory, setCustomCategory] = useState(""); // Tracks custom category name
  const [quantity, setQuantity] = useState(1); // Tracks item quantity
  const [note, setNote] = useState(""); // Tracks optional note

  // Handle form submission for adding a new item
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = category === "custom" ? customCategory : category;
    if (name && finalCategory) {
      onAdd({ name, category: finalCategory, quantity, note, packed: false }); // Add item
      setName(""); // Reset form fields
      setCategory("");
      setCustomCategory("");
      setQuantity(1);
      setNote("");
    }
  };

  // Handle adding a custom category
  const handleCustomCategory = () => {
    if (customCategory && !categories.includes(customCategory)) {
      onAddCategory(customCategory); // Add the new category to the list
      setCategory(customCategory); // Set selected category to the new custom one
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input for item name */}
      <Input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {/* Dropdown to select category */}
      <Select value={category} onValueChange={setCategory} required>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
          {/* Option to add a custom category */}
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      {/* Input for custom category name */}
      {category === "custom" && (
        <div className="space-y-2">
          <Input
            placeholder="Custom category name"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
          <Button type="button" onClick={handleCustomCategory}>
            Add Custom Category
          </Button>
        </div>
      )}
      {/* Input for item quantity */}
      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min={1}
        required
      />
      {/* Input for optional note */}
      <Input
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit">Add Item</Button>
    </form>
  );
}

// Component to display and manage an individual item
function Item({ item, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode
  const [editedItem, setEditedItem] = useState(item); // Tracks edited item details

  // Save edited item
  const handleEdit = () => {
    onEdit(editedItem);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      {/* Checkbox to mark item as packed */}
      <Checkbox
        checked={item.packed}
        onCheckedChange={() => onToggle(item.id)}
      />
      {isEditing ? (
        <>
          {/* Input fields for editing item */}
          <Input
            value={editedItem.name}
            onChange={(e) =>
              setEditedItem({ ...editedItem, name: e.target.value })
            }
          />
          <Input
            type="number"
            value={editedItem.quantity}
            onChange={(e) =>
              setEditedItem({
                ...editedItem,
                quantity: parseInt(e.target.value),
              })
            }
            min={1}
          />
          <Button onClick={handleEdit}>Save</Button>
        </>
      ) : (
        <>
          {/* Display item details */}
          <span
            className={`flex-grow ${
              item.packed ? "line-through text-gray-500" : ""
            }`}
          >
            {item.name} (x{item.quantity})
          </span>
          {/* Button to enable edit mode */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </>
      )}
      {/* Button to delete item */}
      <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
        Delete
      </Button>
    </div>
  );
}

// Component to display items grouped by category
function CategoryList({
  items,
  category,
  onToggle,
  onEdit,
  onDelete,
  onDeleteCategory,
  onEditCategory,
}) {
  const [isEditing, setIsEditing] = useState(false); // Tracks edit mode for category name
  const [editedCategory, setEditedCategory] = useState(category); // Tracks edited category name

  // Save edited category name
  const handleSaveCategory = () => {
    onEditCategory(category, editedCategory);
    setIsEditing(false);
  };

  return (
    <AccordionItem value={category}>
      <AccordionTrigger>
        <div className="flex justify-between items-center">
          <span>{category}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {/* Display items within the category */}
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        <div className="flex gap-1">
          {/* Edit category name */}
          {isEditing ? (
            <>
              <Input
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
              />
              <Button size="sm" onClick={handleSaveCategory}>
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit Category ({category})
            </Button>
          )}
          {/* Button to delete category */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteCategory(category)}
          >
            Delete Category ({category})
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Main App component to manage the checklist
export default function App() {
  const [items, setItems] = useState([]); // List of items
  const [categories, setCategories] = useState(defaultCategories); // List of categories

  // Add a new item
  const addItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now() }]);
  };

  // Toggle item packed status
  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  // Edit an item
  const editItem = (editedItem) => {
    setItems(
      items.map((item) => (item.id === editedItem.id ? editedItem : item))
    );
  };

  // Delete an item
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Add a new category
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Delete a category and its items
  const deleteCategory = (category) => {
    setCategories(categories.filter((cat) => cat !== category));
    setItems(items.filter((item) => item.category !== category));
  };

  // Edit category name
  const editCategory = (oldCategory, newCategory) => {
    setCategories(
      categories.map((cat) => (cat === oldCategory ? newCategory : cat))
    );
    setItems(
      items.map((item) =>
        item.category === oldCategory
          ? { ...item, category: newCategory }
          : item
      )
    );
  };

  // Reset all items to unpacked
  const resetList = () => {
    setItems(items.map((item) => ({ ...item, packed: false })));
  };

  // Clear all items
  const clearList = () => {
    setItems([]);
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {});

  const totalItems = items.length; // Total items
  const packedItems = items.filter((item) => item.packed).length; // Packed items count

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Packing Checklist for Travel</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form for adding items */}
          <ItemForm
            onAdd={addItem}
            onAddCategory={addCategory}
            categories={categories}
          />
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Your Packing List</h2>
            <p className="text-sm text-gray-600 mb-4">
              Total: {totalItems} items | Packed: {packedItems} items
            </p>
            {/* Accordion for grouped items */}
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(groupedItems).map(([category, items]) => (
                <CategoryList
                  key={category}
                  category={category}
                  items={items}
                  onToggle={toggleItem}
                  onEdit={editItem}
                  onDelete={deleteItem}
                  onDeleteCategory={deleteCategory}
                  onEditCategory={editCategory}
                />
              ))}
            </Accordion>
          </div>
          <div className="mt-6 space-x-2">
            <Button onClick={resetList}>Reset List</Button>
            <Button variant="destructive" onClick={clearList}>
              Clear List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}