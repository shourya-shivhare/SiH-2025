// Initialize map
const map = L.map('map').setView([31.818, 75.207], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Bus stops data
const busStops = [
  { name: "Batala Bus Stand", coords: [31.818, 75.207] },
  { name: "Railway Road Stop", coords: [31.820, 75.215] },
  { name: "City Market Stop", coords: [31.825, 75.225] },
  { name: "Civil Hospital Stop", coords: [31.822, 75.212] },
  { name: "Model Town Stop", coords: [31.824, 75.218] },
  { name: "Gurdwara Bunga Stop", coords: [31.827, 75.222] },
  { name: "Sadar Bazar Stop", coords: [31.829, 75.228] }
];

// Add bus stop markers with small SVG bus icon
busStops.forEach(stop => {
  L.marker(stop.coords, {
    icon: L.icon({
      iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Bus_font_awesome.svg",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }).addTo(map).bindPopup(stop.name, { closeButton: false });
});

// Populate dropdowns
const startSelect = document.getElementById("start");
const endSelect = document.getElementById("end");

busStops.forEach(stop => {
  startSelect.add(new Option(stop.name, stop.coords.join(",")));
  endSelect.add(new Option(stop.name, stop.coords.join(",")));
});

// Global variables
let routingControl = null;
let userMarker = null;
let busMarker = null;
let busAnimation = null;

// Show route function
function filterRoute() {
  const startCoords = startSelect.value.split(",").map(Number);
  const endCoords = endSelect.value.split(",").map(Number);

  if (routingControl) {
    routingControl.setWaypoints([
      L.latLng(startCoords[0], startCoords[1]),
      L.latLng(endCoords[0], endCoords[1])
    ]);
  } else {
    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startCoords[0], startCoords[1]),
        L.latLng(endCoords[0], endCoords[1])
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
      const route = e.routes[0];
      const distance = (route.summary.totalDistance / 1000).toFixed(2);
      const duration = Math.round(route.summary.totalTime / 60);

      const infoBox = document.getElementById("route-info");
      document.getElementById("distance").innerText = `${distance} km`;
      document.getElementById("duration").innerText = `${duration} mins`;

      infoBox.style.display = "block";
      infoBox.classList.add("show");

      // Animate bus along the route
      animateBus(route);
    });
  }
}

// Locate user function
function locateMe() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (userMarker) map.removeLayer(userMarker);

    userMarker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png", // user icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })
    }).addTo(map).bindPopup("📍 You are here").openPopup();

    map.setView([lat, lng], 15);

    // Find nearest bus stop
    let nearest = null;
    let minDist = Infinity;
    busStops.forEach(stop => {
      const dist = map.distance([lat, lng], stop.coords);
      if (dist < minDist) {
        minDist = dist;
        nearest = stop;
      }
    });

    if (nearest) {
      startSelect.value = nearest.coords.join(",");
      filterRoute();

      const infoBox = document.getElementById("route-info");
      infoBox.innerHTML += `<p>📍 Nearest Stop: <b>${nearest.name}</b> (${(minDist / 1000).toFixed(2)} km)</p>`;
    }
  }

  function error() {
    alert("Unable to retrieve your location.");
  }
}

// Swap start and end stops
function swapStops() {
  const temp = startSelect.value;
  startSelect.value = endSelect.value;
  endSelect.value = temp;
  filterRoute();
}

// Animate bus along route (SVG bus icon)
function animateBus(route) {
  if (busMarker) map.removeLayer(busMarker);
  if (busAnimation) clearInterval(busAnimation);

  const coords = route.coordinates;
  if (!coords || coords.length < 2) return;

  busMarker = L.marker([coords[0].lat, coords[0].lng], {
    icon: L.icon({
      iconUrl: "bus icon.png", // SVG bus icon
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }).addTo(map);

  let i = 0;
  busAnimation = setInterval(() => {
    if (i >= coords.length) {
      clearInterval(busAnimation);
      return;
    }
    busMarker.setLatLng([coords[i].lat, coords[i].lng]);
    i++;
  }, 200);
}
