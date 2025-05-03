let startLocation = null;
let endLocation = null;
let waypoints = [];
let selectingMode = null; // "start", "end", "waypoint"
let routesData = [];

let directionsService;
let directionsRenderer;

window.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("select-start-button");
    const endButton = document.getElementById("select-end-button");
    const waypointButton = document.getElementById("add-waypoint-button");
    const routeButton = document.getElementById("route-between-button");
    const clearRouteButton = document.getElementById("clear-route-button");
    const exportRoutesButton = document.getElementById("export-routes-button");
    if (exportRoutesButton) {
        exportRoutesButton.addEventListener("click", exportRoutes);
    }
    const importRoutesButton = document.getElementById("import-routes-button");
    const importRoutesInput = document.getElementById("import-routes-input");

    if (importRoutesButton && importRoutesInput) {
        importRoutesButton.addEventListener("click", () => {
            importRoutesInput.click();
        });

        importRoutesInput.addEventListener("change", importRoutes);
    }



    if (startButton && endButton && waypointButton && routeButton && clearRouteButton) {
        startButton.addEventListener("click", () => selectLocation("start"));
        endButton.addEventListener("click", () => selectLocation("end"));
        waypointButton.addEventListener("click", () => selectLocation("waypoint"));
        routeButton.addEventListener("click", routeBetweenPoints);
        clearRouteButton.addEventListener("click", clearRoute);
    }
});

function initDirections() {
    if (!directionsService || !directionsRenderer) {
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
    }
}

function selectLocation(type) {
    selectingMode = type;
    alert(`Click on the map to set the ${type === 'start' ? 'start point' : type === 'end' ? 'end point' : 'waypoint'}.`);
}

function setupRouteClickHandler() {
    map.addListener("click", (event) => {
        if (selectingMode) {
            const latlng = { lat: event.latLng.lat(), lng: event.latLng.lng() };

            if (selectingMode === "start") {
                startLocation = latlng;
            } else if (selectingMode === "end") {
                endLocation = latlng;
            } else if (selectingMode === "waypoint") {
                waypoints.push({ location: latlng, stopover: true });
            }

            selectingMode = null;
            alert("Point added.");
        }
    });
}

function routeBetweenPoints() {
    if (!startLocation || !endLocation) {
        alert("Set both start and end point first!");
        return;
    }

    initDirections();

    const request = {
        origin: startLocation,
        destination: endLocation,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            if (status === "OK") {
            directionsRenderer.setDirections(result);

            // save route for export
            routesData.push({
                start: startLocation,
                end: endLocation,
                waypoints: waypoints,
                timestamp: Date.now()
            });
        }

        } else {
            alert("Failed to calculate route: " + status);
        }
    });
}

function clearRoute() {
    if (directionsRenderer) {
        directionsRenderer.set('directions', null);
    }
    startLocation = null;
    endLocation = null;
    waypoints = [];
    selectingMode = null;
    alert("Route cleared.");
}

function exportRoutes() {
    if (!routesData || routesData.length === 0) {
        alert("No routes to export!");
        return;
    }

    const dataStr = JSON.stringify(routesData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "routes.json";
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
function importRoutes(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);

            if (!Array.isArray(importedData)) {
                throw new Error("Invalid JSON file format.");
            }

            routesData = [];

            importedData.forEach(route => {
                if (route.start && route.end) {
                    routesData.push(route);

                    initDirections();

                    const request = {
                        origin: route.start,
                        destination: route.end,
                        waypoints: route.waypoints || [],
                        travelMode: google.maps.TravelMode.DRIVING,
                    };

                    directionsService.route(request, (result, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(result);
                        } else {
                            console.warn("Failed to calculate one of the routes: " + status);
                        }
                    });
                }
            });

            alert("Routes imported successfully!");

        } catch (err) {
            alert("Error importing JSON file.");
            console.error(err);
        }
    };

    reader.readAsText(file);
}
