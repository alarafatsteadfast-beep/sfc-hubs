function renderTrees(hubs) {
  const filteredForTree = getFilteredHubs();
  const divisionScopedHubs = getDivisionScopedHubs();
  const districtScopedHubs = getDistrictScopedHubs();

  const divisions = [...new Set(filteredForTree.map(h => h.division).filter(Boolean))].sort();
  const districts = [...new Set(divisionScopedHubs.map(h => h.district).filter(Boolean))].sort();
  const zones = [...new Set(districtScopedHubs.map(h => h.zone).filter(Boolean))].sort();

  renderClickableTree("divisionTree", divisions, setDivisionFilter, "division");
  renderClickableTree("districtTree", districts, setDistrictFilter, "district");
  renderClickableTree("zoneTree", zones, setZoneFilter, "zone");
  renderHubTree(filteredForTree);

  syncAccordionState();
}

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
    link.textContent = hub.name;

    if (activeSelection.type === "hub" && activeSelection.value === hub.name) {
      link.classList.add("active-item");
    }

    link.addEventListener("click", function() {
      setActiveSelection("hub", hub.name);
      renderTrees(allHubs);
      map.setView(hub.marker.getLatLng(), 12);
      hub.marker.openPopup();
      openOnlySection("hubTree");
    });

    item.appendChild(link);
    hubTree.appendChild(item);
  });
}

function renderClickableTree(containerId, items, clickHandler, type) {
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

    const link = document.createElement("span");
    link.className = "tree-link";
    link.textContent = item;

    if (activeSelection.type === type && activeSelection.value === item) {
      link.classList.add("active-item");
    }

    link.addEventListener("click", function() {
      clickHandler(item);
    });

    row.appendChild(link);
    container.appendChild(row);
  });
}

function initTreeToggles() {
  const toggles = document.querySelectorAll(".tree-toggle");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", function() {
      if (this.classList.contains("disabled")) return;

      const targetId = this.getAttribute("data-target");
      const target = document.getElementById(targetId);
      if (!target) return;

      const isHidden = target.classList.contains("hidden");

      if (isHidden) {
        openOnlySection(targetId);
      } else {
        closeSection(targetId);
      }
    });
  });
}

function openSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.classList.remove("hidden");

  const toggle = document.querySelector(`.tree-toggle[data-target="${targetId}"]`);
  if (toggle) {
    toggle.classList.add("active");
  }
}

function closeSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.classList.add("hidden");

  const toggle = document.querySelector(`.tree-toggle[data-target="${targetId}"]`);
  if (toggle) {
    toggle.classList.remove("active");
  }
}

function openOnlySection(targetId) {
  const allTargets = ["divisionTree", "districtTree", "zoneTree", "hubTree"];

  allTargets.forEach(id => {
    if (id === targetId) {
      openSection(id);
    } else {
      closeSection(id);
    }
  });
}

function resetAllSections() {
  closeSection("divisionTree");
  closeSection("districtTree");
  closeSection("zoneTree");
  closeSection("hubTree");
}

function setSectionDisabled(targetId, disabled) {
  const toggle = document.querySelector(`.tree-toggle[data-target="${targetId}"]`);
  const target = document.getElementById(targetId);

  if (!toggle || !target) return;

  if (disabled) {
    toggle.classList.add("disabled");
    target.classList.add("hidden");
    toggle.classList.remove("active");
  } else {
    toggle.classList.remove("disabled");
  }
}

function syncAccordionState() {
  setSectionDisabled("divisionTree", false);
  setSectionDisabled("districtTree", !activeFilters.division);
  setSectionDisabled("zoneTree", !activeFilters.district);
  setSectionDisabled("hubTree", !activeFilters.zone);
}