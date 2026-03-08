var map = L.map('map').setView([23.6850, 90.3563], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap'
}).addTo(map);

var marker = L.marker([23.7806, 90.4070]).addTo(map);

marker.bindPopup(`
<b>Dhaka Central Hub</b><br>
Address: Gulshan 1<br>
Hub Phone: 017xxxxxx<br>
Manager: Rahim Ahmed<br>
<a href="https://www.google.com/maps/dir/?api=1&destination=23.7806,90.4070" target="_blank">Get Directions</a>
`);