// Global variables for date and getting item from local storage
var currentDate = dayjs().format("M/DD/YYYY");
var storedCity = JSON.parse(localStorage.getItem("searchedCity")) || [];



$(document).ready(function(){
    // Function to get Current day weather conditions
    function getCityWeather(cityName){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=7c116c195b43008fb23ae55ea85959a7";
        
        // Ajax call to get info from openweatherapi
        $.ajax({
            url: queryURL,            
            method: "GET"
        }).then(function(response){
            console.log(response);
            $("#current-city").empty();
            // Information getting from api
            var searchedCity = $("<h3>").text(response.name);
            var displayDate = searchedCity.append(" " + currentDate);
            var temperature = $("<p>").addClass("the-temperature").text("Temperature: " + response.main.temp + "F");
            var humidity = $("<p>").addClass("the-humidity").text("Humidity: " + response.main.humidity + "%");
            var windSpeed = $("<p>").addClass("the-windspeed").text("Wind Speed: " + response.wind.speed + "MPH");
            var weatherIcon = $("<img>").addClass("weather-image").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

            $(searchedCity).append(weatherIcon);
            $("#current-city").append(searchedCity, temperature, humidity, windSpeed);
            
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?&appid=7c116c195b43008fb23ae55ea85959a7&lat=" + lat + "&lon=" + lon;
            // Ajax call to get uv index
            $.ajax({
                url: queryURL2,
                method: "GET",
            }).then(function (response) {

                var uvI = response.value;
                var uvIndex = $("<p>").addClass("uvIndex").text("UV Index: " + uvI); 
                // Conditional check for uv index low, moderate or high index
                if (uvI < 3){
                    uvIndex.addClass("lowUV");
                }else if (uvI >= 3 && uvI <= 5){
                    uvIndex.addClass("moderateUV");
                }else{
                    uvIndex.addClass("highUV");
                }
                $("#current-city").append(uvIndex);


            });      
        getFiveDay(cityName);
        })       
    }
    // Function to get five day forecast for searched city
    function getFiveDay(cityName){
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=7c116c195b43008fb23ae55ea85959a7&units=imperial";

        // Ajax call to get five day forecast
        $.ajax({
            url: fiveDayURL,
            dataType: "json",
            method: "GET"
        }).then(function(response){
            console.log(response);
            $("#fiveday").empty();
            // loop to create cards for each day
            for (var i = 1; i < response.list.length; i+=8){
                
                var card = $("<div>").addClass("forecastCard")

                var day = $("<h4>").text(new Date(response.list[i].dt_txt).toLocaleDateString())
                var maxTemp = $("<p>").text("Temperature: " + response.list[i].main.temp_max + "F");
                var humid = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%")
                card.append(day, maxTemp, humid);
                $("#fiveday").append(card);
            }
            
        })
    }
    // on click function to search for city entered in search bar 
    $("#search-button").on("click", function(event){
        event.preventDefault();
        var cityName = $("#city-search").val();
        storedCity.push(cityName);
        var cityArray = JSON.stringify(storedCity);

        localStorage.setItem("searchedCity", cityArray);
        $(".list-group").append(storedCity);

        getCityWeather(cityName);
    })




})