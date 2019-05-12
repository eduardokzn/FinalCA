// JSON object
var options = {
    frequency: 30000
}

// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
// var mainView = myApp.addView('.view-main', {
//     // Because we want to use dynamic navbar, we need to enable it for this view:
//     dynamicNavbar: true
// });

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

    // NOTICE THAT THIS SECTION IS SLIGHTLY
    // DIFFERENT FROM THE SLIDES, BUT IT IS
    // THE SAME IDEA. I AM CALLING THE 
    // WATCH ACCELERATION FUNCTION, ONLY WHEN THE
    // DEVICE IS READY
    //startWatch();
    getLocation();
    tryingFile();

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})

function shake(){
    navigator.vibrate(1000);
}

// accCallback. This is the function in charge of 
// displayiing the acceleration on the front end
function accCallback(acceleration){
    var element = document.getElementById('accelerometer');
	element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br>' +
			      'Acceleration Y: ' + acceleration.y + '<br>' +
			      'Acceleration Z: ' + acceleration.z + '<br>' +
			      'Timestamp: ' + acceleration.timestamp + '<br>';
}

// onError callback
function onError(msg){
    console.log(msg);
}


// THIS IS THE FUNCTION THAT WILL READ THE ACCELEROMETER
var watchID = null;
function startWatch(){
    // Notice that the function takes two callbacks (accCallback and onError) and
    // a JSON object (options)
    watchID = navigator.accelerometer.watchAcceleration(accCallback, onError, options); 
}



// This function is going to use the plugin to 
// get the latitude and longitud from the device
function getLocation(){
    // Once the position has been retrieved, an JSON object
    // will be passed into the callback function (in this case geoCallback)
    // If something goes wrong, the onError function is the 
    // one that will be run
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}

// The callback function must catch the object with the position
function geoCallback(position)
{

    // Printing the position object to the console
//    console.log("geoCallback -----------------------------------------------------------------------------------------------------------------------------position:"+position);

    // Extracting the latitude and longitude
    // from the position object
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log("geoCallback ----------------------------------------------------------------------------------------------- location: Lat: " + latitude + " Long: " + longitude);
    
    //creates a marker for your current position
    var mk = new Object();
    mk.lat = latitude;
    mk.lng = longitude;

    // Placing the data on the front end map and text html
    addMarker(mk);
}

// update position coords in the html 
// function geoMk(position)
function geoMk(lat,lng)
{
    console.log("geoMk---------------------------------------------------------------------");

    // Formatting the data to put it on the front end
    var location = "Lat: " + lat + "       Long: " + lng;
    // Placing the data on the front end
    document.getElementById('position').innerHTML = location;
}

//--------------------------------------------------------------------------------------------------------------------Google Maps API
//----------------------------------------------------------------------
// Markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];
var latitude;
var longitude;

function initMap(markers) 
{
    baseCoin = "USD";
    coinCode = "EUR";
    console.log("baseCoin"+baseCoin);
    
    // Defining a position to display
    var cct = {lat: 53.346, lng: -6.2588};

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: cct,
      mapTypeId: 'terrain'
    });

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function(event) {
      addMarker(event.latLng);    
    });

    // Adds a marker at the center of the map.
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
//    addMarker(cct);


  }

 // Adds a marker to the map and push to the array.
function addMarker(location) 
{
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    // map.setZoom(5);
    map.setCenter(marker.getPosition());
    
    console.log("__________________________________________________________________________addMarker(location)");
    // console.log(marker.getPosition());

    position = ""+marker.getPosition();
    console.log("addMarker-----------------------------------------------------"+position);
    latitude = position.substring(1, position.indexOf(","));
    // console.log("addMarker-----------------------------------"+position+"--------------------"+lat);
    longitude = position.substring(position.indexOf(",")+2, position.length-1);
    // console.log("addMarker-----------------------------------"+position+"--------------------"+lng);
    // console.log("addMarker------------------------location: Lat: " + lat + " Long: " + lng);
    
    //update html
    geoMk(latitude,longitude);
    //get country, city, currency
    openCage(latitude,longitude);
    weatherCheck();
    // geoMk(marker.getPosition(0));
    //markers.push(marker);

    
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    console.log(".......................................................................................................................markers");
    console.log(""+markers[0].value);
    console.log(""+markers.length);
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}
//----------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------Google Maps API



