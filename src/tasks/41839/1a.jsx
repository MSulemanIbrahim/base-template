import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

const commonCategories = ['Dairy', 'Vegetables', 'Snacks', 'Fruits', 'Meat', 'Beverages'];

function GroceryItem({ item, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleSave = () => {
    onEdit(editedItem);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between mb-2">
      {isEditing ? (
        <>
          <Input 
            value={editedItem.name} 
            onChange={(e) => setEditedItem({...editedItem, name: e.target.value})} 
            className="mr-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Category</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {commonCategories.map(cat => (
                <DropdownMenuItem key={cat} onClick={() => setEditedItem({...editedItem, category: cat})}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleSave}>Save</Button>
        </>
      ) : (
        <>
          <Checkbox 
            checked={item.purchased} 
            onCheckedChange={onToggle} 
            className="mr-2"
          />
          <span className={item.purchased ? 'line-through text-muted-foreground' : ''}>
            {item.name} - {item.category}
          </span>
          <div>
            <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">Edit</Button>
            <Button onClick={onDelete} variant="ghost" size="sm" className="ml-2 text-red-500">Delete</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(commonCategories[0]);

  const addItem = () => {
    if (inputValue.trim()) {
      setItems([...items, { name: inputValue, category: selectedCategory, purchased: false }]);
      setInputValue('');
    }
  };

  const toggleItem = (index) => {
    const newItems = [...items];
    newItems[index].purchased = !newItems[index].purchased;
    setItems(newItems);
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const editItem = (index, newItem) => {
    const newItems = [...items];
    newItems[index] = newItem;
    setItems(newItems);
  };

  const clearChecked = () => {
    setItems(items.filter(item => !item.purchased));
  };

  const resetList = () => {
    setItems([]);
  };

  const groupedItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Grocery List Maker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Add grocery item"
              className="flex-grow mr-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>{selectedCategory}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {commonCategories.map(cat => (
                  <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={addItem} className="ml-2">Add</Button>
          </div>
          {Object.keys(groupedItems).map(category => (
            <div key={category} className="mb-4">
              <Label className="mb-2 text-lg">{category}</Label>
              {groupedItems[category].map((item, idx) => (
                <GroceryItem 
                  key={idx} 
                  item={{...item, category}} 
                  onToggle={() => toggleItem(items.indexOf(item))} 
                  onDelete={() => deleteItem(items.indexOf(item))} 
                  onEdit={(newItem) => editItem(items.indexOf(item), newItem)} 
                />
              ))}
            </div>
          ))}
          <div className="mt-4 flex justify-between">
            <Button onClick={clearChecked} variant="outline">Clear Checked Items</Button>
            <Button onClick={resetList} variant="destructive">Reset List</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}