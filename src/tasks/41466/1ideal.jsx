// Importing required libraries and components for the app
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Define color palette for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Data structure for renewable energy information
const RenewableEnergyData = {
  capacity: [ // Data for renewable energy capacity in GW by type
    {name: '2010', Solar: 50, Wind: 200, Hydro: 1000, Biomass: 80, Geothermal: 15},
    {name: '2020', Solar: 700, Wind: 650, Hydro: 1200, Biomass: 150, Geothermal: 25},
    {name: '2024', Solar: 1500, Wind: 900, Hydro: 1250, Biomass: 200, Geothermal: 30},
  ],
  adoptionTrends: [ // Data for renewable energy adoption trends as a global percentage share
    {year: '2010', share: 15},
    {year: '2020', share: 25},
    {year: '2024', share: 35},
  ],
  topCountries: [ // Data for countries leading in renewable energy adoption
    {name: 'Iceland', value: 100},
    {name: 'Norway', value: 98},
    {name: 'Germany', value: 55},
    {name: 'China', value: 30},
    {name: 'USA', value: 20},
  ],
};

// Component to render a bar chart of renewable energy capacity by type
function CapacityChart() {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>Renewable Energy Capacity (GW)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={RenewableEnergyData.capacity}>
            <XAxis dataKey="name" /> {/* X-axis showing years */}
            <YAxis /> {/* Y-axis showing capacity in GW */}
            <Tooltip /> {/* Tooltip for detailed information on hover */}
            <Legend /> {/* Legend explaining the color mapping */}
            {/* Bars for each renewable energy source */}
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

// Component to render a line chart showing global renewable energy adoption trends
function AdoptionTrend() {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>Global Renewable Share (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={RenewableEnergyData.adoptionTrends}>
            <XAxis dataKey="year" /> {/* X-axis showing years */}
            <YAxis /> {/* Y-axis showing percentage share */}
            <Tooltip /> {/* Tooltip for detailed information */}
            <Legend /> {/* Legend for the line */}
            <Line type="monotone" dataKey="share" stroke="#8884d8" activeDot={{r: 8}} /> {/* Line representing adoption trends */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Component to render a pie chart for top countries in renewable energy adoption
function CountryAdoptionPie() {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>Top Countries in Renewable Energy</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={RenewableEnergyData.topCountries} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label
            >
              {/* Map each country to a colored slice */}
              {RenewableEnergyData.topCountries.map((entry, index) => 
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              )}
            </Pie>
            <Tooltip /> {/* Tooltip for detailed information */}
            <Legend /> {/* Legend explaining the slices */}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Main App component to render all cards and charts
export default function App() {
  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:flex-wrap sm:justify-center sm:space-x-4">
      {/* Render each chart component */}
      <CapacityChart />
      <AdoptionTrend />
      <CountryAdoptionPie />
      {/* Additional card for displaying key benefits */}
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
