# UNI Google Maps Explorer

A university project. An interactive map built on Google Maps JavaScript API with markers, route planning, and geolocation.

> Last updated: May 2025

## Tech stack

| Technology | Role |
|---|---|
| [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) | Map rendering, geocoding, routing |
| Vanilla JavaScript | Frontend logic |
| [TailwindCSS](https://tailwindcss.com/) (CDN) | Styling |

## Features

- Map centered on University of Zielona Góra with custom dark/light style
- Reverse geocoding — enter coordinates, get an address
- Browser geolocation — show your current position on the map
- Custom markers with info windows
- Export and import markers as JSON
- Route planning with start point, end point, and waypoints
- Export and import routes as JSON

## Requirements

- Google Maps JavaScript API key ([get one here](https://console.cloud.google.com/))
- Browser with internet access

## Quick start

1. Copy `js/env.example.js` → `js/env.js`, then replace `"YOUR_API_KEY"` with your Google Maps API key:

```js
window.env = {
  GOOGLE_MAPS_API_KEY: 'your-key-here',
};
```

2. Open `index.html` in a browser (or serve with any static server).

## Project structure

```
index.html          # main app
js/
  env.js            # API key config
  app.js            # initialization
  map.js            # map setup, style toggle
  geocode.js        # reverse geocoding
  geolocation.js    # browser geolocation
  markers.js        # markers + info windows + JSON export/import
  routes.js         # route planning + JSON export/import
  infowindow.js     # info window helpers
```
