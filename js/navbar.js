// manage the navbar

// SAVE LOCATION
let navbarSave = document.querySelector("#navbar__lieuxEnregistre");
navbarSave.addEventListener("click", () => {
    let locationUserList = document.querySelector("#locationUserList");
    let locationUserList__save = document.querySelector("#locationUserList__save");
    if (locationUserList__save.classList.contains("none")) {
        // open the favorite location list

        navbarSave.classList.remove("unactive");
        let imgNavBar = navbarSave.querySelector("img");
        imgNavBar.src = "assets/icons/grey/bookmark-empty.svg";

        locationUserList.classList.remove("none");
        locationUserList__save.classList.remove("none");
        let locationUserList__historic = document.querySelector("#locationUserList__historic");
        locationUserList__historic.classList.add("none");
        let imgNavBarHist = navbarHistoric.querySelector("img");
        imgNavBarHist.src = "assets/icons/grey_light/clock.svg";
        navbarHistoric.classList.add("unactive");

        // shift mini map
        let map_switch_button = document.querySelector("#switchMap__mainButton");
        map_switch_button.classList.add("rightlvl2");

        saveLocations = getLocation("favoriteLocation");

        locationUserList__save.innerHTML = "";

        // create the html element
        saveLocations.forEach((location, index) => {
            let locationElContainer = createElement("div", locationUserList__save, null, ["locationUserList__save__element"]);
            let elButtonLocation = createElement("button", locationElContainer, null, ["locationUserList__save__element__content"], {
                city: location.cityName,
                firstField: location.addrFirstField,
                lastField: location.AddrLastField,
                firstImg: location.imgLink,
                lat: location.dataLat,
                lon: location.dataLon,
            });

            let elImgContainer = createElement("div", elButtonLocation, null, ["locationUserList__save__element__content__img"]);
            let elImg = createElement("img", elImgContainer, null, [], { src: location.imgLink });

            let elTextContainer = createElement("div", elButtonLocation, null, ["locationUserList__save__element__content__text"]);
            let elTextFirst = createElement("p", elTextContainer, null, [], {}, location.addrFirstField);
            let elTextLast = createElement("p", elTextContainer, null, [], {}, location.AddrLastField);

            let elButtonUnsave = createElement("button", locationElContainer, null, ["locationUserList__save__element__unsave"]);
            let elButtonUnsaveImg = createElement("img", elButtonUnsave, null, [], { src: "assets/icons/blue/bookmark-solid.svg" });

            // delete favorite location
            elButtonUnsave.addEventListener("click", () => {
                removeLocation("favoriteLocation", index);

                // refresh locations
                locationUserList.classList.add("none");
                locationUserList__save.classList.add("none");
                navbarSave.click();
            });
        });

        // redirect on location page
        let locationElements = document.querySelectorAll(".locationUserList__save__element__content");
        locationElements.forEach((locationElement) => {
            locationElement.addEventListener("click", () => {
                let city = locationElement.getAttribute("city");
                let firstField = locationElement.getAttribute("firstField");
                let lastField = locationElement.getAttribute("lastField");
                let firstImg = locationElement.getAttribute("firstImg");

                // put marker
                putMarker(lat, lon, true);

                // rechercher les autres photos
                getCityImg(city).then((result) => {
                    let firstImgHTML = document.querySelector("#adressResultInfo__img img");
                    firstImgHTML.src = firstImg;

                    let otherImgs = document.querySelectorAll("#adressResultInfo__photos img");

                    otherImgs.forEach((element, index) => {
                        element.src = result[index + 1].urls.regular;
                    });
                });

                // rechercher les infos wikipedia de la ville
                getWikipediaInfo(city).then((result) => {
                    let textInformation = document.querySelector("#adressResultInfo__text p");
                    textInformation.innerHTML = getTextFromHtml(result.summary);
                });

                // adresse
                let addrFirst = document.querySelector("#adressResultInfo__principal__adress p:first-child");
                let addrLast = document.querySelector("#adressResultInfo__principal__adress p:last-child");

                addrFirst.innerHTML = firstField;
                addrLast.innerHTML = lastField;

                // undisplay favorite location
                locationUserList__save.classList.toggle("none");
                locationUserList.classList.toggle("none");

                // display page
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

                // undisplay save button
                let saveButton = document.querySelector("#adressResultInfo__button");
                saveButton.classList.add("none");
            });
        });
    } else {
        let locationUserList = document.querySelector("#locationUserList");
        locationUserList.classList.add("none");
        let locationUserList__save = document.querySelector("#locationUserList__save");
        locationUserList__save.classList.add("none");
        let locationUserList__historic = document.querySelector("#locationUserList__historic");
        locationUserList__historic.classList.add("none");

        // shift mini map
        let map_switch_button = document.querySelector("#switchMap__mainButton");
        map_switch_button.classList.remove("rightlvl2");

        // navbar design
        navbarSave.classList.add("unactive");
        let imgNavBar = navbarSave.querySelector("img");
        imgNavBar.src = "assets/icons/grey_light/bookmark-empty.svg";
    }

    // undisplay adress section
    let adressResultInfo = document.querySelector("#adressResultInfo");
    adressResultInfo.classList.add("none");
    // undisplay the close button
    let separator = document.querySelector("#searchbar__input__button .separator");
    let xmarkButton = document.querySelector("#searchbar__input__button #xmarkButton");
    separator.classList.add("none");
    xmarkButton.classList.add("none");
});

