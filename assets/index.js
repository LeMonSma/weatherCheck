//Global Variables
var apiKey = "31dd8ecf1a0dcb41282f861b271a2f77";

var citySearch = [];

var cityArr = [];


var cityInputEl = document.querySelector('#input-city');

var cityNameEl = document.querySelector('#city-name');

var searchBtnEl = document.querySelector('#search-btn');




var fiveCast = function (forecast) {

    for (var i = 1; i < 6; i++) {

        var dateP = document.querySelector('#date-' + i);

        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');


        var iconImg = document.querySelector('#icon-' + i);

        var iconCode = forecast.daily[i].weather[0].icon;

        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);

        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        displayTemperatures('#high-' + i, forecast.daily[i].temp.max);

        displayTemperatures('#low-' + i, forecast.daily[i].temp.min);

        displayTemperatures('#temp-' + i, forecast.daily[i].temp.day);




        var humiditySpan = document.querySelector('#humidity-' + i);

        humiditySpan.textContent = forecast.daily[i].humidity;
    }
};


var getForcast = function (city, lat, lon) {

    var apiUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;

    fetch(apiUrl2)

        .then(function (response) {

            if (response.ok) {

                response.json().then(function (data) {

                    console.log(data);


                    cityNameEl.textContent = `${city} (${moment().format("L")})`;


                    currentForecast(data);

                    fiveDayForecast(data);
                });
            }
        })
};

var apiCordinates = function (city) {


    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;


    fetch(apiUrl)

        .then(function (response) {

            if (response.ok) {
                response.json()

                    .then(function (data) {
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        getCurrentForcast(city, lat, lon);


                        if (document.querySelector('.city-list')) {
                            document.querySelector('.city-list').remove();
                        }

                        previousCity(city);
                        loadPrevCities();
                    });


            } else {

                alert('Error: Location not found');
            }
        })

        .catch(function (error) {

            alert('Unable to connect to OpenWeatherMaps')
        })
};

var formSubmitHandler = function (event) {

    event.preventDefault();


    var selectCity = cityInputEl.value


    if (selectCity) {
        apiCoordinates(selectCity);
        cityInputEl.value = '';

    } else {
        alert('Please enter a valid city name');
    };
};

var displayTemperatures = function (element, temperature) {

    var tempEl = document.querySelector(element);

    var elementText = Math.round(temperature);

    tempEl.textContent = elementText;
};
