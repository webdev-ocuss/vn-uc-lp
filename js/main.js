(() => {
  'use strict';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Lead modal behavior now handled by embedded GHL form.

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
