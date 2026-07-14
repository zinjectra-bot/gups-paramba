/* Module entry: initializes all features by importing feature modules */
import { initNavigation, initHeaderScrollEffect } from './nav.js';
import { initPrincipalMessage } from './principal.js';
import { initAdminPanel } from './admin.js';
import { initContactForm } from './contact.js';
import { initSectionAnimations } from './sections.js';
import { initAuthAndReviews } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPrincipalMessage();
  initAdminPanel();
  initContactForm();
  initSectionAnimations();
  initHeaderScrollEffect();
  initAuthAndReviews();
});