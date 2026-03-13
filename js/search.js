function initSearch() {
  const searchBox = document.getElementById("searchBox");
  if (!searchBox) return;

  searchBox.addEventListener("input", function() {
    const value = this.value.toLowerCase().trim();

    const filtered = allHubs.filter(hub =>
      hub.name.toLowerCase().includes(value)
    );

    renderHubTree(filtered);
  });
}