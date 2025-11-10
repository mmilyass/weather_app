import { days, months, getWeatherImage, fetchedApi } from './functions.js'

const message = document.getElementById("message-error");
const main = document.querySelector("main");
const main_img = document.getElementById("main-img");
const imgsTwo = document.querySelectorAll("#img-two");
const tempTwo = document.querySelectorAll("#temp-two");
const temp_value_one = document.querySelectorAll("#temp-value-one");
const status = document.querySelectorAll("#status");
const forcast_days = document.querySelectorAll("#temp-one");
const imgs = document.querySelectorAll("#img-one");
const forcast_temps = document.querySelectorAll("#temp-value");
const today = new Date();
let mesurement = 'C';
let windMesure = "km/h";
let data;

let check = true;

async function setMainTemp() {
    const today = new Date();
    let decimalPart;
    let temp;
    document.getElementById("CityName").textContent = data.currentData.name;
    document.getElementById("date").textContent = days[today.getDay()] + ', ' + months[today.getMonth()] + ', ' + today.getFullYear();
    if (mesurement == 'F') {
        temp = (data.currentData.main.temp * 9 / 5) + 32;
        decimalPart = "°" + Math.round(temp);
    }
    else {
        temp = data.currentData.main.temp;
        decimalPart = Math.round(temp) + "°";
    }
    document.getElementById("temp").textContent = decimalPart;
    main_img.src = getWeatherImage(data.currentData.weather[0].description);
}

// Set forecast days section
async function forcastDays(data) {
    let d = today.getDay();
    let forecast;

    for (let i = 0; i < 7; i++) {
        forcast_days[i].textContent = days[d];
        d = d === 6 ? 0 : d + 1;

        if (mesurement === 'F') {
            forecast = (data.forecastData.list[i].main.temp * 9 / 5) + 32;
            forcast_temps[i].textContent = "°" + Math.round(forecast);
        }
        else {
            forecast = data.forecastData.list[i].main.temp;
            forcast_temps[i].textContent = Math.round(forecast) + "°";
        }
        imgs[i].src = getWeatherImage(data.forecastData.list[i].weather[0].description);
    }
}

// Set weather status section
async function setStatus(data) {
    status[0].textContent = data.currentData.weather[0].description;
    status[1].textContent = data.currentData.main.humidity + "%";
    if (windMesure === "km/h")
        status[2].textContent = data.currentData.wind.speed + " Km/h";
    else
        status[2].textContent = ((data.currentData.wind.speed * 0.621370)).toString().slice(0, 4) + " mph";
    status[3].textContent = '0' + " mm";
}

// Set hourly forecast section
async function hourlyForecast(data) {
    const localtime = data.hourlyData.location.localtime;
    let hourData;
    let check = true;
    let hour = parseInt(localtime.split(" ")[1].split(":")[0]) + 1;
    const firstDayHours = data.hourlyData.forecast.forecastday;
    document.getElementById("today").textContent = days[today.getDay()];

    for (let i = 0; i < 8; i++) {
        if (hour == 24 || check == false) {
            if (check == true) {
                check = false;
                hour = 0;
            }
            hourData = firstDayHours[1].hour[hour];
        }
        else if (check == true) {
            hourData = firstDayHours[0].hour[hour];
        }
        const ampm = hour >= 12 ? ' PM' : ' AM';
        const displayHour = hour % 12 || 12;

        imgsTwo[i].classList.remove("hidden");
        imgsTwo[i].src = getWeatherImage(hourData.condition.text, hour);
        if (mesurement == 'C')
            temp_value_one[i].textContent = Math.round(hourData.temp_c) + "°";
        else
            temp_value_one[i].textContent = "°" + Math.round(hourData.temp_f);
        tempTwo[i].textContent = displayHour + ampm;
        hour++;
    }
}


document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("searchInput").value;
    if (input === "") {
        main.classList.replace("flex", "hidden");
        message.textContent = "Enter a city please!";
    }
    else {
        data = await fetchedApi(input);
        if (!data) {
            main.classList.replace("flex", "hidden");
            message.textContent = "City Not found!";
            return;
        }
        message.classList.add("hidden");
        main.classList.replace("hidden", "flex");
        console.log(data);
        await setMainTemp();
        await setStatus(data);
        await forcastDays(data);
        await hourlyForecast(data);
    }
}
)

function units(target) {
    target.stopPropagation();
    if (check == true) {
        check = false;
        document.getElementById("navig").classList.replace("hidden", "flex");
    }
    else {
        check = true;
        document.getElementById("navig").classList.replace("flex", "hidden");
    }
}


// those functions are responsible for the temperature and wind mesure 
// calculation and representation .

function TempCels() {
    mesurement = 'C';
    if (data) {
        hourlyForecast(data);
        setMainTemp(data);
        forcastDays(data);
    }
    document.getElementById("celsLabel").textContent = "✔";
    document.getElementById("fahLabel").textContent = "";
}
function TempFah() {
    mesurement = 'F';
    if (data) {
        hourlyForecast(data);
        setMainTemp(data);
        forcastDays(data);
    }
    document.getElementById("celsLabel").textContent = "";
    document.getElementById("fahLabel").textContent = "✔";
}

function WindKm() {
    windMesure = "km/h";
    if (data)
        setStatus(data);
    document.getElementById("kmLabel").textContent = "✔";
    document.getElementById("mphLabel").textContent = "";
}
function WindMph() {
    windMesure = "mph";
    if (data)
        setStatus(data);
    document.getElementById("kmLabel").textContent = "";
    document.getElementById("mphLabel").textContent = "✔";
}

// we are adding here an event listere for the nav bar.
document.getElementById("dropdown-one").addEventListener("click", units);
document.getElementById("units").addEventListener("click", units);
document.addEventListener("click", () => {
    if (check == false) {
        check = true;
        document.getElementById("navig").classList.replace("flex", "hidden");
    }
})

document.getElementById("cels").addEventListener("click", TempCels);
document.getElementById("fah").addEventListener("click", TempFah);
document.getElementById("klmet").addEventListener("click", WindKm);
document.getElementById("mph").addEventListener("click", WindMph);