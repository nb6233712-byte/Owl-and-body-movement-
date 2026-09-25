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
  initHeroEntrance();
  initScrollReveal();
  initLegalNavSpy();
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
  const owlHead      = document.getElementById('owl-3d-head') || document.getElementById('owl-layer-head') || document.getElementById('owl-head');
  const owlTorso     = document.getElementById('owl-3d-torso') || document.getElementById('owl-layer-torso') || document.getElementById('owl-torso');
  const owlCollarTie = document.getElementById('owl-3d-collar-tie') || document.getElementById('owl-layer-collar-tie');
  const owlBg        = document.getElementById('owl-3d-shadow') || document.getElementById('owl-layer-bg');
  const owlEyes      = document.getElementById('owl-3d-eyes') || document.getElementById('owl-layer-eyes');
  const owlSpecular  = document.getElementById('owl-specular');
  const eyelidLeft      = document.getElementById('owl-eyelid-left');
  const eyelidRight     = document.getElementById('owl-eyelid-right');
  const headSphereGrad  = document.getElementById('headSphereGrad');
  const facialDiscGrad  = document.getElementById('facialDiscGrad');
  const torsoSphereGrad = document.getElementById('torsoSphereGrad');
  const owlSpecularGrad = document.getElementById('owlSpecularGrad');

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
  const LERP_BODY = 0.25;  // 0.25 aggressive interpolation speed — immediate, crisp, and snappy
  const MAX_PUPIL = 5.5;   // px — guaranteed inside sclera (r26 - iris r16 = 10px buffer)

  // ── Bounds cache & frame scheduling state ───────────────────────────────────
  let owlCenterX        = 0;
  let owlCenterY        = 0;
  let rafId             = null;
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

    const now = performance.now();

    // Breathing offset: smooth sinusoid, only when idle breathing is active
    const breatheY = breatheActive
      ? -BREATHE_AMPLITUDE * Math.sin((now - breatheStart) * 2 * Math.PI / BREATHE_CYCLE_MS)
      : 0;

    // ── Coordinate update: brisk 200ms ease-out return, or accelerated unified LERP (0.25) ──
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
    } else {
      // Aggressive interpolation speed (LERP factor: 0.25) so response is immediate, crisp, and snappy with zero lag
      state.normX   = lerp(state.normX,   target.normX,   LERP_BODY);
      state.normY   = lerp(state.normY,   target.normY,   LERP_BODY);
      state.specX   = lerp(state.specX,   target.specX,   LERP_BODY);
      state.specY   = lerp(state.specY,   target.specY,   LERP_BODY);
      state.shadowX = lerp(state.shadowX, target.shadowX, LERP_BODY);
      state.shadowY = lerp(state.shadowY, target.shadowY, LERP_BODY);

      // Direct snap when within minimal threshold (< 0.0015) for zero trailing latency
      if (Math.abs(state.normX - target.normX) < 0.0015) state.normX = target.normX;
      if (Math.abs(state.normY - target.normY) < 0.0015) state.normY = target.normY;
      if (Math.abs(state.specX - target.specX) < 0.05)   state.specX = target.specX;
      if (Math.abs(state.specY - target.specY) < 0.05)   state.specY = target.specY;
      if (Math.abs(state.shadowX - target.shadowX) < 0.05) state.shadowX = target.shadowX;
      if (Math.abs(state.shadowY - target.shadowY) < 0.05) state.shadowY = target.shadowY;

      // Synchronized Eye Gaze: apply instantaneous translation directly so gaze snaps in real time
      state.pupilX  = target.pupilX;
      state.pupilY  = target.pupilY;
    }

    // Clamp pupil displacement strictly to maximum 5.5px radius
    const pupilR = Math.hypot(state.pupilX, state.pupilY);
    if (pupilR > MAX_PUPIL) {
      state.pupilX = (state.pupilX / pupilR) * MAX_PUPIL;
      state.pupilY = (state.pupilY / pupilR) * MAX_PUPIL;
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

    // 2. Head (#owl-3d-head):
    // transform: rotateY(${normX * 16}deg) rotateX(${-normY * 12}deg) translateX(${normX * 10}px) translateY(${normY * 6}px) translateZ(42px);
    if (owlHead) {
      const headTx = (nx * 10).toFixed(2);
      const headTy = (ny * 6 + (breatheActive ? breatheY * 0.5 : 0)).toFixed(2);
      const headRy = (nx * 16).toFixed(2);
      const headRx = (-ny * 12).toFixed(2);
      owlHead.style.transform =
        `rotateY(${headRy}deg) rotateX(${headRx}deg) translateX(${headTx}px) translateY(${headTy}px) translateZ(42px)`;
    }

    // 3. Collar & Tie (#owl-3d-collar-tie):
    // transform: rotateY(${normX * 7}deg) rotateX(${-normY * 5}deg) translateX(${normX * 4}px) translateZ(22px);
    if (owlCollarTie) {
      const collarTx = (nx * 4).toFixed(2);
      const collarRy = (nx * 7).toFixed(2);
      const collarRx = (-ny * 5).toFixed(2);
      const collarTy = breatheActive && breatheY !== 0 ? ` translateY(${(breatheY * 0.8).toFixed(2)}px)` : '';
      owlCollarTie.style.transform =
        `rotateY(${collarRy}deg) rotateX(${collarRx}deg) translateX(${collarTx}px)${collarTy} translateZ(22px)`;
    }

    // 4. Torso (#owl-3d-torso):
    // transform: rotateY(${normX * 4}deg) translateX(${normX * 2}px) translateZ(5px);
    if (owlTorso) {
      const torsoTx = (nx * 2).toFixed(2);
      const torsoRy = (nx * 4).toFixed(2);
      const torsoTy = breatheActive && breatheY !== 0 ? ` translateY(${breatheY.toFixed(2)}px)` : '';
      owlTorso.style.transform =
        `rotateY(${torsoRy}deg) translateX(${torsoTx}px)${torsoTy} translateZ(5px)`;
      owlTorso.style.filter =
        `drop-shadow(${(-nx * 8).toFixed(1)}px ${(12 + ny * 4).toFixed(1)}px 20px rgba(0,0,0,0.35))`;
    }

    // 5. Background plumage — subtle depth anchor
    if (owlBg) {
      owlBg.style.transform =
        `translateZ(0px) translateX(${(nx * 1.5).toFixed(1)}px) rotateY(${(nx * 2).toFixed(2)}deg)`;
    }

    // 6. Eyes layer — depth pop + follow (rotates with head in 3D space)
    if (owlEyes) {
      const eyesTy = (ny * 6 + (breatheActive ? breatheY * 0.3 : 0)).toFixed(2);
      owlEyes.style.transform =
        `rotateY(${(nx * 16).toFixed(2)}deg) rotateX(${(-ny * 12).toFixed(2)}deg) translateX(${(nx * 10).toFixed(2)}px) translateY(${eyesTy}px) translateZ(58px)`;
    }

    // 7. Synchronized Eye Gaze: instantaneous translation to #owl-pupil-left and #owl-pupil-right
    leftPupil.style.transform  =
      `translateX(${state.pupilX.toFixed(2)}px) translateY(${state.pupilY.toFixed(2)}px)`;
    rightPupil.style.transform =
      `translateX(${state.pupilX.toFixed(2)}px) translateY(${state.pupilY.toFixed(2)}px)`;

    // 8. CSS custom props → drop-shadow filters
    owlSvg.style.setProperty('--owl-shadow-x', `${state.shadowX.toFixed(1)}px`);
    owlSvg.style.setProperty('--owl-shadow-y', `${state.shadowY.toFixed(1)}px`);

    // 9. Dynamic Specular Light Shift: shift radial gradient focal point slightly opposite to rotation
    if (headSphereGrad) {
      headSphereGrad.setAttribute('cx', `${(40 - nx * 8).toFixed(1)}%`);
      headSphereGrad.setAttribute('cy', `${(35 - ny * 6).toFixed(1)}%`);
      headSphereGrad.setAttribute('fx', `${(38 - nx * 8).toFixed(1)}%`);
      headSphereGrad.setAttribute('fy', `${(32 - ny * 6).toFixed(1)}%`);
    }
    if (facialDiscGrad) {
      facialDiscGrad.setAttribute('cx', `${(40 - nx * 7).toFixed(1)}%`);
      facialDiscGrad.setAttribute('cy', `${(35 - ny * 5).toFixed(1)}%`);
      facialDiscGrad.setAttribute('fx', `${(38 - nx * 7).toFixed(1)}%`);
      facialDiscGrad.setAttribute('fy', `${(32 - ny * 5).toFixed(1)}%`);
    }
    if (torsoSphereGrad) {
      torsoSphereGrad.setAttribute('cx', `${(45 - nx * 5).toFixed(1)}%`);
      torsoSphereGrad.setAttribute('cy', `${(35 - ny * 4).toFixed(1)}%`);
    }
    if (owlSpecularGrad) {
      owlSpecularGrad.setAttribute('cx', `${(50 - nx * 10).toFixed(1)}%`);
      owlSpecularGrad.setAttribute('cy', `${(40 - ny * 8).toFixed(1)}%`);
      owlSpecularGrad.setAttribute('fx', `${(50 - nx * 10).toFixed(1)}%`);
      owlSpecularGrad.setAttribute('fy', `${(30 - ny * 8).toFixed(1)}%`);
    }
    if (owlSpecular) {
      owlSpecular.style.transform =
        `translateX(${state.specX.toFixed(1)}px) translateY(${state.specY.toFixed(1)}px)`;
    }

    // Stop redundant RAF ticks when settled; continue only while interpolating, returning, or breathing
    const settled =
      !isReturningToRest &&
      Math.abs(state.normX - target.normX) < 0.0015 &&
      Math.abs(state.normY - target.normY) < 0.0015 &&
      Math.abs(state.specX - target.specX) < 0.05 &&
      Math.abs(state.specY - target.specY) < 0.05 &&
      Math.abs(state.shadowX - target.shadowX) < 0.05 &&
      Math.abs(state.shadowY - target.shadowY) < 0.05;

    if (!settled) {
      rafId = requestAnimationFrame(tick);
    } else if (breatheActive) {
      rafId = requestAnimationFrame(tick);
    }
  }

  // ── Unified Fast Input Handler ─────────────────────────────────────────────
  // Track pointer position via mousemove and touchmove ({ passive: true })
  // Normalize target offsets to -1.0 to 1.0 based on viewport center
  let prevNormX = 0;
  let prevNormY = 0;

  function updatePointer(clientX, clientY) {
    lastMoveTime = performance.now();
    resetBreatheTimer();

    const vpCenterX = window.innerWidth * 0.5;
    const vpCenterY = window.innerHeight * 0.5;

    // Normalize target offsets to -1.0 to 1.0 based on viewport center
    const newNormX = Math.max(-1.0, Math.min(1.0, (clientX - vpCenterX) / (vpCenterX || 1)));
    const newNormY = Math.max(-1.0, Math.min(1.0, (clientY - vpCenterY) / (vpCenterY || 1)));

    pointerSpeed = Math.hypot(newNormX - prevNormX, newNormY - prevNormY);
    prevNormX = newNormX;
    prevNormY = newNormY;

    target.normX = newNormX;
    target.normY = newNormY;

    // Synchronized Eye Gaze:
    // Calculate pupil displacement clamped to a maximum 5.5px radius
    const dX = clientX - owlCenterX;
    const dY = clientY - owlCenterY;
    const dist = Math.hypot(dX, dY);
    const angle = Math.atan2(dY, dX);
    const factor = Math.min(dist / 380, 1.0);
    const pupilDist = Math.min(MAX_PUPIL, MAX_PUPIL * factor);
    target.pupilX = Math.cos(angle) * pupilDist;
    target.pupilY = Math.sin(angle) * pupilDist;

    target.specX   = -newNormX * 18;
    target.specY   = -newNormY * 12;
    target.shadowX = -newNormX * 6;
    target.shadowY =  6 + newNormY * 4;

    scheduleFrame();
  }

  // ── Pointer & Touch event handlers ─────────────────────────────────────────
  const onMouseMove = (e) => {
    isTouchActive     = false;
    isReturningToRest = false;
    updatePointer(e.clientX, e.clientY);
  };

  function handleTouch(e) {
    if (!e.touches || e.touches.length === 0) return;
    isTouchActive     = true;
    isReturningToRest = false;
    const t = e.touches[0];
    updatePointer(t.clientX, t.clientY);
  }

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

    resetBreatheTimer();
    scheduleFrame();
  }

  // ── Mobile Gyroscope ────────────────────────────────────────────────────────
  // Map window.ondeviceorientation (gamma: -30 to 30, beta: 15 to 65) directly
  // into normalized inputs [-1.0, 1.0] so tilting phone drives high-speed 3D tilt
  let orientationActive = false;

  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    if (isTouchActive) return; // Touch interaction takes precedence

    lastMoveTime = performance.now();
    resetBreatheTimer();

    // Map gamma: -30 to 30 directly into normalized input [-1.0, 1.0]
    const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
    const normX = clampedGamma / 30;

    // Map beta: 15 to 65 directly into normalized input [-1.0, 1.0] (center 40, span +/-25)
    const clampedBeta = Math.max(15, Math.min(65, e.beta));
    const normY = (clampedBeta - 40) / 25;

    target.normX = Math.max(-1.0, Math.min(1.0, normX));
    target.normY = Math.max(-1.0, Math.min(1.0, normY));

    // Calculate pupil displacement clamped to maximum 5.5px radius
    target.pupilX = target.normX * MAX_PUPIL;
    target.pupilY = target.normY * MAX_PUPIL;
    const gyroPupilR = Math.hypot(target.pupilX, target.pupilY);
    if (gyroPupilR > MAX_PUPIL) {
      target.pupilX = (target.pupilX / gyroPupilR) * MAX_PUPIL;
      target.pupilY = (target.pupilY / gyroPupilR) * MAX_PUPIL;
    }

    target.specX   = -target.normX * 18;
    target.specY   = -target.normY * 12;
    target.shadowX = -target.normX * 6;
    target.shadowY =  6 + target.normY * 4;

    if (!orientationActive) {
      orientationActive = true;
      owlSvg.style.animation = 'none';
    }
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
    if (owlHead)      owlHead.style.transform        = 'translateZ(42px)';
    if (owlCollarTie) owlCollarTie.style.transform   = 'translateZ(22px)';
    if (owlTorso)   { owlTorso.style.transform       = 'translateZ(5px)';
                      owlTorso.style.filter           = ''; }
    if (owlBg)        owlBg.style.transform          = 'translateZ(0px)';
    if (owlEyes)      owlEyes.style.transform        = 'translateZ(58px)';
    leftPupil.style.transform  = '';
    rightPupil.style.transform = '';
    owlSvg.style.setProperty('--owl-shadow-x', '-3px');
    owlSvg.style.setProperty('--owl-shadow-y',  '6px');
    if (owlSpecular)  owlSpecular.style.transform    = '';
    if (headSphereGrad) {
      headSphereGrad.setAttribute('cx', '40%');
      headSphereGrad.setAttribute('cy', '35%');
      headSphereGrad.setAttribute('fx', '38%');
      headSphereGrad.setAttribute('fy', '32%');
    }
    if (facialDiscGrad) {
      facialDiscGrad.setAttribute('cx', '40%');
      facialDiscGrad.setAttribute('cy', '35%');
      facialDiscGrad.setAttribute('fx', '38%');
      facialDiscGrad.setAttribute('fy', '32%');
    }
    if (torsoSphereGrad) {
      torsoSphereGrad.setAttribute('cx', '45%');
      torsoSphereGrad.setAttribute('cy', '35%');
    }
    if (owlSpecularGrad) {
      owlSpecularGrad.setAttribute('cx', '50%');
      owlSpecularGrad.setAttribute('cy', '40%');
      owlSpecularGrad.setAttribute('fx', '50%');
      owlSpecularGrad.setAttribute('fy', '30%');
    }
  }

  // Initialize breathing idle timer
  resetBreatheTimer();

  // ── Unified event listener registration (mousemove & touchmove with { passive: true }) ──
  window.addEventListener('mousemove',    onMouseMove,    { passive: true });
  document.addEventListener('mouseleave', onMouseLeave,   { passive: true });
  window.addEventListener('touchstart',   handleTouch,    { passive: true });
  window.addEventListener('touchmove',    handleTouch,    { passive: true });
  window.addEventListener('touchend',     handleTouchEnd, { passive: true });
  window.addEventListener('touchcancel',  handleTouchEnd, { passive: true });

  // Mobile Gyroscope registration
  if ('ondeviceorientation' in window) {
    window.ondeviceorientation = handleOrientation;
  }
  window.addEventListener('deviceorientation', handleOrientation, { passive: true });

  // Gyroscope: request permission on first touchstart gesture (iOS 13+)
  window.addEventListener('touchstart', function grantOnce() {
    enableOrientationTracking();
    window.removeEventListener('touchstart', grantOnce);
  }, { once: true, passive: true });

  // Recalculate owl centre whenever layout shifts
  window.addEventListener('resize', updateBounds, { passive: true });
  window.addEventListener('scroll', updateBounds, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   GLOBAL SCROLL REVEAL & MICRO-ANIMATION CONTROLLERS
   ───────────────────────────────────────────────────────────── */

function initHeroEntrance() {
  const heroHead = document.querySelector('main > section:first-child .sechead, main > section:first-child .hero-intro-col, main > .night.tight .sechead, .legal-page-header .sechead, .app-toolbar');
  if (heroHead) {
    heroHead.classList.add('hero-fade-in');
  }
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal], .reveal-on-scroll, .sechead, .card, .pkg, .bridge, .ptab tr, .legal-category-card, .legal-card, .img-split').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const targets = document.querySelectorAll(
    'main section .sechead, main section .card, main section .pkg, main section .bridge, main .img-split, main section .twrap, main section .callout, main .legal-category-card, main .legal-card, main #business-scorp-calc, main .app-device-wrapper, [data-reveal]'
  );

  if (!targets.length) return;

  // Stagger delays for card groups
  document.querySelectorAll('.pkgs, .grid, .svcs, .cols, .g4, .g3').forEach(container => {
    const children = container.querySelectorAll('.pkg, .card, .svc');
    children.forEach((child, index) => {
      child.style.transitionDelay = `${(index % 4) * 0.08}s`;
    });
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  targets.forEach(el => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
    observer.observe(el);
  });
}

function initLegalNavSpy() {
  const navLinks = document.querySelectorAll('.legal-nav a, .legal-toc-link');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks).map(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return null;
    const targetId = href.replace('#', '');
    return targetId ? document.getElementById(targetId) : null;
  }).filter(Boolean);

  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
    let currentId = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });
}


