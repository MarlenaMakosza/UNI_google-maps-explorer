window.env = {
    GOOGLE_MAPS_API_KEY: "YOUR_API_KEY", // Enter your Google Maps API key here
    // EXAMPLE: "123123123123123"
};

function loadGoogleMapsScript() {
    const apiKey = window.env?.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        alert('Missing API key!');
        return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}
