/* Contact form handling (simple UX-only behavior) */
export function initContactForm() {
  const contactForm = document.querySelector('.contact-form form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputs = this.querySelectorAll('input, textarea');
    let isValid = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ff4444';
      } else {
        input.style.borderColor = '';
      }
    });
    if (!isValid) return;

    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.backgroundColor = '#4CAF50';
      this.reset();
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.disabled = false;
      }, 2000);
    }, 1000);
  });
}