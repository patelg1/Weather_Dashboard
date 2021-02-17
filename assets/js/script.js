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
            
            $("#current-city").empty();
            // Information getting from api
            var searchedCity = $("<h3>").text(response.name);
            var displayDate = searchedCity.append(" " + currentDate);
            var temperature = $("<p>").addClass("the-temperature").text("Temperature: " + response.main.temp + " F");
            var humidity = $("<p>").addClass("the-humidity").text("Humidity: " + response.main.humidity + " %");
            var windSpeed = $("<p>").addClass("the-windspeed").text("Wind Speed: " + response.wind.speed + " MPH");
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
            for (var i = 4; i < response.list.length; i+=8){

                var colDiv = $("<div>").addClass("col");
                var card = $("<div>").addClass("forecastCard, bg-primary");

                var day = $("<h4>").text(new Date(response.list[i].dt_txt).toLocaleDateString()).addClass("text-white");
                var maxTemp = $("<p>").text("Temp: " + response.list[i].main.temp_max + " F").addClass("text-white");
                var humid = $("<p>").text("Humidity: " + response.list[i].main.humidity + " %").addClass("text-white");
                var forecastIcon = $("<img>").addClass("forecast-image").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                card.append(day, forecastIcon, maxTemp, humid);
                colDiv.append(card);
                $("#fiveday").append(colDiv);
                
            }
            
        })
    }
    // on click function to search for city entered in search bar 
    $("#search-button").on("click", function(event){
        event.preventDefault();
        var cityName = $("#city-search").val();
        searchCity(cityName)
    })

    $("#clear-history").on("click", function(){
        $(".list-group").empty();
        localStorage.clear();

    })

    function searchCity(cityName) {
        storedCity.push(cityName);

        let uniqueCities = storedCity.filter((c, index) => {
            return storedCity.indexOf(c) === index;
        });

        

        generateCityButtons(uniqueCities);

        var cityArray = JSON.stringify(uniqueCities);
        localStorage.setItem("searchedCity", cityArray);

        
        getCityWeather(cityName);
    }

    function generateCityButtons(uniqueCities) {
        $(".list-group").empty()
        uniqueCities.forEach(city => {
            var listItemCity = $("<button>").text(city).addClass("bg-white, m-1");
            
            listItemCity.on('click', () => {
                searchCity(city)
            })

             $(".list-group").append(listItemCity);
        });

    }

     generateCityButtons(storedCity)

})