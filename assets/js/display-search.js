var resultTextEl = document.querySelector("#result-text");
var resultContentEl = document.querySelector("#result-content");
var searchFormEl = document.querySelector("#search-form");
document.getElementById("buttonLocalStorage").style.visibility = "hidden";
document.getElementById("buttonLocalStorage1").style.visibility = "hidden";
function getParams() {
  var searchParamsArr = document.location.search.split("&");
  var query = searchParamsArr[0].split("=").pop();
  searchApi(query);
}
function printResults(resultObj) {
  var resultCard = document.createElement("div");
  resultCard.classList.add("card", "bg-light", "text-dark", "mb-3");
  var resultBody = document.createElement("div");
  resultBody.classList.add("card-body");
  resultCard.append(resultBody);
  var titleEl = document.createElement("h3");
  titleEl.textContent = "";
  var bodyContentEl = document.createElement("p");
  bodyContentEl.innerHTML =
    "<strong>Temperature:</strong> " +
    resultObj.temp.day +
    "degrees F" +
    "<br/>";
  if (resultObj.dt) {
    var dateObject = new Date(resultObj.dt * 1000);
    var humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
    bodyContentEl.innerHTML +=
      "<strong>Date:</strong> " + humanDateFormat + "<br/>";
  } else {
    bodyContentEl.innerHTML +=
      "<strong>Subjects:</strong> No subject for this entry.";
  }
  if (resultObj.wind_speed) {
    bodyContentEl.innerHTML +=
      "<strong>Wind:</strong> " + resultObj.wind_speed + "mph" + "<br/>";
  } else {
    bodyContentEl.innerHTML +=
      "<strong>Subjects:</strong> No subject for this entry.";
  }
  if (resultObj.humidity) {
    bodyContentEl.innerHTML +=
      "<strong>Humidity:</strong> " + resultObj.humidity + "%" + "<br/>";
  } else {
    bodyContentEl.innerHTML +=
      "<strong>Description:</strong>  No description for this entry.";
  }
  resultBody.append(titleEl, bodyContentEl);
  resultContentEl.append(resultCard);
}
function searchApi(query) {
  var locQueryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
  locQueryUrl = locQueryUrl + query + "&appid=eb92979807d48fa0bbcad9370c91beb3";
  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (locRes) {
      resultTextEl.textContent = locRes[0].name;
      var locQueryUrlWithCoords =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        locRes[0].lat +
        "&units=imperial" +
        "&lon=" +
        locRes[0].lon +
        "&appid=eb92979807d48fa0bbcad9370c91beb3";
      fetch(locQueryUrlWithCoords)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then(function (locRes1) {
          resultContentEl.textContent = "";

          document
            .getElementById("buttonLocalStorage")
            .addEventListener("click", handleSearchFormSubmitLocalStorage);

          if (localStorage.getItem("city") !== locRes[0].name) {
            document.getElementById("buttonLocalStorage").style.visibility =
              "visible";
            document.getElementById("buttonLocalStorage").textContent =
              localStorage.getItem("city");
            localStorage.setItem("city", locRes[0].name);
          } else {
            localStorage.setItem("city", locRes[0].name);
          }
          for (var i = 0; i < locRes1.daily.length; i++) {
            printResults(locRes1.daily[i]);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    });
}
function handleSearchFormSubmit(event) {
  event.preventDefault();
  var searchInputVal = document.querySelector("#search-input").value;
  if (!searchInputVal) {
    console.error("You need a search input value!");
    return;
  }
  searchApi(searchInputVal);
}
function handleSearchFormSubmitLocalStorage(event) {
  event.preventDefault();
  var searchInputValLocalStorage =
    document.getElementById("buttonLocalStorage").textContent;
  console.log(searchInputValLocalStorage);
  if (!searchInputValLocalStorage) {
    console.error("You need a search input value!");
    return;
  }
  searchApi(searchInputValLocalStorage);
}
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
getParams();
