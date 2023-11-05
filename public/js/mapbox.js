/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2ltb2hheTAwMSIsImEiOiJjbG9sMWlwenUyYzY2MnFtZW82YmtvcG14In0.iM2erqGdPqt3rwqF37AJsw';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/simohay001/clol20niw007s01o4dclrffql',
  scrollZoom: false,
  // center: [-115.251338, 36.162681],
  // zoom: 10,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extends map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
