async function searchAddress_Text(text) {
    // search address from text
    let url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(text) + "&format=json&addressdetails=1&limit=5";

    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error("Erreur lors de la requête à l'API OpenStreetMap : " + error);
        });
}

async function searchAddress_GeographicCoordinate(lat, lon) {
    // search address from geographic coordinate
    let url = "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=json&addressdetails=1&limit=5";

    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error("Erreur lors de la requête à l'API OpenStreetMap : " + error);
        });
}

async function getWikipediaInfo(city) {
    // search city information

    const apiKeyWikipedia = "CODE API";

    // Recherche de la page correspondante à la ville
    let searchUrl = `https://fr.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${city}&utf8=&origin=*&apikey=${apiKeyWikipedia}`;
    return fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => {
            let pageId = data.query.search[0].pageid;
            // Récupération du résumé et du lien de la page
            let contentUrl = `https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&pageids=${pageId}&exsentences=3&exintro=1&origin=*&apikey=${apiKeyWikipedia}`;

            return fetch(contentUrl)
                .then((response) => response.json())
                .then((data) => {
                    let summary = data.query.pages[pageId].extract;
                    let pageUrl = `https://fr.wikipedia.org/?curid=${pageId}`;

                    return { summary, pageUrl };
                });
        })
        .catch((error) => console.error(error));
}

async function getCityImg(city) {
    const endpoint = "https://api.unsplash.com/search/photos";
    const apiKeyUnsplash = "CODE API";

    const params = { query: `${city}`, per_page: 4 };

    return fetch(`${endpoint}?${new URLSearchParams(params)}`, {
        headers: { Authorization: `Client-ID ${apiKeyUnsplash}` },
    })
        .then((response) => response.json())
        .then((data) => {
            return data.results;
        })
        .catch((error) => {
            console.error(error);
        });
}

let searchBar = document.querySelector("#searchbar__input__input");
let timeoutId;

