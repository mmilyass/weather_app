export const api = "http://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=CITY_NAME&days=7";
export const key = "42f65174c74c433b935152556250710";

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
// this function fetch data from the API and store in the const data;

export async function fetchedApi(city) {
    try {
        const searchUrl = `https://api.weatherapi.com/v1/search.json?key=${key}&q=${city}`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        // If no results, city is invalid
        console.log(searchData);
        const exactMatch = searchData.find(
            place => place.name.toLowerCase() === city.trim().toLowerCase()
        );

        if (!exactMatch) {
            console.log("heheh");
            return false;
        }

        const validCity = exactMatch.name;
        const api = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${validCity}&days=7`;
        const response = await fetch(api);
        const data = await response.json();
        if (data.error) {
            console.log("API error:", data.error.message);
            return false;
        }
        return data;
    }
    catch (error) {
        console.log("error fetching api:", error);
        return (false);
    }
}


// this function take the condition of the weather and return the right img to the condition description


export function getWeatherImage(conditionText) {
    const text = conditionText.toLowerCase(); // normalize for comparison

    if (text.includes("drizzle"))
        return "assets/images/icon-drizzle.webp";

    if (text.includes("rain") || text.includes("shower"))
        return "assets/images/icon-rain.webp";

    if (text.includes("snow") || text.includes("sleet") || text.includes("ice"))
        return "assets/images/icon-snow.webp";

    if (text.includes("thunder") || text.includes("storm") || text.includes("tornado"))
        return "assets/images/icon-storm.webp";

    if (text.includes("fog") || text.includes("mist") || text.includes("haze"))
        return "assets/images/icon-fog.webp";

    if (text.includes("overcast") || text.includes("cloudy"))
        return "assets/images/icon-overcast.webp";

    if (text.includes("partly"))
        return "assets/images/icon-partly-cloudy.webp";

    if (text.includes("sunny") || text.includes("clear"))
        return "assets/images/icon-sunny.webp";

    return "assets/images/icon-dropdown.webp";
}

//  this funciton set the forecat Days section 

export async function forcastDays(data) {
    let d = today.getDay();
    for (let i = 0; i < 7; i++) {
        forcast_days[i].textContent = days[d];
        d === 6 ? d = 0 : d++;
        let forcast = data.forecast.forecastday[i].day.avgtemp_c;
        forcast_temps[i].textContent = forcast.toString().split('.')[0] + "°";
        imgs[i].src = getWeatherImage(data.forecast.forecastday[i].day.condition.text);
    }
}


// this one set the weather other status

export async function setStatus(data) {
    status[0].textContent = data.current.condition.text;
    status[1].textContent = data.current.humidity + "%";
    status[2].textContent = data.current.wind_kph + " Km/h";
    status[3].textContent = data.current.precip_mm + " mm";

}


// this functio set the hourly forecast section.

export async function hourlyForecast(data) {
    let houre = today.getHours();

    for (let i = 0; i < 8; i++) {
        let ampm = houre >= 12 ? ' PM' : ' AM';
        let displayHour = houre % 12 + 1 || 12;
        let temperature = data.forecast.forecastday[0].hour[houre].temp_c;
        let image = data.forecast.forecastday[0].hour[houre].condition.text;
        imgsTwo[i].classList.remove("hidden");
        imgsTwo[i].src = getWeatherImage(image);
        temp_value_one[i].textContent = temperature.toString().split('.')[0] + "°";
        tempTwo[i].textContent = displayHour + ampm;
        console.log(houre);
        if (houre === 23)
            houre = 0;
        else
            houre++;
    }
}
