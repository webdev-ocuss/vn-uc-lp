(() => {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Lead modal behavior (Unshackled book page)
  (() => {
    const modalEl = document.getElementById('leadModal');
    if (!modalEl) return;

    // Bootstrap is required for this modal.
    const bs = window.bootstrap;
    if (!bs?.Modal) return;

    const leadModal = bs.Modal.getOrCreateInstance(modalEl, {
      backdrop: 'static',
      keyboard: true
    });

    const formPanel = document.getElementById('leadModalFormPanel');
    const successPanel = document.getElementById('leadModalSuccessPanel');
    const form = document.getElementById('leadForm');
    const statusEl = document.getElementById('leadFormStatus');

    const countdownEl = document.getElementById('leadCloseCountdown');
    const downloadBtn = document.getElementById('leadDownloadBtn');
    const closeNowBtn = document.getElementById('leadCloseNow');

    let intervalId = null;
    let remainingMs = 10000;
    let lastTick = 0;

    function clearTimer() {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }

    function setPanels(showSuccess) {
      if (formPanel) formPanel.classList.toggle('d-none', showSuccess);
      if (successPanel) successPanel.classList.toggle('d-none', !showSuccess);
    }

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg;
    }

    function resetCountdown() {
      remainingMs = 10000;
      lastTick = Date.now();
      if (countdownEl) countdownEl.textContent = '10';
    }

    function updateCountdown() {
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
      if (countdownEl) countdownEl.textContent = String(seconds);
    }

    function startInactivityCountdown() {
      clearTimer();
      resetCountdown();

      const onActivity = () => {
        resetCountdown();
      };

      const activityEvents = ['click', 'keydown', 'focusin', 'touchstart', 'pointerdown'];
      activityEvents.forEach((evt) => modalEl.addEventListener(evt, onActivity, { passive: true }));

      intervalId = window.setInterval(() => {
        const now = Date.now();
        const delta = now - lastTick;
        lastTick = now;
        remainingMs -= delta;
        updateCountdown();

        if (remainingMs <= 0) {
          clearTimer();
          activityEvents.forEach((evt) => modalEl.removeEventListener(evt, onActivity));
          leadModal.hide();
        }
      }, 250);

      // Cleanup activity listeners when modal hides
      const cleanup = () => {
        clearTimer();
        activityEvents.forEach((evt) => modalEl.removeEventListener(evt, onActivity));
        modalEl.removeEventListener('hidden.bs.modal', cleanup);
      };
      modalEl.addEventListener('hidden.bs.modal', cleanup);
    }

    function resetModal() {
      setPanels(false);
      setStatus('');
      clearTimer();
      if (form) {
        form.reset();
        form.classList.remove('was-validated');
      }
      if (countdownEl) countdownEl.textContent = '10';
    }

    modalEl.addEventListener('show.bs.modal', () => {
      resetModal();
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      resetModal();
    });

    closeNowBtn?.addEventListener('click', () => {
      leadModal.hide();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      setStatus('');

      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        setStatus('Please complete the required fields.');
        return;
      }

      setPanels(true);
      downloadBtn?.focus?.();
      startInactivityCountdown();
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
