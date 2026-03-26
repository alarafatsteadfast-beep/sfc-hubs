var activeFilters = {
  division: [],
  district: []
};

var activeSelection = {
  type: "",
  value: ""
};

function setActiveSelection(type, value) {
  activeSelection.type = type;
  activeSelection.value = value;
}

function clearActiveSelection(type) {
  if (activeSelection.type === type) {
    activeSelection.type = "";
    activeSelection.value = "";
  }
}

function getSearchValue() {
  const searchBox = document.getElementById("searchBox");
  if (!searchBox) return "";
  return searchBox.value.toLowerCase().trim();
}

function getFilteredHubs() {
  const searchValue = getSearchValue();

  return allHubs.filter(hub => {
    const hubName = (hub.name || "").toLowerCase();
    const hubDivision = (hub.division || "").toLowerCase();
    const hubDistrict = (hub.district || "").toLowerCase();
    const hubPoliceStation = (hub.police_station || "").toLowerCase();

    const matchDivision =
      activeFilters.division.length === 0 ||
      activeFilters.division.includes(hub.division);

    const matchDistrict =
      activeFilters.district.length === 0 ||
      activeFilters.district.includes(hub.district);

    const matchSearch =
      !searchValue ||
      hubName.includes(searchValue) ||
      hubDivision.includes(searchValue) ||
      hubDistrict.includes(searchValue) ||
      hubPoliceStation.includes(searchValue);

    return matchDivision && matchDistrict && matchSearch;
  });
}

function getCrossFilteredValues() {
  const filtered = getFilteredHubs();

  const divisions = [...new Set(allHubs.map(h => h.division).filter(Boolean))].sort();
  const districts = [...new Set(allHubs.map(h => h.district).filter(Boolean))].sort();

  return {
    divisions: divisions,
    districts: districts,
    hubs: filtered.slice().sort(function(a, b) {
      return (a.name || "").localeCompare(b.name || "");
    })
  };
}

function applyFilters() {
  const filtered = getFilteredHubs();

  updateVisibleMarkers(filtered);
  renderTrees();

  if (filtered.length > 0) {
    fitMapToFilteredHubs(filtered);
  } else {
    hideHubDetailsPanel();
  }
}

function toggleArrayFilter(filterKey, value) {
  const list = activeFilters[filterKey];
  const index = list.indexOf(value);

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(value);
  }
}

function setDivisionFilter(value) {
  toggleArrayFilter("division", value);
  clearActiveSelection("hub");
  applyFilters();
}

function setDistrictFilter(value) {
  toggleArrayFilter("district", value);
  clearActiveSelection("hub");
  applyFilters();
}

function clearAllFilters() {
  activeFilters.division = [];
  activeFilters.district = [];

  activeSelection.type = "";
  activeSelection.value = "";

  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.value = "";
  }

  hideSearchSuggestions();
  hideHubDetailsPanel();
  updateVisibleMarkers(allHubs);
  renderTrees();
  fitMapToFilteredHubs(allHubs);
  resetAllSections();
}

function initClearFilters() {
  const clearBtn = document.getElementById("clearFiltersBtn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", function() {
    clearAllFilters();
  });
}