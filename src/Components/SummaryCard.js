// src/Components/SummaryCard.js

import React, { useMemo } from "react";
import moment from "moment";
import "../css/SummaryCard.css";
import convertToFahrenheit from "../helpers/convertToFahrenheit";

// https://openweathermap.org/weather-conditions#Icon-list
function SummaryCard({ day, isFahrenheitMode, degreeSymbol }) {
  const day_icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

  const formattedTemp = useMemo(
    () =>
      Math.round(
        isFahrenheitMode ? convertToFahrenheit(day.main.temp) : day.main.temp
      ),
    [day.main.temp, isFahrenheitMode]
  );

  return (
    <li className="summary-items">
      <div>
        <p className="temp">
          {formattedTemp}
          {degreeSymbol}
        </p>
        <p className="weather-main">
          {day.weather[0].main}
          <img src={day_icon} alt={day.weather[0].description} />
        </p>
        <p className="description">{day.weather[0].description}</p>
        <p className="time">{moment(day.dt_txt).format("hh:mm a")}</p>
      </div>
    </li>
  );
}

export default SummaryCard;
