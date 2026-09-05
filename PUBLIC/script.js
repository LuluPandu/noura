const API_BASE = '/api/campaigns';

const campaignList = document.getElementById('campaignList');
const categoryFilter = document.getElementById('categoryFilter');
const regionFilter = document.getElementById('regionFilter');

let allCampaigns = []; // store all approved campaigns here

// Fetch approved campaigns from backend
async function loadCampaigns() {
  try {
    const response = await fetch(`${API_BASE}/approved`);
    const data = await response.json();
    allCampaigns = data;
    renderCampaigns(allCampaigns);
  } catch (err) {
    campaignList.innerHTML = `<p id="loadingText">⚠️ Could not load campaigns. Is the server running?</p>`;
    console.error(err);
  }
}

// Render campaign cards on the page
function renderCampaigns(campaigns) {
  if (campaigns.length === 0) {
    campaignList.innerHTML = `<p id="loadingText">No campaigns found.</p>`;
    return;
  }

  campaignList.innerHTML = campaigns.map(c => `
    <div class="campaign-card">
      <div class="card-body">
        <span class="category-badge">${c.category}</span>
        <h3>${c.title}</h3>
        <p class="region">📍 ${c.region}</p>
        <p class="desc">${c.description.substring(0, 100)}${c.description.length > 100 ? '...' : ''}</p>
        <p class="goal">Goal: ₹${c.goalAmount.toLocaleString('en-IN')}</p>
        <a class="view-btn" href="campaign.html?id=${c._id}">View Details</a>
      </div>
    </div>
  `).join('');
}

// Filter campaigns based on dropdown selections
function applyFilters() {
  const category = categoryFilter.value;
  const region = regionFilter.value;

  let filtered = allCampaigns;

  if (category) {
    filtered = filtered.filter(c => c.category === category);
  }
  if (region) {
    filtered = filtered.filter(c => c.region === region);
  }

  renderCampaigns(filtered);
}

categoryFilter.addEventListener('change', applyFilters);
regionFilter.addEventListener('change', applyFilters);

// Load campaigns when page opens
loadCampaigns();