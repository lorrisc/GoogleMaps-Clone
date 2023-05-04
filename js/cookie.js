// HISTORIC AND FAVORITE LOCATION

// get all location
function getLocation(cookieName) {
    let cookie = document.cookie;
    let startIndex = cookie.indexOf(`${cookieName}=`);
    if (startIndex !== -1) {
        startIndex += `${cookieName}=`.length;
        let endIndex = cookie.indexOf(";", startIndex);
        if (endIndex === -1) {
            endIndex = cookie.length;
        }
        let savedLocationsString = cookie.substring(startIndex, endIndex);
        return JSON.parse(savedLocationsString);
    }
    return [];
}

// add a location
function addLocation(cookieName, dataLat, dataLon, cityName, addrFirstField, AddrLastField, imgLink) {
    let savedLocations = getLocation(cookieName);

    let location = {
        dataLat: dataLat,
        dataLon: dataLon,
        cityName: cityName,
        addrFirstField: addrFirstField,
        AddrLastField: AddrLastField,
        imgLink: imgLink,
    };
    savedLocations.push(location);

    // Supprimer les doublons
    savedLocations = savedLocations.filter((location, index, self) => index === self.findIndex((t) => t.dataLat === location.dataLat && t.dataLon === location.dataLon));

    saveCookie(cookieName, savedLocations);
}

// delete a location
function removeLocation(cookieName, index) {
    let savedLocations = getLocation(cookieName)
    savedLocations.splice(index, 1);
    saveCookie(cookieName, savedLocations);
}

// save a cookie
function saveCookie(cookieName, savedLocations) {
    let expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    // Écrire le tableau mis à jour dans le cookie
    document.cookie = `${cookieName}=${JSON.stringify(savedLocations)}; expires=${expirationDate.toUTCString()}`;
}