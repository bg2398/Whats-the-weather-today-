//My APIKEY from open weather
var key = '98d816fd2db92d702f8ca33fe4d6b8f8';
var city = "seattle"

//date info
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var cityHist = [];
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
    //PUSH is adding city
	cityHist.push(city);
//local storage
	localStorage.setItem('city', JSON.stringify(cityHist));
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});
// creating variable for history
//save entered cities in the search bar
var contHistEl = $('.cityHist');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityHist.length; i++) {
        //console logged to verify cityHist loop is functioning
// console.log(cityHist)
// adding searched cities and turningn them into butons while also increasing searched cities
		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityHist[i]}`)

		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');

		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	
	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecastEl.empty();
		getWeatherToday();
	});
};


var cardTodayBody = $('.cardBodyToday')
//Launch week forecast with open weather link and insert key Var 
function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(cardTodayBody).empty();
//using ajax to get data from the server
	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
	
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		
		var pElTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
		cardTodayBody.append(pElTemp);
		
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);
	
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
		
		var cityLon = response.coord.lon;
	
		var cityLat = response.coord.lat;
	

		var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: getUrlUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			cardTodayBody.append(pElUvi);
			
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'green');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "yellow")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "orange")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "red")
			} else {
				uviSpan.attr("class", "purple")
			}
		});
	});
	getFiveDayForecast();
};

var fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;
//using ajax to retrieve url data from the server
	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];
	
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
            console.log(response)
		})
		//adding loop for 5 day forecast cards
		for (let i = 0; i < myWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 300px;');
			fiveForecastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);
            //console logged 5 day body cards
            console.log(response)

			//Temp section using JQUERY using created Variable "myWeather"
			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(pElTemp);
			//Feels Like section
			var pElFeel = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °F`);
			divElBody.append(pElFeel);
			//Humidity section
			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

//Local Storage for searched imputs.
function initLoad() {

	var cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();
