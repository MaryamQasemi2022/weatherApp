class Weather {
  apiKey = "971d214e870853520e98e9e0ee3b7056";
  searchBtn = document.querySelector(".serach-btn");
  inputField = document.querySelector(".search-box input");
  deviceLocationBtn = document.querySelector(".device-location-btn");
  infoText = document.querySelector(".info-text");
  weatherPart = document.querySelector(".weather-part");
  inputPart = document.querySelector(".input-part");
  backArrowIcon = document.querySelector(".bi-arrow-left");

  constructor() {
    this.searchBtn.addEventListener("click", (e) => {
      this.search(e);
    });
    this.inputField.addEventListener("keyup", (e) => {
      this.search(e);
    });
    this.backArrowIcon.addEventListener("click", this.backToInputPart);
    this.deviceLocationBtn.addEventListener("click", this.searchLocation);
  }

  search = (e) => {
    this.infoText.innerHTML = "";
    if (
      (e.type == "keyup" && e.key == "Enter" && this.inputField.value.trim()) ||
      (e.type === "click" && this.inputField.value.trim())
    ) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.inputField.value}&appid=${this.apiKey}&units=metric`;
      this.fetchWeather(url);
    } else if (
      (e.key == "Enter" && !this.inputField.value.trim()) ||
      (e.type === "click" && !this.inputField.value.trim())
    ) {
      this.infoText.innerHTML = "Error: city name is required";
    }
  };

  searchLocation = () => {
    this.infoText.innerHTML = "";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
    } else {
      console.log("geolocation is not support by this browser");
    }
  };
  onSuccess = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    this.fetchWeather(url);
  };
  onError = (error) => {
    this.infoText.innerHTML = `Error: ${error.message}`;
  };

  fetchWeather = async (url) => {
    this.infoText.innerHTML = "loading....";
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        this.displayWeather(data);
        return;
      }
      if (response.status === 404) throw new Error("404, Not found");
      if (response.status === 500) {
        throw new Error("500, internal server error");
      }
      console.log(response);
      // For any other server error
      throw new Error(response.status);
    } catch (err) {
      this.infoText.innerHTML = err;
    }
  };

  displayWeather = (data) => {
    const {
      name,
      wind: { speed },
      main: { temp, humidity },
      sys: { country },
    } = data;
    const { description, icon } = data.weather[0];
    this.weatherPart.classList.toggle("hidden");
    this.inputPart.classList.toggle("hidden");
    this.backArrowIcon.classList.toggle("hidden");

    document.querySelector(
      ".weather-part .icon img"
    ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector(".weather-part .temprature .numb").innerHTML = temp;
    document.querySelector(".weather-part .description").innerHTML =
      description;
    document.querySelector(
      ".weather-part .location span"
    ).innerHTML = `${country} , ${name}`;
    document.querySelector(".weather-part .humidity span").innerHTML = humidity;
    document.querySelector(".weather-part .wind span").innerHTML = speed;
  };

  backToInputPart = () => {
    this.weatherPart.classList.toggle("hidden");
    this.inputPart.classList.toggle("hidden");
    this.backArrowIcon.classList.toggle("hidden");
    this.infoText.innerHTML = "";
  };
}
const weather = new Weather();
