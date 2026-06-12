const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchForm && searchInput && searchResults) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      searchResults.textContent = 'Please enter a search term to continue.';
      return;
    }

    searchResults.textContent = `Searching for "${query}"...`;

    setTimeout(() => {
      searchResults.textContent = `No matching items found for "${query}" yet. Try another search or come back later.`;
    }, 600);
  });
}
