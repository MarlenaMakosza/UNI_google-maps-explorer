let markersData = [];
let markersOnMap = [];

window.addEventListener("DOMContentLoaded", () => {
    const exportMarkersButton = document.getElementById("export-markers-button");
    if (exportMarkersButton) {
        exportMarkersButton.addEventListener("click", exportMarkers);
    }

    const importMarkersButton = document.getElementById("import-markers-button");
    const importMarkersInput = document.getElementById("import-markers-input");

    if (importMarkersButton && importMarkersInput) {
        importMarkersButton.addEventListener("click", () => {
            importMarkersInput.click();
        });

        importMarkersInput.addEventListener("change", importMarkers);
    }
    const clearMarkersButton = document.getElementById("clear-markers-button");
    if (clearMarkersButton) {
        clearMarkersButton.addEventListener("click", () => {
            if (!confirm("Are you sure you want to remove all markers?")) return;

            markersOnMap.forEach(marker => marker.setMap(null));
            markersOnMap = [];
            markersData = [];

            updateMarkerCounter();
            updateMarkerList();
        });
    }

});


function setupMarkerClickHandler() {
    map.addListener("click", (event) => {
        const latlng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };

        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
                scaledSize: new google.maps.Size(40, 40),
            },
        });

        const content = `Coordinates: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

        marker.addListener("click", () => {
            showInfoWindow(map, marker, content);
        });

        showInfoWindow(map, marker, content);

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: latlng }, (results, status) => {
            const address = (status === "OK" && results[0])
                ? results[0].formatted_address
                : null;

            markersData.push({ lat: latlng.lat, lng: latlng.lng, address });
            markersOnMap.push(marker);

            updateMarkerCounter();
            updateMarkerList();
        });
    });
}


function exportMarkers() {
    if (!markersData || markersData.length === 0) {
        alert("No markers to export!");
        return;
    }

    const dataStr = JSON.stringify(markersData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "markers.json";
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function importMarkers(event) {
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

            // clear current markers
            markersData = [];
            markersOnMap.forEach(marker => marker.setMap(null));
            markersOnMap = [];

            importedData.forEach(({ lat, lng }) => {
                const latlng = { lat, lng };

                const marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    icon: {
                        url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
                        scaledSize: new google.maps.Size(40, 40),
                    },
                });

                const content = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

                marker.addListener("click", () => {
                    showInfoWindow(map, marker, content);
                });

                markersOnMap.push(marker);
                markersData.push({ lat, lng });
            });

                updateMarkerCounter();
                updateMarkerList()
                reverseGeocodeMarkersWithoutAddress();
            alert("Markers imported successfully!");

        } catch (err) {
            alert("Error importing JSON file.");
            console.error(err);
        }
    };


    reader.readAsText(file);
}


function updateMarkerCounter() {
    const counter = document.getElementById("marker-counter");
    if (counter) {
        counter.textContent = `Markers: ${markersData.length}`;
    }
}

function updateMarkerList() {
    const list = document.getElementById("marker-list");
    if (!list) return;

    list.innerHTML = "";

    markersData.forEach(({ lat, lng, address }, index) => {
        const li = document.createElement("li");
        li.classList.add("flex", "justify-between", "items-center", "mb-1", "hover:bg-gray-100", "px-2", "py-1", "rounded");

        // label with address or coordinates
        const label = document.createElement("span");
        label.textContent = address
            ? address
            : `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        label.classList.add("cursor-pointer", "hover:text-blue-600", "transition");

        // on label click — pan to marker
        label.addEventListener("click", () => {
            const marker = markersOnMap[index];
            if (!marker) return;

            map.panTo({ lat, lng });
            map.setZoom(18);
            showInfoWindow(map, marker, `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.title = "Remove marker";
        deleteBtn.classList.add("text-red-600", "hover:text-red-800", "text-lg", "font-bold", "ml-2");

        deleteBtn.addEventListener("click", () => {
            const marker = markersOnMap[index];
            if (marker) marker.setMap(null);

            markersData.splice(index, 1);
            markersOnMap.splice(index, 1);

            updateMarkerCounter();
            updateMarkerList();
        });

        li.appendChild(label);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}


function reverseGeocodeMarkersWithoutAddress() {
    const geocoder = new google.maps.Geocoder();
    let pending = 0;

    markersData.forEach((marker) => {
        if (!marker.address) {
            pending++;
            geocoder.geocode({ location: { lat: marker.lat, lng: marker.lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    marker.address = results[0].formatted_address;
                }

                pending--;

                if (pending === 0) {
                    updateMarkerList();
                }
            });
        }
    });

    if (pending === 0) {
        updateMarkerList();
    }
}
