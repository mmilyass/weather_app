export const key = "aec57b3783589990abee79b2c67e766b";
export const key2 = "42f65174c74c433b935152556250710";

export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


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



