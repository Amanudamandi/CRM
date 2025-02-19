import React from "react";
import { Line } from "react-chartjs-2";
const LineChart = ({ chartData }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Line Chart</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Lead Count of TL"
            },
            legend: {
              display: false
            }
          },
          responsive: true
        }}
      />
    </div>
  );
}

export default LineChart;