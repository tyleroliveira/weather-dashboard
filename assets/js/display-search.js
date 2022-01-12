var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
document.getElementById("buttonLocalStorage").style.visibility="hidden";
document.getElementById("buttonLocalStorage1").style.visibility="hidden";
function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and
  // convert it to an array (i.e. ['?q=london', 'format=photo']). These params
  // are set in script.js.
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var query = searchParamsArr[0].split('=').pop();
  //var format = searchParamsArr[1].split('=').pop();

  searchApi(query);
}


// Function takes a result object from the api and adds content to the DOM,
// displaying the results on the page.
function printResults(resultObj) {
  //console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = "";

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Temperature:</strong> ' + resultObj.temp.day + "degrees F" + '<br/>';




    if (resultObj.dt) {


var dateObject = new Date(resultObj.dt *1000);

var humanDateFormat = dateObject.toLocaleString() //2019-12-9 10:30:15
//console.log(humanDateFormat);
      

      bodyContentEl.innerHTML +=
        '<strong>Date:</strong> ' + humanDateFormat + '<br/>';
    } else {
      bodyContentEl.innerHTML +=
        '<strong>Subjects:</strong> No subject for this entry.';
    }

  if (resultObj.wind_speed) {
    bodyContentEl.innerHTML +=
      '<strong>Wind:</strong> ' + resultObj.wind_speed + 'mph' + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> No subject for this entry.';
  }

  if (resultObj.humidity) {
    bodyContentEl.innerHTML +=
      '<strong>Humidity:</strong> ' + resultObj.humidity + '%' + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  No description for this entry.';
  }

  // var linkButtonEl = document.createElement('a');
  // linkButtonEl.textContent = 'Read More';
  // linkButtonEl.setAttribute('href', resultObj.url);
  // linkButtonEl.classList.add('btn', 'btn-dark');

  resultBody.append(titleEl, bodyContentEl,);

  resultContentEl.append(resultCard);
}

//from api
//http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

function searchApi(query) {
  var locQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=';
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
      //console.log(locRes[0].name);
      //console.log(locRes);
      //console.log(locRes[0].lat);
      //console.log(locRes[0].lat)
      var locQueryUrlWithCoords = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + locRes[0].lat + '&units=imperial' + '&lon=' + locRes[0].lon + '&appid=eb92979807d48fa0bbcad9370c91beb3';
      fetch(locQueryUrlWithCoords)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        }
        )
        .then(function (locRes1) {
          //console.log(locRes1);
          // console.log(locRes1.current.temp);
          // console.log(locRes1.daily[0].temp.day);
          // console.log(locRes1.daily[1].temp.day);
          // console.log(locRes1.daily[2].temp.day);
          // console.log(locRes1.daily[3].temp.day);
          // console.log(locRes1.daily[4].temp.day);
          resultContentEl.textContent = '';

          document.getElementById("buttonLocalStorage").addEventListener('submit', handleSearchFormSubmitLocalStorage);

          if (localStorage.getItem("city") !== locRes[0].name) {
            document.getElementById("buttonLocalStorage").style.visibility="visible";
          document.getElementById("buttonLocalStorage").textContent = localStorage.getItem("city");
          localStorage.setItem("city", locRes[0].name);
          //console.log(localStorage.getItem("city"));
        }
        else {
          localStorage.setItem("city", locRes[0].name);
        }
          




          

          


          for (var i = 0; i < locRes1.daily.length; i++) {
            printResults(locRes1.daily[i]);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    })
  }


// This function is nearly the same as the one in script.js
function handleSearchFormSubmit(event) {
        event.preventDefault();

        // Get user input from the form
        var searchInputVal = document.querySelector('#search-input').value;
        //var formatInputVal = document.querySelector('#format-input').value;

        if (!searchInputVal) {
          console.error('You need a search input value!');
          return;
        }

        // Pass intput to searchApi which will fetch data
        searchApi(searchInputVal);
      }


      function handleSearchFormSubmitLocalStorage(event) {
        event.preventDefault();

        // Get user input from the form
        var searchInputValLocalStorage = localStorage.getItem("city");
        console.log(searchInputValLocalStorage);
        //var formatInputVal = document.querySelector('#format-input').value;

        if (!searchInputValLocalStorage) {
          console.error('You need a search input value!');
          return;
        }

        // Pass intput to searchApi which will fetch data
        searchApi(searchInputValLocalStorage);
      }

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

  getParams();
