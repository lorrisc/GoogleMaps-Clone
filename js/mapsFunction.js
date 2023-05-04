// coordonnées géographiques de l'utilisateur
function geolocateUser() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    resolve([latitude, longitude]);
                },
                function (error) {
                    reject(error);
                }
            );
        } else {
            reject(new Error("La géolocalisation n'est pas prise en charge par le navigateur"));
        }
    });
}

// ajouter un marqueur sur la carte
function putMarker(lat, lon, updPosition = true, mapZoom = 15, remove = true) {
    // remove point information
    let pointInformation = document.querySelector("#pointInformation");
    pointInformation.classList.add("none");

    if (remove == true) if (currentMarker) currentMarker.remove();
    currentMarker = L.marker([lat, lon], { icon: marker }).addTo(map);
    if (updPosition == true) map.setView([lat, lon], mapZoom);
}
