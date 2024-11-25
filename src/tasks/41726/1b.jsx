import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Other'],
  expense: ['Groceries', 'Rent', 'Entertainment', 'Utilities', 'Other']
};

function TransactionForm({ onSubmit, categories }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && category) {
      onSubmit({ type, amount: parseFloat(amount), category, note, date: new Date() });
      setAmount('');
      setNote('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Select onValueChange={setType} defaultValue="income">
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </Select>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
            <Select onValueChange={setCategory} defaultValue="">
              {categories[type].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </Select>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes" />
            <Button type="submit">Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function BalanceOverview({ income, expense, balance }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-green-500">Income</p>
          <p className="font-bold">${income.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-red-500">Expense</p>
          <p className="font-bold">${expense.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-blue-500">Balance</p>
          <p className="font-bold">${balance.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PieChartComponent({ data }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionList({ transactions }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.map((t, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <div className="flex items-center">
              <div className={`w-3 h-3 mr-2 rounded-full ${t.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{t.category}</span>
            </div>
            <div>
              <span className={`${t.type === 'income' ? 'text-green-500' : 'text-red-500'} font-bold`}>${t.amount.toFixed(2)}</span>
              <small className="ml-2 text-xs">{format(t.date, 'MMM d, yyyy HH:mm')}</small>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [customCategories, setCustomCategories] = useState(categories);

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const pieData = [
    ...transactions.reduce((acc, t) => {
      const key = t.type === 'income' ? t.category + '-income' : t.category + '-expense';
      acc[key] = (acc[key] || { name: t.category, value: 0 });
      acc[key].value += t.amount;
      return acc;
    }, {})
  ].map((item, idx) => ({ ...item, color: COLORS[idx % COLORS.length] }));

  return (
    <div className="p-4 max-w-sm mx-auto sm:max-w-lg">
      <BalanceOverview income={totalIncome} expense={totalExpense} balance={balance} />
      <TransactionForm onSubmit={addTransaction} categories={customCategories} />
      <PieChartComponent data={pieData} />
      <TransactionList transactions={transactions} />
    </div>
  );
}