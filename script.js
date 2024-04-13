const wrapper = document.querySelector('.wrapper'),
  inputPart = document.querySelector('.input-part'),
  infoTxt = inputPart.querySelector('.info-txt'),
  inputField = inputPart.querySelector('input'),
  locationBtn = inputPart.querySelector('button'),
  weatherPart = wrapper.querySelector('.weather-part'),
  wIcon = weatherPart.querySelector('img'),
  arrowBack = wrapper.querySelector('header i')

let api

inputField.addEventListener('keyup', e => {
  if (e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value)
  }
})

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  } else {
    alert('Your browser not support geolocation api')
  }
})

function requestApi (city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units-metric&appid=ee62aa67b88a06d0cee81a624d3d0122`
  fetchData()
}

function onSuccess (postition) {
  const { latitude, longitude } = postition.coords
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ee62aa67b88a06d0cee81a624d3d0122`
  fetchData()
}

function onError (error) {
  infoTxt.innerText = error.message
  infoTxt.classList.add('error')
}

function fetchData () {
  infoTxt.innerText = 'Getting weather details...'
  infoTxt.classList.add('pending')
  fetch(api)
    .then(res => res.json())
    .then(result => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = 'something went wrong'
      infoTxt.classList.replace('pending', 'error')
    })
}

function weatherDetails (info) {
  if (info.cod == '404') {
    infoTxt.classList.replace('pending', 'error')
    infoTxt.innerText = `${inputField.value} isn't a valid city name`
  } else {
    const city = info.name
    const country = info.sys.country
    const { description, id } = info.weather[0]
    const { temp, feels_like, humidity } = info.main

    if (id == 800) {
      wIcon.src = 'assets/clear.png' // Clear sky
    } else if (id >= 200 && id <= 232) {
      wIcon.src = 'assets/thunderstorm.png' // Thunderstorm
    } else if (id >= 300 && id <= 321) {
      wIcon.src = 'assets/drizzle.png' // Drizzle
    } else if (id >= 500 && id <= 504) {
      wIcon.src = 'assets/rain.png' // Rain
    } else if (id == 511 || (id >= 520 && id <= 531)) {
      wIcon.src = 'assets/rain snow.png' // Rain or Snow
    } else if (id >= 600 && id <= 622) {
      wIcon.src = 'assets/snow.png' // Snow
    } else if (id == 701 || id == 741) {
      wIcon.src = 'assets/mist.png' // Mist or Fog
    } else if (id == 711) {
      wIcon.src = 'assets/smoke-haze.png' // Smoke
    } else if (id == 721) {
      wIcon.src = 'assets/smoke-haze.png' // Haze
    } else if (id == 731 || id == 751 || id == 761 || id == 762) {
      wIcon.src = 'assets/squall-dust.png' // Dust or Sand
    } else if (id == 771) {
      wIcon.src = 'assets/squall-dust.png' // Squall
    } else if (id == 781) {
      wIcon.src = 'assets/tornado.png' // Tornado
    } else if (id == 801 || id == 802) {
      wIcon.src = 'assets/few clouds.png' // Few clouds
    } else if (id == 803) {
      wIcon.src = 'assets/broken or scattered clouds.png' // Scattered clouds
    } else if (id == 804) {
      wIcon.src = 'assets/broken or scattered clouds.png' // Broken clouds
    } else {
      wIcon.src = 'assets/unknown weather.png' // Default or unknown weather
    }

    weatherPart.querySelector('.temp .numb').innerText = Math.round(
      Math.floor(temp) - 273.15
    )
    weatherPart.querySelector('.weather').innerText = description
    weatherPart.querySelector(
      '.location span'
    ).innerText = `${city}, ${country}`
    weatherPart.querySelector('.temp .numb-2').innerText = Math.round(
      Math.floor(feels_like) - 273.15
    )
    weatherPart.querySelector('.humidity span').innerText = `${humidity}%`
    infoTxt.classList.remove('pending', 'error')
    infoTxt.innerText = ''
    inputField.value = ''
    wrapper.classList.add('active')
  }
}

arrowBack.addEventListener('click', () => {
  wrapper.classList.remove('active')
})
