/* Global Variables */
var cities = [];
var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// For accepting use city name 
var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else{
        alert("Please enter a City in the Search Bar");
    }
    saveSearch();
    pastSearch(city);
}


// Local Storage
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Getting data from the open weather API
var getCityWeather = function(city){
    var apiKey = "22350e7833a6bb1a314619299b31d571"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
  //  Clear previous content
   weatherContainerEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;

    // Creating date element in a span 
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM DD, YYYY") + ") ";
   citySearchInputEl.appendChild(currentDate);

    // Creating the image icon for weather type 
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInputEl.appendChild(weatherIcon);

  //  Creating Temperature data in a span  
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
  //  Creating Humidity data in a span 
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
   humidityEl.classList = "list-group-item"

  //  Creating Wind data in a span 
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

    // Appending Temp, Humidity and Wind data to container 
   weatherContainerEl.appendChild(temperatureEl);
   weatherContainerEl.appendChild(humidityEl);
   weatherContainerEl.appendChild(windSpeedEl);
// For use of coordinates to match the selected cities
   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
  
}


var get5Day = function(city){
    var apiKey = "22350e7833a6bb1a314619299b31d571"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-info text-light m-2";

       // Creating forecast date element 
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM DD, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       // Creating an image element 
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       // Appending element to forecast card 
       forecastEl.appendChild(weatherIcon);
       
       // Creating temperature span 
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body bg-info text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        // Appending temperature element to forecast card 
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "% humidity";

       // Appending Humidity emelent to forecast card 
       forecastEl.appendChild(forecastHumEl);
            
       // Creating temperature span 
       var forecastwindSpeedEl=document.createElement("span");
        forecastwindSpeedEl.classList = "card-body text-center";
        forecastwindSpeedEl.textContent = dailyForecast.wind.speed + " MPH";
    
       // Appending wind speed element to forecast card 
       forecastEl.appendChild(forecastwindSpeedEl);     

       // Appending forecast element to five day container 
        forecastContainerEl.appendChild(forecastEl);
    }

}


var pastSearch = function(pastSearch){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-info text-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

/* Past Search Event Listener */

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
