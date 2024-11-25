import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const initialCategories = {
  income: ["Salary", "Freelance", "Other"],
  expense: ["Groceries", "Rent", "Entertainment", "Other"],
};

// Transaction Form Component
const TransactionForm = ({ addTransaction, categories, setCategories }) => {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || amount <= 0) {
      alert("Please enter a valid amount and category.");
      return;
    }
    addTransaction({ type, amount: parseFloat(amount), category, notes, date: new Date() });
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
      <Select value={type} onValueChange={setType}>
        <Select.Trigger>
          <Select.Value placeholder="Select type" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="income">Income</Select.Item>
          <Select.Item value="expense">Expense</Select.Item>
        </Select.Content>
      </Select>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        min="0.01"
      />
      <Select value={category} onValueChange={setCategory}>
        <Select.Trigger>
          <Select.Value placeholder="Select category" />
        </Select.Trigger>
        <Select.Content>
          {categories[type].map((cat) => (
            <Select.Item key={cat} value={cat}>
              {cat}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
      />
      <Button type="submit">Add Transaction</Button>
      <div className="flex space-x-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
        />
        <Button type="button" onClick={handleAddCategory}>
          Add
        </Button>
      </div>
    </form>
  );
};

// Transaction History with Filtering
const TransactionHistory = ({ transactions, filters, setFilters }) => {
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = !filters.type || t.type === filters.type;
    const matchesDate =
      (!filters.startDate || new Date(t.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(t.date) <= new Date(filters.endDate));
    return matchesType && matchesDate;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Filters for date range and type */}
          <div className="flex space-x-2">
            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <Select.Trigger>
                <Select.Value placeholder="Type" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">All</Select.Item>
                <Select.Item value="income">Income</Select.Item>
                <Select.Item value="expense">Expense</Select.Item>
              </Select.Content>
            </Select>
          </div>
          {/* Filtered Transaction List */}
          <ul className="space-y-2">
            {filteredTransactions.map((t, index) => (
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
                <div className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                  ${t.amount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Main App Component
export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [filters, setFilters] = useState({ type: "", startDate: "", endDate: "" });

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const resetData = () => {
    setTransactions([]);
    setCategories(initialCategories);
    setFilters({ type: "", startDate: "", endDate: "" });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Finance Tracker</h1>
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
      <TransactionHistory transactions={transactions} filters={filters} setFilters={setFilters} />
      <Button onClick={resetData} className="w-full">
        Reset Data
      </Button>
    </div>
  );
}
