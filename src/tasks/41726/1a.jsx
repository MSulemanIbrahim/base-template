import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const initialCategories = {
  income: ["Salary", "Freelance", "Other"],
  expense: ["Groceries", "Rent", "Entertainment", "Other"]
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
    addTransaction({ type, amount: parseFloat(amount), category, notes, date: new Date() });
    setAmount("");
    setCategory("");
    setNotes("");
  };

  const handleAddCategory = () => {
    if (newCategory && !categories[type].includes(newCategory)) {
      setCategories({
        ...categories,
        [type]: [...categories[type], newCategory]
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

const PieChart = ({ data }) => {
  // Simplified pie chart implementation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map((item, index) => {
        const angle = (item.value / total) * 360;
        const endAngle = startAngle + angle;
        const largeArcFlag = angle > 180 ? 1 : 0;
        const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
        const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
        const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
        const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

        const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        startAngle = endAngle;

        return <path key={index} d={pathData} fill={`hsl(${index * 30}, 70%, 50%)`} />;
      })}
    </svg>
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
              <div className={t.type === "income" ? "text-green-600" : "text-red-600"}>
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
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Income</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={categories.income.map((cat) => ({
                    label: cat,
                    value: transactions
                      .filter((t) => t.type === "income" && t.category === cat)
                      .reduce((sum, t) => sum + t.amount, 0)
                  }))}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={categories.expense.map((cat) => ({
                    label: cat,
                    value: transactions
                      .filter((t) => t.type === "expense" && t.category === cat)
                      .reduce((sum, t) => sum + t.amount, 0)
                  }))}
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