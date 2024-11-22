import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProgrammingLanguagesData = [
    { name: 'JavaScript', usage: 65.2, developers: 17.4 },
    { name: 'Python', usage: 48.3, developers: 12.1 },
    { name: 'Java', usage: 35.6, developers: 9.8 },
    { name: 'C++', usage: 25.9, developers: 5.6 },
    { name: 'TypeScript', usage: 22.4, developers: 4.8 },
];

const adoptionTrends = [
    { year: 2010, JavaScript: 25, Python: 10, Java: 20, Cpp: 18, TypeScript: 0 },
    { year: 2024, JavaScript: 65, Python: 48, Java: 15, Cpp: 10, TypeScript: 22 },
];

const salaryData = [
    { language: 'Rust', salary: 130000 },
    { language: 'Go', salary: 125000 },
    { language: 'Python', salary: 120000 },
    { language: 'JavaScript', salary: 110000 },
    { language: 'Java', salary: 105000 },
];

const featureData = [
    { feature: 'Easy to learn', Python: true, JavaScript: true, Cpp: false, Rust: false, TypeScript: true },
    { feature: 'Performance', Python: false, JavaScript: false, Cpp: true, Rust: true, TypeScript: false },
    { feature: 'Type safety', Python: false, JavaScript: false, Cpp: true, Rust: true, TypeScript: true },
];

function PopularityChart() {
    return (
        <Card className="w-full sm:w-1/2 p-4">
            <CardHeader>
                <CardTitle>Popularity of Programming Languages in 2024</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ProgrammingLanguagesData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="usage" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function AdoptionTrendsChart() {
    return (
        <Card className="w-full sm:w-1/2 p-4">
            <CardHeader>
                <CardTitle>Adoption Trends (2010-2024)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={adoptionTrends}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {['JavaScript', 'Python', 'Java', 'Cpp', 'TypeScript'].map((lang, idx) => (
                            <Bar key={lang} dataKey={lang} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function SalaryPieChart() {
    return (
        <Card className="w-full sm:w-1/2 p-4">
            <CardHeader>
                <CardTitle>Average Salaries by Language (2024)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={salaryData} dataKey="salary" nameKey="language" cx="50%" cy="50%" outerRadius={80} label>
                            {salaryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function FeatureTable() {
    return (
        <Card className="w-full sm:w-1/2 p-4">
            <CardHeader>
                <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Feature</th>
                            {featureData[0] && Object.keys(featureData[0]).slice(1).map(lang => <th key={lang} className="px-4 py-2">{lang}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {featureData.map((row, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{row.feature}</td>
                                {Object.keys(row).slice(1).map(lang => (
                                    <td key={lang} className="border px-4 py-2">{row[lang] ? '✅' : '❌'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

export default function App() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Programming Languages: Trends, Popularity, and Use Cases</h1>
            <div className="flex flex-wrap -mx-2">
                <PopularityChart />
                <AdoptionTrendsChart />
                <SalaryPieChart />
                <FeatureTable />
            </div>
        </div>
    );
}