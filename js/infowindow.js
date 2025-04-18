let activeInfoWindow = null;

function showInfoWindow(map, marker, content, duration = 5000) {
    if (activeInfoWindow) {
        activeInfoWindow.close(); // close previous
    }

    const infowindow = new google.maps.InfoWindow({
        content: content,
    });

    infowindow.open(map, marker);
    activeInfoWindow = infowindow; // track active window

    setTimeout(() => {
        infowindow.close();
        if (activeInfoWindow === infowindow) {
            activeInfoWindow = null;
        }
    }, duration);
}
