import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Colors used for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// E-commerce growth data
const eCommerceGrowthData = [
  { year: "2015", sales: 1.5, retailShare: 7.4 },
  { year: "2020", sales: 4.2, retailShare: 18.0 },
  { year: "2024", sales: 6.3, retailShare: 23.6 },
];

// Market share data for e-commerce platforms
const platformMarketShareData = [
  { platform: "Shopify", share: 28.3 },
  { platform: "WooCommerce", share: 23.5 },
  { platform: "Amazon", share: 18.7 },
  { platform: "Magento", share: 7.8 },
  { platform: "BigCommerce", share: 6.1 },
];

// Consumer preference data
const consumerPreferencesData = [
  { preference: "Free Shipping", percentage: 77 },
  { preference: "Easy Returns", percentage: 65 },
  { preference: "Sustainable Products", percentage: 58 },
  { preference: "Personalized Recommendations", percentage: 52 },
  { preference: "Mobile-Friendly Experience", percentage: 47 },
];

// Regional market leaders data
const regionalMarketLeadersData = [
  { region: "North America", platform: "Amazon", payment: "Credit/Debit Cards" },
  { region: "Europe", platform: "Zalando", payment: "Digital Wallets" },
  { region: "Asia-Pacific", platform: "Alibaba", payment: "Mobile Payments" },
  { region: "Latin America", platform: "MercadoLibre", payment: "Local Methods" },
];

// Component to display a bar chart for e-commerce growth
function GrowthBarChart() {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>E-Commerce Growth Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eCommerceGrowthData}>
            <XAxis dataKey="year" /> {/* X-axis with year */}
            <YAxis /> {/* Y-axis */}
            <Tooltip /> {/* Tooltip for hover information */}
            <Legend /> {/* Legend to describe the data */}
            <Bar dataKey="sales" fill="#0088FE" name="Sales (Trillions)" /> {/* Bar for sales */}
            <Bar dataKey="retailShare" fill="#FFBB28" name="% Retail Online" /> {/* Bar for retail share */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Component to display a pie chart for platform market share
function MarketSharePieChart() {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>Platform Market Share</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={platformMarketShareData}
              dataKey="share"
              nameKey="platform"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {platformMarketShareData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip /> {/* Tooltip for hover information */}
            <Legend /> {/* Legend for market share */}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Component to display a bar chart for consumer preferences
function PreferencesBarChart() {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>Consumer Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={consumerPreferencesData}>
            <XAxis dataKey="preference" /> {/* X-axis with preference */}
            <YAxis /> {/* Y-axis */}
            <Tooltip /> {/* Tooltip for hover information */}
            <Legend /> {/* Legend to describe the data */}
            <Bar dataKey="percentage" fill="#00C49F" name="Preference (%)" /> {/* Bar for preferences */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Component to display a table for regional market leaders
function RegionalLeadersTable() {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle>Regional Market Leaders</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Leading Platform</th>
              <th className="px-4 py-2">Dominant Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {regionalMarketLeadersData.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{row.region}</td> {/* Region */}
                <td className="border px-4 py-2">{row.platform}</td> {/* Platform */}
                <td className="border px-4 py-2">{row.payment}</td> {/* Payment method */}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// Main app component
export default function App() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">E-Commerce Trends in 2024</h1>
      <GrowthBarChart /> {/* Render growth bar chart */}
      <MarketSharePieChart /> {/* Render market share pie chart */}
      <PreferencesBarChart /> {/* Render preferences bar chart */}
      <RegionalLeadersTable /> {/* Render regional leaders table */}
    </div>
  );
}
