import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const initialCategories = {
  income: ["Salary", "Freelance", "Other"],
  expense: ["Groceries", "Rent", "Entertainment", "Other"],
};

const adoptionTrends = {
  labels: ["2010", "2020", "2024"],
  data: [15, 25, 35],
};

const TransactionForm = ({ addTransaction, categories, setCategories }) => {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      notes,
      date: new Date(),
    });
    setAmount("");
    setCategory("");
    setNotes("");
  };

  const handleAddCategory = () => {
    if (newCategory && !categories[type].includes(newCategory)) {
      setCategories({
        ...categories,
        [type]: [...categories[type], newCategory],
      });
      setNewCategory("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type Selector */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Amount Input */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Category Selector */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories[type]?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Input */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes (optional)
        </label>
        <input
          type="text"
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Transaction
      </button>

      {/* Add New Category */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <label
            htmlFor="newCategory"
            className="block text-sm font-medium text-gray-700"
          >
            New Category
          </label>
          <input
            type="text"
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="self-end px-4 py-2 text-white bg-green-500 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add
        </button>
      </div>
    </form>
  );
};

const BalanceOverview = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>Income: ${totalIncome.toFixed(2)}</div>
          <div>Expenses: ${totalExpenses.toFixed(2)}</div>
          <div>Balance: ${balance.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const PieChart = ({ data, labels }) => {
  const formattedData = data.filter((n) => n !== 0);
  const total = formattedData.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  let cumulativeAngle = 0;

  return (
    <div>
      {/* SVG Pie Chart */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          {formattedData.map((value, index) => {
            const angle = (value / total) * 360;

            // Handle single segment case
            if (formattedData.length === 1) {
              return (
                <circle
                  key={index}
                  cx="16"
                  cy="16"
                  r="16"
                  fill={`hsl(${(index * 360) / labels.length}, 70%, 50%)`}
                />
              );
            }

            const largeArcFlag = angle > 180 ? 1 : 0;

            // Convert angles to radians and calculate coordinates
            const startX = 16 + 16 * Math.cos((Math.PI * cumulativeAngle) / 180);
            const startY = 16 + 16 * Math.sin((Math.PI * cumulativeAngle) / 180);
            cumulativeAngle += angle;
            const endX = 16 + 16 * Math.cos((Math.PI * cumulativeAngle) / 180);
            const endY = 16 + 16 * Math.sin((Math.PI * cumulativeAngle) / 180);

            // Generate the path for the current segment
            const pathData = `
              M 16 16
              L ${startX} ${startY}
              A 16 16 0 ${largeArcFlag} 1 ${endX} ${endY}
              Z
            `;

            return (
              <path
                key={index}
                d={pathData}
                fill={`hsl(${(index * 360) / labels.length}, 70%, 50%)`}
              />
            );
          })}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap justify-center mt-4">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center mr-4 mb-2">
            <div
              className="w-3 h-3 mr-1"
              style={{
                backgroundColor: `hsl(${(index * 360) / labels.length}, 70%, 50%)`,
              }}
            ></div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};




const TransactionHistory = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {transactions.map((t, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 rounded ${
                t.type === "income" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div>
                <div className="font-bold">{t.category}</div>
                <div className="text-sm">{t.notes}</div>
                <div className="text-xs">{t.date.toLocaleString()}</div>
              </div>
              <div
                className={
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }
              >
                ${t.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const InsightsTab = ({ transactions }) => {
  const getTopCategories = (type) => {
    const categoryTotals = transactions
      .filter((t) => t.type === type)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topIncomeCategories = getTopCategories("income");
  const topExpenseCategories = getTopCategories("expense");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold">Top Income Categories</h3>
        <ul>
          {topIncomeCategories.map(([category, amount]) => (
            <li key={category}>
              {category}: ${amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold">Top Expense Categories</h3>
        <ul>
          {topExpenseCategories.map(([category, amount]) => (
            <li key={category}>
              {category}: ${amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(initialCategories);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const resetData = () => {
    setTransactions([]);
    setCategories(initialCategories);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Finance Tracker</h1>
      <BalanceOverview transactions={transactions} />
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button className="w-full">Toggle Transaction Form</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <TransactionForm
            addTransaction={addTransaction}
            categories={categories}
            setCategories={setCategories}
          />
        </CollapsibleContent>
      </Collapsible>
      <Tabs defaultValue="history">
        <TabsList className="w-full">
          <TabsTrigger value="history" className="w-1/2">
            History
          </TabsTrigger>
          <TabsTrigger value="insights" className="w-1/2">
            Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <TransactionHistory transactions={transactions} />
        </TabsContent>
        <TabsContent value="insights">
          <InsightsTab transactions={transactions} />
        </TabsContent>
      </Tabs>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button className="w-full">Toggle Charts</Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Income</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={categories.income.map((cat) =>
                    transactions
                      .filter((t) => t.type === "income" && t.category === cat)
                      .reduce((sum, t) => sum + t.amount, 0)
                  )} // Array of values for each category
                  labels={categories.income} // Array of category labels
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={categories.expense.map((cat) =>
                    transactions
                      .filter((t) => t.type === "expense" && t.category === cat)
                      .reduce((sum, t) => sum + t.amount, 0)
                  )} // Array of values
                  labels={categories.expense} // Array of labels (categories)
                />
              </CardContent>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Button onClick={resetData} className="w-full">
        Reset Data
      </Button>
    </div>
  );
}
