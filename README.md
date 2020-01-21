# Google Map and Pins Demo

Note: styling has been kept to a minimum because this was originally developed to be embedded into an existing website.

API's used are Google Maps Javascript API and Geocoding API. Database and hosting by [Google Firebase](https://firebase.google.com/).

## Routes
  - [/](https://map-demo-db723.firebaseapp.com/)
  - [/map](https://map-demo-db723.firebaseapp.com/map) (Same as '/')
  - [/register](https://map-demo-db723.firebaseapp.com/register)
  - [/thank-you](https://map-demo-db723.firebaseapp.com/thank-you)

## Map
The map displays user submitted pins. Closely grouped pins are clustered, and automatically zoomed in when clicked. Clicking on a pin will show an info window.

## Register Form
The "Coin ID" is validated to be a 6 digit number. The "title", "description", and "location" are required. The image is optional. When a user enters in their location, a small map and pin appear, allowing the user to adjust the location. The "submit" button doesn't become active until all inputs are valid.

Feel free to add pins and view the updated map.
