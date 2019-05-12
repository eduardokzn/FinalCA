/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //--------------------------------------------------------------------------------------- code auto start in here
        //tryingFile();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
*/
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
function recordDataSave(valToSave)
{
    dataSave = dataSave+valToSave;
    console.log("dataSave---------------------------------------------------------------------------------------------:" + dataSave);
}
function clearDataSave(valToSave)
{
    dataSave = null;
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
    
    writeFile(dataObj);

}