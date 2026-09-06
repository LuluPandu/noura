const API_BASE = '/api/campaigns';
const token = localStorage.getItem('adminToken');

const pendingList = document.getElementById('pendingList');
const logoutBtn = document.getElementById('logoutBtn');

// Redirect to login if no token found
if (!token) {
  window.location.href = 'admin-login.html';
}

// Logout button
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
});

// Load pending campaigns
async function loadPending() {
  try {
    const response = await fetch(`${API_BASE}/admin/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('adminToken');
      window.location.href = 'admin-login.html';
      return;
    }

    const campaigns = await response.json();
    renderPending(campaigns);
  } catch (err) {
    pendingList.innerHTML = `<p id="loadingText">⚠️ Could not load pending requests.</p>`;
    console.error(err);
  }
}

function renderPending(campaigns) {
  if (campaigns.length === 0) {
    pendingList.innerHTML = `<p id="loadingText">No pending requests right now. 🎉</p>`;
    return;
  }

  pendingList.innerHTML = campaigns.map(c => `
    <div class="dashboard-card">
      <span class="category-badge">${c.category}</span>
      <h3>${c.title}</h3>
      <p class="region">📍 ${c.region} — Raised by: ${c.requesterName}</p>
      <p class="desc">${c.description}</p>
      <p class="goal">Goal: ₹${c.goalAmount.toLocaleString('en-IN')}</p>
      ${c.proofLink ? `<p><a href="${c.proofLink}" target="_blank" rel="noopener">View Proof Link →</a></p>` : ''}
      <p><strong>Scanner:</strong> <a href="${c.scannerImage}" target="_blank" rel="noopener">View Scanner Image</a></p>
      <p><strong>Contact:</strong> ${c.contactInfo}</p>

      <div class="dashboard-actions">
        <button class="approve-btn" onclick="approveCampaign('${c._id}')">✅ Approve</button>
        <button class="reject-btn" onclick="rejectCampaign('${c._id}')">❌ Reject</button>
      </div>
    </div>
  `).join('');
}

async function approveCampaign(id) {
  await updateStatus(id, 'approve');
}

async function rejectCampaign(id) {
  await updateStatus(id, 'reject');
}

async function updateStatus(id, action) {
  try {
    const response = await fetch(`${API_BASE}/admin/${action}/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      loadPending(); // refresh the list
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch (err) {
    alert('Could not connect to server.');
    console.error(err);
  }
}

loadPending();