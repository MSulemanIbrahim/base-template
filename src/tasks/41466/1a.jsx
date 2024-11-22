import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BarChart = ({ data, labels, title }) => {
  const maxValue = Math.max(...data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {data.map((value, index) => (
            <div key={index} className="flex items-center">
              <span className="w-24 text-sm">{labels[index]}</span>
              <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PieChart = ({ data, labels, title }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((value, index) => {
              const startAngle = currentAngle;
              const angle = (value / total) * 360;
              currentAngle += angle;
              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * currentAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * currentAngle) / 180);
              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                  fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
                />
              );
            })}
          </svg>
        </div>
      </CardContent>
      <div className="flex flex-wrap justify-center mt-4">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center mr-4 mb-2">
            <div
              className="w-3 h-3 mr-1"
              style={{
                backgroundColor: `hsl(${(index * 360) / data.length}, 70%, 50%)`,
              }}
            ></div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const LineChart = ({ data, labels, title }) => {
  const maxValue = Math.max(...data.flat());
  const points = data.map((series, seriesIndex) =>
    series.map((value, index) => ({
      x: (index / (labels.length - 1)) * 100,
      y: 100 - (value / maxValue) * 100,
    }))
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {points.map((series, seriesIndex) => (
              <polyline
                key={seriesIndex}
                points={series.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke={`hsl(${(seriesIndex * 120) % 360}, 70%, 50%)`}
                strokeWidth="2"
              />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {labels.map((label, index) => (
              <span key={index} className="text-xs">{label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const renewableCapacity = {
    labels: ["2010", "2020", "2024"],
    data: [
      [50, 700, 1500],   // Solar
      [200, 650, 900],   // Wind
      [1000, 1200, 1250], // Hydro
      [80, 150, 200],    // Biomass
      [15, 25, 30],      // Geothermal
    ],
  };

  const topCountries = {
    labels: ["Iceland", "Norway", "Germany", "China", "United States"],
    data: [100, 98, 55, 30, 20],
  };

  const adoptionTrends = {
    labels: ["2010", "2020", "2024"],
    data: [15, 25, 35],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Renewable Energy Visualization</h1>
      <Tabs defaultValue="capacity" className="w-full">
        <TabsList>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="countries">Top Countries</TabsTrigger>
          <TabsTrigger value="trends">Adoption Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="capacity">
          <LineChart
            data={renewableCapacity.data}
            labels={renewableCapacity.labels}
            title="Global Renewable Energy Capacity (GW)"
          />
        </TabsContent>
        <TabsContent value="countries">
          <BarChart
            data={topCountries.data}
            labels={topCountries.labels}
            title="Top Countries in Renewable Energy Adoption (% in Energy Mix, 2024)"
          />
        </TabsContent>
        <TabsContent value="trends">
          <PieChart
            data={adoptionTrends.data}
            labels={adoptionTrends.labels}
            title="Global Renewable Energy Adoption Trends (%)"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}