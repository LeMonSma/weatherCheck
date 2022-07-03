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


var currCast = function (forecast) {

    var castEl = document.querySelector('.city-cast');

    castEl.classList.remove('hide');

    var weatherIconEl = document.querySelector('#today-icon');

    var currentIcon = forecast.current.weather[0].icon;

    weatherIconEl.setAttribute('src', `http://openweathermap.org/img/wn/${currentIcon}.png`);

    weatherIconEl.setAttribute('alt', forecast.current.weather[0].main)

    displayTemp('#current-high', forecast.daily[0].temp.max);

    displayTemp('#current-low', forecast.daily[0].temp.min);

    displayTemp('#current-feels-like', forecast.current['feels_like']);

    displayTemp('#current-temp', forecast.current['temp']);

    var currentConditionEl = document.querySelector('#current-condition');

    currentConditionEl.textContent = forecast.current.weather[0].description

    currentHumidityEl.textContent = forecast.current['humidity'];

    var currentWindEl = document.querySelector('#current-wind-speed')


    currentWindEl.textContent = forecast.current['wind_speed'];

    var uviEl = document.querySelector('#current-uvi')

    var currentHumidityEl = document.querySelector('#current-humidity');

    var currentUvi = forecast.current['uvi'];

    uviEl.textContent = currentUvi;




    switch (true) {

        case (currentUvi <= 2):
            uviEl.className = 'badge badge-success';
            break;
        case (currentUvi <= 5):
            uviEl.className = 'badge badge-warning';
            break;
        case (currentUvi <= 7):
            uviEl.className = 'badge badge-danger';
    }
};


var previousCity = function (city) {

    for (var i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArray));
};


var loadPrevCities = function () {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 5) {
        cityArr.shift();
    }

    var recentCity = document.querySelector('#recent-city');
    var cityUl = document.createElement('ul');
    cityUl.className = 'list-group list-group-flush city-list';
    recentCity.appendChild(cityUl);

    for (var i = 0; i < cityArr.length; i++) {

        var cityListItem = document.createElement('button');

        cityListItem.setAttribute('type', 'button');

        cityListItem.className = 'list-group-item';

        cityListItem.setAttribute('value', cityArr[i]);

        cityListItem.textContent = cityArr[i];

        cityUl.prepend(cityListItem);
    }


    var cityList = document.querySelector('.city-list');

    cityList.addEventListener('click', selectRecentCities)
};

var selectCities = function (event) {
    var clickedCity = event.target.getAttribute('value');

    apiCoordinates(clickedCity);

};



searchBtnEl.addEventListener('click', formSubmitHandler);

cityInputEl.addEventListener('keyup', function (event) {

    if (event.keyCode === 13) {

        cityBtn.click();
    }
});