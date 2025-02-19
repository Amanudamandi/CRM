import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ chartData }) => {

    const Styles = {
        chartContainer: { 
            display: 'flex',
            flexDirection: 'column'
        }
    }

    return (
    <div style={Styles.chartContainer}>
        <h3 style={{ textAlign: "center" }}>Coordinator Status</h3>
        <Pie
            data={chartData}
            options = {{
                plugins: {
                    legend: { 
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "Coordinator Status"
                    }
                }
            }}
        />
    </div>
    );
}
export default PieChart;