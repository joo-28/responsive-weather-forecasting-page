const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector("#search-btn");
const currentLocationButton = document.querySelector("#current-location-btn");
const API_KEY = "1435d827841530cdb4a93da0416a356c";
const currentCardDiv = document.querySelector(".current-Weather")
const weatherCardDiv = document.querySelector(".weather-cards")
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind :${weatherItem.wind.speed}M/S</h4>
                    <h4>Humidity :${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt ="weather icon"> 
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }else{
        return ` <li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt ="weather icon">
                    <h4>Weather : ${weatherItem.weather[0].description}</h4>
                    <h6>Temperature : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind : ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity : ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}
const getWeatherDetails = ( cityName, lat, lon ) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;


    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate)
            }
        });

        cityInput.value = "";
        currentCardDiv.innerHTML = "";
        weatherCardDiv.innerHTML = "";
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }else{
                weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        })
    }).catch(() =>{
        alert("An error occurred while fetching the Weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

    fetch(GEOCODING_API_URL).then (response => response.json()).then(data => {
       if(!data.length) return alert(`No Coordinates found for ${cityName}`);
       const { name, lat, lon } = data[0];
       getWeatherDetails( name, lat, lon );
    }).catch(() =>{
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude} = position.coords;
            const REVERSE_GEOCODING_URL =`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then (response => response.json()).then(data => {
                if(!data.length) return alert(`No Coordinates found for ${cityName}`);
                const { name, lat, lon } = data[0];
                getWeatherDetails( name, latitude, longitude );
             }).catch(() =>{
                 alert("An error occurred while fetching the City!");
             });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED){
                alert(" Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
}

currentLocationButton.addEventListener("click",getUserCoordinates);
searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());