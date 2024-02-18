const SearchBtn = document.getElementById("Sbtn");
const InputBox = document.querySelector(".input-box");
const CurrentDiv = document.querySelector('.current-weather');
const WeatherDiv = document.querySelector('.weather-card');
const Currentlocation = document.querySelector('.location-btn');
const API_KEY ="b799c45ae83e39804248c822119a54e6";

const createWeatherCard = (cityName , weatherItem , index) =>{
    if(index === 0){
        return `
                <div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather image"/>
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        `
    } else{
        return `
        <li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather image"/>
            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity:${weatherItem.main.humidity}%</h4>
        </li>
      `
    }
};

const getWeatherDetails = async (cityName , lat , lon) => {
    try{

        const dailyForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(dailyForecast);
        const data = await response.json();
        console.log(data);
        const UniqueForecastDays =[];
        const filteredData = data.list.filter((forecast)=>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!UniqueForecastDays.includes(forecastDate)){
                return UniqueForecastDays.push(forecastDate);
            }
            console.log(UniqueForecastDays);
        });
        InputBox.value="";
        CurrentDiv.innerHTML="";
        WeatherDiv.innerHTML="";
        console.log(filteredData);
        filteredData.forEach((weatherItem , index)=>{
            if(index===0){
                CurrentDiv.insertAdjacentHTML("beforeend" ,createWeatherCard(cityName, weatherItem , index)) ;
            }
            else{
                WeatherDiv.insertAdjacentHTML("beforeend" ,createWeatherCard(cityName, weatherItem , index)) ;
            }
        });
    }catch(error){
        alert("No data Found");
    }
}


const getCityCoordinates = async () =>{
    const cityName = InputBox.value.trim();
    if(!cityName) return;
    console.log(cityName);
    try{

        const API_URL =`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        const response = await fetch(API_URL);
        const data = await response.json();
        if(!data.length){
            return alert(`No Coordinate Found For ${cityName}`);
        } 
        console.log(data);
        const {name , lat ,lon } = data[0];
        console.log(name , lat , lon);
        getWeatherDetails(name , lat , lon);
    }catch(error){
        console.log(error);
    }
}

const getCurrentLoction =  () => {
    navigator.geolocation.getCurrentPosition(
        async(position)=>{
            const {latitude , longitude} = position.coords;
            console.log(latitude , longitude);
            const REVERSE_GEO_LOCATION =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude }&lon=${longitude}&appid=${API_KEY}`;
            console.log(position);
            const response = await fetch(REVERSE_GEO_LOCATION);
            const data = await response.json();
            const { name } = data[0];
            console.log(name);
            getWeatherDetails(name ,latitude , longitude);
            console.log(data);
        },
        (error)=>{
           if(error.code === error.PERMISSION_DENIED){
            alert("Geoloaction request Denied Please reset the permission");
           }

        }
    )
}

console.log(getCurrentLoction);




Currentlocation.addEventListener('click' , getCurrentLoction);
getCurrentLoction();
SearchBtn.addEventListener("click" , getCityCoordinates);
InputBox.addEventListener("keyup" , e => e.key==="Enter" && getCityCoordinates());


