// object to store response, min, max and average temps
var currentWeather = {}

// stores and returns the api key for the weather api
function getWeatherApiKey() {
    var weatherApiKey = "20ce152fba104603b4cb45bef144122a";
    return weatherApiKey;
}

// retrieves and stores the latitude value for the responded weather data
function getLatitude(response) {
    var latitude = response.lat;
    return latitude;
}

// retrieves and stores the longitude value for the responded weather data
function getLongitude(response) {
    var longitude = response.lon;
    return longitude;
}

// retrieves and returns the start time from the user input
function getStartTime() {
    // to store the start time provided by the user in the UI - PLACEHOLDER value

    // DAN!! - use this function to grab the going out time of the user
    // Suggestion: place the Jquery for the going out time input here, grab the going out time input value and put it into the startTime variable below
    // Need to turn the going out input value into a valid moment.js value
    // Will need to include the date as well as the time

    // NEED TO MAKE SURE USER ONLY PUTS IN FUTURE TIME

    // START TIME HAS TO BE BEFORE FINISH TIME

    var startTime = moment("2020-09-20 14:00");
    return startTime;
}

// retrieves and returns the end time from the user input
function getFinishTime() {
    // to store the finish time provided by the user in the UI - PLACEHOLDER value

    // DAN!! - use this function to grab the coming home time of the user
    // Suggestion: place the Jquery for the coming home time input here, grab the coming home time input value and put it into the finishTime variable below
    // Need to turn the coming home input value into a valid moment.js value
    // Will need to include the date as well as the time

    // NEED TO PLACE LIMIT ON USER INPUT TO LESS THAN 48 HOURS!!

    var finishTime = moment("2020-09-20 20:00");
    return finishTime;
}

// retrieves the temperature for the time of the day
function hourlyTempCheck(response) {
    var temperature = response.temp;
    console.log(`Temperature: ${temperature}`);
}

// checks the uv for the time of the day
function hourlyUvCheck(response) {
    var uvIndex = response.uv;
    var uvThreshold = 2;

    if (uvIndex >= uvThreshold) {
        // display uv message - this is where functions can got to display to the user what to wear - PLACEHOLDER
        console.log(`UV Index: ${uvIndex}`);
        console.log("You will need sunprotection today, wear a hat or apply sunscreen regularly");
    } else {
        // else because we don't want to give false info, this is a disclaimer
        console.log("UV is low but it is still advised to protect yourself from UV");
    }
}

// checks the precipitation for the time of the day
function hourlyRainCheck(response) {
    var precip = response.precip;
    var precipThreshold = 5;

    if (precip > precipThreshold) {
        // display to the user what to wear - this is where functions can go to display info to the user - PLACEHOLDER
        console.log(`Precipitation: ${precip}mm`);
        console.log("You will need a waterproof or an umbrella");
    }
}

// checks the wind speed for the given time of day
function hourlyWindCheck(response) {
    var windSpeed = response.wind_spd;
    var windSpeedThreshold = 10;

    if (windSpeed > windSpeedThreshold) {
        // display to the user what to wear - this is where functions can go to update the display - PLACEHOLDER
        console.log(`Wind Speed: ${windSpeed}km/h`);
        console.log("You will need wind protection");
    }
}

