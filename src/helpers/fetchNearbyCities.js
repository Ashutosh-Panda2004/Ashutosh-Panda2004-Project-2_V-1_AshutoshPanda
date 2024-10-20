// src/helpers/fetchNearbyCities.js

import axios from 'axios';

/**
 * Fetches nearby cities using OpenWeatherMap's "Find" API.
 * @param {number} lat - Latitude of the main city.
 * @param {number} lon - Longitude of the main city.
 * @param {number} count - Number of nearby cities to fetch.
 * @returns {Promise<Array>} - List of nearby cities.
 */
export const fetchNearbyCities = async (lat, lon, count = 5) => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${count}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.list) {
      return response.data.list;
    }
    return [];
  } catch (error) {
    console.error('Error fetching nearby cities:', error);
    return [];
  }
};
