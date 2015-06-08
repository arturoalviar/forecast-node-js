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

//import forcast.js file
var forecast = require('./forecast');

//app only works if three arguments are provided
if(process.argv.length != 3){
	//print usage for user
	console.log("Usage: node app.js zip_code");
}else{
	//run app
	forecast.get(process.argv[2]);
}