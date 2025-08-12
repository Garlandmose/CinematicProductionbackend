// js/application.js
document.addEventListener('DOMContentLoaded', () => {
  const roleInput = document.getElementById('role-input');
  const roleDisplay = document.getElementById('role-display');
  const form = document.getElementById('jobApplication');
  const message = document.getElementById('status-message');

  // ✅ Get role from URL
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');

  if (role) {
    const decodedRole = decodeURIComponent(role);
    roleInput.value = decodedRole;
    roleDisplay.innerHTML = `<strong>Applying for:</strong> ${decodedRole}`;
    roleDisplay.style.color = '#d4af37';
  } else {
    message.style.color = '#ff6b6b';
    message.textContent = 'Error: No role selected.';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    message.style.color = '#d4af37';
    message.textContent = 'Sending...';

    try {
      // ✅ Use current site's origin (works locally and live)
      const response = await fetch(`${window.location.origin}/api/applications`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      message.style.color = 'lightgreen';
      message.textContent = `✅ ${result.message}`;
      form.reset();
    } catch (err) {
      console.error('Frontend Error:', err);
      message.style.color = '#ff6b6b';
      message.textContent = `❌ Network error: ${err.message}`;
    }
  });
});