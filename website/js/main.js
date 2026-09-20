/**
 * PIVOT AIDE TAX — MAIN JAVASCRIPT
 * Handles mobile navigation, header scroll effects, active states,
 * and global modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initModals();
  initOwlTracking();
});

function initNavigation() {
  const toggleBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const topbar = document.querySelector('.topbar');

  function updateDrawerTop() {
    if (drawer && topbar) {
      const rect = topbar.getBoundingClientRect();
      drawer.style.top = `${Math.max(0, rect.bottom)}px`;
    }
  }

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      updateDrawerTop();
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.innerHTML = isOpen
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    window.addEventListener('resize', updateDrawerTop);
    window.addEventListener('scroll', updateDrawerTop, { passive: true });

    // Close on link click inside drawer
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });
    });
  }

  // Highlight active nav item based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a, .mobile-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Ensure dropdown parent trigger is active if currently viewing a resource subpage
  const resourceSubpages = ['resources.html', 'new-law.html', 'free-help.html', 'audit-resolution.html', 'meet-uncle-pat.html'];
  if (resourceSubpages.includes(currentPath)) {
    document.querySelectorAll('.nav-item.has-dropdown .dropdown-trigger').forEach(trigger => {
      trigger.classList.add('active');
    });
  }
}

function initHeaderScroll() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initModals() {
  // Global modal opener triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    }

    const closeBtn = e.target.closest('.modal-close, [data-modal-close]');
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    }
  });

  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-backdrop.open');
      if (openModalEl) closeModal(openModalEl);
    }
  });
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea, button:not(.modal-close)');
    if (firstInput) firstInput.focus();
  }
};

window.closeModal = function(modal) {
  if (typeof modal === 'string') {
    modal = document.getElementById(modal);
  }
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function initOwlTracking() {
  /* ───────────────────────────────────────────────────────────────────────────
   *  Uncle Pat — LERP-based 3D Parallax Tracker + Micro-animations
   *
   *  Architecture: single persistent requestAnimationFrame loop that
   *  LERP-interpolates 8 scalar state values each frame for butter-smooth,
   *  organic inertia. CSS transitions are stripped from all layer elements
   *  so the rAF loop is the sole animation driver — no double-buffering.
   *
   *  Micro-animations (separate rAF loops, non-competing):
   *    • Organic blink: random 4-9s interval, 140ms rAF-driven scaleY
   *    • Breathing idle: sinusoidal translateY after 2.5s mouse stillness
   *
   *  Layer depth stack (translateZ):
   *    #owl-layer-bg          0 px   — back feathers (deepest)
   *    #owl-layer-torso      10 px   — deep slate body
   *    #owl-layer-collar-tie 24 px   — collar + gold tie
   *    #owl-layer-head       36 px   — head, disc, tufts, beak
   *    #owl-layer-eyes       50 px   — sclera, iris, pupils (closest)
   * ─────────────────────────────────────────────────────────────────────────*/

  const owlSvg       = document.getElementById('hero-owl-svg');
  const leftPupil    = document.getElementById('owl-pupil-left');
  const rightPupil   = document.getElementById('owl-pupil-right');
  const owlRoot      = document.getElementById('owl-root');
  const owlHead      = document.getElementById('owl-layer-head') || document.getElementById('owl-head');
  const owlTorso     = document.getElementById('owl-layer-torso') || document.getElementById('owl-torso');
  const owlCollarTie = document.getElementById('owl-layer-collar-tie');
  const owlBg        = document.getElementById('owl-layer-bg');
  const owlEyes      = document.getElementById('owl-layer-eyes');
  const owlSpecular  = document.getElementById('owl-specular');
  const eyelidLeft   = document.getElementById('owl-eyelid-left');
  const eyelidRight  = document.getElementById('owl-eyelid-right');

  if (!owlSvg || !leftPupil || !rightPupil) return;

  // Mobile devices use touch + deviceorientation — tracking runs on all pointer types

  // ── LERP helper ─────────────────────────────────────────────────────────────
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── State: current interpolated values (all at rest on init) ────────────────
  const state = {
    normX:   0,   // interpolated normalized X  (−1 → +1)
    normY:   0,   // interpolated normalized Y  (−1 → +1)
    pupilX:  0,   // interpolated pupil translateX (px)
    pupilY:  0,   // interpolated pupil translateY (px)
    specX:   0,   // specular highlight translateX (px)
    specY:   0,   // specular highlight translateY (px)
    shadowX: -3,  // drop-shadow X offset (px) — resting value
    shadowY:  6,  // drop-shadow Y offset (px) — resting value
  };

  // ── Targets: updated each mousemove, LERP'd toward each frame ───────────────
  const target = {
    normX: 0,  normY: 0,
    pupilX: 0, pupilY: 0,
    specX: 0,  specY: 0,
    shadowX: -3, shadowY: 6,
  };

  // LERP factor (accelerated to eliminate tracking lag)
  const LERP_BODY = 0.25;  // 0.22 - 0.28 range — fast, responsive body/head tracking
  const MAX_PUPIL = 5.5;   // px — guaranteed inside sclera (r26 - iris r16 = 10px buffer)

  // ── Bounds cache & frame scheduling state ───────────────────────────────────
  let owlCenterX        = 0;
  let owlCenterY        = 0;
  let rafId             = null;
  let latestClientX     = 0;
  let latestClientY     = 0;
  let hasNewCoords      = false;
  let isTouchActive     = false;
  let isReturningToRest = false;
  let returnStartTime   = 0;
  let returnStartNormX  = 0;
  let returnStartNormY  = 0;
  let returnStartPupilX = 0;
  let returnStartPupilY = 0;
  let returnStartSpecX  = 0;
  let returnStartSpecY  = 0;
  let returnStartShadowX = -3;
  let returnStartShadowY = 6;
  const RETURN_DURATION_MS = 200; // brisk return over ~200ms

  const updateBounds = () => {
    const rect = owlSvg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    owlCenterX = rect.left + rect.width  * 0.5;
    owlCenterY = rect.top  + rect.height * 0.41;
  };
  updateBounds();

  // Strip CSS transitions — rAF loop is the sole easing driver
  [owlRoot, owlHead, owlTorso, owlCollarTie, owlBg, owlEyes,
   leftPupil, rightPupil, owlSpecular]
    .filter(Boolean)
    .forEach(el => {
      el.style.transition = 'none';
      el.style.setProperty('transition', 'none', 'important');
    });

  // ── Frame scheduling helpers (cancels redundant RAF ticks) ─────────────────
  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const scheduleFrame = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    rafId = requestAnimationFrame(tick);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  MICRO-ANIMATION 1 — ORGANIC BLINK
  //  • Separate rAF loop from the tracking loop to avoid coupling.
  //  • Random interval 4–9 s; skipped if pointer velocity is high.
  //  • Phase 1 (60 ms): scaleY 0 → 1  (upper eyelid sweeps down — close)
  //  • Phase 2 (80 ms): scaleY 1 → 0  (eyelid lifts back — open)
  //  • Total: 140 ms. Looks natural; does not feel cartoonish.
  // ═══════════════════════════════════════════════════════════════════════════

  const BLINK_CLOSE_MS = 60;
  const BLINK_OPEN_MS  = 80;
  const BLINK_TOTAL_MS = BLINK_CLOSE_MS + BLINK_OPEN_MS;
  let blinkRafId       = null;
  let blinkScheduledId = null;
  let pointerSpeed     = 0;      // updated in onMouseMove, decays over time
  let lastMoveTime     = performance.now();

  function executeBlink() {
    // If stationary for > 300ms, pointer speed is zeroed
    if ((performance.now() - lastMoveTime) > 300) {
      pointerSpeed = 0;
    }
    // Suppress blink during fast cursor movement (speed threshold: 0.04 norm/frame)
    if (pointerSpeed > 0.04) {
      scheduleBlink(); // try again later
      return;
    }
    if (!eyelidLeft || !eyelidRight) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const start = performance.now();

    function blinkTick(now) {
      const t = now - start;
      let scale;

      if (t < BLINK_CLOSE_MS) {
        // Close phase: ease-in (accelerating)
        const p = t / BLINK_CLOSE_MS;
        scale = p * p; // quadratic ease-in
      } else if (t < BLINK_TOTAL_MS) {
        // Open phase: ease-out (decelerating)
        const p = (t - BLINK_CLOSE_MS) / BLINK_OPEN_MS;
        scale = 1 - p * p; // quadratic ease-out
      } else {
        // Done — ensure fully open
        eyelidLeft.style.transform  = 'scaleY(0)';
        eyelidRight.style.transform = 'scaleY(0)';
        blinkRafId = null;
        scheduleBlink(); // queue next blink
        return;
      }

      eyelidLeft.style.transform  = `scaleY(${scale.toFixed(4)})`;
      eyelidRight.style.transform = `scaleY(${scale.toFixed(4)})`;
      blinkRafId = requestAnimationFrame(blinkTick);
    }

    blinkRafId = requestAnimationFrame(blinkTick);
  }

  function scheduleBlink() {
    if (blinkScheduledId) clearTimeout(blinkScheduledId);
    // Random interval: 4000–9000 ms
    const delay = 4000 + Math.random() * 5000;
    blinkScheduledId = setTimeout(executeBlink, delay);
  }

  // Kick off blink scheduler after a short warmup
  setTimeout(scheduleBlink, 2000);

  // ═══════════════════════════════════════════════════════════════════════════
  //  MICRO-ANIMATION 2 — BREATHING IDLE
  //  • Activates after 2.5 s of mouse stillness.
  //  • Very slow 4-second sinusoidal chest rise/fall (−1.5 px translateY).
  //  • Applied as an additive offset inside the main tick loop so it
  //    blends naturally with the 3D parallax transforms.
  //  • Deactivates immediately on next mouse move.
  // ═══════════════════════════════════════════════════════════════════════════

  const BREATHE_IDLE_MS   = 2500;  // ms still before breathing starts
  const BREATHE_CYCLE_MS  = 4000;  // period of one breath (in + out)
  const BREATHE_AMPLITUDE = 1.5;   // px — subtle, not cartoonish

  let breatheActive       = false;
  let breatheStart        = 0;     // timestamp when breathing began
  let breatheTimer        = null;

  function resetBreatheTimer() {
    if (breatheTimer) clearTimeout(breatheTimer);
    breatheActive = false;
    breatheTimer  = setTimeout(() => {
      breatheActive = true;
      breatheStart  = performance.now();
      scheduleFrame();
    }, BREATHE_IDLE_MS);
  }

  // ── Core rAF loop ────────────────────────────────────────────────────────────
  function tick() {
    rafId = null;

    // Runtime reduced-motion guard
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resetToRest();
      return;
    }

    // Run calculations only when new coordinates arrive via mousemove or touchmove
    if (hasNewCoords) {
      hasNewCoords = false;
      setTargetFromDelta(latestClientX - owlCenterX, latestClientY - owlCenterY);
    }

    const now = performance.now();

    // Breathing offset: smooth sinusoid, only when idle breathing is active
    const breatheY = breatheActive
      ? -BREATHE_AMPLITUDE * Math.sin((now - breatheStart) * 2 * Math.PI / BREATHE_CYCLE_MS)
      : 0;

    // ── Coordinate update: brisk 200ms ease-out return, instant touch reaction, or accelerated LERP ──
    if (isReturningToRest) {
      const elapsed  = now - returnStartTime;
      const progress = Math.min(elapsed / RETURN_DURATION_MS, 1.0);
      const easeOut  = 1 - (1 - progress) * (1 - progress); // brisk quadratic ease-out

      state.normX   = returnStartNormX   + (0  - returnStartNormX)   * easeOut;
      state.normY   = returnStartNormY   + (0  - returnStartNormY)   * easeOut;
      state.pupilX  = returnStartPupilX  + (0  - returnStartPupilX)  * easeOut;
      state.pupilY  = returnStartPupilY  + (0  - returnStartPupilY)  * easeOut;
      state.specX   = returnStartSpecX   + (0  - returnStartSpecX)   * easeOut;
      state.specY   = returnStartSpecY   + (0  - returnStartSpecY)   * easeOut;
      state.shadowX = returnStartShadowX + (-3 - returnStartShadowX) * easeOut;
      state.shadowY = returnStartShadowY + (6  - returnStartShadowY) * easeOut;

      if (progress >= 1.0) {
        isReturningToRest = false;
        state.normX   = 0;
        state.normY   = 0;
        state.pupilX  = 0;
        state.pupilY  = 0;
        state.specX   = 0;
        state.specY   = 0;
        state.shadowX = -3;
        state.shadowY = 6;
      }
    } else if (isTouchActive) {
      // Immediate Touch Reaction: bypass heavy smoothing so finger swipes track instantly
      state.normX   = target.normX;
      state.normY   = target.normY;
      state.pupilX  = target.pupilX;
      state.pupilY  = target.pupilY;
      state.specX   = target.specX;
      state.specY   = target.specY;
      state.shadowX = target.shadowX;
      state.shadowY = target.shadowY;
    } else {
      // Desktop mouse or gyro tracking — accelerated LERP factor
      state.normX   = lerp(state.normX,   target.normX,   LERP_BODY);
      state.normY   = lerp(state.normY,   target.normY,   LERP_BODY);
      state.specX   = lerp(state.specX,   target.specX,   LERP_BODY);
      state.specY   = lerp(state.specY,   target.specY,   LERP_BODY);
      state.shadowX = lerp(state.shadowX, target.shadowX, LERP_BODY);
      state.shadowY = lerp(state.shadowY, target.shadowY, LERP_BODY);

      // Direct snap when within minimal threshold to eliminate trailing latency completely
      if (Math.abs(state.normX - target.normX) < 0.0015) state.normX = target.normX;
      if (Math.abs(state.normY - target.normY) < 0.0015) state.normY = target.normY;
      if (Math.abs(state.specX - target.specX) < 0.05)   state.specX = target.specX;
      if (Math.abs(state.specY - target.specY) < 0.05)   state.specY = target.specY;
      if (Math.abs(state.shadowX - target.shadowX) < 0.05) state.shadowX = target.shadowX;
      if (Math.abs(state.shadowY - target.shadowY) < 0.05) state.shadowY = target.shadowY;

      // Pupils: set position directly in animation frame so gaze snaps synchronously without delay
      state.pupilX  = target.pupilX;
      state.pupilY  = target.pupilY;
    }

    // Decay pointer speed frame-by-frame
    pointerSpeed *= 0.88;

    const nx = state.normX;
    const ny = state.normY;

    // 1. Root group tilt — unified rig rotation base
    if (owlRoot) {
      owlRoot.style.transform =
        `rotateY(${(nx * 2).toFixed(2)}deg) rotateX(${(-ny * 2).toFixed(2)}deg)`;
    }

    // 2. Head (#owl-head or #owl-layer-head)
    // rotateY: normX * 14deg, rotateX: -normY * 10deg, translateX: normX * 8px, translateY: normY * 6px
    if (owlHead) {
      const headTx = (nx * 8).toFixed(1);
      const headTy = (ny * 6 + (breatheActive ? breatheY * 0.5 : 0)).toFixed(2);
      const headRy = (nx * 14).toFixed(2);
      const headRx = (-ny * 10).toFixed(2);
      owlHead.style.transform =
        `translateZ(36px) translateX(${headTx}px) translateY(${headTy}px) rotateY(${headRy}deg) rotateX(${headRx}deg)`;
    }

    // 3. Collar & Tie — tracks behind head
    if (owlCollarTie) {
      const collarBreatheY = breatheActive ? breatheY * 0.8 : 0;
      owlCollarTie.style.transform =
        `translateZ(24px) translateX(${(nx * 5).toFixed(1)}px) translateY(${collarBreatheY.toFixed(2)}px) rotateY(${(nx * 8).toFixed(2)}deg)`;
    }

    // 4. Torso (#owl-torso)
    // rotateY: normX * 6deg, translateX: normX * 4px
    if (owlTorso) {
      const torsoTx = (nx * 4).toFixed(1);
      const torsoTy = (breatheActive ? breatheY : 0).toFixed(2);
      const torsoRy = (nx * 6).toFixed(2);
      owlTorso.style.transform =
        `translateZ(10px) translateX(${torsoTx}px) translateY(${torsoTy}px) rotateY(${torsoRy}deg)`;
      owlTorso.style.filter =
        `drop-shadow(${(-nx * 8).toFixed(1)}px ${(12 + ny * 4).toFixed(1)}px 20px rgba(0,0,0,0.35))`;
    }

    // 5. Background plumage — subtle depth anchor
    if (owlBg) {
      owlBg.style.transform =
        `translateZ(0px) translateX(${(nx * 1.5).toFixed(1)}px) rotateY(${(nx * 2).toFixed(2)}deg)`;
    }

    // 6. Eyes layer — depth pop + follow
    if (owlEyes) {
      const eyesBreatheY = breatheActive ? breatheY * 0.3 : 0;
      owlEyes.style.transform =
        `translateZ(50px) translateX(${(nx * 2.5).toFixed(1)}px) translateY(${(ny * 2 + eyesBreatheY).toFixed(2)}px)`;
    }

    // 7. Pupils — set directly in animation frame synchronously without waiting on transitions
    leftPupil.style.transform  =
      `translateX(${state.pupilX.toFixed(2)}px) translateY(${state.pupilY.toFixed(2)}px)`;
    rightPupil.style.transform =
      `translateX(${state.pupilX.toFixed(2)}px) translateY(${state.pupilY.toFixed(2)}px)`;

    // 8. CSS custom props → head & collar drop-shadow filters
    owlSvg.style.setProperty('--owl-shadow-x', `${state.shadowX.toFixed(1)}px`);
    owlSvg.style.setProperty('--owl-shadow-y', `${state.shadowY.toFixed(1)}px`);

    // 9. Specular highlight — moves opposite cursor
    if (owlSpecular) {
      owlSpecular.style.transform =
        `translateX(${state.specX.toFixed(1)}px) translateY(${state.specY.toFixed(1)}px)`;
    }

    // Stop redundant RAF ticks when settled; continue only while interpolating, returning, or breathing
    const settled =
      !isReturningToRest &&
      state.normX === target.normX &&
      state.normY === target.normY &&
      state.specX === target.specX &&
      state.specY === target.specY &&
      state.shadowX === target.shadowX &&
      state.shadowY === target.shadowY;

    if (!settled) {
      rafId = requestAnimationFrame(tick);
    } else if (breatheActive) {
      rafId = requestAnimationFrame(tick);
    }
  }

  // ── Shared helper: update all targets from a viewport delta (px from owl centre) ──
  let prevNormX = 0;
  let prevNormY = 0;

  function setTargetFromDelta(dX, dY) {
    const maxX = Math.max(window.innerWidth  * 0.5, 300);
    const maxY = Math.max(window.innerHeight * 0.5, 300);
    const newNormX = Math.max(-1, Math.min(1, dX / maxX));
    const newNormY = Math.max(-1, Math.min(1, dY / maxY));

    pointerSpeed = Math.hypot(newNormX - prevNormX, newNormY - prevNormY);
    prevNormX = newNormX;
    prevNormY = newNormY;

    target.normX = newNormX;
    target.normY = newNormY;

    const angle  = Math.atan2(dY, dX);
    const factor = Math.min(Math.hypot(dX, dY) / 420, 1.0);
    target.pupilX = Math.cos(angle) * MAX_PUPIL * factor;
    target.pupilY = Math.sin(angle) * MAX_PUPIL * factor;

    target.specX   = -newNormX * 18;
    target.specY   = -newNormY * 12;
    target.shadowX = -newNormX * 6;
    target.shadowY =  6 + newNormY * 4;
  }

  // ── Mouse move handler ───────────────────────────────────────────────────────
  const onMouseMove = (e) => {
    isTouchActive     = false;
    isReturningToRest = false;
    lastMoveTime      = performance.now();
    resetBreatheTimer();
    latestClientX = e.clientX;
    latestClientY = e.clientY;
    hasNewCoords  = true;
    scheduleFrame();
  };

  // ── Touch event handler (touchstart + touchmove, mobile finger tracking) ──────────
  function handleTouch(e) {
    if (!e.touches || e.touches.length === 0) return;
    lastMoveTime      = performance.now();
    resetBreatheTimer();
    isTouchActive     = true;
    isReturningToRest = false;

    const t = e.touches[0];
    latestClientX = t.clientX;
    latestClientY = t.clientY;

    // Apply coordinates immediately into target vector
    setTargetFromDelta(t.clientX - owlCenterX, t.clientY - owlCenterY);

    // Bypass heavy smoothing immediately for instant finger reaction
    state.normX   = target.normX;
    state.normY   = target.normY;
    state.pupilX  = target.pupilX;
    state.pupilY  = target.pupilY;
    state.specX   = target.specX;
    state.specY   = target.specY;
    state.shadowX = target.shadowX;
    state.shadowY = target.shadowY;

    scheduleFrame();
  }

  // On touchend / touchcancel: briskly return to origin over ~200ms
  function handleTouchEnd() {
    isTouchActive     = false;
    isReturningToRest = true;
    returnStartTime   = performance.now();
    returnStartNormX  = state.normX;
    returnStartNormY  = state.normY;
    returnStartPupilX = state.pupilX;
    returnStartPupilY = state.pupilY;
    returnStartSpecX  = state.specX;
    returnStartSpecY  = state.specY;
    returnStartShadowX = state.shadowX;
    returnStartShadowY = state.shadowY;

    target.normX   = 0;
    target.normY   = 0;
    target.pupilX  = 0;
    target.pupilY  = 0;
    target.specX   = 0;
    target.specY   = 0;
    target.shadowX = -3;
    target.shadowY = 6;
    pointerSpeed   = 0;
    hasNewCoords   = false;

    resetBreatheTimer();
    scheduleFrame();
  }

  // ── Device orientation handler (gyroscope tilt on mobile) ────────────────────
  let orientationActive = false;

  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    if (isTouchActive) return; // Touch interaction takes precedence

    lastMoveTime = performance.now();
    resetBreatheTimer();

    // Fast Gyroscope Response:
    // Tightened clamp range & sensitivity multiplier for dynamic reaction to subtle phone tilts
    const GAMMA_CLAMP = 15;        // degrees (tightened from ±30°)
    const GAMMA_SENSITIVITY = 1.5; // multiplier for fast, responsive left/right reaction
    const clampedGamma = Math.max(-GAMMA_CLAMP, Math.min(GAMMA_CLAMP, e.gamma));
    const gNorm = Math.max(-1, Math.min(1, (clampedGamma / GAMMA_CLAMP) * GAMMA_SENSITIVITY));

    // Vertical axis: beta — natural phone hold angle ~40°
    const BETA_CENTER = 40;       // degrees
    const BETA_CLAMP = 12;        // degrees delta (tightened from ±25°)
    const BETA_SENSITIVITY = 1.5; // multiplier for fast, responsive up/down reaction
    const betaDelta = e.beta - BETA_CENTER;
    const clampedBetaDelta = Math.max(-BETA_CLAMP, Math.min(BETA_CLAMP, betaDelta));
    const bNorm = Math.max(-1, Math.min(1, (clampedBetaDelta / BETA_CLAMP) * BETA_SENSITIVITY));

    target.normX   = gNorm;
    target.normY   = bNorm;
    target.pupilX  = gNorm * MAX_PUPIL;
    target.pupilY  = bNorm * MAX_PUPIL;
    target.specX   = -gNorm * 18;
    target.specY   = -bNorm * 12;
    target.shadowX = -gNorm * 6;
    target.shadowY =  6 + bNorm * 4;

    if (!orientationActive) {
      orientationActive = true;
      owlSvg.style.animation = 'none';
    }
    hasNewCoords = false;
    scheduleFrame();
  }

  // ── iOS 13+ permission + orientation listener registration ───────────────────
  function enableOrientationTracking() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(result => {
          if (result === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          }
        })
        .catch(() => { /* sensor unavailable — graceful fallback to touch-only */ });
    } else {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
  }

  // ── Pointer leaves viewport ──────────────────────────────────────────────────
  const onMouseLeave = () => {
    isTouchActive     = false;
    isReturningToRest = false;
    pointerSpeed      = 0;
    target.normX      = 0;  target.normY      = 0;
    target.pupilX     = 0;  target.pupilY     = 0;
    target.specX      = 0;  target.specY      = 0;
    target.shadowX    = -3; target.shadowY    = 6;
    hasNewCoords      = false;
    resetBreatheTimer();
    scheduleFrame();
  };

  // ── Hard reset (reduced-motion or unmount) ───────────────────────────────────
  function resetToRest() {
    stopLoop();
    breatheActive     = false;
    isTouchActive     = false;
    isReturningToRest = false;
    if (breatheTimer) { clearTimeout(breatheTimer); breatheTimer = null; }

    // Cancel blink in-flight
    if (blinkRafId)       { cancelAnimationFrame(blinkRafId); blinkRafId = null; }
    if (blinkScheduledId) { clearTimeout(blinkScheduledId);   blinkScheduledId = null; }
    if (eyelidLeft)  eyelidLeft.style.transform  = 'scaleY(0)';
    if (eyelidRight) eyelidRight.style.transform = 'scaleY(0)';

    Object.assign(state,  { normX: 0, normY: 0, pupilX: 0, pupilY: 0,
                            specX: 0, specY: 0, shadowX: -3, shadowY: 6 });
    Object.assign(target, { normX: 0, normY: 0, pupilX: 0, pupilY: 0,
                            specX: 0, specY: 0, shadowX: -3, shadowY: 6 });

    if (owlRoot)      owlRoot.style.transform       = '';
    if (owlHead)      owlHead.style.transform        = 'translateZ(36px)';
    if (owlCollarTie) owlCollarTie.style.transform   = 'translateZ(24px)';
    if (owlTorso)   { owlTorso.style.transform       = 'translateZ(10px)';
                      owlTorso.style.filter           = ''; }
    if (owlBg)        owlBg.style.transform          = 'translateZ(0px)';
    if (owlEyes)      owlEyes.style.transform        = 'translateZ(50px)';
    leftPupil.style.transform  = '';
    rightPupil.style.transform = '';
    owlSvg.style.setProperty('--owl-shadow-x', '-3px');
    owlSvg.style.setProperty('--owl-shadow-y',  '6px');
    if (owlSpecular)  owlSpecular.style.transform    = '';
  }

  // Initialize breathing idle timer
  resetBreatheTimer();

  // ── Event listener registration (desktop & touch) ──────────────────────────
  window.addEventListener('mousemove',    onMouseMove,    { passive: true });
  document.addEventListener('mouseleave', onMouseLeave,   { passive: true });
  window.addEventListener('touchstart',   handleTouch,    { passive: true });
  window.addEventListener('touchmove',    handleTouch,    { passive: true });
  window.addEventListener('touchend',     handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel',  handleTouchEnd, { passive: true });

  // Gyroscope: request permission on first touchstart gesture (iOS 13+)
  window.addEventListener('touchstart', function grantOnce() {
    enableOrientationTracking();
    window.removeEventListener('touchstart', grantOnce);
  }, { once: true, passive: true });

  // Recalculate owl centre whenever the layout shifts
  window.addEventListener('resize', updateBounds, { passive: true });
  window.addEventListener('scroll', updateBounds, { passive: true });
}
