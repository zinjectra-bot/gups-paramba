/* Admin panel rendering and server users listing */
import { getStoredUser } from './utils.js';

const adminOverlay = document.getElementById('adminOverlay');
const adminCloseBtn = document.getElementById('adminCloseBtn');
const adminAccessStatus = document.getElementById('adminAccessStatus');
const adminLocalUsers = document.getElementById('adminLocalUsers');
const adminServerUsers = document.getElementById('adminServerUsers');

function renderLocalAdminUsers() {
  if (!adminLocalUsers) return;
  adminLocalUsers.innerHTML = '';
  const user = getStoredUser();
  if (!user || !user.email) {
    adminLocalUsers.innerHTML = '<p class="admin-status">No local users are currently logged in.</p>';
    return;
  }
  const row = document.createElement('div');
  row.className = 'admin-user-row';
  const loginTime = user.loginTime ? new Date(user.loginTime) : null;
  const timeStr = loginTime && !isNaN(loginTime.getTime()) ? loginTime.toLocaleString() : 'Unknown time';
  row.innerHTML = `
    <div class="admin-user-main">
      <div class="admin-user-email">${user.email}</div>
      <div class="admin-user-meta">Last login: ${timeStr}</div>
    </div>
    <div class="admin-user-tag">Local</div>`;
  adminLocalUsers.appendChild(row);
}

async function renderServerUsers() {
  if (!adminServerUsers) return;
  adminServerUsers.innerHTML = '<p class="admin-status">Loading server users…</p>';
  try {
    if (!window.websim || !websim.users || typeof websim.users.list !== 'function') {
      adminServerUsers.innerHTML = '<p class="admin-status error">Users API not available in this environment.</p>';
      return;
    }
    const users = await websim.users.list();
    if (!users || !Array.isArray(users) || users.length === 0) {
      adminServerUsers.innerHTML = '<p class="admin-status">No users found on the server.</p>';
      return;
    }
    adminServerUsers.innerHTML = '';
    users.forEach((u) => {
      const row = document.createElement('div');
      row.className = 'admin-user-row';
      const email = u.email || '(no email)';
      const id = u.id || u.userId || '';
      const createdAt = u.createdAt ? new Date(u.createdAt) : null;
      const createdStr = createdAt && !isNaN(createdAt.getTime()) ? createdAt.toLocaleString() : '';
      row.innerHTML = `
        <div class="admin-user-main">
          <div class="admin-user-email">${email}</div>
          <div class="admin-user-meta">${id ? `ID: ${id}` : ''}${createdStr ? ` | Created: ${createdStr}` : ''}</div>
        </div>
        <div class="admin-user-tag">Server</div>`;
      adminServerUsers.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading server users:', err);
    adminServerUsers.innerHTML = '<p class="admin-status error">Failed to load server users.</p>';
  }
}

export function openAdminPanel() {
  if (!adminOverlay) return;
  const currentUser = getStoredUser();
  if (!currentUser || !currentUser.email) {
    if (adminAccessStatus) {
      adminAccessStatus.textContent = 'Access restricted. Please login with Gmail before opening the admin panel.';
      adminAccessStatus.classList.add('error');
    }
  } else {
    if (adminAccessStatus) {
      adminAccessStatus.textContent = `Admin access opened as ${currentUser.email}`;
      adminAccessStatus.classList.remove('error');
      adminAccessStatus.classList.add('success');
    }
  }
  renderLocalAdminUsers();
  renderServerUsers();
  adminOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAdminPanel() {
  if (!adminOverlay) return;
  adminOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

export function initAdminPanel() {
  if (!adminOverlay) return;
  // expose globally so nav module can call it
  window.openAdminPanel = openAdminPanel;

  adminOverlay.addEventListener('click', (e) => {
    if (e.target === adminOverlay) closeAdminPanel();
  });
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminPanel);
}