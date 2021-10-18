mapboxgl.accessToken = 'pk.eyJ1IjoicGhhbXRydW5naGlldTZkIiwiYSI6ImNrdGJuZHduNzF4aTYyd3Bsa3RyMGxhY3IifQ.jzhAQ1H3SkdOoJi-BYKI8A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [105.82061007444896, 21.01794812087948],
    zoom: 12,
});

const urlParams = Array.from(new URLSearchParams(location.search).values());
if(urlParams.length != 0) {
    const lng = parseFloat(urlParams[0]);
    const lat = parseFloat(urlParams[1]);
    const marker = new mapboxgl.Marker({color: '#F84C4C'})
        .setLngLat([lng, lat])
        .addTo(map);
}

map.on('load', () => {
    // Add the control to the map.
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );

    map.addSource('places', {
        'type': 'geojson',
        'data': 'http://localhost:8081/api/foodreview/map',
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
            'circle-color': '#4264fb',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;


        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});