import {days, months, getWeatherImage, forcastDays, setStatus, fetchedApi, hourlyForecast } from './functions.js'

const message = document.getElementById("message-error");
const main = document.querySelector("main");
const main_img = document.getElementById("main-img");

async function setMainTemp(data) {
    const today = new Date();
    document.getElementById("CityName").textContent = data.location.name;
    document.getElementById("date").textContent = days[today.getDay()] + ', ' + months[today.getMonth()] + ', ' + today.getFullYear();
    let temp = data.current.temp_c;
    let decimalPart = temp.toString().split('.')[0] + "°";
    document.getElementById("temp").textContent = decimalPart;
    main_img.src = getWeatherImage(data.current.condition.text);
    main_img.classList.remove("hidden");

}


document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("searchInput").value;
    if (input === "") {
        message.classList.remove("hidden");
        main.classList.add("hidden");
        message.textContent = "Enter a city please!";
        message.style.color = "white";
        document.getElementById("searchContain").append(message);
    }
    else {
        const data = await fetchedApi(input);
        if (!data) {
            main.classList.add("hidden");
            message.textContent = "City Not found!";
            return;
        }
        message.classList.add("hidden");
        main.classList.remove("hidden");
        console.log(data);
        await setMainTemp(data);
        await setStatus(data);
        await forcastDays(data);
        await hourlyForecast(data);
    }
}
)

