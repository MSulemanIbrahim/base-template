// Importing necessary libraries and components for the application
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Data for programming languages' usage and developers in 2024
const ProgrammingLanguagesData = [
    { name: 'JavaScript', usage: 65.2, developers: 17.4 },
    { name: 'Python', usage: 48.3, developers: 12.1 },
    { name: 'Java', usage: 35.6, developers: 9.8 },
    { name: 'C++', usage: 25.9, developers: 5.6 },
    { name: 'TypeScript', usage: 22.4, developers: 4.8 },
];

// Data for programming language adoption trends over time
const adoptionTrends = [
    { year: 2010, JavaScript: 25, Python: 10, Java: 20, Cpp: 18, TypeScript: 0 },
    { year: 2024, JavaScript: 65, Python: 48, Java: 15, Cpp: 10, TypeScript: 22 },
];

// Data for average salaries by programming language
const salaryData = [
    { language: 'Rust', salary: 130000 },
    { language: 'Go', salary: 125000 },
    { language: 'Python', salary: 120000 },
    { language: 'JavaScript', salary: 110000 },
    { language: 'Java', salary: 105000 },
];

// Data for key features supported by different programming languages
const featureData = [
    { feature: 'Easy to learn', Python: true, JavaScript: true, Cpp: false, Rust: false, TypeScript: true },
    { feature: 'Performance', Python: false, JavaScript: false, Cpp: true, Rust: true, TypeScript: false },
    { feature: 'Type safety', Python: false, JavaScript: false, Cpp: true, Rust: true, TypeScript: true },
];

// Component to display a bar chart for programming languages' popularity
function PopularityChart() {
    return (
        <Card className="w-full sm:w-1/2 p-4">
            <CardHeader>
                <CardTitle>Popularity of Programming Languages in 2024</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ProgrammingLanguagesData}>
                        <XAxis dataKey="name" /> {/* X-axis showing programming language names */}
                        <YAxis /> {/* Y-axis showing usage percentages */}
                        <Tooltip /> {/* Tooltip to display detailed info on hover */}
                        <Legend /> {/* Legend for the chart */}
                        <Bar dataKey="usage" fill="#8884d8" /> {/* Bar showing usage data */}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Component to display a bar chart for adoption trends from 2010 to 2024
function AdoptionTrendsChart() {
    return (
        <Card className="w-full sm:w-1/2 p-4">
            <CardHeader>
                <CardTitle>Adoption Trends (2010-2024)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={adoptionTrends}>
                        <XAxis dataKey="year" /> {/* X-axis showing years */}
                        <YAxis /> {/* Y-axis showing percentage adoption */}
                        <Tooltip /> {/* Tooltip for detailed info */}
                        <Legend /> {/* Legend for languages */}
                        {['JavaScript', 'Python', 'Java', 'Cpp', 'TypeScript'].map((lang, idx) => (
                            <Bar key={lang} dataKey={lang} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Component to display a pie chart for average salaries by language
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
                        <Tooltip /> {/* Tooltip for salary details */}
                        <Legend /> {/* Legend for languages */}
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Component to display a table for key features supported by programming languages
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
                            <th className="px-4 py-2">Feature</th> {/* Table header for features */}
                            {featureData[0] && Object.keys(featureData[0]).slice(1).map(lang => <th key={lang} className="px-4 py-2">{lang}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {featureData.map((row, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{row.feature}</td> {/* Feature name */}
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

// Main App component to render all charts and tables
export default function App() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Programming Languages: Trends, Popularity, and Use Cases</h1>
            <div className="flex flex-wrap -mx-2">
                {/* Rendering individual components */}
                <PopularityChart />
                <AdoptionTrendsChart />
                <SalaryPieChart />
                <FeatureTable />
            </div>
        </div>
    );
}