// retrieves and stores the url for the weather icon for the time of the day
function hourlyDisplayIcon(response) {
    var iconCode = response.weather.icon;
    var iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`
    console.log(`Icon: ${iconUrl}`);
}

// finds the minimum temperature in an array of temps provided by the api
function findMinTemp(temps) {
    var minTemp = temps[0];
    temps.forEach(function(temp) {

        if (minTemp > temp) {
            minTemp = temp;
        }
    });
    console.log(`Min Temp: ${minTemp}`);
    return minTemp;
}

// finds the maximum temperature in an array of temps provided by the api
function findMaxTemp(temps) {
    var maxTemp = temps[0];
    temps.forEach(function(temp) {

        if (maxTemp < temp) {
            maxTemp = temp;
        }
    });
    console.log(`Max Temp: ${maxTemp}`);
    return maxTemp;
}

// finds the average temperature in an array of temperatures provided by the weather api
function findAverageTemp(temps) {
    var avgTemp = 0;
    var sum = 0;
    temps.forEach(function(temp) {
        sum += temp;
    });
    avgTemp = sum / temps.length;
    console.log(`Avg Temp: ${avgTemp.toFixed(2)}`);
    return avgTemp;
}

// processes the weather data retrieved from the weather api
function processHourlyWeatherData(response) {

    // stores response object in currentWeather object
    console.log(response);
    currentWeather.response = response;

    // store, retrieve in currentWeather object and console log the location and country
    currentWeather.cityName = response.city_name;
    currentWeather.countryCode = response.country_code

    console.log(`Location: ${currentWeather.cityName}`);
    console.log(`Country: ${currentWeather.countryCode}`);

    // retrieve and store the latitude and longitude of the responded weather data
    // to be used for zomato api
    currentWeather.latitude = getLatitude(response);
    currentWeather.longitude = getLongitude(response);

    console.log(`Latitude: ${currentWeather.latitude}`);
    console.log(`Longitude: ${currentWeather.longitude}`);

    // grab the start and finish times from the user input
    currentWeather.startTime = getStartTime();
    currentWeather.finishTime = getFinishTime();

    console.log(`Start Time: ${currentWeather.startTime}`);
    console.log(`Finish Time: ${currentWeather.finishTime}`);

    // array to store the temps for every hour
    currentWeather.temps = [];

    // go through every hour for the next 48 hours and display the data in the console
    response.data.forEach(function(dataObject) {

        // retrieve and store 
        var time = moment(dataObject.timestamp_local);

        // if data index is after start time and before finish time then display data
        if (moment(time).isSame(moment(currentWeather.startTime)) ||
            moment(time).isAfter(moment(currentWeather.startTime)) && moment(time).isBefore(moment(currentWeather.finishTime)) ||
            moment(time).isSame(moment(currentWeather.finishTime))) {

            console.log(`------------------------------`);
            console.log(`Time: ${moment(dataObject.timestamp_local).format("MMM Do, k:mm")}`);
            console.log(`Weather Description: ${dataObject.weather.description}`);
            hourlyTempCheck(dataObject);
            currentWeather.temps.push(dataObject.temp);
            hourlyUvCheck(dataObject);
            hourlyRainCheck(dataObject);
            hourlyWindCheck(dataObject);
            hourlyDisplayIcon(dataObject);
            console.log(`------------------------------`);
        }
    });

    findAverageTemp(currentWeather.temps);
    renderChosenWears();
}

// creates a url friendly location using the users inputs to be added to the query URL
function createLocation(cityInput, countryInput) {
    var location = "";

    if (cityInput != "" && countryInput === "") {
        location += cityInput;
    } else if (cityInput != "" && countryInput != "") {
        location = `${cityInput},${countryInput}`;
    }
    return location;
}

// creates the url to retrieve weather data from the weather api
// location input will be provided by user
function createHourlyWeatherUrl(cityInput, countryInput) {
    var location = createLocation(cityInput, countryInput);
    var apiKey = getWeatherApiKey();
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/hourly";
    var queryUrl = baseUrl +
        "?key=" + apiKey +
        "&city=" + location;
    return queryUrl;
}

// returns location with lower case letters and replaces all whitespaces with url friendly %20
function makeUrlFriendly(location) {
    return location.toLowerCase().replace(/\s/g, "%20");
}

// placeholder function to retrieve the country input from the user - PLACEHOLDER
function getCountryInput() {

    // DAN!! - Here's a function to take the country from the user
    // Suggestion: place the Jquery for the country input here and grab the country input value and put it into the country variable below

    // placeholder variable -- here is where to retrieve the user input data for country from the UI - PLACEHOLDER
    var country = $("#country").val();
    var countryFriendlyUrl = makeUrlFriendly(country);
    return countryFriendlyUrl;
}

// placeholder function to retrieve the city input from the user - PLACEHOLDER
function getCityInput() {

    // DAN!! - Here's the function to take the city from the user input
    // Suggestion: place the Jquery for the location input here and grab the city input value and put it into the city variable below

    // placeholder value -- here is where to retrieve the user input data for city from the UI - PLACEHOLDER
    var city = $("#location").val();
    var cityFriendlyUrl = makeUrlFriendly(city);
    return cityFriendlyUrl;
}

// calls the weather api for the hourly weather
function callWeatherApi() {
    var cityInput = getCityInput();

    // if the city input is empty then don't make the weather api call
    if (cityInput != "") {
        var countryInput = getCountryInput();
        var queryUrl = createHourlyWeatherUrl(cityInput, countryInput);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).
        then(processHourlyWeatherData).
        catch(function(error) {
            console.log("Catch error: " + error.message);
        });
    } else {
        // display error message if city is not inputted
        $("#modal-message").text("city is empty");
        $("#modal").show();
    }

}

//the oject for clothing suggestions
var wears = {
    //the base layer will add [1,2,3,4,5] °C to the body heat  
    baseLayer: ["t-shirt", "long-sleeve t-shirt", "flannel shirt", "sweatshirt", "sweater"],
    //the outer later will add [9,10,11] °C to the body heat 
    outerLayer: ["short-jacket", "coat", "down-jacket"]
}

// array of suggested clothing based on temprature
var chosenWears = [];

// thi is the optimal temprature trying to achive at 26°C
var i = 26

// function to append suggested clothing into chosenWears array
function renderChosenWears() {

    // find and store the min and max temps of the currentWeather object
    var minTemp = findMinTemp(currentWeather.temps);
    var maxTemp = findMaxTemp(currentWeather.temps);

    //if the min temp is higher than the optimal temprature, it will suggest basic clothing
    if (minTemp >= i) {
        chosenWears.push(wears.baseLayer[0]);
        //if the min temp is lower then 5°C, it will give the maximum clothing suggestion  
    } else if (minTemp <= 5) {
        chosenWears.push(wears.outerLayer[2]);
        chosenWears.push(wears.baseLayer[1], wears.baseLayer[2], wears.baseLayer[4]);
        //if the min temp is in between 5-26°C:  
    } else {

        //if the maxtemp is higher then the optimal temprature, it will set maxtemp as the optimal at 26°C
        if (maxTemp >= i) {
            maxTemp = i;
        }

        //if the difference between max and min temp is greater than 11°C, it will append down-jacket to suggestion
        if ((maxTemp - minTemp) >= 11) {
            chosenWears.push(wears.outerLayer[2]);
            //if the difference between max and min temp is equal to  10°C, it will append coat to suggestion  
        } else if ((maxTemp - minTemp) === 10) {
            chosenWears.push(wears.outerLayer[1]);
            //if the difference between max and min temp is equal to  9°C, it will append short-jacket to suggestion 
        } else if ((maxTemp - minTemp) === 9) {
            chosenWears.push(wears.outerLayer[0]);
            //if the difference between max and min temp is less than 9°C, it will discard the difference, at calculate based on min temp only   
        } else if ((maxTemp - minTemp) < 9) {
            maxTemp = minTemp;
        }

        //if the temprature is greater then 16°C, it will itterate through the base layer to append suggestions
        if (maxTemp >= 16) {
            i = i - maxTemp;
            for (let k = wears.baseLayer.length - 1; k >= 0; k--) {
                if (i >= (k + 1)) {
                    i = i - (k + 1);
                    chosenWears.push(wears.baseLayer[k]);
                }
            }
            //if the temparture is less then 16°C  , it will itterate through the outer layer for 1 itme ,and then through base layer to append suggestions
        } else if (maxTemp < 16) {
            i = i - maxTemp;
            for (let u = wears.outerLayer.length - 1; u >= 0; u--) {
                if (i >= (u + 9)) {
                    i = i - (u + 9);
                    chosenWears.push(wears.outerLayer[u]);
                    break;
                }
            }

            for (let k = wears.baseLayer.length - 1; k >= 0; k--) {
                if (i >= (k + 1)) {
                    i = i - (k + 1);
                    chosenWears.push(wears.baseLayer[k]);
                }
            }
        }
    }
    console.log(chosenWears);
}

function closeModal() {
    $("#modal").hide();
}

// activates the call to the weather api
$("#confirmBtn").on("click", callWeatherApi);
$("#close-modal").on("click", closeModal);