// src/Components/DailySummaryCard.js

import React from 'react';
import '../css/DailySummaryCard.css';

function DailySummaryCard({ city, summary }) {
  if (!summary) return null;

  const { averageTemp, maxTemp, minTemp, dominantCondition, date } = summary;

  return (
    <div className="daily-summary-card">
      <h3>{city}</h3>
      <p>Date: {date}</p>
      <p>Average Temp: {averageTemp}°C</p>
      <p>Max Temp: {maxTemp}°C</p>
      <p>Min Temp: {minTemp}°C</p>
      <p>Dominant Condition: {dominantCondition}</p>
    </div>
  );
}

export default DailySummaryCard;
