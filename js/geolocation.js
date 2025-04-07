window.addEventListener("DOMContentLoaded", () => {
    const locationButton = document.getElementById("location-button");

    if (locationButton) {
        locationButton.addEventListener("click", () => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    map.setCenter(userLocation);
                    map.setZoom(15);

                    const marker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "Your location",
                        icon: {
                            url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
                            scaledSize: new google.maps.Size(40, 40),
                        },
                    });

                    showInfoWindow(map, marker, "You are here!");

                },
                (error) => {
                    alert("Failed to get your location.");
                    console.error(error);
                }
            );
        });
    }
});
