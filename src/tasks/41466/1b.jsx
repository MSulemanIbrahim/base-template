import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RenewableEnergyData = {
  capacity: [
    {name: '2010', Solar: 50, Wind: 200, Hydro: 1000, Biomass: 80, Geothermal: 15},
    {name: '2020', Solar: 700, Wind: 650, Hydro: 1200, Biomass: 150, Geothermal: 25},
    {name: '2024', Solar: 1500, Wind: 900, Hydro: 1250, Biomass: 200, Geothermal: 30},
  ],
  adoptionTrends: [
    {year: '2010', share: 15},
    {year: '2020', share: 25},
    {year: '2024', share: 35},
  ],
  topCountries: [
    {name: 'Iceland', value: 100},
    {name: 'Norway', value: 98},
    {name: 'Germany', value: 55},
    {name: 'China', value: 30},
    {name: 'USA', value: 20},
  ],
};

function CapacityChart() {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>Renewable Energy Capacity (GW)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={RenewableEnergyData.capacity}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Solar" fill="#FFD700" />
            <Bar dataKey="Wind" fill="#82ca9d" />
            <Bar dataKey="Hydro" fill="#4169E1" />
            <Bar dataKey="Biomass" fill="#8B4513" />
            <Bar dataKey="Geothermal" fill="#FF6347" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function AdoptionTrend() {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>Global Renewable Share (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={RenewableEnergyData.adoptionTrends}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="share" stroke="#8884d8" activeDot={{r: 8}}/>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function CountryAdoptionPie() {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>Top Countries in Renewable Energy</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={RenewableEnergyData.topCountries} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {RenewableEnergyData.topCountries.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:flex-wrap sm:justify-center sm:space-x-4">
      <CapacityChart />
      <AdoptionTrend />
      <CountryAdoptionPie />
      <Card className="sm:w-full w-[300px]">
        <CardHeader>
          <CardTitle>Benefits of Renewable Energy</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            <li>Environmental Impact</li>
            <li>Energy Security</li>
            <li>Economic Growth</li>
            <li>Sustainability</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}