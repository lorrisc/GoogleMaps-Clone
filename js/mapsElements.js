let map;
let currentMarker;

// CUSTOMS MARKERS
let markerSizeFactor = 16;
const marker = L.icon({
    iconUrl: "assets/icons/marker.png",
    iconSize: [373 / markerSizeFactor, 669 / markerSizeFactor],
    iconAnchor: [373 / markerSizeFactor / 2, 669 / markerSizeFactor],
});

// LAYERS MAPS
// classique avec anotation
let googleStreets = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

// classique sans anotation
let googleStreetsNoLabels = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

// satellite avec anotation
let GoogleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

// satellite sans anotation
let googleSatNoLabels = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

// terrain avec anotation
let googleTerrain = L.tileLayer("http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});
