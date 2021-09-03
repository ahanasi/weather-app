import "./style.css";
var moment = require('moment');

const getWeather = async (location) => {
  try {
    const data = await getData(location);
    console.log(data);
    return {
      city: data.name,
      current_datetime: moment().utcOffset(data.timezone / 60).format("ddd, h:mm A"),
      weather_desc: data.weather[0].description,
      weather_icon: data.weather[0].icon,
      temp: data.main.temp,
      temp_max: data.main.temp_max,
      temp_min: data.main.temp_min,
      feels_like: data.main.feels_like,
    };
  } catch (error) {
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
  return Math.round(tempInt * 100.0) / 100.0;
};

const locationForm = document.getElementById("locationForm");

locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let locationInput = document.getElementById("location").value;
  getWeather(locationInput).then(
    (r) => {
      console.log(r);
      const cityName = document.querySelector(".forecast-city");
      const cityTemp = document.querySelector(".main-temp");
      const weatherImg = document.querySelector(".weather-icon");
      const weatherDesc = document.querySelector(".icon-desc");

      cityName.innerHTML = r.city;
      cityTemp.innerHTML = `${roundOffTemp(tempInCelcius(r.temp))}ºC`;
      weatherImg.src = "http://openweathermap.org/img/wn/" + r.weather_icon + "@2x.png";
      weatherImg.alt = "Weather Icon";
      weatherDesc.innerHTML = r.weather_desc;
    },
    (reason) => {
      console.log(reason);
    }
  );
});