// HISTORIC LOCATION
let navbarHistoric = document.querySelector("#navbar__historique");
navbarHistoric.addEventListener("click", () => {
    let locationUserList = document.querySelector("#locationUserList");
    let locationUserList__historic = document.querySelector("#locationUserList__historic");
    if (locationUserList__historic.classList.contains("none")) {
        // open the favorite location list

        navbarHistoric.classList.remove("unactive");
        let imgNavBar = navbarHistoric.querySelector("img");
        imgNavBar.src = "assets/icons/grey/clock.svg";

        locationUserList.classList.remove("none");
        locationUserList__historic.classList.remove("none");
        let locationUserList__save = document.querySelector("#locationUserList__save");
        locationUserList__save.classList.add("none");
        let imgNavBarFav = navbarSave.querySelector("img");
        imgNavBarFav.src = "assets/icons/grey_light/bookmark-empty.svg";
        navbarSave.classList.add("unactive");

        // shift mini map
        let map_switch_button = document.querySelector("#switchMap__mainButton");
        map_switch_button.classList.add("rightlvl2");

        historicLocation = getLocation("historicLocation");

        locationUserList__historic.innerHTML = "";

        // create the html element
        historicLocation.forEach((location, index) => {
            let locationElContainer = createElement("div", locationUserList__historic, null, ["locationUserList__historic__element"]);
            let elButtonLocation = createElement("button", locationElContainer, null, ["locationUserList__historic__element__content"], {
                city: location.cityName,
                firstField: location.addrFirstField,
                lastField: location.AddrLastField,
                firstImg: location.imgLink,
                lat: location.dataLat,
                lon: location.dataLon,
            });

            let elImgContainer = createElement("div", elButtonLocation, null, ["locationUserList__historic__element__content__img"]);
            let elImg = createElement("img", elImgContainer, null, [], { src: location.imgLink });

            let elTextContainer = createElement("div", elButtonLocation, null, ["locationUserList__historic__element__content__text"]);
            let elTextFirst = createElement("p", elTextContainer, null, [], {}, location.addrFirstField);
            let elTextLast = createElement("p", elTextContainer, null, [], {}, location.AddrLastField);
        });

        // redirect on location page
        let locationElements = document.querySelectorAll(".locationUserList__historic__element__content");
        locationElements.forEach((locationElement) => {
            locationElement.addEventListener("click", () => {
                let city = locationElement.getAttribute("city");
                let firstField = locationElement.getAttribute("firstField");
                let lastField = locationElement.getAttribute("lastField");
                let firstImg = locationElement.getAttribute("firstImg");
                let lat = locationElement.getAttribute("lat");
                let lon = locationElement.getAttribute("lon");

                // put marker
                putMarker(lat, lon, true);

                // rechercher les autres photos
                getCityImg(city).then((result) => {
                    let firstImgHTML = document.querySelector("#adressResultInfo__img img");
                    firstImgHTML.src = firstImg;

                    let otherImgs = document.querySelectorAll("#adressResultInfo__photos img");

                    otherImgs.forEach((element, index) => {
                        element.src = result[index + 1].urls.regular;
                    });
                });

                // rechercher les infos wikipedia de la ville
                getWikipediaInfo(city).then((result) => {
                    let textInformation = document.querySelector("#adressResultInfo__text p");
                    textInformation.innerHTML = getTextFromHtml(result.summary);
                });

                // adresse
                let addrFirst = document.querySelector("#adressResultInfo__principal__adress p:first-child");
                let addrLast = document.querySelector("#adressResultInfo__principal__adress p:last-child");

                addrFirst.innerHTML = firstField;
                addrLast.innerHTML = lastField;

                // undisplay favorite location
                locationUserList__historic.classList.toggle("none");
                locationUserList.classList.toggle("none");

                // display page
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

                // undisplay save button
                let saveButton = document.querySelector("#adressResultInfo__button");
                saveButton.classList.add("none");
            });
        });
    } else {
        let locationUserList = document.querySelector("#locationUserList");
        locationUserList.classList.add("none");
        let locationUserList__historic = document.querySelector("#locationUserList__historic");
        locationUserList__historic.classList.add("none");
        let locationUserList__save = document.querySelector("#locationUserList__save");
        locationUserList__save.classList.add("none");

        // shift mini map
        let map_switch_button = document.querySelector("#switchMap__mainButton");
        map_switch_button.classList.remove("rightlvl2");

        // navbar design
        navbarHistoric.classList.add("unactive");
        let imgNavBar = navbarHistoric.querySelector("img");
        imgNavBar.src = "assets/icons/grey_light/clock.svg";
    }

    // undisplay adress section
    let adressResultInfo = document.querySelector("#adressResultInfo");
    adressResultInfo.classList.add("none");
    // undisplay the close button
    let separator = document.querySelector("#searchbar__input__button .separator");
    let xmarkButton = document.querySelector("#searchbar__input__button #xmarkButton");
    separator.classList.add("none");
    xmarkButton.classList.add("none");
});

// minimise button
let userList_closeButton = document.querySelector("#locationUserList__minimiseButton");
userList_closeButton.addEventListener("click", () => {
    let locationUserList = document.querySelector("#locationUserList");
    locationUserList.classList.add("none");
    let locationUserList__save = document.querySelector("#locationUserList__save");
    locationUserList__save.classList.add("none");
    let locationUserList__historic = document.querySelector("#locationUserList__historic");
    locationUserList__historic.classList.add("none");

    // minimap
    let map_switch_button = document.querySelector("#switchMap__mainButton");
    map_switch_button.classList.remove("rightlvl2");

    // navbar design
    navbarSave.classList.add("unactive");
    navbarHistoric.classList.add("unactive");
    let imgNavBarSave = navbarSave.querySelector("img");
    imgNavBarSave.src = "assets/icons/grey_light/bookmark-empty.svg";
    let imgNavBarHist = navbarHistoric.querySelector("img");
    imgNavBarHist.src = "assets/icons/grey_light/clock.svg";
});
