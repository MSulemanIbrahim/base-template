import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = ["Clothes", "Toiletries", "Electronics", "Documents", "Miscellaneous"];

function ItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && category) {
      onAdd({ name, category, quantity, note, packed: false });
      setName("");
      setCategory("");
      setQuantity(1);
      setNote("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      {category === "custom" && (
        <Input
          placeholder="Custom category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      )}
      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min={1}
        required
      />
      <Input
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit">Add Item</Button>
    </form>
  );
}

function Item({ item, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleEdit = () => {
    onEdit(editedItem);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox
        checked={item.packed}
        onCheckedChange={() => onToggle(item.id)}
      />
      {isEditing ? (
        <>
          <Input
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
          />
          <Input
            type="number"
            value={editedItem.quantity}
            onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) })}
            min={1}
          />
          <Button onClick={handleEdit}>Save</Button>
        </>
      ) : (
        <>
          <span className={`flex-grow ${item.packed ? "line-through text-gray-500" : ""}`}>
            {item.name} (x{item.quantity})
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </>
      )}
      <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
        Delete
      </Button>
    </div>
  );
}

function CategoryList({ items, category, onToggle, onEdit, onDelete }) {
  return (
    <AccordionItem value={category}>
      <AccordionTrigger>{category}</AccordionTrigger>
      <AccordionContent>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function App() {
  const [items, setItems] = useState([]);

  const addItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now() }]);
  };

  const toggleItem = (id) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const editItem = (editedItem) => {
    setItems(items.map((item) => 
      item.id === editedItem.id ? editedItem : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const resetList = () => {
    setItems(items.map((item) => ({ ...item, packed: false })));
  };

  const clearList = () => {
    setItems([]);
  };

  const groupedItems = items.reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {});

  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Packing Checklist for Travel</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm onAdd={addItem} />
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Your Packing List</h2>
            <p className="text-sm text-gray-600 mb-4">
              Total: {totalItems} items | Packed: {packedItems} items
            </p>
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(groupedItems).map(([category, items]) => (
                <CategoryList
                  key={category}
                  category={category}
                  items={items}
                  onToggle={toggleItem}
                  onEdit={editItem}
                  onDelete={deleteItem}
                />
              ))}
            </Accordion>
          </div>
          <div className="mt-6 space-x-2">
            <Button onClick={resetList}>Reset List</Button>
            <Button variant="destructive" onClick={clearList}>Clear List</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}