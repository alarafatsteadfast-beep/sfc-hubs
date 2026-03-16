var activeSuggestionIndex = -1;
var currentSuggestions = [];

function initSearch() {

  const searchBox = document.getElementById("searchBox");
  const suggestionsBox = document.getElementById("searchSuggestions");

  if (!searchBox || !suggestionsBox) return;

  searchBox.addEventListener("input", function () {

    const value = this.value.toLowerCase().trim();

    const filtered = getFilteredHubs();
    updateVisibleMarkers(filtered);
    renderTrees();
    fitMapToFilteredHubs(filtered);

    if (value === "") {
      hideSearchSuggestions();
      return;
    }

    const matches = allHubs.filter(hub => {

      const name = (hub.name || "").toLowerCase();
      const district = (hub.district || "").toLowerCase();
      const division = (hub.division || "").toLowerCase();
      const zone = (hub.zone || "").toLowerCase();

      return (
        name.includes(value) ||
        district.includes(value) ||
        division.includes(value) ||
        zone.includes(value)
      );

    });

    currentSuggestions = matches.slice(0, 8);

    renderSearchSuggestions(currentSuggestions, value);

  });

  searchBox.addEventListener("keydown", function (e) {

    if (currentSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeSuggestionIndex = Math.min(
        activeSuggestionIndex + 1,
        currentSuggestions.length - 1
      );
      updateSuggestionActiveState();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
      updateSuggestionActiveState();
    }

    if (e.key === "Enter") {

      if (
        activeSuggestionIndex >= 0 &&
        currentSuggestions[activeSuggestionIndex]
      ) {
        e.preventDefault();
        selectSearchSuggestion(currentSuggestions[activeSuggestionIndex]);
      }

    }

    if (e.key === "Escape") {
      hideSearchSuggestions();
    }

  });

  document.addEventListener("click", function (e) {

    if (
      !suggestionsBox.contains(e.target) &&
      e.target !== searchBox
    ) {
      hideSearchSuggestions();
    }

  });

}

function renderSearchSuggestions(suggestions, query) {

  const suggestionsBox = document.getElementById("searchSuggestions");
  if (!suggestionsBox) return;

  suggestionsBox.innerHTML = "";
  activeSuggestionIndex = -1;

  if (!suggestions.length) {

    const empty = document.createElement("div");

    empty.className = "search-suggestion-item";

    empty.innerHTML = `
      <div class="search-suggestion-title">
        No results found
      </div>
      <div class="search-suggestion-meta">
        Try searching hub, district, division or zone
      </div>
    `;

    suggestionsBox.appendChild(empty);
    suggestionsBox.classList.remove("hidden");

    return;
  }

  suggestions.forEach(function (hub, index) {

    const item = document.createElement("div");
    item.className = "search-suggestion-item";

    item.innerHTML = `
      <div class="search-suggestion-title">${hub.name}</div>
      <div class="search-suggestion-meta">
        ${hub.district || "-"} • ${hub.division || "-"} • ${hub.zone || "-"}
      </div>
    `;

    item.addEventListener("click", function () {
      selectSearchSuggestion(hub);
    });

    item.addEventListener("mouseenter", function () {
      activeSuggestionIndex = index;
      updateSuggestionActiveState();
    });

    suggestionsBox.appendChild(item);

  });

  suggestionsBox.classList.remove("hidden");

}

function updateSuggestionActiveState() {

  const items = document.querySelectorAll(".search-suggestion-item");

  items.forEach(function (item, index) {
    item.classList.toggle(
      "active",
      index === activeSuggestionIndex
    );
  });

}

function hideSearchSuggestions() {

  const suggestionsBox = document.getElementById("searchSuggestions");
  if (!suggestionsBox) return;

  suggestionsBox.classList.add("hidden");
  suggestionsBox.innerHTML = "";

  activeSuggestionIndex = -1;
  currentSuggestions = [];

}

function selectSearchSuggestion(hub) {

  const searchBox = document.getElementById("searchBox");

  if (!searchBox || !hub) return;

  searchBox.value = hub.name;

  hideSearchSuggestions();

  activeSelection.type = "hub";
  activeSelection.value = hub.name;

  updateVisibleMarkers([hub]);
  renderTrees();

  focusHubOnMap(hub, 13);

  scrollToHubTreeItem(hub.name);

}