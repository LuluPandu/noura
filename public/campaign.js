const API_BASE = '/api/campaigns';

const detailContainer = document.getElementById('detailContainer');

// Get campaign ID from URL (?id=xxxx)
const params = new URLSearchParams(window.location.search);
const campaignId = params.get('id');

async function loadCampaignDetail() {
  if (!campaignId) {
    detailContainer.innerHTML = `<p id="loadingText">No campaign selected.</p>`;
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${campaignId}`);
    if (!response.ok) throw new Error('Campaign not found');
    const c = await response.json();

    detailContainer.innerHTML = `
      <div class="detail-card">
        <span class="category-badge">${c.category}</span>
        <h2>${c.title}</h2>
        <p class="region">📍 ${c.region}</p>
        <p class="requester">Raised by: ${c.requesterName}</p>

        <div class="detail-section">
          <h3>Story</h3>
          <p>${c.description}</p>
        </div>

        <div class="detail-section">
          <h3>Goal Amount</h3>
          <p class="goal">₹${c.goalAmount.toLocaleString('en-IN')}</p>
        </div>

        ${c.proofLink ? `
        <div class="detail-section">
          <h3>Proof of Authenticity</h3>
          <a href="${c.proofLink}" target="_blank" rel="noopener">View News/Proof Link →</a>
        </div>` : ''}

        <div class="detail-section">
          <h3>Donate via Scanner</h3>
          <img src="${c.scannerImage}" alt="Donation QR Scanner" class="scanner-img" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<p>Scanner image not available</p>')">
        </div>

        <div class="detail-section">
          <h3>Contact</h3>
          <p>${c.contactInfo}</p>
        </div>
      </div>
    `;
  } catch (err) {
    detailContainer.innerHTML = `<p id="loadingText">⚠️ Could not load this campaign.</p>`;
    console.error(err);
  }
}

loadCampaignDetail();