// This function is going to be in charge of invoking
// the open cage external API
function openCage(){

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=53.34592+-6.25881&key=22e5695431c543d682e4d4b52ec743ab';
    // Opening the request. Remember, we will send
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {
        
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        // Printing the result JSON to the console
        console.log(responseJSON);
        // Extracting the individual values, just as we
        // do with any JSON object. Just as we did 
        // with the position.
        // REMEMBER: In this case, we have an array inside 
        // the JSON object.
        var city = responseJSON.results[0].components.city;
        var country = responseJSON.results[0].components.country;
        var currency = responseJSON.results[0].annotations.currency.name;

        // Formattng data to put it on the front end
        var oc = "City: " + city + "<br>Country: " + country + "<br>Currency: " + currency;

        // Placing formatted data on the front ed
        document.getElementById('opencage').innerHTML = oc;
    }
}
var baseCoin;
var coinCode;

var country;
var city;
var currency;
// get country, city and currency
function openCage(lat,lng)
{
    var http = new XMLHttpRequest();
    const url = 'https://api.opencagedata.com/geocode/v1/json?q='+lat+'+'+lng+'&key=22e5695431c543d682e4d4b52ec743ab';
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        console.log("------------------------------------------ openCage response");
//        console.log(response);
        var responseJSON = JSON.parse(response); 
        console.log("------------------------------------------ openCage responseJSON");
        console.log(responseJSON);
        city = responseJSON.results[0].components.city;
        country = responseJSON.results[0].components.country;
        currency = responseJSON.results[0].annotations.currency.name;
        var oc = "Country: " + country + "<br>City: " + city + "<br>Currency: " + currency;
        document.getElementById('opencage').innerHTML = oc;
//UPDATE COINCODE TO CHASE THE CURRENCY RATE
        coinCode = responseJSON.results[0].annotations.currency.iso_code;
        coinConversion();
    }
}
var weather;
function weatherCheck()
{
    var http = new XMLHttpRequest();
    const url = 'http://api.openweathermap.org/data/2.5/find?lat='+latitude+'&lon='+longitude+'&appid=1e3cf45c0037332e954e4a76b7583d72&units=metric';
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        var responseJSON = JSON.parse(response); 
        console.log("------------------------------------------**************************************************************************** weatherCheck responseJSON");
        console.log(responseJSON);
        console.log("------------------------------------------**************************************************************************** weatherCheck weather");
        
        weather = "Temperature:"+(responseJSON.list[0].main.temp)+" ";
        weather = weather+" Max:"+(responseJSON.list[0].main.temp_max)+" ";
        weather = weather+" Min:"+(responseJSON.list[0].main.temp_min)+" degrees Celsius";
        console.log(weather);
        console.log("------------------------------------------**************************************************************************** weatherCheck weather");
        var oc = weather + "";
        document.getElementById('weather').innerHTML = oc;
    }
}

var coinRate;
//get currency rate against USD
function coinConversion() 
{
    var http = new XMLHttpRequest();
    const url = 'http://www.apilayer.net/api/live?access_key=580d7cda308b7171741e187e2deb8068&format=1';
    http.open("GET", url);
    http.send();
  //  var currencyCoin = (coinBase+coinPos);
    http.onreadystatechange = (e) =>{
        var response = http.responseText;
//        console.log(response);
        var responseJSON = JSON.parse(response);
//        console.log(responseJSON);
        var currencyCoin = baseCoin+""+coinCode;
        var currency = responseJSON.quotes[currencyCoin];
        coinRate = currency;
        console.log("************************************ "+currencyCoin+"="+currency);
        //document.getElementById('coinsConversion').innerHTML = "USDBRL"+currency;
    //coinCurrency update
        document.getElementById('coinCurrency').innerHTML =  "1 "+baseCoin+" = "+ coinRate +" "+coinCode ;
        document.getElementById('coinMulti').value =  "Convert "+baseCoin+" to "+coinCode ;
        document.getElementById('coinDiv').value =   "Convert "+coinCode+" to "+ baseCoin;

    }
}

