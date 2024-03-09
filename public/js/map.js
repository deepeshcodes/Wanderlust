mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 8 // starting zoom
});

// console.log(coordinates);

const el = document.createElement('div');
el.className = 'marker'

const originalMarker = {
    color: 'red'
};

const marker = new mapboxgl.Marker(originalMarker)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
        )
    )
    .addTo(map);

// marker.getElement().addEventListener('mouseenter', () => {
//     marker.getElement().innerHTML = `<i class="fas fa-compass"></i>`
// });

// marker.getElement().addEventListener('mouseleave', () => {
//     marker = new mapboxgl.Marker(originalMarker);
// });