const API_BASE = '/api/admin';

const form = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Save the token in the browser so we stay logged in
      localStorage.setItem('adminToken', result.token);
      loginMessage.textContent = '✅ Login successful! Redirecting...';
      loginMessage.style.color = 'green';
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 800);
    } else {
      loginMessage.textContent = '⚠️ ' + (result.message || 'Login failed.');
      loginMessage.style.color = 'red';
    }
  } catch (err) {
    loginMessage.textContent = '⚠️ Could not connect to server.';
    loginMessage.style.color = 'red';
    console.error(err);
  }
});