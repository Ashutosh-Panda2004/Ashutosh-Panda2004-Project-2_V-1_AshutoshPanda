// src/helpers/alertManager.js

let alertThresholds = {
    temperature: 35, // Celsius
    consecutive: 2,   // Number of consecutive breaches
  };
  
  let breachCount = 0;
  
  export function setAlertThresholds(newThresholds) {
    alertThresholds = { ...alertThresholds, ...newThresholds };
  }
  
  export function checkThresholds(currentTemp, triggerAlert) {
    if (currentTemp > alertThresholds.temperature) {
      breachCount += 1;
      if (breachCount >= alertThresholds.consecutive) {
        triggerAlert(`Temperature has exceeded ${alertThresholds.temperature}°C for ${alertThresholds.consecutive} consecutive updates.`);
        breachCount = 0; // Reset after alert
      }
    } else {
      breachCount = 0; // Reset if condition not met
    }
  }
  