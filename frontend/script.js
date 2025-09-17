const map = L.map('map').setView([31.818, 75.207], 13);

function filterRoute() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Please select both start and destination stops.");
    return;
  }

  alert(`Searching route from ${start} to ${end}`);
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const busStops = [
  { name: "Batala Bus Stand", coords: [31.818, 75.207] },
  { name: "Railway Road Stop", coords: [31.820, 75.215] },
  { name: "City Market Stop", coords: [31.825, 75.225] },
  { name: "Civil Hospital Stop", coords: [31.822, 75.212] },
  { name: "Model Town Stop", coords: [31.824, 75.218] },
  { name: "Gurdwara Bunga Stop", coords: [31.827, 75.222] },
  { name: "Sadar Bazar Stop", coords: [31.829, 75.228] }
];

// Add bus stops to map
busStops.forEach(stop => {
  L.marker(stop.coords).addTo(map)
    .bindPopup(`${stop.name}`, { closeButton: false });
});

// Populate dropdowns dynamically
const startSelect = document.getElementById("start");
const endSelect = document.getElementById("end");

busStops.forEach(stop => {
  const option1 = document.createElement("option");
  option1.value = stop.name;
  option1.textContent = stop.name;
  startSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = stop.name;
  option2.textContent = stop.name;
  endSelect.appendChild(option2);
});

// Routes
const route_1 = [
  [31.818, 75.207],
  [31.820, 75.215],
  [31.825, 75.225]
];

L.polyline(route_1, { color: 'blue' }).addTo(map)
  .bindPopup("Bus Route 1");

const route_2 = [
  [31.822, 75.212],
  [31.824, 75.218],
  [31.827, 75.222],
  [31.829, 75.228]
];

L.polyline(route_2, { color: 'green' }).addTo(map)
  .bindPopup("Bus Route 2");
