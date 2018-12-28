// Global variables
var CLIENT_ID = '1039924587363-o42n29ujvbqusbmfjd8oh0ovb7m55iii.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBvFg2hPMVSmFSFOWnRbpzY2XclzeWCRqg';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

// Auth helper functions

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
console.log(SCOPES)

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    document.getElementById('signout_button').onclick = handleSignoutClick;
    document.getElementById('authorize_button').onclick = handleAuthClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
