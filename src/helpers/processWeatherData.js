// src/helpers/processWeatherData.js

export function convertKelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }
  
  export function getDominantWeatherCondition(weatherList) {
    const conditionCount = {};
    weatherList.forEach(entry => {
      const condition = entry.weather[0].main;
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });
    return Object.keys(conditionCount).reduce((a, b) => 
      conditionCount[a] > conditionCount[b] ? a : b
    );
  }
  
  export function calculateDailyAggregates(weatherList) {
    const temps = weatherList.map(entry => convertKelvinToCelsius(entry.main.temp));
    const averageTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2);
    const maxTemp = Math.max(...temps).toFixed(2);
    const minTemp = Math.min(...temps).toFixed(2);
    const dominantCondition = getDominantWeatherCondition(weatherList);
  
    return {
      averageTemp,
      maxTemp,
      minTemp,
      dominantCondition,
    };
  }
  