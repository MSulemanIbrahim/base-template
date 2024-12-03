import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

const commonCategories = ['Clothes', 'Toiletries', 'Electronics', 'Documents', 'Miscellaneous'];

function App() {
  const [items, setItems] = useState({});
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 1, notes: '', packed: false });
  const [newCategory, setNewCategory] = useState('');

  const addItem = () => {
    if (newItem.name && newItem.category) {
      const updatedItems = { ...items };
      if (!updatedItems[newItem.category]) {
        updatedItems[newItem.category] = [];
      }
      updatedItems[newItem.category].push({ ...newItem });
      setItems(updatedItems);
      setNewItem({ name: '', category: '', quantity: 1, notes: '', packed: false });
    }
  };

  const togglePacked = (category, index) => {
    const updatedItems = { ...items };
    updatedItems[category][index].packed = !updatedItems[category][index].packed;
    setItems(updatedItems);
  };

  const deleteItem = (category, index) => {
    const updatedItems = { ...items };
    updatedItems[category].splice(index, 1);
    if (updatedItems[category].length === 0) {
      delete updatedItems[category];
    }
    setItems(updatedItems);
  };

  const resetList = () => {
    setItems(Object.keys(items).reduce((acc, key) => {
      acc[key] = items[key].map(item => ({ ...item, packed: false }));
      return acc;
    }, {}));
  };

  const clearList = () => setItems({});

  const addCategory = () => {
    if (newCategory && !commonCategories.includes(newCategory)) {
      // Here we would normally update commonCategories, but since we're not using external state management:
      setNewItem(prev => ({ ...prev, category: newCategory }));
      setNewCategory('');
    }
  };

  const totalItems = Object.values(items).reduce((total, category) => total + category.length, 0);
  const packedItems = Object.values(items).reduce((total, category) => 
    total + category.filter(item => item.packed).length, 0);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4 w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Travel Packing Checklist</CardTitle>
          <CardDescription>Add and manage your packing items.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input 
              value={newItem.name} 
              onChange={e => setNewItem({ ...newItem, name: e.target.value })} 
              placeholder="Item name" 
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{newItem.category || 'Select Category'}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                {commonCategories.map(cat => 
                  <DropdownMenuItem key={cat} onClick={() => setNewItem({ ...newItem, category: cat })}>
                    {cat}
                  </DropdownMenuItem>
                )}
                <Input 
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)} 
                  placeholder="New category" 
                />
                <Button onClick={addCategory}>Add Category</Button>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input 
              type="number" 
              value={newItem.quantity} 
              onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })} 
              placeholder="Qty" 
            />
            <Input 
              value={newItem.notes} 
              onChange={e => setNewItem({ ...newItem, notes: e.target.value })} 
              placeholder="Notes" 
            />
          </div>
          <Button className="mt-2 w-full" onClick={addItem}>Add Item</Button>
        </CardContent>
      </Card>

      {Object.entries(items).map(([category, categoryItems]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b py-2">
                <Checkbox 
                  checked={item.packed} 
                  onCheckedChange={() => togglePacked(category, index)}
                />
                <div className={item.packed ? 'line-through text-muted-foreground' : ''}>
                  {item.name} (x{item.quantity}) {item.notes && `- ${item.notes}`}
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteItem(category, index)}>Delete</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardFooter className="flex justify-between">
          <div>Items: {totalItems} | Packed: {packedItems}</div>
          <div>
            <Button onClick={resetList}>Reset List</Button>
            <Button className="ml-2" onClick={clearList}>Clear List</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;