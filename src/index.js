import "./style.css";
var moment = require("moment");

const unknownCityAlert = document.querySelector(".unknown-city");
const cityName = document.querySelector(".forecast-city");
const celciusBtn = document.querySelector(".celcius-btn");
const fhtBtn = document.querySelector(".fht-btn");
const locationForm = document.getElementById("locationForm");
const closeAlert = document.querySelector(".alert-close-btn");
const cityTemp = document.querySelector(".main-temp");
const feelsLike = document.querySelector(".feels-like");
const maxTemp = document.querySelector(".max-temp");
const minTemp = document.querySelector(".min-temp");

const getWeather = async (location) => {
  unknownCityAlert.classList.add("hidden");

  try {
    const data = await getData(location);

    console.log(data);
    return {
      city: data.name,
      current_datetime: moment()
        .utcOffset(data.timezone / 60)
        .format("ddd, h:mm A"),
      weather_desc: data.weather[0].description,
      weather_icon: data.weather[0].icon,
      temp: data.main.temp,
      temp_max: data.main.temp_max,
      temp_min: data.main.temp_min,
      feels_like: data.main.feels_like,
    };
  } catch (error) {
    unknownCityAlert.classList.remove("hidden");
    throw new Error(e);
  }
};

const getData = async (location) => {
  let response;

  try {
    response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=7b30dc7029bf55d47084cfa5e69b15e8`, { mode: "cors" });
  } catch (e) {
    throw new Error(e);
  }

  if (response.status === 200) {
    try {
      const responseJson = await response.json();
      return responseJson;
    } catch (e) {
      throw new Error(e);
    }
  } else {
    throw new Error(e);
  }
};

const tempInCelcius = (kelvin) => {
  return kelvin - 273.15;
};

const tempInFarenheit = (kelvin) => {
  return (tempInCelcius(kelvin) * 9) / 5 + 32;
};

const roundOffTemp = (tempInt) => {
  return Math.round(tempInt);
};

const switchTemp = ([avgT, feelT, maxT, minT], unit) => {
  if (unit == "fht") {
    cityTemp.textContent = `${roundOffTemp(tempInFarenheit(avgT))}°F`;
    feelsLike.textContent = `${roundOffTemp(tempInFarenheit(feelT))}°F`;
    maxTemp.textContent = `${roundOffTemp(tempInFarenheit(maxT))}°F`;
    minTemp.textContent = `${roundOffTemp(tempInFarenheit(minT))}°F`;
  } else {
    cityTemp.textContent = `${roundOffTemp(tempInCelcius(avgT))}°C`;
    feelsLike.textContent = `${roundOffTemp(tempInCelcius(feelT))}°C`;
    maxTemp.textContent = `${roundOffTemp(tempInCelcius(maxT))}°C`;
    minTemp.textContent = `${roundOffTemp(tempInCelcius(minT))}°C`;
  }
};

const weatherInDOM = (unit, location = null) => {
  let locationInput = location ? location : document.getElementById("location").value;

  getWeather(locationInput).then(
    (r) => {
      const weatherImg = document.querySelector(".weather-icon");
      const byline = document.querySelector(".forecast-byline");

      cityName.textContent = r.city;
      weatherImg.src = "http://openweathermap.org/img/wn/" + r.weather_icon + "@4x.png";
      byline.textContent = `${r.current_datetime}, ${r.weather_desc}`;
      switchTemp([r.temp, r.feels_like, r.temp_max, r.temp_min], unit);
    },
    (reason) => {
      console.log(reason);
    }
  );
};

locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let unit = celciusBtn.classList.contains("opacity-50") ? "fht" : "cel";
  weatherInDOM(unit);
});

closeAlert.addEventListener("click", (e) => {
  unknownCityAlert.classList.add("hidden");
});

celciusBtn.addEventListener("click", () => {
  celciusBtn.classList.remove("opacity-50");
  fhtBtn.classList.add("opacity-50");
  weatherInDOM("cel", cityName.textContent);
});

fhtBtn.addEventListener("click", () => {
  fhtBtn.classList.remove("opacity-50");
  celciusBtn.classList.add("opacity-50");
  weatherInDOM("fht", cityName.textContent);
});
