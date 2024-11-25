import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie, Line } from "react-chartjs-2";

const ECommerceGrowth = ({ data }) => (
  <Card className="sm:mx-4">
    <CardHeader>
      <CardTitle>E-Commerce Growth</CardTitle>
    </CardHeader>
    <CardContent>
      <Line 
        data={{
          labels: Object.keys(data),
          datasets: [{
            label: 'Global E-Commerce Sales (USD Trillions)',
            data: Object.values(data),
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          }]
        }} 
        options={{
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }}
      />
    </CardContent>
  </Card>
);

const PlatformMarketShare = ({ data }) => (
  <Card className="sm:mx-4 mt-4">
    <CardHeader>
      <CardTitle>Top E-Commerce Platforms</CardTitle>
    </CardHeader>
    <CardContent>
      <Pie 
        data={{
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
            ]
          }]
        }} 
      />
    </CardContent>
  </Card>
);

const ConsumerPreferences = ({ data }) => (
  <Card className="sm:mx-4 mt-4">
    <CardHeader>
      <CardTitle>Consumer Preferences</CardTitle>
    </CardHeader>
    <CardContent>
      <Bar 
        data={{
          labels: Object.keys(data),
          datasets: [{
            label: 'Percentage (%)',
            data: Object.values(data),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          }]
        }} 
        options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            }
          }
        }}
      />
    </CardContent>
  </Card>
);

export default function App() {
  const growthData = {
    "2015": 1.5,
    "2020": 4.2,
    "2024": 6.3
  };

  const platformData = {
    "Shopify": 28.3,
    "WooCommerce": 23.5,
    "Amazon": 18.7,
    "Magento": 7.8,
    "BigCommerce": 6.1
  };

  const consumerData = {
    "Free Shipping": 77,
    "Easy Returns": 65,
    "Sustainable Products": 58,
    "Personalized Recommendations": 52,
    "Mobile-Friendly Experience": 47
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">E-Commerce Trends in 2024</h1>
      <ECommerceGrowth data={growthData} />
      <PlatformMarketShare data={platformData} />
      <ConsumerPreferences data={consumerData} />
    </div>
  );
}