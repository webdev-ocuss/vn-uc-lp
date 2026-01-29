(() => {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Checkout modal (if present)
  (() => {
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

    modalEl.addEventListener('show.bs.modal', (event) => {
      const trigger = event.relatedTarget;
      const planFromTrigger = trigger?.getAttribute?.('data-plan') || 'core';

      resetModalState();
      setPlan(planFromTrigger);
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      resetModalState();
      setPlan('core');
    });

    planInputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.checked) setPlan(input.value);
      });
    });

    formEl?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn) submitBtn.disabled = true;
      if (formEl) formEl.hidden = true;
      if (successEl) successEl.hidden = false;
    });
  })();

  // Hero video behavior
  (() => {
    const video = document.getElementById('heroVideo');
    const shell = document.getElementById('heroVideoShell');
    const muteBtn = document.getElementById('heroMuteToggle');
    const playBtn = document.getElementById('heroPlayToggle');
    if (!video || !shell || !muteBtn || !playBtn) return;

    const hint = document.getElementById('heroUnmuteHint');
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

    let hintDismissed = false;

    function setPlayStateUI(isPlaying) {
      shell.classList.toggle('is-playing', isPlaying);
      playBtn.setAttribute('aria-pressed', String(isPlaying));
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');

      const icon = playBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-play', 'fa-pause');
        icon.classList.add(isPlaying ? 'fa-pause' : 'fa-play');
      }
    }

    function setMuteState(muted) {
      video.muted = muted;
      muteBtn.setAttribute('aria-pressed', String(!muted));
      muteBtn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');

      const icon = muteBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-volume-xmark', 'fa-volume-high');
        icon.classList.add(muted ? 'fa-volume-xmark' : 'fa-volume-high');
      }

      // Once unmuted at least once, permanently dismiss hint (per requirement)
      if (!muted && !hintDismissed) {
        hintDismissed = true;
        shell.classList.add('hint-dismissed');
        if (hint) hint.style.display = 'none';
      }
    }

    // Start muted for autoplay compliance
    setMuteState(true);

    // Remove all native controls (no seeking UI)
    video.controls = false;

    // Autoplay after 5 seconds (unless reduced motion)
    if (!prefersReducedMotion) {
      window.setTimeout(async () => {
        if (!video.paused) return;
        try {
          await video.play();
        } catch {
          // Autoplay can be blocked; leave poster and let user play via custom control.
        }
      }, 5000);
    }

    // Keep UI in sync with playback
    setPlayStateUI(!video.paused);
    video.addEventListener('play', () => setPlayStateUI(true));
    video.addEventListener('pause', () => setPlayStateUI(false));
    video.addEventListener('ended', () => setPlayStateUI(false));

    // Custom play/pause button
    playBtn.addEventListener('click', async () => {
      if (video.paused) {
        try {
          await video.play();
        } catch {
          // ignore
        }
      } else {
        video.pause();
      }
    });

    // Unmute / mute toggle
    muteBtn.addEventListener('click', async () => {
      const nextMuted = !video.muted;
      setMuteState(nextMuted);

      if (!nextMuted) {
        video.volume = 1;
        try {
          await video.play();
        } catch {
          // Ignore; user can press play via custom control.
        }
      }
    });
  })();
})();
