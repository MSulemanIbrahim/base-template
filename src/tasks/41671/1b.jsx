import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', budget: 0 });
  const [alertThreshold, setAlertThreshold] = useState(0.8);

  const addCategory = () => {
    if (newCategory.name && newCategory.budget > 0) {
      setCategories([...categories, { ...newCategory, expenses: [], remaining: newCategory.budget }]);
      setNewCategory({ name: '', budget: 0 });
    }
  };

  const deleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addExpense = (categoryIndex, expense) => {
    setCategories(categories.map((cat, i) => {
      if (i === categoryIndex) {
        const remaining = cat.remaining - expense.amount;
        return { 
          ...cat, 
          expenses: [...cat.expenses, expense], 
          remaining: remaining >= 0 ? remaining : 0 
        };
      }
      return cat;
    }));
  };

  const totalBudget = categories.reduce((sum, cat) => sum + parseFloat(cat.budget), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + (parseFloat(cat.budget) - parseFloat(cat.remaining)), 0);

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [{
      data: categories.map(cat => cat.budget - cat.remaining),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Budget Planner</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="categoryName">Name</Label>
            <Input 
              id="categoryName" 
              value={newCategory.name} 
              onChange={e => setNewCategory({...newCategory, name: e.target.value})} 
              placeholder="Category Name" 
            />
            <Label htmlFor="categoryBudget" className="mt-2">Budget</Label>
            <Input 
              id="categoryBudget" 
              type="number" 
              value={newCategory.budget} 
              onChange={e => setNewCategory({...newCategory, budget: e.target.value})} 
              placeholder="Budget Amount" 
            />
          </CardContent>
          <CardFooter>
            <Button onClick={addCategory}>Add Category</Button>
          </CardFooter>
        </Card>
        
        <Card className="flex-1">
          <CardContent>
            <Label>Alert Threshold</Label>
            <Input 
              type="number" 
              value={alertThreshold * 100} 
              onChange={e => setAlertThreshold(e.target.value / 100)} 
              placeholder="Alert at % of budget" 
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <CategoryCard 
            key={index} 
            category={category} 
            index={index} 
            onDelete={deleteCategory} 
            onAddExpense={addExpense} 
            alertThreshold={alertThreshold}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Budget Summary</h2>
        <Pie data={chartData} />
        <div className="mt-4 text-center">
          <p>Total Budget: ${totalBudget.toFixed(2)}</p>
          <p>Total Spent: ${totalSpent.toFixed(2)}</p>
          <p>Remaining: ${(totalBudget - totalSpent).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, index, onDelete, onAddExpense, alertThreshold }) {
  const [expense, setExpense] = useState({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const usagePercentage = ((category.budget - category.remaining) / category.budget) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription>Budget: ${category.budget}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p>Remaining: ${category.remaining.toFixed(2)}</p>
          {usagePercentage >= alertThreshold * 100 && 
            <p className="text-red-500">Warning: Approaching budget limit!</p>}
        </div>
        <Input 
          type="number" 
          value={expense.amount} 
          onChange={e => setExpense({...expense, amount: e.target.value})} 
          placeholder="Expense Amount" 
        />
        <Input 
          value={expense.description} 
          onChange={e => setExpense({...expense, description: e.target.value})} 
          placeholder="Description" 
          className="mt-2"
        />
        <Input 
          type="date" 
          value={expense.date} 
          onChange={e => setExpense({...expense, date: e.target.value})} 
          className="mt-2"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          if (expense.amount && expense.description) {
            onAddExpense(index, expense);
            setExpense({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
          }
        }}>Add Expense</Button>
        <Button variant="destructive" onClick={() => onDelete(index)} className="ml-2">Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default App;