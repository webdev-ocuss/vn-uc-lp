(() => {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const modalEl = document.getElementById('checkoutModal');
  if (!modalEl) return;

  const planNameEl = modalEl.querySelector('[data-plan-name]');
  const planPriceEl = modalEl.querySelector('[data-plan-price]');
  const vipNoteEl = modalEl.querySelector('[data-vip-note]');

  const formEl = document.getElementById('checkoutForm');
  const successEl = document.getElementById('checkoutSuccess');
  const submitBtn = document.getElementById('checkoutSubmit');

  const planInputs = Array.from(modalEl.querySelectorAll('input[type="radio"][name="plan"]'));
  const hiddenPlanInput = formEl ? formEl.querySelector('input[name="selectedPlan"]') : null;

  const PLANS = {
    core: { key: 'core', label: 'Core Experience', priceText: '$27 USD' },
    vip: { key: 'vip', label: 'VIP Experience', priceText: '$77 USD' }
  };

  function resetModalState() {
    if (successEl) successEl.hidden = true;
    if (formEl) formEl.hidden = false;
    if (submitBtn) submitBtn.disabled = false;
  }

  function setPlan(planKey) {
    const plan = PLANS[planKey] || PLANS.core;

    planInputs.forEach((input) => {
      input.checked = input.value === plan.key;
    });

    if (planNameEl) planNameEl.textContent = plan.label;
    if (planPriceEl) planPriceEl.textContent = plan.priceText;
    if (hiddenPlanInput) hiddenPlanInput.value = plan.key;

    if (vipNoteEl) vipNoteEl.hidden = plan.key !== 'vip';
  }

  // Set plan when modal opens (from CTA button data-plan)
  modalEl.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    const planFromTrigger = trigger?.getAttribute?.('data-plan') || 'core';

    resetModalState();
    setPlan(planFromTrigger);
  });

  // Reset when closing
  modalEl.addEventListener('hidden.bs.modal', () => {
    resetModalState();
    setPlan('core');
  });

  // Toggle plan within modal
  planInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) setPlan(input.value);
    });
  });

  // Submit: show "Coming soon" success (no network)
  formEl?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (submitBtn) submitBtn.disabled = true;

    if (formEl) formEl.hidden = true;
    if (successEl) successEl.hidden = false;
  });
})();
