import { days, months, getWeatherImage, forcastDays, hourlyForecast, setStatus, fetchedApi } from './functions.js'

const message = document.getElementById("message-error");
const main = document.querySelector("main");
const main_img = document.getElementById("main-img");
let check = true;

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
    // main.classList.remove("hidden");
    const input = document.getElementById("searchInput").value;
    if (input === "") {
        main.classList.replace("flex", "hidden");
        message.textContent = "Enter a city please!";
    }
    else {
        const data = await fetchedApi(input);
        if (!data) {
            main.classList.replace("flex", "hidden");
            message.textContent = "City Not found!";
            return;
        }
        message.classList.add("hidden");
        main.classList.replace("hidden", "flex");
        console.log(data);
        await setMainTemp(data);
        await setStatus(data);
        await forcastDays(data);
        await hourlyForecast(data);
    }
}
)

function units() {
    if (check == true) {
        check = false;
        document.querySelector("header").style.opacity = "0.8";
        document.getElementById("navig").classList.replace("hidden", "flex");
    }
    else {
        check = true;
        document.querySelector("header").style.opacity = "1";
        document.getElementById("navig").classList.replace("flex", "hidden");
    }
}

function TempCels(){
    document.getElementById("celsLabel").textContent = "✔";
    document.getElementById("fahLabel").textContent = "";
}
function TempFah(){
    document.getElementById("celsLabel").textContent = "";
    document.getElementById("fahLabel").textContent = "✔";
}

function WindKm(){
    document.getElementById("kmLabel").textContent = "✔";
    document.getElementById("mphLabel").textContent = "";
}
function WindMph(){
    document.getElementById("kmLabel").textContent = "";
    document.getElementById("mphLabel").textContent = "✔";
}

document.getElementById("dropdown-one").addEventListener("click", units);
document.getElementById("units").addEventListener("click", units);
// document.querySelector("header").addEventListener("click", () =>{
//     if (check == false)
//         document.getElementById("navig").classList.replace("flex", "hidden");
// });
document.getElementById("cels").addEventListener("click", TempCels);
document.getElementById("fah").addEventListener("click", TempFah);
document.getElementById("klmet").addEventListener("click", WindKm);
document.getElementById("mph").addEventListener("click", WindMph);