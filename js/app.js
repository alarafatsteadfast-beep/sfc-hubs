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

initTreeToggles();
initSidebarCollapse();
initSidebarRail();
initSearch();
initClearFilters();
loadHubData();
resetAllSections();

const hubDetailsClose = document.getElementById("hubDetailsClose");
const hubPanel = document.getElementById("hubDetailsPanel");
const overlay = document.getElementById("mapOverlay");

if (hubDetailsClose) {
  hubDetailsClose.addEventListener("click", hideHubDetailsPanel);
}

if (overlay) {
  overlay.addEventListener("click", hideHubDetailsPanel);
}

let startY = 0;
let currentY = 0;
let dragging = false;

if (hubPanel) {

  hubPanel.addEventListener("touchstart", function(e) {

    if (window.innerWidth > 768) return;

    dragging = true;
    startY = e.touches[0].clientY;

  });

  hubPanel.addEventListener("touchmove", function(e) {

    if (!dragging) return;

    currentY = e.touches[0].clientY;

    const diff = currentY - startY;

    if (diff > 0) {
      hubPanel.style.transform = `translateY(${diff}px)`;
    }

  });

  hubPanel.addEventListener("touchend", function() {

    dragging = false;

    const diff = currentY - startY;

    if (diff > 120) {
      hideHubDetailsPanel();
      hubPanel.style.transform = "";
      return;
    }

    hubPanel.style.transform = "";

  });

}

window.addEventListener("resize", function() {

  if (typeof map !== "undefined") {
    map.invalidateSize();
  }

});