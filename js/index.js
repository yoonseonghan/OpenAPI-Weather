async function setRenderBackground() {
    //https://picsum.photos/200/300
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob"
    })
    // console.log(result.data)
    const data = URL.createObjectURL(result.data)
    // console.log(data)
    document.querySelector("body").style.backgroundImage = `url(${data})`
}

function setTime() {
    // navigator.geolocation.getCurrentPosition(function (pos) {
    //     console.log(pos)
    // })
    const timer = document.querySelector(".timer");
    setInterval(() => {
        const date = new Date();
        if (date.getHours() > 12) { //오후
            const timecontent = document.querySelector(".timer-content")
            timecontent.innerHTML = "Good evening, sh!";
        } else {//오전
            const timecontent = document.querySelector(".timer-content")
            timecontent.innerHTML = "Good moning, sh!";
        }
        timer.textContent = `${("0" + date.getHours()).slice(-2)} : ${("0" + date.getMinutes()).slice(-2)} : ${("0" + date.getSeconds()).slice(-2)}`
    }, 1000)
}

function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", function (e) {
        // console.log(e.currentTarget.value)
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value)
            getMemo();
            memoInput.value = "";
        }
    })
}

function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
}
function getPositon(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
}
async function getWeather(lat, lon) {
    //console.log(lat, lon);

    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a1bcb0ed587e81e5a518a162655b79fb`);
    }


    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=2719e331e07a6af0547cfe7df2754c8c ")

    return data;
}
async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPositon();
        latitude = position.coords.latitude
        longitude = position.coords.longitude
    } catch {

    }
    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    //console.log(weatherData.list);
    //배열이 너무많아서 오전, 오후만 남길수 있는 로직
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if ((cur.dt_txt.indexOf("18:00:00") > 0)) {
            acc.push(cur);
        }
        return acc;
    }, [])
    console.log(weatherList)
    const modalBody = document.querySelector(".modal-body")
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    }).join("")
}

function weatherWrapperComponent(e) {
    console.log(e);
    const chanegeToCelsius = (temp) => ((temp - 273.15).toFixed(1))


    return `                        
    <div class="card" style="width: 18rem;">
        <div class="card-header" text-red>
            ${e.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body">
            <h5>${e.weather[0].main}</h5>
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
            <p class="card-text">${chanegeToCelsius(e.main.temp)}</p>
        </div>
    </div>
  
    `

}
function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png"
    if (weatherData === "Clouds") return "/web_pjt2/images/001-cloud.png"
    if (weatherData === "Rain") return "/web_pjt2/images/003-rainy.png"
    if (weatherData === "Snow") return "/web_pjt2/images/006-snowy.png"
    if (weatherData === "Thunderstorm") return "/web_pjt2/images/008-storm.png"
    if (weatherData === "Drizzle") return "/web_pjt2/images/031-snowflake.png"
    if (weatherData === "Atomsphere") return "/web_pjt2/images/033-hurricane.png"
}

renderWeather()
deleteMemo();
getMemo();
setMemo();
setTime();
setRenderBackground();
setInterval(() => {
    setRenderBackground();
}, 5000)