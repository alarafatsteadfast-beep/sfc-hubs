function renderTrees() {
  const data = getCrossFilteredValues();

  renderClickableTree("divisionTree", data.divisions, setDivisionFilter, "division");
  renderClickableTree("districtTree", data.districts, setDistrictFilter, "district");
  renderClickableTree("zoneTree", data.zones, setZoneFilter, "zone");
  renderHubTree(data.hubs);
  updateSidebarCounts(data);
  updateQuickAccessPreview();
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
    item.dataset.hubName = hub.name;

    const link = document.createElement("span");
    link.className = "tree-link";
    link.textContent = hub.name;

    if (activeSelection.type === "hub" && activeSelection.value === hub.name) {
      link.classList.add("active-item");
    }

    link.addEventListener("click", function() {
      if (activeSelection.type === "hub" && activeSelection.value === hub.name) {
        activeSelection.type = "";
        activeSelection.value = "";
        renderTrees();
        return;
      }

      setActiveSelection("hub", hub.name);
      renderTrees();
      focusHubOnMap(hub, 12);
      scrollToHubTreeItem(hub.name);
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

function updateSidebarCounts(data) {
  const divisionTreeCount = document.getElementById("divisionTreeCount");
  const districtTreeCount = document.getElementById("districtTreeCount");
  const zoneTreeCount = document.getElementById("zoneTreeCount");
  const hubTreeCount = document.getElementById("hubTreeCount");

  const divisionRailCount = document.getElementById("divisionRailCount");
  const districtRailCount = document.getElementById("districtRailCount");
  const zoneRailCount = document.getElementById("zoneRailCount");
  const hubRailCount = document.getElementById("hubRailCount");

  const divisionCount = data.divisions.length;
  const districtCount = data.districts.length;
  const zoneCount = data.zones.length;
  const hubCount = data.hubs.length;

  if (divisionTreeCount) divisionTreeCount.textContent = divisionCount;
  if (districtTreeCount) districtTreeCount.textContent = districtCount;
  if (zoneTreeCount) zoneTreeCount.textContent = zoneCount;
  if (hubTreeCount) hubTreeCount.textContent = hubCount;

  if (divisionRailCount) divisionRailCount.textContent = divisionCount;
  if (districtRailCount) districtRailCount.textContent = districtCount;
  if (zoneRailCount) zoneRailCount.textContent = zoneCount;
  if (hubRailCount) hubRailCount.textContent = hubCount;
}

function updateQuickAccessPreview() {
  const selectedHubLabel = document.getElementById("selectedHubLabel");
  const favoriteHubCount = document.getElementById("favoriteHubCount");
  const recentHubCount = document.getElementById("recentHubCount");
  const favoriteHubList = document.getElementById("favoriteHubList");
  const recentHubList = document.getElementById("recentHubList");

  if (selectedHubLabel) {
    selectedHubLabel.textContent =
      activeSelection.type === "hub" && activeSelection.value
        ? activeSelection.value
        : "None selected";
  }

  if (favoriteHubCount) {
    favoriteHubCount.textContent = "0 hubs";
  }

  if (recentHubCount) {
    recentHubCount.textContent = "0 hubs";
  }

  if (favoriteHubList) {
    favoriteHubList.innerHTML = `<div class="quick-empty">No favorite hubs yet</div>`;
  }

  if (recentHubList) {
    recentHubList.innerHTML = `<div class="quick-empty">No recent hubs yet</div>`;
  }
}

function initTreeToggles() {
  const toggles = document.querySelectorAll(".tree-toggle");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", function() {
      const targetId = this.getAttribute("data-target");
      const target = document.getElementById(targetId);
      if (!target) return;

      const isHidden = target.classList.contains("hidden");

      if (isHidden) {
        openSection(targetId);
      } else {
        closeSection(targetId);
      }
    });
  });
}

function initSidebarCollapse() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  if (!sidebar || !toggleBtn) return;

  const savedState = localStorage.getItem("sfc_sidebar_collapsed");
  if (savedState === "true") {
    sidebar.classList.add("collapsed");
  }

  toggleBtn.addEventListener("click", function() {
    sidebar.classList.toggle("collapsed");
    localStorage.setItem("sfc_sidebar_collapsed", sidebar.classList.contains("collapsed"));

    setTimeout(function() {
      if (typeof map !== "undefined") {
        map.invalidateSize();
      }
    }, 260);
  });
}

function initSidebarRail() {
  const sidebar = document.getElementById("sidebar");
  const railButtons = document.querySelectorAll(".rail-btn");

  if (!sidebar || railButtons.length === 0) return;

  railButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      const action = this.getAttribute("data-rail-action");
      const target = this.getAttribute("data-rail-target");

      if (action === "clear") {
        clearAllFilters();
        return;
      }

      if (!target) return;

      sidebar.classList.remove("collapsed");
      localStorage.setItem("sfc_sidebar_collapsed", "false");

      setTimeout(function() {
        if (target !== "quickAccessPanel") {
          openSection(target);
        }

        const quickPanel = document.getElementById("quickAccessPanel");
        if (target === "quickAccessPanel" && quickPanel) {
          quickPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

        if (typeof map !== "undefined") {
          map.invalidateSize();
        }
      }, 260);
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

function resetAllSections() {
  closeSection("divisionTree");
  closeSection("districtTree");
  closeSection("zoneTree");
  closeSection("hubTree");
}

function scrollToHubTreeItem(hubName) {
  const hubTree = document.getElementById("hubTree");
  if (!hubTree) return;

  openSection("hubTree");

  setTimeout(function() {
    const targetItem = hubTree.querySelector(`[data-hub-name="${CSS.escape(hubName)}"]`);
    if (targetItem) {
      targetItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, 100);
}