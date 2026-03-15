function buildPopup(hub, lat, lng) {
  return `
    <div class="hub-popup">

      <div class="hub-popup-body">

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

      </div>

      <div class="hub-popup-footer">
        <button class="direction-btn" onclick="openDirections(${lat},${lng})">
          📍 Get Directions
        </button>
      </div>

    </div>
  `;
}

function openDirections(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank", "noopener,noreferrer");
}