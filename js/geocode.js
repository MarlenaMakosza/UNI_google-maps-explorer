window.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("latlng-input");
    const geocodeButton = document.getElementById("geocode-button");

    if (geocodeButton) {
        geocodeButton.addEventListener("click", () => {
            const input = inputField.value.trim();
            if (!input) {
                alert("Please enter coordinates!");
                return;
            }

            const parts = input.split(",");
            if (parts.length !== 2) {
                alert("Use format: lat, lng");
                return;
            }

            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);

            if (isNaN(lat) || isNaN(lng)) {
                alert("Enter valid numbers!");
                return;
            }

            const latlng = { lat, lng };
            map.setCenter(latlng);

            addMarkerWithReverseGeocoding(lat, lng);
            
        });
    }
});


function addMarkerWithReverseGeocoding(lat, lng, iconUrl = "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png") {
    const latlng = { lat, lng };

    const marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(40, 40),
        },
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, (results, status) => {
        const address = (status === "OK" && results[0])
            ? results[0].formatted_address
            : null;

        const content = address
            ? `Address: ${address}`
            : `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        showInfoWindow(map, marker, content);

        marker.addListener("click", () => {
            showInfoWindow(map, marker, content);
        });

        markersData.push({ lat, lng, address });
        markersOnMap.push(marker);
        updateMarkerCounter();
        updateMarkerList();
    });
}
