// src/Components/RealTimeWeather.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { calculateDailyAggregates, convertKelvinToCelsius } from '../helpers/processWeatherData';
import { checkThresholds, setAlertThresholds } from '../helpers/alertManager';
import DailySummaryCard from './DailySummaryCard';
import AlertNotification from './AlertNotification';
import Visualization from './Visualization';
import '../css/RealTimeWeather.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function RealTimeWeather({ trackedCities }) {
  const [weatherData, setWeatherData] = useState({});
  const [dailySummaries, setDailySummaries] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Set initial thresholds (can be made user-configurable)
    setAlertThresholds({ temperature: 35, consecutive: 2 });

    const fetchWeather = async () => {
      try {
        const promises = trackedCities.map(city =>
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        );
        const responses = await Promise.all(promises);
        const newWeatherData = {};
        responses.forEach((res, index) => {
          const city = trackedCities[index];
          newWeatherData[city] = res.data;
          const tempCelsius = convertKelvinToCelsius(res.data.main.temp);
          checkThresholds(tempCelsius, (alertMsg) => {
            setAlerts(prev => [...prev, { city, message: alertMsg, time: new Date() }]);
          });
        });
        setWeatherData(newWeatherData);

        // Process daily summaries
        trackedCities.forEach(city => {
          const data = newWeatherData[city];
          if (!dailySummaries[city]) {
            dailySummaries[city] = [];
          }
          dailySummaries[city].push(data);
          const today = new Date().toISOString().split('T')[0];
          const todayData = dailySummaries[city].filter(entry => {
            const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
            return entryDate === today;
          });
          const aggregates = calculateDailyAggregates(todayData);
          setDailySummaries(prev => ({
            ...prev,
            [city]: { ...aggregates, date: today },
          }));
        });

      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (trackedCities.length > 0) {
      // Initial fetch
      fetchWeather();

      // Set interval
      const interval = setInterval(fetchWeather, FETCH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [trackedCities, dailySummaries]);

  return (
    <div className="real-time-weather">
      <h2>Real-Time Weather Monitoring</h2>
      <div className="daily-summaries">
        {trackedCities.map(city => (
          <DailySummaryCard key={city} city={city} summary={dailySummaries[city]} />
        ))}
      </div>
      <Visualization weatherData={weatherData} />
      <div className="alerts">
        {alerts.map((alert, index) => (
          <AlertNotification key={index} alert={alert} />
        ))}
      </div>
    </div>
  );
}

export default RealTimeWeather;

