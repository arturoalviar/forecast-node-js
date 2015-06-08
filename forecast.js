/*
***** Simple Nodejs app that uses geocoder 
***** and the Dark Sky Forecast API to
***** get the current weather of a 
***** given zip code via the command line
********************
***** Arturo Alviar*
********************
*/

'use strict';

//import http and https
var http = require('http');
var https = require('https');
var colors = require('colors');

//API goes here
var apiKey = 'YOUR API KEY GOES HERE';

//print out forecast information
var printForecast = function(geoInfo, forecast){
	console.log("The forecast for today at " + geoInfo[2] + "," + geoInfo[3] + " " + geoInfo[4]+ " is " + (forecast.currently.summary).underline.green);
	console.log("It is " + colors.cyan(Math.ceil(forecast.currently.temperature)) + " degrees");
	console.log("More Info" );
	console.log("Humidity: " + colors.cyan(forecast.currently.humidity * 100) + "%".cyan);
	console.log("Wind Speed: " + colors.cyan(forecast.currently.windSpeed) + " degrees" );
}

//print errors
var printError = function(error){
	console.log("Oops, Something went wrong!")
	console.error(error.message);
}

//get geo location with zip code
var getGeo = function(zipCode){
	var request = http.get('http://geocoder.us/service/csv/geocode?zip=' + zipCode , function(response){
		var body = '';
		response.on('data', function(dataBody){
			body += dataBody;	
		});
		response.on('end', function(){
			if(response.statusCode === 200){
				body = body.split(', '); //turn the response body into an array
				return getForecast(body); //after we have this info, call the getForecast function to get the weather
			}else{
				printError({
					message: 'There was an error getting the forecast for ' + zipCode + '. (' + http.STATUS_CODES[response.statusCode] + ')' 
				});
			}		
		});
	});
	request.on('error', printError);
}

//takes in an arrary which should contain the following structure
//[long, lat, city, state(abbr), zip]

var getForecast = function(geoInfo){
	//needs https to talk to api
	var forecastRequest = https.get("https://api.forecast.io/forecast/" + apiKey + "/" + geoInfo[0] + "," + geoInfo[1], function(response){
		var forecastJSON = '';
		response.on('data', function(forecaseData){
			forecastJSON += forecaseData;
		});
		response.on('end', function(){
			if(response.statusCode === 200){
				try{
					//try to parse the data we get from the api
					var forecast = JSON.parse(forecastJSON);
					//print the info out in the console
					printForecast(geoInfo, forecast);
				}catch(error){
					//print error if we can't parse JSON
					printError(error);
				}
			}else{
				printError({
					message: 'There was an error getting the forecast for ' + geoInfo[4] + '. (' + http.STATUS_CODES[response.statusCode] + ')' 
				});
			}
		});
	});
	forecastRequest.on('error', printError);
}

module.exports.get = getGeo;