/* Shared helpers and localStorage wrappers */
export const STORAGE_USER_KEY = 'gups_paramba_user';
export const STORAGE_REVIEWS_KEY = 'gups_paramba_reviews';

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
export function setStoredUser(user) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}
export function clearStoredUser() {
  localStorage.removeItem(STORAGE_USER_KEY);
}

export function getStoredReviews() {
  const raw = localStorage.getItem(STORAGE_REVIEWS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}
export function setStoredReviews(reviews) {
  localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
}