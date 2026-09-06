const API_BASE = '/api/campaigns';

const form = document.getElementById('campaignForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.goalAmount = Number(data.goalAmount);

  try {
    const response = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      formMessage.textContent = '✅ Your request has been submitted for review. We will get back to you soon.';
      formMessage.style.color = 'green';
      form.reset();
    } else {
      formMessage.textContent = '⚠️ ' + (result.message || 'Something went wrong.');
      formMessage.style.color = 'red';
    }
  } catch (err) {
    formMessage.textContent = '⚠️ Could not connect to server.';
    formMessage.style.color = 'red';
    console.error(err);
  }
});