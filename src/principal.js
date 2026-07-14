/* Principal message toggle */
export function initPrincipalMessage() {
  const principalToggle = document.getElementById('principalToggle');
  const principalMessage = document.getElementById('principalMessage');
  if (!principalToggle || !principalMessage) return;

  const toggleText = principalToggle.querySelector('.toggle-text');

  principalToggle.addEventListener('click', () => {
    principalMessage.classList.toggle('show');
    principalToggle.classList.toggle('active');
    toggleText.textContent = principalMessage.classList.contains('show')
      ? "Hide Principal's Message"
      : "Read Principal's Message";
  });
}