function weatherLoad() {
  // New variables for the HTML elements
  let inputEl = document.getElementById("city-input");
  let searchEl = document.getElementById("submitBtn");
  let clearEl = document.getElementById("clear-history");
  let nameEl = document.getElementById("city-name");
  let currentPicEl = document.getElementById("current-pic");
  let currentTempEl = document.getElementById("temperature");
  let currentHumidityEl = document.getElementById("humidity");
  let currentWindEl = document.getElementById("wind-speed");
  let currentUVEl = document.getElementById("UV-index");
  let APIKey = "a181cc15c8052f9222bf837a547a0291";

  // Function for retrieving information from Open Weather API
  function getWeather(cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    axios.get(queryURL).then(function (response) {
      let currentDate = new Date(response.data.dt * 1000);
      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();
      nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = response.data.weather[0].icon;
      currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
      currentPicEl.setAttribute("alt", response.data.weather[0].description);
      currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
      currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
      let lat = response.data.coord.lat;
      let lon = response.data.coord.lon;
      let UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey +
        "&cnt=1";
      axios.get(UVQueryURL).then(function (response) {
        let UVIndex = document.createElement("span");
        UVIndex.setAttribute("class", "badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        currentUVEl.innerHTML = "UV Index: ";
        currentUVEl.append(UVIndex);
      });

      let cityID = response.data.id;
      let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
      axios.get(forecastQueryURL).then(function (response) {
        let forecastEls = document.querySelectorAll(".forecast");
        for (i = 0; i < forecastEls.length; i++) {
          forecastEls[i].innerHTML = "";
          let forecastIndex = i * 8 + 4;
          let forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
          let forecastDay = forecastDate.getDate();
          let forecastMonth = forecastDate.getMonth() + 1;
          let forecastYear = forecastDate.getFullYear();
          let forecastDateEl = document.createElement("p");
          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEls[i].append(forecastDateEl);
          let forecastWeatherEl = document.createElement("img");
          forecastWeatherEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png"
          );
          forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
          forecastEls[i].append(forecastWeatherEl);
          let forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
          forecastEls[i].append(forecastTempEl);
          let forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
          forecastEls[i].append(forecastHumidityEl);
        }
      });
    });
  }
  // Makes button functional when clicked
  searchEl.addEventListener("click", function () {
    let searchTerm = inputEl.value;
    getWeather(searchTerm);
  });

  // Fahrenheit conversion
  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }
}
// Loads js functions and animations for entire page
weatherLoad();
