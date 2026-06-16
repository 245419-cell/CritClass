const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const showAllBtn = document.getElementById('showAllBtn');

// Handle 'Show all' button click
if (showAllBtn) {
  showAllBtn.style.display = 'none';
  showAllBtn.addEventListener('click', () => {
    searchInput.value = '';
    showAllBtn.style.display = 'none';
    searchResults.textContent = '';
    location.reload();
  });
}

if (searchForm && searchInput && searchResults) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      searchResults.textContent = 'Please enter a search term to continue.';
      return;
    }

    searchResults.textContent = `Searching for "${query}"...`;

    fetch(`/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        const grid = document.querySelector('.quick-access-grid');
        if (!data || !data.found || !data.sections || data.sections.length === 0) {
          searchResults.textContent = 'Class/Teacher does not exist';
          if (grid) grid.style.display = 'none';
          return;
        }

        // Render matched sections into the grid
        if (grid) {
          grid.style.display = '';
          grid.innerHTML = data.sections
            .map((s) => {
              return `<a href="/class/${s.id}" class="quick-access-link"><div class="quick-access-box"><h3>${escapeHtml(s.courseName)}</h3><p>${escapeHtml(s.teacherFirstName)} ${escapeHtml(s.teacherLastName)}</p><p class="avg-rating">${s.avgRating ? `Average rating: ${escapeHtml(s.avgRating)} ★` : 'No reviews yet'}</p></div></a>`;
            })
            .join('');
          searchResults.textContent = '';
          showAllBtn.style.display = 'block';
        }
      })
      .catch(() => {
        searchResults.textContent = `Search failed. Try again.`;
      });
  });
}

// Simple HTML escaper for rendering server data into the DOM
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