searchbar.addEventListener("input", function () {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async function () {
        let continueSearch = true;
        searchAddress_Text(searchBar.value).then((results) => {
            // supprimer les résultats précédents
            let resultList = document.querySelector("#searchbar__result");
            resultList.innerHTML = "";
            resultList.classList.remove("none");

            let allResultsButton = [];

            if (continueSearch == true) {
                results.forEach((address) => {
                    // afficher les résultats

                    // texte affiché
                    let firstAddrField = "";
                    let lastAddrField = "";
                    let lastAddrFieldCondition = true;

                    // definition des var de résultats pour plus de clarté
                    let addr_houseNumber = address.address.house_number;
                    let addr_road = address.address.road;
                    let addr_hamlet = address.address.hamlet;
                    let addr_natural = address.address.natural;
                    let addr_tourism = address.address.tourism;
                    let addr_postcode = address.address.postcode;
                    let addr_city = address.address.city;
                    let addr_village = address.address.village;
                    let addr_lat = address.lat;
                    let addr_lon = address.lon;

                    // premier champ
                    if (addr_houseNumber) {
                        firstAddrField += addr_houseNumber + " ";
                    }
                    if (addr_road) {
                        firstAddrField += addr_road + " ";
                    }
                    if (addr_hamlet) {
                        firstAddrField = addr_hamlet + " ";
                    }
                    if (addr_natural) {
                        firstAddrField = addr_natural;
                        lastAddrFieldCondition = false;
                    }
                    if (addr_tourism) {
                        firstAddrField = addr_tourism;
                        lastAddrFieldCondition = false;
                    }

                    // second champ
                    if (lastAddrFieldCondition == true) {
                        if (addr_postcode) {
                            lastAddrField += addr_postcode + " ";
                        }
                        if (addr_city) {
                            lastAddrField += addr_city;
                        } else if (addr_village) {
                            lastAddrField += addr_village;
                        }
                    }

                    // affichage
                    resultText = firstAddrField + lastAddrField;
                    if (resultText != "") {
                        result = createElement("button", resultList, null, [], { firstField: firstAddrField, lastField: lastAddrField, lat: addr_lat, lon: addr_lon, city: addr_city }, resultText);

                        allResultsButton.push(result);
                    }

                    // delete on escape
                    document.addEventListener("keydown", function (e) {
                        if (e.key == "Escape") {
                            resultList.innerHTML = "";
                        }
                    });
                });

                allResultsButton.forEach((button) => {
                    button.addEventListener("click", () => {
                        continueSearch = false;
                        // adresse choisie

                        // get attribute
                        let firstField = button.getAttribute("firstField");
                        let lastField = button.getAttribute("lastField");
                        let lat = button.getAttribute("lat");
                        let lon = button.getAttribute("lon");
                        let city = button.getAttribute("city");

                        putMarker(lat, lon, true, 15);

                        // affichage des informations de l'adresse
                        let addrFirst = document.querySelector("#adressResultInfo__principal__adress p:first-child");
                        let addrLast = document.querySelector("#adressResultInfo__principal__adress p:last-child");

                        addrFirst.innerHTML = firstField;
                        addrLast.innerHTML = lastField;

                        getWikipediaInfo(city).then((result) => {
                            let textInformation = document.querySelector("#adressResultInfo__text p");
                            textInformation.innerHTML = getTextFromHtml(result.summary);
                        });

                        let firstImgUrl = "";
                        getCityImg(city).then((result) => {
                            let firstImg = document.querySelector("#adressResultInfo__img img");
                            firstImg.src = result[0].urls.regular;
                            firstImgUrl = result[0].urls.regular; // for cookie

                            let otherImgs = document.querySelectorAll("#adressResultInfo__photos img");

                            otherImgs.forEach((element, index) => {
                                element.src = result[index + 1].urls.regular;
                            });
                        });

                        // display section
                        let adressResultInfo = document.querySelector("#adressResultInfo");
                        adressResultInfo.classList.remove("none");

                        // move switch map button
                        let map_switch_button = document.querySelector("#switchMap__mainButton");
                        map_switch_button.classList.add("rightlvl2");

                        // display close button
                        let noneElements = document.querySelectorAll("#searchbar__input__button .none");
                        noneElements.forEach((element) => {
                            element.classList.remove("none");
                        });

                        // give possibility to save the address
                        let saveButton = document.querySelector("#saveLoc");
                        saveButton.addEventListener("click", () => {
                            addLocation("favoriteLocation", lat, lon, city, firstField, lastField, firstImgUrl);
                        });

                        // save in historic
                        // timeout for api time
                        setTimeout(() => {
                            addLocation("historicLocation", lat, lon, city, firstField, lastField, firstImgUrl);
                        }, 1000);

                        resultList.innerHTML = "";
                    });
                });
            }
        });
    }, 150);
});

// close button
let closeButton = document.querySelector("#xmarkButton");
closeButton.addEventListener("click", () => {
    let adressResultInfo = document.querySelector("#adressResultInfo");
    adressResultInfo.classList.add("none");

    let map_switch_button = document.querySelector("#switchMap__mainButton");
    map_switch_button.classList.remove("rightlvl2");

    // undisplay the close button
    let separator = document.querySelector("#searchbar__input__button .separator");
    let xmarkButton = document.querySelector("#searchbar__input__button #xmarkButton");
    separator.classList.add("none");
    xmarkButton.classList.add("none");
});

// remove result list when click outside
let searchbarGlobal = document.querySelector("#searchbar");
let resultList = document.querySelector("#searchbar__result");
document.addEventListener("click", function (event) {
    const isClickInsideSearchbar = searchbarGlobal.contains(event.target);

    if (!isClickInsideSearchbar) {
        resultList.innerHTML = "";
    }
});
document.addEventListener("focusin", function (event) {
    const isFocusInsideSearchbar = searchbarGlobal.contains(event.target);

    if (!isFocusInsideSearchbar) {
        resultList.innerHTML = "";
    }
});
