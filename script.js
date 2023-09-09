const body = document.querySelector("body");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const cityName = document.querySelector(".input-city");

// console.log(cityName.innerText);

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        showWeatherData(data);
      });
  });
}

// function changeBg(url) {
//   document.body.style.background = `url(${url})`;
//   // console.log(url)
// }

function fetchWeatherDetails(lat, long) {}

function handleSubmit() {
  let data = cityName.value;
  // console.log(data)
  let city = cityName.value;
  cityName.value = "";
  try {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${data}&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        fetchWeatherDetails(data);
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
        )
          .then((res) => res.json())
          .then((data) => {
            // console.log(data);
            showWeatherData(data);
            timezone.innerHTML = city;
          });
      });
  } catch (e) {
    console.log(e);
  }
}

function showWeatherData(data) {
  let { humidity, temp, sunrise, sunset, feels_like } = data.current;

  // console.log(timeEl.innerText)
  // if(timeEl.innerText> ){changeBg('./Image/night.jpg')}
  // if(data.current.weather[0].main==='Rain'){changeBg('./Image/rainy.jpg')}
  //if(data.current.weather[0].main==='Cloud' || data.current.weather[0].main==='Haze'){changeBg('./Image/cloudy.jpg')}
  //if(data.current.[0].main==='Rain'){changeBg('./Image/rainy.jpg')}
  //if(data.current.weather[0].main==='Rain'){changeBg('./Image/rainy.jpg')}

  // if(data.lat==25.2988){
  //   // changeBg('C:\Projects\weather-website\Image\rainy.jpg')
  //   alert('called')
  // }

  // timezone.innerHTML = cityName.value;
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
        <div>Temperature</div>
        <div>${temp}</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>feels_like</div>
        <div>${feels_like}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    
    
    `;

  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}
