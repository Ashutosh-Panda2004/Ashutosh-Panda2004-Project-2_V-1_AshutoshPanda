// src/Components/TrackedCitiesList.js

import React from 'react';
import '../css/TrackedCitiesList.css';
import { AiOutlineClose } from 'react-icons/ai';

function TrackedCitiesList({ trackedCities, removeCity }) {
  return (
    <div className="tracked-cities">
      <h3>Tracked Nearby Cities</h3>
      <ul>
        {trackedCities.map((city, index) => (
          <li key={index}>
            {city}
            <AiOutlineClose
              className="remove-icon"
              onClick={() => removeCity(city)}
              title={`Remove ${city}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackedCitiesList;
