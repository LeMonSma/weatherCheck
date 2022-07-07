const cityInputEl = document.getElementById('input-city')

const searchBtn = document.getElementById('search-btn')

const todayWeatherEl = document.getElementById('todays-weather')

const fiveDayCast = document.getElementById('five-day-forecast')

const secondDayEl = document.getElementById('day-2')

const thirdDayEl = document.getElementById('day-3')

const fourthDayEl = document.getElementById('day-4')

const fifthDayEl = document.getElementById('day-5')

const sixthDayEl = document.getElementById('day-6')

const fiveDayArr = [secondDayEl, thirdDayEl, fourthDayEl, fifthDayEl, sixthDayEl]

const pastSearchEl = document.getElementById('past-search')



const apiKey = '31dd8ecf1a0dcb41282f861b271a2f77'

function apiCity(e) {
    e.preventDefault()

    const city = cityInputEl

    const cityEl = document.createElement('h2')

    cityEl.textContent = city

    cityEl.id = ('city')

    todayWeatherEl.append(cityEl)

    recentSearch = document.createElement('button')

    recentSearch.textContent = city
    recentSearch.id = city

    recentSearch.id = 'results'

    pastSearchEl.append(recentSearch)

    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => apiWeather(data))
}

function apiWeather(data) {

    const lat = data[0].lat

    const long = data[0].lon

    const apiUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`

    fetch(apiUrl2)
        .then(res => res.json())
        .then(data => weatherData(data))
}

function weatherData(data) {


    const temp = data.current.temp

    const wind = data.current.wind_speed

    const humidity = data.current.humidity

    const currentWeatherEl = document.createElement('div')

    const weatherTempEl = document.createElement('p')

    weatherTempEl.textContent = 'Temperature' + temp
    currentWeatherEl.appendChild(weatherTempEl)

    const weatherWindEl = document.createElement('p')

    weatherWindEl.textContent = 'Wind Speed' + wind
    currentWeatherEl.appendChild(weatherWindEl)

    const weatherHumidEl = document.createElement('p')

    weatherHumidEl.textContent = 'Humidity' + humidity
    currentWeatherEl.appendChild(weatherHumidEl)

    for (i = 0; i < 5; i++) {

        const currentDiv = fiveDayArr[i]

        var tempDaily = data.daily[i + 1].temp.day
        var windDaily = data.daily[i + 1].wind_speed
        var humidityDaily = data.daily[i + 1].humidity


        var tempDailyP = document.createElement("p")
        tempDailyP.textContent = "Temp: " + tempDaily + " F"
        currentDiv.append(tempDailyP)

        var windDailyP = document.createElement("p")
        windDailyP.textContent = "Wind: " + windDaily + " MPH"
        currentDiv.append(windDailyP)

        var humidityDailyP = document.createElement("p")
        humidityDailyP.textContent = "Humidity: " + humidityDaily + "%"
        currentDiv.append(humidityDailyP)
    }
}

searchBtn.addEventListener('click', apiCity)



