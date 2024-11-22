import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Bar Chart Component
const BarChart = ({ data, xKey, yKey, title }) => {
  const maxValue = Math.max(...data.map((item) => item[yKey]));

  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end space-x-2 h-64">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="bg-blue-500 w-12 rounded-t"
              style={{ height: `${(item[yKey] / maxValue) * 100}%` }}
            ></div>
            <span className="text-sm mt-2">{item[xKey]}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Pie Chart Component
const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative h-64">
        <div className="w-48 h-48 rounded-full overflow-hidden mx-auto">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const rotate = index > 0 ? data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0) : 0;
            return (
              <div
                key={index}
                className="absolute inset-0"
                style={{
                  backgroundColor: item.color,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotate * Math.PI) / 180)}% ${
                    50 - 50 * Math.sin((rotate * Math.PI) / 180)
                  }%, ${50 + 50 * Math.cos(((rotate + percentage * 3.6) * Math.PI) / 180)}% ${
                    50 - 50 * Math.sin(((rotate + percentage * 3.6) * Math.PI) / 180)
                  }%)`,
                }}
              ></div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap justify-center">
          {data.map((item, index) => (
            <div key={index} className="flex items-center mr-4 mb-2">
              <div className="w-3 h-3 mr-1" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Table Component
const Table = ({ data, columns, title }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="text-left p-2 bg-gray-100">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-2 border-t">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const eCommerceGrowth = [
    { year: 2015, sales: 1.5, percentage: 7.4 },
    { year: 2020, sales: 4.2, percentage: 18.0 },
    { year: 2024, sales: 6.3, percentage: 23.6 },
  ];

  const platformMarketShare = [
    { label: "Shopify", value: 28.3, color: "#95A5A6" },
    { label: "WooCommerce", value: 23.5, color: "#9B59B6" },
    { label: "Amazon", value: 18.7, color: "#E74C3C" },
    { label: "Magento", value: 7.8, color: "#3498DB" },
    { label: "BigCommerce", value: 6.1, color: "#2ECC71" },
    { label: "Others", value: 15.6, color: "#F1C40F" },
  ];

  const consumerPreferences = [
    { preference: "Free Shipping", percentage: 77 },
    { preference: "Easy Returns", percentage: 65 },
    { preference: "Sustainable Products", percentage: 58 },
    { preference: "Personalized Recommendations", percentage: 52 },
    { preference: "Mobile-Friendly Experience", percentage: 47 },
  ];

  const regionalMarketLeaders = [
    { region: "North America", platform: "Amazon", payment: "Credit/Debit Cards" },
    { region: "Europe", platform: "Zalando", payment: "Digital Wallets" },
    { region: "Asia-Pacific", platform: "Alibaba", payment: "Mobile Payments" },
    { region: "Latin America", platform: "MercadoLibre", payment: "Local Payment Methods" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">E-Commerce Trends in 2024: Insights and Future Directions</h1>
      <Tabs defaultValue="growth">
        <TabsList className="mb-4">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="consumers">Consumer Preferences</TabsTrigger>
          <TabsTrigger value="regions">Regional Leaders</TabsTrigger>
        </TabsList>
        <TabsContent value="growth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BarChart
              data={eCommerceGrowth}
              xKey="year"
              yKey="sales"
              title="Global E-Commerce Sales (USD Trillions)"
            />
            <BarChart
              data={eCommerceGrowth}
              xKey="year"
              yKey="percentage"
              title="% of Retail Sales Online"
            />
          </div>
        </TabsContent>
        <TabsContent value="platforms">
          <PieChart data={platformMarketShare} title="Top E-Commerce Platforms Market Share" />
        </TabsContent>
        <TabsContent value="consumers">
          <BarChart
            data={consumerPreferences}
            xKey="preference"
            yKey="percentage"
            title="Consumer Preferences (%)"
          />
        </TabsContent>
        <TabsContent value="regions">
          <Table
            data={regionalMarketLeaders}
            columns={["region", "platform", "payment"]}
            title="Regional Market Leaders (2024)"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}