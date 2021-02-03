var currentDate = dayjs().format("M/DD/YYYY");



$(document).ready(function(){
    
    function getCityWeather(cityName){
        var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=7c116c195b43008fb23ae55ea85959a7&units=imperial";
        
        
        $.ajax({
            url: queryURL,
            dataType: "json",
            method: "GET"
        }).then(function(data){
            console.log(data);
            $("#current-city").empty();
            
        })

        var searchedCity = $("<h3>").text(data.name);
        var displayDate = searchedCity.append(" " + currentDate);
        var temperature = $("<p>").addClass("the-temperature").text("Temperature: " + data.main.temp + "F");
        var humidity = $("<p>").addClass("the-humidity").text("Humidity: " + data.main.humidity + "%");
        var windSpeed = $("<p>").addClass("the-windspeed").text("Wind Speed: " + data.wind.speed + "MPH");
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        $("#current-city").append(searchedCity, displayDate, temperature, humidity, windSpeed, weatherIcon);
        

      // var uvIndex = $("<p>").addClass("the-uvIndex").text("UV Index: " + data.main.temp + "F")
        getFiveDay(cityName);
    }

    function getFiveDay(city){
        var fiveDayURL = "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=7c116c195b43008fb23ae55ea85959a7&units=imperial";


        $.ajax({
            url: fiveDayURL,
            dataType: "json",
            method: "GET"
        }).then(function(data){
            console.log(data);
            $("#fiveday").empty();

            for (var i = 0; i < data.list.length; i++){
                var day = $("<h4>").text(new Date(data.list[i].dt_txt).toLocaleDateString())
                var maxTemp = $("<p>").text("Temperature: " + data.list[i].main.temp_max + "F");
                var humid = $("<p>").text("Humidity: " + data.list[i].main.humidity + "%")

                $(".cardfive").append(day, maxTemp, humid);
                            }
            
        })
    }
     
    $("#search-button").on("click", function(event){
        event.preventDefault();

        
    })

getCityWeather();


})