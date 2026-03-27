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

function matchesSearch(hub, searchValue) {
  if (!searchValue) return true;

  const hubName = (hub.name || "").toLowerCase();
  const hubDivision = (hub.division || "").toLowerCase();
  const hubDistrict = (hub.district || "").toLowerCase();
  const hubPoliceStation = (hub.police_station || "").toLowerCase();

  return (
    hubName.includes(searchValue) ||
    hubDivision.includes(searchValue) ||
    hubDistrict.includes(searchValue) ||
    hubPoliceStation.includes(searchValue)
  );
}

function getFilteredHubs() {
  const searchValue = getSearchValue();

  return allHubs.filter(function(hub) {
    const matchDivision =
      activeFilters.division.length === 0 ||
      activeFilters.division.includes(hub.division);

    const matchDistrict =
      activeFilters.district.length === 0 ||
      activeFilters.district.includes(hub.district);

    const matchSearch = matchesSearch(hub, searchValue);

    return matchDivision && matchDistrict && matchSearch;
  });
}

function getCrossFilteredValues() {
  const searchValue = getSearchValue();
  const filtered = getFilteredHubs();

  const divisionScopedHubs = allHubs.filter(function(hub) {
    const matchDivision =
      activeFilters.division.length === 0 ||
      activeFilters.division.includes(hub.division);

    return matchDivision && matchesSearch(hub, searchValue);
  });

  const districtScopedHubs = allHubs.filter(function(hub) {
    const matchDistrict =
      activeFilters.district.length === 0 ||
      activeFilters.district.includes(hub.district);

    return matchDistrict && matchesSearch(hub, searchValue);
  });

  const districts = [
    ...new Set(
      divisionScopedHubs
        .map(function(hub) {
          return hub.district;
        })
        .filter(Boolean)
    )
  ].sort();

  const divisions = [
    ...new Set(
      districtScopedHubs
        .map(function(hub) {
          return hub.division;
        })
        .filter(Boolean)
    )
  ].sort();

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

function removeInvalidDependentFilters() {
  const searchValue = getSearchValue();

  const validDistricts = new Set(
    allHubs
      .filter(function(hub) {
        const matchDivision =
          activeFilters.division.length === 0 ||
          activeFilters.division.includes(hub.division);

        return matchDivision && matchesSearch(hub, searchValue);
      })
      .map(function(hub) {
        return hub.district;
      })
      .filter(Boolean)
  );

  activeFilters.district = activeFilters.district.filter(function(district) {
    return validDistricts.has(district);
  });
}

function setDivisionFilter(value) {
  toggleArrayFilter("division", value);
  removeInvalidDependentFilters();
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