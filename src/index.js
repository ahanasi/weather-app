import "./style.css";

async function getWeather(location) {
  try {
    const data = await getData(location);
    return {
      city: data.name,
      temp: data.main.temp,
      temp_max: data.main.temp_max,
      temp_min: data.main.temp_min,
      feels_like: data.main.feels_like,
    };
  } catch (error) {
    console.log("Error in getWeather");
  }
}

async function getData(location) {
  let response;

  try {
    response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=7b30dc7029bf55d47084cfa5e69b15e8`,
      { mode: "cors" }
    );
  } catch (e) {
    alert("Network Error");
  }

  if (response.status === 200) {
    try {
      const responseJson = await response.json();
      return responseJson;
    } catch (e) {
      console.log("Error converting to json");
    }
  } else {
    console.log(`Error: ${response.status}`);
  }
}

getWeather("Addis Ababa");
