// src/App.js

import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RiCelsiusFill, RiFahrenheitFill } from "react-icons/ri";
import { TbMapSearch, TbMoon, TbSun, TbSearch } from "react-icons/tb";
import "./App.css";

import DetailsCard from "./Components/DetailsCard";
import SummaryCard from "./Components/SummaryCard";
import RealTimeWeather from "./Components/RealTimeWeather";
import Settings from "./Components/Settings";
import TrackedCitiesList from "./Components/TrackedCitiesList";

import Animation from "./Components/Animation";
import BackgroundColor from "./Components/BackgroundColor";

import axios from "axios";

import NotFound from "./asset/not-found.svg";
import SearchPlace from "./asset/search.svg";

import { fetchNearbyCities } from "./helpers/fetchNearbyCities";

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const { t } = useTranslation();
  
  const [noData, setNoData] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(`https://openweathermap.org/img/wn/10n@2x.png`);
  const [currentLanguage, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [loading, setLoading] = useState(false);
  const [backgroundSoundEnabled, setBackgroundSoundEnabled] = useState(true);
  const [isFahrenheitMode, setIsFahrenheitMode] = useState(false);
  const degreeSymbol = useMemo(() => (isFahrenheitMode ? "\u00b0F" : "\u00b0C"), [isFahrenheitMode]);
  const [active, setActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // **Define dailySummaries state**
  const [dailySummaries, setDailySummaries] = useState({});

  // Initialize tracked cities with empty array or from localStorage
  const [trackedCities, setTrackedCities] = useState(() => {
    const savedCities = localStorage.getItem("trackedCities");
    return savedCities ? JSON.parse(savedCities) : [];
  });

  // Handle dark mode
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  // Set theme based on device preference
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDark(true);
    }

    const darkModeListener = (event) => {
      setIsDark(event.matches);
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkModeListener);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", darkModeListener);
    };
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => !prev);
  };

  const activate = () => {
    setActive(true);
  };

  const toggleFahrenheit = () => {
    setIsFahrenheitMode(!isFahrenheitMode);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm) { // Removed the !weatherData.main condition
      getWeather(searchTerm);
    }
  };

  const getWeather = async (location) => {
    setLoading(true);
    setWeatherData({});
    setNoData("");

    const url = "https://api.openweathermap.org/data/2.5/weather?q=";
    try {
      let res = await fetch(
        `${url}${location}&appid=${API_KEY}&units=metric`
      );
      let data = await res.json();
      if (data.cod !== 200) {
        setNoData("Location Not Found");
        setCity("Unknown Location");
        setLoading(false);
        return;
      }
      setWeatherData(data);
      setCity(`${data.name}, ${data.sys.country}`);
      setWeatherIcon(
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
      );

      // Fetch nearby cities
      const nearby = await fetchNearbyCities(data.coord.lat, data.coord.lon, 5);
      setTrackedCities(nearby.map(city => city.name));
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setNoData("Error fetching data");
    }
  };

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeatherByCoords(latitude, longitude);
  };

  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setWeatherData({});
    setNoData("");

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod !== 200) {
        setNoData("Location Not Found");
        setCity("Unknown Location");
        setLoading(false);
        return;
      }
      setWeatherData(data);
      setCity(`${data.name}, ${data.sys.country}`);
      setWeatherIcon(
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
      );

      // Fetch nearby cities
      const nearby = await fetchNearbyCities(data.coord.lat, data.coord.lon, 5);
      setTrackedCities(nearby.map(city => city.name));
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setNoData("Error fetching data");
    }
  };

  // Autocomplete search
  const [countries, setCountries] = useState([]);
  const [countryMatch, setCountryMatch] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        let arr = [];
        response.data.forEach((element) => {
          arr.push(element.name.official);
        });
        setCountries(arr);
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };

    loadCountries();
  }, []);

  const searchCountries = (input) => {
    setSearchTerm(input);

    if (!input) {
      setCountryMatch([]);
    } else {
      let matches = countries.filter((country) => {
        const regex = new RegExp(`${input}`, "gi");
        return country.match(regex);
      });
      setCountryMatch(matches);
    }
  };

  // Load current location weather on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(myIP);
  }, []);

  // **Define removeTrackedCity function**
  const removeTrackedCity = (cityToRemove) => {
    setTrackedCities((prevCities) => prevCities.filter(city => city !== cityToRemove));
    
    // Optionally, remove from weatherData and dailySummaries
    setWeatherData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[cityToRemove];
      return updatedData;
    });

    setDailySummaries((prevSummaries) => {
      const updatedSummaries = { ...prevSummaries };
      delete updatedSummaries[cityToRemove];
      return updatedSummaries;
    });
  };

  return (
    <div className="container">
      <div
        className="blur"
        style={{
          background: `${
            weatherData && weatherData.weather ? BackgroundColor(weatherData) : "#a6ddf0"
          }`,
          top: "-10%",
          right: "0",
        }}
      ></div>
      <div
        className="blur"
        style={{
          background: `${
            weatherData && weatherData.weather ? BackgroundColor(weatherData) : "#a6ddf0"
          }`,
          top: "36%",
          left: "-6rem",
        }}
      ></div>

      <div className="content">
        <div className="form-container">
          <div className="name">
            <Animation />
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={isDark}
                onChange={toggleDark}
              />
              <label htmlFor="checkbox" className="label">
                <TbMoon style={{ color: "#a6ddf0" }} />
                <TbSun style={{ color: "#f5c32c" }} />
                <div className="ball" />
              </label>
            </div>
            <div className="city">
              <TbMapSearch />
              <span>{city}</span>
            </div>
          </div>

          <div className="search">
            <h2
              style={{
                marginRight:
                  currentLanguage === "es" || currentLanguage === "fr"
                    ? "10px"
                    : "0px",
                color: `${isDark ? "#fff" : "#333"}`,
              }}
            >
              {t("weatherExplorer") || "Weather Explorer"}
            </h2>

            <hr
              style={{
                borderBottom: `${
                  isDark ? "3px solid #fff" : "3px solid #333"
                }`,
              }}
            />

            <form className="search-bar" noValidate onSubmit={submitHandler}>
              <input
                onClick={activate}
                placeholder={active ? "" : "Explore cities weather"}
                onChange={(e) => searchCountries(e.target.value)}
                value={searchTerm}
                required
                className="input_search"
              />

              <button className="s-icon" type="submit">
                <TbSearch />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {countryMatch.length > 0 && (
              <ul className="list-dropdown">
                {countryMatch.slice(0, 10).map((country, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      if (!weatherData.name || weatherData.name !== country) {
                        setSearchTerm(country);
                        setCountryMatch([]);
                        getWeather(country);
                      }
                    }}
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="info-container">
          <div className="info-inner-container">
            <div className="toggle-container">
              <input
                type="checkbox"
                className="checkbox"
                id="fahrenheit-checkbox"
                checked={isFahrenheitMode}
                onChange={toggleFahrenheit}
              />
              <label htmlFor="fahrenheit-checkbox" className="label">
                <RiFahrenheitFill />
                <RiCelsiusFill />
                <div className="ball" />
              </label>
            </div>
          </div>
          {loading ? (
            <div className="loader"></div>
          ) : (
            <span>
              {Object.keys(weatherData).length === 0 ? (
                <div className="nodata">
                  {noData === "Location Not Found" ? (
                    <>
                      <img
                        src={NotFound}
                        alt="An astronaut lost in space"
                      />
                      <p>Oh oh! We're lost in space finding that place.</p>
                    </>
                  ) : (
                    <>
                      <img
                        src={SearchPlace}
                        alt="Searching for location"
                      />
                      <p style={{ padding: "20px" }}>
                        Don't worry, if you don't know what to search for, try:
                        India or maybe USA.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <DetailsCard
                    weather_icon={weatherIcon}
                    data={weatherData}
                    soundEnabled={backgroundSoundEnabled}
                    isFahrenheitMode={isFahrenheitMode}
                    degreeSymbol={degreeSymbol}
                  />
                  <h1 className="title centerTextOnMobile">
                    {/* Optionally, add a title for real-time data */}
                  </h1>
                  <ul className="summary">
                    {weatherData.list && weatherData.list.map((days, index) => (
                      <SummaryCard
                        key={index}
                        day={days}
                        isFahrenheitMode={isFahrenheitMode}
                        degreeSymbol={degreeSymbol}
                      />
                    ))}
                  </ul>
                  {/* Add Real-Time Weather Component */}
                  <RealTimeWeather trackedCities={trackedCities} />
                  {/* Add Tracked Cities List */}
                  {trackedCities.length > 0 && (
                    <TrackedCitiesList
                      trackedCities={trackedCities}
                      removeCity={removeTrackedCity} // Ensure this prop is passed
                    />
                  )}
                  {/* Add Settings Component (Optional) */}
                  <Settings />
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
