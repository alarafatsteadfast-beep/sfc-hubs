// Initialize map
var map = L.map('map').setView([23.6850, 90.3563], 7);

// Map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Marker cluster
var markers = L.markerClusterGroup();
var hubMarkers = [];
var allHubs = [];

// Google Sheet CSV
const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYDLFsB6QUf0Vf0kL-COmVR3eh0jXOLnBG1r6stjL7hVf8-kvpV-KjCAv9R9QKAO0C6E00XGfw7I0q/pub?output=csv";

// Live clock
function updateDateTime() {
  const timeEl = document.getElementById("liveDateTime");
  if (!timeEl) return;

  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  };

  timeEl.textContent = now.toLocaleString("en-US", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Parse CSV
Papa.parse(sheetURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    const hubs = results.data || [];

    hubs.forEach(hub => {
      if (!hub.lat || !hub.lng) return;

      const lat = parseFloat(hub.lat);
      const lng = parseFloat(hub.lng);

      if (isNaN(lat) || isNaN(lng)) return;

      var marker = L.marker([lat, lng]);

      var popup = `
        <div class="hub-popup">

          <h2 class="title">Hub Details</h2>

          <div class="box"><b>Name:</b> ${hub.name || ""}</div>

          <div class="box"><b>Address:</b> ${hub.address || ""}</div>

          <div class="grid2">
            <div class="box"><b>Hub ID:</b> ${hub.hub_id || ""}</div>
            <div class="box"><b>Zone:</b> ${hub.zone || ""}</div>
          </div>

          <div class="grid2">
            <div class="box"><b>District:</b> ${hub.district || ""}</div>
            <div class="box"><b>Division:</b> ${hub.division || ""}</div>
          </div>

          <div class="box">
            <b>Coordinates:</b> ${lat}, ${lng}
          </div>

          <hr>

          <div class="section">Contact Details</div>

          <div class="grid2">
            <div class="box"><b>Hub IP:</b> ${hub.hub_ip || ""}</div>
            <div class="box"><b>Hub Phone:</b> ${hub.hub_phone || ""}</div>
          </div>

          <div class="grid2">
            <div class="box"><b>Manager:</b> ${hub.manager || ""}</div>
            <div class="box"><b>Phone:</b> ${hub.manager_phone || ""}</div>
          </div>

          <div class="grid2">
            <div class="box"><b>Asst. Manager:</b> ${hub.assistant_manager || ""}</div>
            <div class="box"><b>Phone:</b> ${hub.assistant_manager_phone || ""}</div>
          </div>

          <div class="grid2">
            <div class="box"><b>Hub Asst:</b> ${hub.hub_assistant || ""}</div>
            <div class="box"><b>Phone:</b> ${hub.hub_assistant_phone || ""}</div>
          </div>

          <hr>

          <div style="text-align:center;">
            <button class="direction-btn" onclick="openDirections(${lat},${lng})">
              📍 Get Directions
            </button>
          </div>

        </div>
      `;

      marker.bindPopup(popup, {
        maxWidth: 360,
        minWidth: 360,
        className: "custom-popup"
      });

      marker.hubName = (hub.name || "").toLowerCase();
      marker.hubData = hub;

      markers.addLayer(marker);
      hubMarkers.push(marker);

      allHubs.push({
        name: hub.name || "",
        zone: hub.zone || "",
        district: hub.district || "",
        division: hub.division || "",
        marker: marker
      });
    });

    map.addLayer(markers);
    renderTrees(allHubs);
  },
  error: function() {
    const hubTree = document.getElementById("hubTree");
    if (hubTree) {
      hubTree.innerHTML = `<div class="tree-item empty-tree">Failed to load hub data</div>`;
    }
  }
});

// Render all trees
function renderTrees(hubs) {
  renderHubTree(hubs);

  const zones = [...new Set(hubs.map(h => h.zone).filter(Boolean))].sort();
  const districts = [...new Set(hubs.map(h => h.district).filter(Boolean))].sort();
  const divisions = [...new Set(hubs.map(h => h.division).filter(Boolean))].sort();

  renderSimpleTree("zoneTree", zones);
  renderSimpleTree("districtTree", districts);
  renderSimpleTree("divisionTree", divisions);
}

// Render hub tree
function renderHubTree(hubs) {
  const hubTree = document.getElementById("hubTree");
  if (!hubTree) return;

  hubTree.innerHTML = "";

  if (hubs.length === 0) {
    hubTree.innerHTML = `<div class="tree-item empty-tree">No hubs found</div>`;
    return;
  }

  hubs.forEach(hub => {
    const item = document.createElement("div");
    item.className = "tree-item";

    const link = document.createElement("span");
    link.className = "tree-link";
    link.textContent = `• ${hub.name}`;

    link.addEventListener("click", function() {
      map.setView(hub.marker.getLatLng(), 12);
      hub.marker.openPopup();
    });

    item.appendChild(link);
    hubTree.appendChild(item);
  });
}

// Render simple lists
function renderSimpleTree(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `<div class="tree-item empty-tree">No data</div>`;
    return;
  }

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "tree-item";
    row.textContent = `• ${item}`;
    container.appendChild(row);
  });
}

// Search: filter hub tree only
document.getElementById("searchBox").addEventListener("input", function() {
  const value = this.value.toLowerCase().trim();

  const filtered = allHubs.filter(hub =>
    hub.name.toLowerCase().includes(value)
  );

  renderHubTree(filtered);
});

// Google Maps direction
function openDirections(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank", "noopener,noreferrer");
}