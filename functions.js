export const key = "aec57b3783589990abee79b2c67e766b";
export const key2 = "42f65174c74c433b935152556250710";

const status = document.querySelectorAll("#status");
const forcast_days = document.querySelectorAll("#temp-one");
const imgs = document.querySelectorAll("#img-one");
const imgsTwo = document.querySelectorAll("#img-two");
const forcast_temps = document.querySelectorAll("#temp-value");
const tempTwo = document.querySelectorAll("#temp-two");
const temp_value_one = document.querySelectorAll("#temp-value-one");

export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const today = new Date();

// Fetch weather data using OpenWeatherMap free API
export async function fetchedApi(city) {
    try {
        // Get coordinates for the city
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData || geoData.length === 0) {
            console.log("City not found");
            return false;
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // Fetch current weather data
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
        const currentRes = await fetch(currentUrl);
        const currentData = await currentRes.json();

        // Fetch 5-day forecast (free tier limit - every 3 hours)
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        //fet hourly forecst.
        const hourlyUrl = `https://api.weatherapi.com/v1/forecast.json?key=${key2}&q=${city}&days=3&aqi=no&alerts=no`;
        const hourlyRes = await fetch(hourlyUrl);
        const hourlyData = await hourlyRes.json();

        if (currentData.cod !== 200 || forecastData.cod !== "200") {
            console.log("API error:", currentData.message || forecastData.message);
            return false;
        }
        return {
            currentData,
            forecastData,
            hourlyData
        };
        // Combine data in a format similar to what the rest of the code expects
    } catch (error) {
        console.log("Error fetching API:", error);
        return false;
    }
}

// Get appropriate weather icon based on condition
export function getWeatherImage(conditionText, hour = 12) {
    const text = conditionText.toLowerCase();

    if (text.includes("drizzle") || text.includes("light rain"))
        return "assets/images/icon-drizzle.webp";

    if (text.includes("rain") || text.includes("shower"))
        return "assets/images/icon-rain.webp";

    if (text.includes("snow") || text.includes("sleet") || text.includes("ice"))
        return "assets/images/icon-snow.webp";

    if (text.includes("thunder") || text.includes("storm") || text.includes("tornado"))
        return "assets/images/icon-storm.webp";

    if (text.includes("fog") || text.includes("mist") || text.includes("haze"))
        return "assets/images/icon-fog.webp";

    if (text.includes("overcast") || text.includes("cloud"))
        return "assets/images/icon-overcast.webp";

    if (text.includes("partly") || text.includes("few clouds") || text.includes("scattered"))
        return "assets/images/icon-partly-cloudy.webp";

    if (text.includes("clear")) {
        if (hour >= 20 || hour <= 5) {
            return "assets/images/icon-clear-night.png";
        } else {
            return "assets/images/icon-sunny.webp";
        }
    }

    // Default for sunny/clear conditions
    return "assets/images/icon-sunny.webp";
}

// Set forecast days section
export async function forcastDays(data) {
    let d = today.getDay();

    for (let i = 0; i < 7; i++) {
        forcast_days[i].textContent = days[d];
        d = d === 6 ? 0 : d + 1;

        const forecast = data.forecastData.list[i].main.temp;
        forcast_temps[i].textContent = Math.round(forecast) + "°";
        imgs[i].src = getWeatherImage(data.forecastData.list[i].weather[0].description);
    }
}

// Set weather status section
export async function setStatus(data) {
    status[0].textContent = data.currentData.weather[0].description;
    status[1].textContent = data.currentData.main.humidity + "%";
    status[2].textContent = data.currentData.wind.speed + " Km/h";
    status[3].textContent = '0' + " mm";
}

// Set hourly forecast section
export async function hourlyForecast(data) {
    const localtime = data.hourlyData.location.localtime;
    let hourData;
    let check = true;
    let hour = parseInt(localtime.split(" ")[1].split(":")[0]) + 1;
    const firstDayHours = data.hourlyData.forecast.forecastday;

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
        temp_value_one[i].textContent = Math.round(hourData.temp_c) + "°";
        tempTwo[i].textContent = displayHour + ampm;
        hour++;
    }
}