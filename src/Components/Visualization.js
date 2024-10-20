// src/Components/Visualization.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import '../css/Visualization.css';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Visualization({ weatherData }) {
  const cities = Object.keys(weatherData);
  const datasets = cities.map((city, index) => {
    const temps = weatherData[city].main ? [weatherData[city].main.temp] : [];
    return {
      label: city,
      data: temps.map(temp => (temp - 273.15).toFixed(2)), // Convert to Celsius
      borderColor: getColor(index),
      backgroundColor: getColor(index),
      fill: false,
    };
  });

  const data = {
    labels: ['Latest'],
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Temperature Trends (°C)',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="visualization">
      <Line data={data} options={options} />
    </div>
  );
}

function getColor(index) {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  return colors[index % colors.length];
}

export default Visualization;
