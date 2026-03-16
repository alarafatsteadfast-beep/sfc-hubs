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

function applySearchValue(value) {
  const searchBox = document.getElementById("searchBox");
  if (!searchBox) return;

  searchBox.value = value || "";

  if (typeof renderTrees === "function") {
    renderTrees();
  }

  if (typeof getFilteredHubs === "function" && typeof updateVisibleMarkers === "function") {
    const filtered = getFilteredHubs();
    updateVisibleMarkers(filtered);

    if (typeof fitMapToFilteredHubs === "function" && filtered.length > 0) {
      fitMapToFilteredHubs(filtered);
    }
  }
}

function handleURLNavigation() {
  if (typeof allHubs === "undefined" || !Array.isArray(allHubs) || allHubs.length === 0) return;

  const params = new URLSearchParams(window.location.search);

  if (params.has("search")) {
    applySearchValue(params.get("search"));
  }

  if (params.has("hub")) {
    const hubName = params.get("hub");
    const targetHub = allHubs.find(function(hub) {
      return (hub.name || "").toLowerCase() === (hubName || "").toLowerCase();
    });

    if (targetHub) {
      focusHubOnMap(targetHub, 13);
      return;
    }
  }

  if (params.has("lat") && params.has("lng") && typeof map !== "undefined") {
    const lat = parseFloat(params.get("lat"));
    const lng = parseFloat(params.get("lng"));

    if (!isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], 13);
    }
  }
}

function initFreshHomeWhenReady() {
  let tries = 0;
  const maxTries = 80;

  const timer = setInterval(function() {
    const hubsReady =
      typeof allHubs !== "undefined" &&
      Array.isArray(allHubs) &&
      allHubs.length > 0;

    if (hubsReady) {
      clearInterval(timer);

      if (typeof renderTrees === "function") {
        renderTrees();
      }

      updateVisibleMarkers(allHubs);
      resetMapView();
      resetAllSections();

      if (window.location.search) {
        handleURLNavigation();
      }

      if (typeof updateQuickAccessPreview === "function") {
        updateQuickAccessPreview();
      }

      return;
    }

    tries += 1;
    if (tries >= maxTries) {
      clearInterval(timer);
    }
  }, 150);
}

updateDateTime();
setInterval(updateDateTime, 1000);

initTreeToggles();

if (typeof initSidebarPanel === "function") {
  initSidebarPanel();
}

if (typeof initSidebarCollapse === "function") {
  initSidebarCollapse();
}

if (typeof initSidebarRail === "function") {
  initSidebarRail();
}

if (typeof initFilterToolbar === "function") {
  initFilterToolbar();
}

initSearch();
initClearFilters();
loadHubData();
resetAllSections();

initFreshHomeWhenReady();

const resetMapBtn = document.getElementById("resetMapBtn");
if (resetMapBtn) {
  resetMapBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    resetMapView();
  });
}

const myLocationBtn = document.getElementById("myLocationBtn");
if (myLocationBtn) {
  myLocationBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    goToMyLocation();
  });
}

const nearestHubBtn = document.getElementById("nearestHubBtn");
if (nearestHubBtn) {
  nearestHubBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    goToNearestHub();
  });
}

document.addEventListener("click", function(e) {
  const closeBtn = e.target.closest("#hubDetailsClose");
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();
    hideHubDetailsPanel();
    return;
  }

  const overlayEl = e.target.closest("#mapOverlay");
  if (overlayEl && !overlayEl.classList.contains("hidden")) {
    e.preventDefault();
    e.stopPropagation();
    hideHubDetailsPanel();
  }
});

window.addEventListener("resize", function() {
  if (typeof map !== "undefined") {
    map.invalidateSize();
  }

  if (typeof hideMarkerHover === "function") {
    hideMarkerHover();
  }
});