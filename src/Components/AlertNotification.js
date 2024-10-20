// src/Components/AlertNotification.js

import React from 'react';
import '../css/AlertNotification.css';

function AlertNotification({ alert }) {
  const { city, message, time } = alert;

  return (
    <div className="alert-notification">
      <p><strong>Alert for {city}:</strong> {message}</p>
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
}

export default AlertNotification;