function USDcoinConversion() 
{

    var amount = document.getElementById("coin").value;
    console.log("amount "+amount);
    console.log("baseCoin "+baseCoin);
    console.log("coinCode "+coinCode);
    console.log("coinRate "+coinRate);
    document.getElementById('coinsConversion').innerHTML = amount+ " "+baseCoin+" = "+ amount*coinRate +" "+coinCode ;
}
function coinUSDconversion() 
{
    var amount = document.getElementById("coin").value;
    console.log("amount "+amount);
    console.log("baseCoin "+baseCoin);
    console.log("coinCode "+coinCode);
    console.log("coinRate "+coinRate);

    document.getElementById('coinsConversion').innerHTML = amount+ " "+coinCode+" = "+ amount/coinRate +" "+baseCoin ;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fso
//----------------------------------------------------------------------
function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
   
}

var fileSystemOptionals = { create: true, exclusive: false };

function fileSystemCallback(fs){

    // Name of the file I want to create
    var fileToCreate = "markersData.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}
var fileSystemOptionals = { create: true, exclusive: false };

// NOW, THE GETFILECALLBACK IS NOT GOING
// TO CALL THE READ OR THE WRITE FUNCTIONS 
// AUTOMATICALLY. THIS WILL BE DONE BY THE
// BUTTON ON THE FRONT END
// THE IMPORTANT PART HERE IS TO PUT THE 
// FILE ENTRY SOMEWHERE FOR ALL OTHER FUNCTIONS
// TO FIND
var entry;

function getFileCallback(fileEntry)
{
    
    entry = fileEntry;
}

// Let's write some files
function saveIt()
{
    recordDataSave();
    writeFile(dataSave);
}
function writeFile(dataObj) {

    // Create a FileWriter object for our FileEntry (log.txt).
    entry.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        fileWriter.write(dataObj);
        fileWriter.onwriteend = function() {
            console.log("Successful file write..." );
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

    });
}

// Let's read some files
function readFile() {

    // Get the file from the file entry
    entry.file(function (file) {
        
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);

        };

    }, onError);
}
var dataSave;

function recordDataSave()
{
    var dataValSave = 
                '{"latitude": '+latitude+
                ',"longitude": '+longitude+
                ',"country": '+country+
                ',"city": '+city+
                ',"currency": '+currency+
                ',"baseCoin": '+baseCoin+
                ',"coinRate": '+coinRate+
                ',"coinCode": '+coinCode+
                ',"weather": '+weather+'}';
    console.log("recordDataSave ------------------------------------------------------------------- dataValSave:" + dataValSave);
    dataSave = dataSave+","+dataValSave;
    console.log("dataSave---------------------------------------------------------------------------------------------:" + dataSave);
}
function clearDataSave()
{
    entry= null;
    dataSave = null;
    writeFile(dataSave);
    console.log("dataSave---------------------------------------------------------------------------------------------:" + dataSave);
}

function onError(msg){
    console.log(msg);
}

// getting coords
function saveMarkers()
{
    navigator.geolocation.getCurrentPosition(saveMarkerCallback, onError);

//	navigator.camera.getPicture(cameraCallback, onError);
}

// BUT THE CALLBACK, INSTEAD OF DISPLAYING THE PIC
// IS GOING TO SAVE IT USING THE WRITEPIC FUNCTION
// AND PASSING A BLOB OBJECT!
function saveMarkerCallback(dataSave) {
    
//    var dataObj = new Blob([imageData], { type: 'image/jpeg' });

    var dataObj = new Blob(dataSave, { type: 'text/plain' });
    writeFile(dataSave+dataObj);

}
//----------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fso
