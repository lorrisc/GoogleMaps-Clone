geolocateUser()
    .then(function (coords) {
        // PRINCIPAL MAP
        map = L.map("backgroundMap").setView(coords, 15);
        map.attributionControl.remove();
        map.removeControl(map.zoomControl);
        L.control
            .zoom({
                position: "bottomright",
            })
            .addTo(map);
        googleStreets.addTo(map);

        // SWITCH MAP
        // define
        let map_switch = L.map("switchMap__mainButton__map", {
            dragging: false,
            scrollWheelZoom: false,
        }).setView(coords, 15 / 1.25);
        map_switch.zoomControl.remove();
        map_switch.attributionControl.remove();
        googleSatNoLabels.addTo(map_switch);

        let map_switch_button = document.querySelector("#switchMap__mainButton");
        let map_switch_button__text = document.querySelector("#switchMap__mainButton__text");
        map_switch_button.classList.add("white");
        map_switch_button__text.innerHTML = "Satellite";

        // place marker on the map
        putMarker(coords[0], coords[1]);

        // action

        // updated zoom and position according to the main map
        map.on("move zoom", function () {
            map_switch.setView(map.getCenter(), map.getZoom() / 1.25);
        });

        // switch the map
        map_switch_button.addEventListener("click", function () {
            if (map.hasLayer(googleStreets)) {
                // main map -> satellite

                map.removeLayer(googleStreets);
                map.addLayer(GoogleSat);

                map_switch.removeLayer(googleSatNoLabels);
                map_switch.addLayer(googleStreetsNoLabels);

                map_switch_button__text.innerHTML = "Plan";
                map_switch_button.classList.remove("white");
                map_switch_button.classList.add("black");
            } else {
                // main map -> plan

                map.removeLayer(GoogleSat);
                map.addLayer(googleStreets);

                map_switch.removeLayer(googleStreetsNoLabels);
                map_switch.addLayer(googleSatNoLabels);

                map_switch_button__text.innerHTML = "Satellite";
                map_switch_button.classList.remove("black");
                map_switch_button.classList.add("white");
            }
        });

        // user click on the map
        map.addEventListener("click", (e) => {
            putMarker(e.latlng.lat, e.latlng.lng, false, null, true);
            searchAddress_GeographicCoordinate(e.latlng.lat, e.latlng.lng).then((results) => {
                let firstAddrField = "";
                let lastAddrField = "";

                // define result var
                let result_houseNumber = results.address.house_number;
                let result_road = results.address.road;
                let result_postcode = results.address.postcode;
                let result_city = results.address.city;

                // create text var
                if (result_houseNumber) firstAddrField += result_houseNumber + " ";
                if (result_road) firstAddrField += result_road;
                if (result_postcode) lastAddrField += result_postcode + " ";
                if (result_city) lastAddrField += result_city;

                // add text on page
                let adress = document.querySelector("#pointInformation__info__text #adress");
                let postcode_city = document.querySelector("#pointInformation__info__text #postcode_city");
                let geopoint = document.querySelector("#pointInformation__info__text #geopoint");

                adress.innerHTML = firstAddrField;
                postcode_city.innerHTML = lastAddrField;
                geopoint.innerHTML = e.latlng.lat + " , " + e.latlng.lng;

                // display section
                let pointInformation = document.querySelector("#pointInformation");
                pointInformation.classList.remove("none");
            });

            // delete on escape
            document.addEventListener("keydown", function (e) {
                if (e.key == "Escape") {
                    if (currentMarker) currentMarker.remove();
                    let pointInformation = document.querySelector("#pointInformation");
                    pointInformation.classList.add("none");
                }
            });
        });
    })
    .catch(function (error) {
        console.log("Une erreur s'est produite lors de la récupération de la position de l'utilisateur : " + error.message);
    });
