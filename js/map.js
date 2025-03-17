let map;
let isDarkMode = false;

const universityLocation = { lat: 51.94131444424505, lng: 15.528911393847483 };

const lightStyle = [
    { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] }
];

const darkStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#17263c' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
];

function initMap() {
map = new google.maps.Map(document.getElementById("map"), {
    center: universityLocation,
    zoom: 17,
    styles: lightStyle,
    mapTypeControl: true,
    mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
    }
});

    setupMarkerClickHandler();
    setupRouteClickHandler();

    const toggleButton = document.getElementById("toggle-style-button");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            isDarkMode = !isDarkMode;
            console.log(`Dark mode is now ${isDarkMode ? 'enabled' : 'disabled'}`);
            map.setOptions({ styles: isDarkMode ? darkStyle : lightStyle });
            toggleButton.textContent = isDarkMode ? '☀️' : '🌙';
        });
    }
}
