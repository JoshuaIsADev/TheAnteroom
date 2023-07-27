const fetchUsersLatLong = async () => {
  const responseIP = await axios.get("https://ipapi.co/json/");

  const usersIP = responseIP.data.ip;

  const responseLatLong = await axios.get(
    "https://ipapi.co/" + `${usersIP}` + "/latlong/"
  );
  return responseLatLong.data.split(",");
};

const fetchWeather = async () => {
  const latLong = await fetchUsersLatLong();

  const responseWeather = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat: `${latLong[0]}`,
        lon: `${latLong[1]}`,
        appid: "f91937c72f5215c9ddce5d59b7dcfc86",
      },
    }
  );
  return [
    convertToFarenheight(responseWeather.data.main.temp_max),
    convertToFarenheight(responseWeather.data.main.temp_min),
    responseWeather.data.weather[0].description,
  ];
};

const convertToFarenheight = function (temperatureNumber) {
  return `${Math.trunc(((Number(temperatureNumber) - 273.15) * 9) / 5 + 32)}°F`;
};

const showWeather = async () => {
  const temperatures = await fetchWeather();
  document.querySelector(
    "#weather"
  ).innerHTML = `${temperatures[0]}/${temperatures[1]}, ${temperatures[2]}`;
};

showWeather();

const fetchArticles = async () => {
  const resultArticles = await axios.get(
    "https://newsapi.org/v2/top-headlines?country=us",
    {
      params: {
        apiKey: "2a35fcef6d18485da5ea2a7447075031",
      },
    }
  );

  return resultArticles.data.articles;
};

const showArticles = async () => {
  const articles = await fetchArticles();
  for (let article of articles) {
    const divArticle = document.createElement("div");
    divArticle.innerHTML = `
    <h2 class="news-title"><a href ="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h2>
    <p class="news-summary">${article.description}</p>
    <br />
    `;

    document.querySelector(".service-newsfeed").appendChild(divArticle);
  }
};

showArticles();

const fetchArtwork = async () => {
  const responseArtwork = await axios.get(
    "https://collectionapi.metmuseum.org/public/collection/v1/search",
    {
      params: {
        q: "",
        medium: "Paintings",
        hasImages: "true",
        isOnView: "true",
      },
    }
  );
  const resultArtworkID = responseArtwork.data.objectIDs;

  const randomNumber =
    resultArtworkID[Math.floor(Math.random() * resultArtworkID.length)];

  return await axios.get(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomNumber}`
  );
};

const showArtwork = async () => {
  const resultArtwork = await fetchArtwork();
  const divArtworkInfo = document.createElement("div");

  divArtworkInfo.innerHTML = `
  <a href="${resultArtwork.data.objectURL}" target="_blank" rel="noopener noreferrer"><span>@ The MET, </span><span class="uppercase">
      ${resultArtwork.data.title}, ${resultArtwork.data.objectDate}, </span>
     <span>${resultArtwork.data.artistDisplayName}</span>
  `;

  const divArtworkImg = document.createElement("div");

  divArtworkImg.innerHTML = `
  <img class="img-fill" src="${resultArtwork.data.primaryImage}" alt="" />
  `;

  document.querySelector(".artwork-info").appendChild(divArtworkInfo);

  document.querySelector(".artwork-img").appendChild(divArtworkImg);
};

showArtwork();

function getCurrentDate() {
  let date;
  let dateTime;

  date = new Date();
  dateTime = date.toISOString().split("T")[0];

  document.querySelector("#display-date").textContent = dateTime;
}

getCurrentDate();
