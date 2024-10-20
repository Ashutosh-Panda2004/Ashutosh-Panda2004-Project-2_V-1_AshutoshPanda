// src/Components/Settings.js

import React, { useState } from 'react';
import { setAlertThresholds } from '../helpers/alertManager';
import '../css/Settings.css';

function Settings() {
  const [temperature, setTemperature] = useState(35);
  const [consecutive, setConsecutive] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertThresholds({ temperature: Number(temperature), consecutive: Number(consecutive) });
    alert('Alert thresholds updated successfully!');
  };

  return (
    <div className="settings">
      <h3>Alert Settings</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Temperature Threshold (°C):</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Consecutive Breaches:</label>
          <input
            type="number"
            value={consecutive}
            onChange={(e) => setConsecutive(e.target.value)}
            required
            min="1"
          />
        </div>
        <button type="submit">Update Thresholds</button>
      </form>
    </div>
  );
}

export default Settings;
