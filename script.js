var map = L.map('map').setView([23.6850, 90.3563], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
 attribution:'© OpenStreetMap'
}).addTo(map);

var markers = L.markerClusterGroup();
var hubMarkers = [];

fetch("hubs.json")
.then(res => res.json())
.then(data => {

data.forEach(hub => {

var marker = L.marker([hub.lat, hub.lng]);

var popup = `
<div class="hub-popup">

<h2 class="title">Hub Details</h2>

<div class="box full"><b>Name:</b> ${hub.name}</div>

<div class="box full"><b>Address:</b> ${hub.address}</div>

<div class="grid2">
<div class="box"><b>Hub ID:</b> ${hub.hub_id}</div>
<div class="box"><b>Zone:</b> ${hub.zone}</div>
</div>

<div class="grid2">
<div class="box"><b>District:</b> ${hub.district}</div>
<div class="box"><b>Division:</b> ${hub.division}</div>
</div>

<div class="box full">
<b>Coordinates:</b> ${hub.lat}, ${hub.lng}
</div>

<hr>

<div class="section">Contact Details</div>

<div class="grid2">
<div class="box"><b>Hub IP:</b> ${hub.hub_ip}</div>
<div class="box"><b>Hub Phone:</b> ${hub.hub_phone}</div>
</div>

<div class="grid2">
<div class="box"><b>Manager:</b> ${hub.manager}</div>
<div class="box"><b>Phone:</b> ${hub.manager_phone}</div>
</div>

<div class="grid2">
<div class="box"><b>Asst. Manager:</b> ${hub.assistant_manager}</div>
<div class="box"><b>Phone:</b> ${hub.assistant_manager_phone}</div>
</div>

<div class="grid2">
<div class="box"><b>Hub Asst:</b> ${hub.hub_assistant}</div>
<div class="box"><b>Phone:</b> ${hub.hub_assistant_phone}</div>
</div>

<hr>

<div style="text-align:center;">
<a class="direction-btn"
target="_blank"
href="https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}">
Get Directions
</a>
</div>

</div>
`;

marker.bindPopup(popup);

marker.hubName = hub.name.toLowerCase();

markers.addLayer(marker);
hubMarkers.push(marker);

});

map.addLayer(markers);

});

/* SEARCH SYSTEM */

document.getElementById("searchBox").addEventListener("keyup",function(){

var value = this.value.toLowerCase();

hubMarkers.forEach(marker=>{

if(marker.hubName.includes(value)){

map.setView(marker.getLatLng(),12);
marker.openPopup();

}

});

});