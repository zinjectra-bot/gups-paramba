/* Auth & reviews module */
import { getStoredUser, setStoredUser, clearStoredUser, getStoredReviews, setStoredReviews } from './utils.js';

function sendLoginToBackend(email) {
  console.log('Sending login data to backend servers:', { email, loginTime: new Date().toISOString() });
}

function renderReviews(reviewsListEl) {
  if (!reviewsListEl) return;
  const reviews = getStoredReviews();
  if (reviews.length === 0) {
    const seed = [
      { name: 'Parent of Class 4 Student', rating: 5, text: 'Very happy with the teachers and the friendly environment at GUPS Paramba.', date: new Date().toISOString() },
      { name: 'Former Student', rating: 4, text: 'I studied here and the school helped me build a strong foundation.', date: new Date().toISOString() },
    ];
    setStoredReviews(seed);
    return renderReviews(reviewsListEl);
  }
  reviewsListEl.innerHTML = '';
  reviews.slice().reverse().forEach((review) => {
    const item = document.createElement('div');
    item.className = 'review-item';
    const date = new Date(review.date);
    const dateStr = isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const stars = '★★★★★'.slice(0, review.rating) + '☆☆☆☆☆'.slice(review.rating);
    item.innerHTML = `
      <div class="review-header">
        <div>
          <div class="review-name">${review.name}</div>
          <div class="review-meta">${dateStr}</div>
        </div>
        <div class="review-rating">${stars}</div>
      </div>
      <div class="review-text">${review.text}</div>`;
    reviewsListEl.appendChild(item);
  });
}

export function initAuthAndReviews() {
  const loginForm = document.getElementById('loginForm');
  const loginEmailInput = document.getElementById('loginEmail');
  const loginPasswordInput = document.getElementById('loginPassword');
  const loginStatus = document.getElementById('loginStatus');
  const loggedInInfo = document.getElementById('loggedInInfo');
  const loggedInEmailSpan = document.getElementById('loggedInEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');
  const reviewStatus = document.getElementById('reviewStatus');

  function updateAuthUI() {
    const user = getStoredUser();
    if (loginForm && loggedInInfo && loggedInEmailSpan) {
      if (user && user.email) {
        loginForm.style.display = 'none';
        loggedInInfo.style.display = 'block';
        loggedInEmailSpan.textContent = user.email;
      } else {
        loginForm.style.display = 'block';
        loggedInInfo.style.display = 'none';
        loggedInEmailSpan.textContent = '';
      }
    }
  }

  updateAuthUI();
  if (reviewsList) renderReviews(reviewsList);

  if (loginForm && loginEmailInput && loginPasswordInput && loginStatus) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginStatus.textContent = '';
      loginStatus.classList.remove('error', 'success');

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value;

      if (!email || !email.includes('@') || (!email.endsWith('@gmail.com') && !email.endsWith('@gmail.com '))) {
        loginStatus.textContent = 'Please enter a valid Gmail address.';
        loginStatus.classList.add('error');
        return;
      }
      if (password !== 'password') {
        loginStatus.textContent = 'Incorrect password.';
        loginStatus.classList.add('error');
        return;
      }
      const user = { email, loginTime: new Date().toISOString() };
      setStoredUser(user);
      sendLoginToBackend(email);
      loginStatus.textContent = 'Login successful. Welcome!';
      loginStatus.classList.add('success');
      updateAuthUI();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearStoredUser();
      if (loginStatus) {
        loginStatus.textContent = 'You have been logged out.';
        loginStatus.classList.remove('success');
        loginStatus.classList.add('error');
      }
      updateAuthUI();
    });
  }

  if (reviewForm && reviewStatus && reviewsList) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      reviewStatus.textContent = '';
      reviewStatus.classList.remove('error', 'success');

      const user = getStoredUser();
      if (!user || !user.email) {
        reviewStatus.textContent = 'Please login with your Gmail to post a review.';
        reviewStatus.classList.add('error');
        return;
      }
      const nameInput = document.getElementById('reviewName');
      const ratingSelect = document.getElementById('reviewRating');
      const textArea = document.getElementById('reviewText');

      const name = nameInput.value.trim();
      const rating = parseInt(ratingSelect.value, 10);
      const text = textArea.value.trim();

      if (!name || !rating || !text) {
        reviewStatus.textContent = 'Please fill in all review fields.';
        reviewStatus.classList.add('error');
        return;
      }

      const newReview = { name, rating, text, date: new Date().toISOString() };
      const reviews = getStoredReviews();
      reviews.push(newReview);
      setStoredReviews(reviews);

      reviewStatus.textContent = 'Thank you! Your review has been posted.';
      reviewStatus.classList.add('success');

      nameInput.value = '';
      ratingSelect.value = '';
      textArea.value = '';
      renderReviews(reviewsList);
    });
  } else if (reviewsList) {
    renderReviews(reviewsList);
  }
}