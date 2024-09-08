
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:'mapbox://styles/mapbox/streets-v12',
    center: list.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(coordinates);
const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(list.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25}).setHTML(
        `<h4> ${list.location}</h4> <p> location provided after booking</p>`
)
)
.addTo(map);