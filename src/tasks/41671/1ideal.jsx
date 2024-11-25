import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Component for individual budget category
const CategoryCard = ({ category, onDelete, onAddExpense, onEditBudget }) => {
  const [expenseAmount, setExpenseAmount] = useState(""); // For adding expense amount
  const [expenseDescription, setExpenseDescription] = useState(""); // For adding expense description
  const [newBudget, setNewBudget] = useState(category.budget); // For editing budget

  const usagePercentage = (category.spent / category.budget) * 100;

  const handleAddExpense = () => {
    if (!expenseAmount || isNaN(expenseAmount) || expenseAmount <= 0) {
      alert("Please enter a valid positive expense amount.");
      return;
    }
    if (category.spent + parseFloat(expenseAmount) > category.budget) {
      alert("Expense exceeds remaining budget.");
      return;
    }
    onAddExpense(category.id, parseFloat(expenseAmount), expenseDescription);
    setExpenseAmount("");
    setExpenseDescription("");
  };

  const handleEditBudget = () => {
    if (!newBudget || isNaN(newBudget) || newBudget <= 0) {
      alert("Please enter a valid positive budget.");
      return;
    }
    if (newBudget < category.spent) {
      alert("New budget cannot be lower than the total spent amount.");
      return;
    }
    onEditBudget(category.id, parseFloat(newBudget));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{category.name}</span>
          <Button variant="destructive" size="sm" onClick={() => onDelete(category.id)}>
            Delete
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          Budget: ${category.budget.toFixed(2)} | Spent: ${category.spent.toFixed(2)} | Remaining: ${(category.budget - category.spent).toFixed(2)}
        </div>
        <Progress value={Math.min(usagePercentage, 100)} className="mb-2" />
        {usagePercentage >= 80 && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>Warning: You're close to exceeding your budget!</AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            placeholder="Amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            min="0"
          />
          <Input
            placeholder="Description"
            value={expenseDescription}
            onChange={(e) => setExpenseDescription(e.target.value)}
          />
          <Button onClick={handleAddExpense}>Add Expense</Button>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="New Budget"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            min="0"
          />
          <Button onClick={handleEditBudget}>Update Budget</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display summary of all categories
const SummaryChart = ({ categories }) => {
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex-1 min-w-[100px]">
            <div className="font-semibold">{cat.name}</div>
            <div className="h-20 bg-gray-200 relative">
              <div
                className="absolute bottom-0 left-0 right-0 bg-blue-500"
                style={{ height: `${Math.min((cat.spent / cat.budget) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-sm">${cat.spent.toFixed(2)} / ${cat.budget.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div>Total Budget: ${totalBudget.toFixed(2)}</div>
        <div>Total Spent: ${totalSpent.toFixed(2)}</div>
        <Progress value={(totalSpent / totalBudget) * 100} className="mt-2" />
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [categories, setCategories] = useState([]); // List of budget categories
  const [newCategoryName, setNewCategoryName] = useState(""); // Name for new category
  const [newCategoryBudget, setNewCategoryBudget] = useState(""); // Budget for new category

  const addCategory = () => {
    if (!newCategoryName.trim() || !newCategoryBudget || isNaN(newCategoryBudget) || newCategoryBudget <= 0) {
      alert("Please enter a valid category name and positive budget.");
      return;
    }
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCategoryName.trim(),
        budget: parseFloat(newCategoryBudget),
        spent: 0,
        expenses: [],
      },
    ]);
    setNewCategoryName("");
    setNewCategoryBudget("");
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const addExpense = (categoryId, amount, description) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              spent: cat.spent + amount,
              expenses: [...cat.expenses, { amount, description, date: new Date() }],
            }
          : cat
      )
    );
  };

  const editBudget = (categoryId, newBudget) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, budget: newBudget } : cat
      )
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Custom Budget Planner</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Budget"
          value={newCategoryBudget}
          onChange={(e) => setNewCategoryBudget(e.target.value)}
          min="0"
        />
        <Button onClick={addCategory}>Add Category</Button>
      </div>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onDelete={deleteCategory}
          onAddExpense={addExpense}
          onEditBudget={editBudget}
        />
      ))}
      <SummaryChart categories={categories} />
    </div>
  );
}
