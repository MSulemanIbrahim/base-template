import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Recharts components (assuming they're available in the Shadcn library)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "@/components/ui/recharts";

const popularLanguages = [
  { name: "JavaScript", usage: 65.2, developers: 17.4 },
  { name: "Python", usage: 48.3, developers: 12.1 },
  { name: "Java", usage: 35.6, developers: 9.8 },
  { name: "C++", usage: 25.9, developers: 5.6 },
  { name: "TypeScript", usage: 22.4, developers: 4.8 }
];

const adoptionTrends = [
  { year: 2010, JavaScript: 25, Python: 10, Java: 20, "C++": 18, TypeScript: 0 },
  { year: 2024, JavaScript: 65, Python: 48, Java: 15, "C++": 10, TypeScript: 22 }
];

const averageSalaries = [
  { language: "Rust", salary: 130000 },
  { language: "Go", salary: 125000 },
  { language: "Python", salary: 120000 },
  { language: "JavaScript", salary: 110000 },
  { language: "Java", salary: 105000 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const PopularLanguagesChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={popularLanguages}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="usage" fill="#8884d8" name="Usage (%)" />
      <Bar yAxisId="right" dataKey="developers" fill="#82ca9d" name="Active Developers (M)" />
    </BarChart>
  </ResponsiveContainer>
);

const AdoptionTrendsChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={adoptionTrends}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      {Object.keys(adoptionTrends[0]).filter(key => key !== "year").map((key, index) => (
        <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index]} />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

const AverageSalariesChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={averageSalaries}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="salary"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {averageSalaries.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

const LanguageFeatures = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Feature</th>
          <th className="px-4 py-2 border">Python</th>
          <th className="px-4 py-2 border">JavaScript</th>
          <th className="px-4 py-2 border">C++</th>
          <th className="px-4 py-2 border">Rust</th>
          <th className="px-4 py-2 border">TypeScript</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-4 py-2 border">Easy to learn</td>
          <td className="px-4 py-2 border">✅</td>
          <td className="px-4 py-2 border">✅</td>
          <td className="px-4 py-2 border">❌</td>
          <td className="px-4 py-2 border">❌</td>
          <td className="px-4 py-2 border">✅</td>
        </tr>
        <tr>
          <td className="px-4 py-2 border">Performance</td>
          <td className="px-4 py-2 border">❌</td>
          <td className="px-4 py-2 border">❌</td>
          <td className="px-4 py-2 border">✅</td>
          <td className="px-4 py-2 border">✅</td>
          <td className="px-4 py-2 border">❌</td>
        </tr>
        <tr>
          <td className="px-4 py-2 border">Type safety</td>
          <td className="px-4 py-2 border">❌</td>
          <td className="px-4 py-2 border">❌</td>
          <td className="px-4 py-2 border">✅</td>
          <td className="px-4 py-2 border">✅</td>
          <td className="px-4 py-2 border">✅</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Programming Languages: Trends, Popularity, and Use Cases</h1>
      <Tabs defaultValue="popular">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="popular">Popular Languages</TabsTrigger>
          <TabsTrigger value="adoption">Adoption Trends</TabsTrigger>
          <TabsTrigger value="salaries">Average Salaries</TabsTrigger>
          <TabsTrigger value="features">Language Features</TabsTrigger>
        </TabsList>
        <TabsContent value="popular">
          <Card>
            <CardHeader>
              <CardTitle>Popular Programming Languages in 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <PopularLanguagesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="adoption">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Trends (2010–2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <AdoptionTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="salaries">
          <Card>
            <CardHeader>
              <CardTitle>Average Salaries by Language (2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <AverageSalariesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageFeatures />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Conclusion</h2>
        <p className="text-gray-700">
          Programming languages vary in their applications and advantages. JavaScript leads in web development, while Python dominates AI/ML. For performance, C++ and Rust shine. Choosing the right language depends on project needs and personal goals.
        </p>
      </div>
    </div>
  );
}