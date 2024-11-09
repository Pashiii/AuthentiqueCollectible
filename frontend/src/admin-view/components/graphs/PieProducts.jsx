import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary chart components
Chart.register(ArcElement, Tooltip, Legend);

const PieProducts = ({ productData }) => {
  // Data for the pie chart (example numbers)
  const data = {
    labels: ["Collectible", "Apparel", "Coffee"],
    datasets: [
      {
        label: "Product Types",
        data: [
          productData.flashSale, // Flash Sale product count
          productData.preOrder, // Pre Order product count
          productData.latestProduct, // Latest Product count
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div style={{ width: "50%", margin: "0 auto" }}>
      <h2 className="text-xl font-bold">Product Type Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default PieProducts;
