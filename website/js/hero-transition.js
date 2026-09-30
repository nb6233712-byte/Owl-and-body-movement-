/**
 * PIVOT AIDE TAX — SORABAN CARD-STACKING SCROLL TRANSITION
 * High-end B2B fintech interaction suite (recreating soraban.com)
 */

(function (window, document) {
  'use strict';

  // Prevent browser from restoring scroll position in the middle of the page on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function initCardStackingTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[CardStackingTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
      ignoreMobileResize: true
    });

    const mm = gsap.matchMedia();

    // ─────────────────────────────────────────────────────────────
    // DESKTOP & TABLET (>= 768px): PINNED CARD-STACKING TRANSITION
    // ─────────────────────────────────────────────────────────────
    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const hero = document.querySelector('.hero');
      const section2 = document.querySelector('.section-thesis');
      const heroText = hero ? hero.querySelector('.shell.in > div:first-child') : null;
      const owlContainer = document.getElementById('owl-container');

      if (!hero || !section2) return;

      // Section 02 Internal Stagger Targets
      const s2Eyebrow = section2.querySelector('.sechead .eyebrow');
      const s2Heading = section2.querySelector('.sechead h2');
      const s2Lede    = section2.querySelector('.sechead .lede');
      const leftCard  = section2.querySelector('.versus > div:first-child');
      const rightCard = section2.querySelector('.versus > div.pat') || section2.querySelector('.versus > div:nth-child(2)');
      const s2Patsays = section2.querySelector('.patsays');
      const s2Wait    = section2.querySelector('.wait');

      if (!isDesktop) {
        // Mobile & Small Viewport (< 768px): Responsive fluid scroll transitions
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          if (hero) gsap.set(hero, { clearProps: 'all' });
          if (section2) gsap.set(section2, { clearProps: 'all' });
          return;
        }

        // 1. Hero text & Mascot Pat smooth scroll exit
        if (heroText || owlContainer) {
          gsap.to([heroText, owlContainer].filter(Boolean), {
            y: -30,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom 40%',
              scrub: 0.8
            }
          });
        }

        // 2. Section 02 Frosted Sheet Reveal
        const s2HeadGroup = [s2Eyebrow, s2Heading, s2Lede].filter(Boolean);
        if (s2HeadGroup.length) {
          gsap.fromTo(s2HeadGroup,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.65,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section2,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 3. Compliance vs Strategy Cards: Opposing slide-in
        if (leftCard) {
          gsap.fromTo(leftCard,
            { x: -24, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'back.out(1.3)',
              scrollTrigger: {
                trigger: leftCard,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        if (rightCard) {
          gsap.fromTo(rightCard,
            { x: 24, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'back.out(1.3)',
              scrollTrigger: {
                trigger: rightCard,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        // 4. Mascot Quote Banner & CTAs
        const s2Bottom = [s2Patsays, s2Wait].filter(Boolean);
        if (s2Bottom.length) {
          gsap.fromTo(s2Bottom,
            { y: 20, scale: 0.96, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              stagger: 0.1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: s2Bottom[0],
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return;
      }

      // ─────────────────────────────────────────────────────────────
      // MASTER SCRUBBED TIMELINE (Pins Hero while Section 02 climbs)
      // ─────────────────────────────────────────────────────────────
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=100%',            // Duration equals 1 full viewport height
          pin: true,                // Pins Section 01 firmly in place
          pinSpacing: false,        // Enables Section 02 to sweep smoothly over Section 01
          scrub: 1.2,               // Smooth momentum scrub
          anticipatePin: 1,         // Eliminates pin-latch hitching
          invalidateOnRefresh: true
        }
      });

      // 1. Section 02 (Incoming Frosted Sheet): Soft parallax glide over Section 01
      masterTl.fromTo(section2,
        {
          y: 60,
          scale: 0.99
        },
        {
          y: 0,
          scale: 1,
          ease: 'none',
          force3D: true
        },
        0
      );

      // 2. Departing Hero Layer (Section 01): Scale down (1 -> 0.95), lift (y: -30px), fade (opacity: 0.2), blur (8px)
      masterTl.to(hero, {
        scale: 0.95,
        y: -30,
        opacity: 0.2,
        filter: 'blur(8px)',
        ease: 'power2.out',
        force3D: true
      }, 0);

      // 3. Uncle Pat Mascot: Independent parallax track (y: -50px, scale: 0.92, opacity: 0)
      masterTl.to(owlContainer, {
        y: -50,
        scale: 0.92,
        opacity: 0,
        ease: 'power2.out',
        force3D: true
      }, 0);

      // 4. Coordinated Internal Sequence:
      // A. Title & Subtext: Fade and float up
      const textGroup = [s2Eyebrow, s2Heading, s2Lede].filter(Boolean);
      if (textGroup.length) {
        masterTl.fromTo(textGroup,
          {
            y: 30,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.35,
            ease: 'power2.out',
            force3D: true
          },
          0.35
        );
      }

      // B. "Compliance" vs "Strategy" Cards: Opposing lateral shift meeting in center
      if (leftCard && rightCard) {
        masterTl.fromTo(leftCard,
          {
            x: -25,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
            force3D: true
          },
          0.45
        );

        masterTl.fromTo(rightCard,
          {
            x: 25,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
            force3D: true
          },
          0.45
        );
      }

      // C. Mascot Quote Banner & Bottom CTAs: Scale in smoothly
      const bottomGroup = [s2Patsays, s2Wait].filter(Boolean);
      if (bottomGroup.length) {
        masterTl.fromTo(bottomGroup,
          {
            y: 15,
            scale: 0.98,
            opacity: 0
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            stagger: 0.08,
            duration: 0.35,
            ease: 'power2.out',
            force3D: true
          },
          0.65
        );
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SPLIT SECTION ("Real people. Real strategy.") -> YEAR SECTION
  // Asymmetrical Pinned Parallax & Elevated Rounded Card Sheet Reveal
  // ─────────────────────────────────────────────────────────────
  function initSplitStorytellingTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[SplitStorytellingTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // DESKTOP & LAPTOP (>= 768px): PINNED SCRUB CHOREOGRAPHY
    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const splitSection = document.getElementById('story-split-section') || document.querySelector('.img-split');
      const yearSection = document.getElementById('year-section') || document.querySelector('.section-year');

      if (!splitSection || !yearSection) return;

      const photo = splitSection.querySelector('.img-frame img') || splitSection.querySelector('.img-col img');
      const textCol = splitSection.querySelector('.text-col');
      const dimOverlay = splitSection.querySelector('.split-dim-overlay');
      const yearEyebrow = yearSection.querySelector('.sechead .eyebrow');
      const yearHeading = yearSection.querySelector('.sechead h2');
      const yearLede = yearSection.querySelector('.sechead .lede');

      if (!isDesktop) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([splitSection, yearSection, textCol, photo, dimOverlay], { clearProps: 'all' });
          return;
        }

        if (photo) {
          gsap.fromTo(photo,
            { scale: 1.05, y: 16, opacity: 0.8 },
            {
              scale: 1.0,
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: splitSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (textCol) {
          gsap.fromTo(textCol.children,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: textCol,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        const textElements = [yearEyebrow, yearHeading, yearLede].filter(Boolean);
        if (textElements.length) {
          gsap.fromTo(textElements,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: yearSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return;
      }

      // ─────────────────────────────────────────────────────────
      // ASYMMETRICAL PINNED PARALLAX MASTER TIMELINE
      // ─────────────────────────────────────────────────────────
      const splitTl = gsap.timeline({
        scrollTrigger: {
          trigger: splitSection,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. Photography Column Parallax: Scale down (1.05 -> 1.0) & vertical drift (y: -40px)
      if (photo) {
        splitTl.fromTo(photo,
          {
            scale: 1.05,
            y: 0
          },
          {
            scale: 1.0,
            y: -40,
            ease: 'none',
            force3D: true
          },
          0
        );
      }

      // 2. Underlying Split Section: Scale down to 0.96 with soft dimming overlay
      splitTl.to(splitSection, {
        scale: 0.96,
        ease: 'power1.out',
        force3D: true
      }, 0);

      if (dimOverlay) {
        splitTl.fromTo(dimOverlay,
          { opacity: 0 },
          {
            opacity: 0.75,
            ease: 'power1.out'
          },
          0
        );
      }

      // 3. Right-hand Text Column: Readable while pinned, gently lift (y: -25px) and fade down (opacity: 0.3)
      if (textCol) {
        splitTl.to(textCol, {
          y: -25,
          opacity: 0.3,
          ease: 'power2.out',
          force3D: true
        }, 0.2);
      }

      // 4. White Section Reveal & Internal Typography Stagger
      splitTl.fromTo(yearSection,
        {
          y: 40
        },
        {
          y: 0,
          ease: 'none',
          force3D: true
        },
        0
      );

      const yearTypography = [yearEyebrow, yearHeading, yearLede].filter(Boolean);
      if (yearTypography.length) {
        splitTl.fromTo(yearTypography,
          {
            y: 30,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: 'power2.out',
            force3D: true
          },
          0.35
        );
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // YEAR SECTION: PINNED 4-QUARTER TIMELINE & PROGRESS SCRUBBER
  // ─────────────────────────────────────────────────────────────
  function initYearTimelineScrub() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[YearTimelineScrub] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // DESKTOP & TABLET (>= 768px): PINNED INTERACTIVE SCRUBBER
    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const yearSection = document.getElementById('year-section') || document.querySelector('.section-year');
      if (!yearSection) return;

      const progressBar = yearSection.querySelector('.cal-progress-bar');
      const cards = Array.from(yearSection.querySelectorAll('.cal-card'));
      const callout = yearSection.querySelector('.year-callout');

      if (!cards.length) return;

      if (!isDesktop) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          if (progressBar) gsap.set(progressBar, { clearProps: 'all' });
          cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
          if (callout) gsap.set(callout, { clearProps: 'all' });
          return;
        }

        cards.forEach((card, idx) => {
          const bullets = card.querySelectorAll('li');
          const badge = card.querySelector('.mo');

          gsap.fromTo(card,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                  card.classList.add('is-active');
                  if (progressBar) {
                    gsap.to(progressBar, {
                      scaleX: (idx + 1) / cards.length,
                      duration: 0.4,
                      ease: 'power1.out'
                    });
                  }
                }
              }
            }
          );

          if (badge) {
            gsap.fromTo(badge,
              { scale: 0.88 },
              {
                scale: 1,
                duration: 0.45,
                ease: 'back.out(2)',
                scrollTrigger: { trigger: card, start: 'top 85%' }
              }
            );
          }

          if (bullets.length) {
            gsap.fromTo(bullets,
              { x: -10, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.4,
                ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 85%' }
              }
            );
          }
        });

        if (callout) {
          gsap.fromTo(callout,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power2.out',
              scrollTrigger: { trigger: callout, start: 'top 88%' }
            }
          );
        }
        return;
      }

      // Initial resting state:
      // Column 1 is active; Columns 2, 3, 4 are muted
      if (progressBar) gsap.set(progressBar, { scaleX: 0.25, transformOrigin: '0% 50%' });

      // Column 1 is fully active
      gsap.set(cards[0], { opacity: 1, filter: 'grayscale(0%)' });
      cards[0].classList.add('is-active');

      // Columns 2, 3, 4 muted initially
      cards.slice(1).forEach(card => {
        gsap.set(card, { opacity: 0.35, filter: 'grayscale(80%)' });
        const bullets = card.querySelectorAll('li');
        if (bullets.length) {
          gsap.set(bullets, { opacity: 0, x: -8 });
        }
      });

      // Bottom callout starts with soft presence
      if (callout) {
        gsap.set(callout, { opacity: 0.45, y: 16 });
      }

      // ─────────────────────────────────────────────────────────
      // PINNED SCRUB TIMELINE
      // ─────────────────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: yearSection,
          start: 'top top',
          end: '+=160%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Step 1: Quarter 1 -> Quarter 2 (Progress 0 -> 0.33)
      // Progress bar moves from 25% to 50%
      if (progressBar) {
        tl.to(progressBar, { scaleX: 0.50, ease: 'none' }, 0);
      }

      // Card 2 activates: opacity -> 1, grayscale -> 0%, date badge pop, bullets stagger
      if (cards[1]) {
        const badge2 = cards[1].querySelector('.mo');
        const bullets2 = cards[1].querySelectorAll('li');

        tl.to(cards[1], {
          opacity: 1,
          filter: 'grayscale(0%)',
          boxShadow: '0 12px 30px -6px rgba(1, 159, 255, 0.16), 0 2px 8px rgba(14, 22, 33, 0.04)',
          ease: 'power2.out',
          onStart: () => cards[1].classList.add('is-active'),
          onReverseComplete: () => cards[1].classList.remove('is-active')
        }, 0.05);

        if (badge2) {
          tl.fromTo(badge2,
            { scale: 1.15 },
            { scale: 1, ease: 'back.out(2)', duration: 0.2 },
            0.1
          );
        }

        if (bullets2.length) {
          tl.to(bullets2, {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            ease: 'power2.out'
          }, 0.12);
        }
      }

      // Step 2: Quarter 2 -> Quarter 3 (Progress 0.33 -> 0.66)
      // Progress bar moves from 50% to 75%
      if (progressBar) {
        tl.to(progressBar, { scaleX: 0.75, ease: 'none' }, 0.33);
      }

      // Card 3 activates: opacity -> 1, grayscale -> 0%, badge pop, bullets stagger
      if (cards[2]) {
        const badge3 = cards[2].querySelector('.mo');
        const bullets3 = cards[2].querySelectorAll('li');

        tl.to(cards[2], {
          opacity: 1,
          filter: 'grayscale(0%)',
          boxShadow: '0 12px 30px -6px rgba(1, 159, 255, 0.16), 0 2px 8px rgba(14, 22, 33, 0.04)',
          ease: 'power2.out',
          onStart: () => cards[2].classList.add('is-active'),
          onReverseComplete: () => cards[2].classList.remove('is-active')
        }, 0.38);

        if (badge3) {
          tl.fromTo(badge3,
            { scale: 1.15 },
            { scale: 1, ease: 'back.out(2)', duration: 0.2 },
            0.42
          );
        }

        if (bullets3.length) {
          tl.to(bullets3, {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            ease: 'power2.out'
          }, 0.45);
        }
      }

      // Step 3: Quarter 3 -> Quarter 4 (Progress 0.66 -> 1.0)
      // Progress bar moves from 75% to 100%
      if (progressBar) {
        tl.to(progressBar, { scaleX: 1.0, ease: 'none' }, 0.66);
      }

      // Card 4 activates: opacity -> 1, grayscale -> 0%, badge pop, bullets stagger
      if (cards[3]) {
        const badge4 = cards[3].querySelector('.mo');
        const bullets4 = cards[3].querySelectorAll('li');

        tl.to(cards[3], {
          opacity: 1,
          filter: 'grayscale(0%)',
          boxShadow: '0 12px 30px -6px rgba(1, 159, 255, 0.16), 0 2px 8px rgba(14, 22, 33, 0.04)',
          ease: 'power2.out',
          onStart: () => cards[3].classList.add('is-active'),
          onReverseComplete: () => cards[3].classList.remove('is-active')
        }, 0.70);

        if (badge4) {
          tl.fromTo(badge4,
            { scale: 1.15 },
            { scale: 1, ease: 'back.out(2)', duration: 0.2 },
            0.74
          );
        }

        if (bullets4.length) {
          tl.to(bullets4, {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            ease: 'power2.out'
          }, 0.77);
        }
      }

      // Bottom callout banner smoothly reveals and glows
      if (callout) {
        tl.to(callout, {
          opacity: 1,
          y: 0,
          boxShadow: '0 8px 30px rgba(1, 159, 255, 0.16)',
          borderColor: 'rgba(1, 159, 255, 0.45)',
          ease: 'power2.out',
          onStart: () => callout.classList.add('is-revealed'),
          onReverseComplete: () => callout.classList.remove('is-revealed')
        }, 0.75);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PROBLEM DIAGNOSTIC MATRIX & DARK SECTION SLIDE-OVER REVEAL
  // ─────────────────────────────────────────────────────────────
  function initDiagnosticMatrixTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[DiagnosticMatrix] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const section = document.getElementById('problems-section') || document.querySelector('.section-probs');
      if (!section) return;

      const grid = section.querySelector('.probs');
      const cards = Array.from(section.querySelectorAll('.prob'));
      const headerElements = section.querySelectorAll('.sechead .eyebrow, .sechead h2, .sechead .lede');
      const darkIntro = document.querySelector('.section-dark-intro') || document.querySelector('.imgband.slim.blue-tint');

      if (!cards.length) return;

      if (!isDesktop) {
        // Mobile / Reduced-Motion Fallback
        cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
        if (darkIntro) gsap.set(darkIntro, { clearProps: 'all' });

        gsap.fromTo(cards,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return;
      }

      // Initial state
      gsap.set(cards, { y: 35, opacity: 0 });

      // 1. Entrance Choreography (top 75%)
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      if (headerElements.length) {
        entranceTl.fromTo(headerElements,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.55,
            ease: 'power2.out'
          },
          0
        );
      }

      // 6 Cards fade in with upward drift and 0.07s stagger using ease "power3.out"
      entranceTl.to(cards, {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.7,
        ease: 'power3.out'
      }, 0.15);

      // 2. Cursor Spotlight Interaction across the 6-card grid
      if (grid) {
        const onMouseMove = (e) => {
          const rect = grid.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          grid.style.setProperty('--mouse-x', `${mouseX}px`);
          grid.style.setProperty('--mouse-y', `${mouseY}px`);

          // Update local card coordinates for internal highlight
          cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardX = e.clientX - cardRect.left;
            const cardY = e.clientY - cardRect.top;
            card.style.setProperty('--card-mouse-x', `${cardX}px`);
            card.style.setProperty('--card-mouse-y', `${cardY}px`);
          });
        };

        const onMouseLeave = () => {
          grid.style.setProperty('--mouse-x', `-1000px`);
          grid.style.setProperty('--mouse-y', `-1000px`);
          cards.forEach(card => {
            card.style.setProperty('--card-mouse-x', `-1000px`);
            card.style.setProperty('--card-mouse-y', `-1000px`);
          });
        };

        grid.addEventListener('mousemove', onMouseMove);
        grid.addEventListener('mouseleave', onMouseLeave);
      }

      // 3. Transition into "Tax is all we do" (Dark Section)
      // The dark section features a luxury curved top edge (border-radius: 28px 28px 0 0)
      // with elevated drop shadow, cleanly overlapping the white grid.
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SERVICES PINNED CHOREOGRAPHY & EQUALIZER REVEAL (SECTION A -> B)
  // ─────────────────────────────────────────────────────────────
  function initServicesPinnedChoreography() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[ServicesPinnedChoreography] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const stage = document.getElementById('services-stage') || document.querySelector('.services-pinned-stage');
      if (!stage) return;

      const lensBg = stage.querySelector('.stage-lens-bg');
      const ambientGlow = stage.querySelector('.stage-ambient-glow');
      const introLayer = stage.querySelector('.stage-intro-layer');
      const servicesLayer = stage.querySelector('.stage-services-layer');
      const sechead = stage.querySelector('.stage-services-layer .sechead');
      const servicesHeading = stage.querySelector('.services-stage-heading');
      const servicesSub = stage.querySelector('.stage-services-layer .sechead .lede');
      const cards = Array.from(stage.querySelectorAll('.svcs .svc'));

      if (!isDesktop) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
          return;
        }

        const headEls = [sechead, servicesHeading, servicesSub].filter(Boolean);
        if (headEls.length) {
          gsap.fromTo(headEls,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stage,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(cards,
            { y: 32, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.1,
              duration: 0.65,
              ease: 'back.out(1.3)',
              scrollTrigger: {
                trigger: stage.querySelector('.svcs') || stage,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return;
      }

      // Initial resting state for Desktop Pinned Choreography
      if (lensBg) {
        gsap.set(lensBg, { scale: 1, opacity: 0.8 });
      }
      if (ambientGlow) {
        gsap.set(ambientGlow, { opacity: 0, scale: 0.85 });
      }
      if (introLayer) {
        gsap.set(introLayer, { opacity: 1, y: 0, filter: 'blur(0px)' });
      }
      if (servicesLayer) {
        gsap.set(servicesLayer, { opacity: 0, y: 30 });
      }
      if (sechead) {
        gsap.set(sechead, { opacity: 0, y: 15 });
      }

      // Cards initial equalizer state
      cards.forEach(card => {
        gsap.set(card, { y: 50, scaleY: 0.92, opacity: 0, transformOrigin: '50% 100%' });
      });

      // Master Pinned Scrub Timeline (+=160% scroll duration)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=160%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // PHASE 1: Lens Expansion & Section A Dissolve (0 -> 0.35)
      if (lensBg) {
        tl.to(lensBg, {
          scale: 1.45,
          opacity: 0.25,
          ease: 'power2.out'
        }, 0);
      }

      if (introLayer) {
        tl.to(introLayer, {
          y: -50,
          opacity: 0,
          filter: 'blur(10px)',
          ease: 'power2.inOut'
        }, 0.04);
      }

      // PHASE 2: Core Services Stage Entrance (0.30 -> 1.0)
      // Ambient radial blue glow expands softly
      if (ambientGlow) {
        tl.to(ambientGlow, {
          opacity: 1,
          scale: 1.15,
          ease: 'power2.out'
        }, 0.28);
      }

      // Services layer fades and slides up into view
      if (servicesLayer) {
        tl.to(servicesLayer, {
          opacity: 1,
          y: 0,
          ease: 'power2.out'
        }, 0.30);
      }

      // Headline and subtext reveal cleanly
      if (sechead) {
        tl.to(sechead, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out'
        }, 0.32);
      }

      // 5 Equalizer Columns Rise from Center Outward:
      // Col 3 (Business Accounting) -> Cols 2 & 4 -> Cols 1 & 5
      if (cards.length >= 5) {
        // Step 1: Center Card (Column 3, index 2)
        tl.to(cards[2], {
          y: 0,
          scaleY: 1,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.35,
          onStart: () => cards[2].classList.add('beam-active')
        }, 0.38);

        // Step 2: Columns 2 & 4 (indices 1 & 3)
        tl.to([cards[1], cards[3]], {
          y: 0,
          scaleY: 1,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.35,
          onStart: () => {
            cards[1].classList.add('beam-active');
            cards[3].classList.add('beam-active');
          }
        }, 0.46);

        // Step 3: Columns 1 & 5 (indices 0 & 4)
        tl.to([cards[0], cards[4]], {
          y: 0,
          scaleY: 1,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.35,
          onStart: () => {
            cards[0].classList.add('beam-active');
            cards[4].classList.add('beam-active');
          }
        }, 0.54);
      }
    });
  }

  function initAudiencesSheetTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[AudiencesSheetTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const sheet    = document.getElementById('audiences-sheet');
      if (!sheet) return;

      const audCards = Array.from(sheet.querySelectorAll('.aud'));
      const audHead  = [
        sheet.querySelector('.sechead .eyebrow'),
        sheet.querySelector('.sechead h2'),
        sheet.querySelector('.sechead .lede')
      ].filter(Boolean);

      if (!isDesktop) {
        // Mobile: clear any state, simple fade-in entrance
        gsap.set(sheet, { clearProps: 'all' });
        audCards.forEach(c => gsap.set(c, { clearProps: 'all' }));
        audHead.forEach(el => gsap.set(el, { clearProps: 'all' }));

        if (audHead.length) {
          gsap.fromTo(audHead,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1,
              stagger: 0.07, duration: 0.55, ease: 'power2.out',
              scrollTrigger: {
                trigger: sheet,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        if (audCards.length) {
          gsap.fromTo(audCards,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1,
              stagger: 0.08, duration: 0.6, ease: 'power3.out',
              scrollTrigger: {
                trigger: sheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return;
      }

      // ── Desktop: NO extra pin (stage is already pinned by initServicesPinnedChoreography).
      // Drive the sheet with its own scrub ScrollTrigger — zero pin conflict.

      // Set sheet starting position (offset below viewport)
      gsap.set(sheet, { yPercent: 35 });
      if (audHead.length) gsap.set(audHead, { y: 30, opacity: 0 });
      if (audCards.length) gsap.set(audCards, { y: 40, opacity: 0 });

      // Sheet wipe — triggered by the sheet itself coming into view
      const wipeTl = gsap.timeline({
        scrollTrigger: {
          trigger: sheet,
          start: 'top bottom',   // fires when sheet bottom edge hits viewport bottom
          end: 'top 10%',        // completes when sheet top is 10% from top
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });

      // Sheet sweeps up into place
      wipeTl.to(sheet, {
        yPercent: 0,
        ease: 'power2.out',
        force3D: true
      }, 0);

      // Header reveals as sheet docks (normalised position ~0.55 in timeline)
      if (audHead.length) {
        wipeTl.to(audHead, {
          y: 0, opacity: 1,
          stagger: 0.06, duration: 0.35, ease: 'power2.out'
        }, 0.55);
      }

      // Audience cards fan in left-to-right
      if (audCards.length) {
        wipeTl.to(audCards, {
          y: 0, opacity: 1,
          stagger: 0.08, duration: 0.4, ease: 'power3.out'
        }, 0.65);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PRICING CASCADE  — "Only pay for the tax work you need."
  // Stage 1 : individual card stagger + price counter + badge pop
  // Stage 2 : business tier slide-and-dock + biz price counters
  // Stage 3 : add-ons panel vertical wipe + bullet stagger
  // Stage 4 : extension panel + CTA spring bounce
  // Stage 5 : footnote disclaimer fade-in
  // ─────────────────────────────────────────────────────────────
  function initPricingCascade() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const section    = document.getElementById('pricing-section');
    const indCards   = section ? Array.from(section.querySelectorAll('.pkgs:not(.biz) .pkg')) : [];
    const bizGrid    = document.getElementById('pkgs-biz');
    const bizCards   = bizGrid ? Array.from(bizGrid.querySelectorAll('.pkg')) : [];
    const addonsEl   = document.getElementById('addons-panel');
    const extEl      = document.getElementById('ext-panel');
    const footnoteEl = document.getElementById('pricing-footnote');

    if (!section) return;

    // ── Utility: roll up a price figure inside a .fig element ──
    function rollUpFig(figEl) {
      if (!figEl) return;
      const lastNode = figEl.childNodes[figEl.childNodes.length - 1];
      if (!lastNode) return;
      const rawText = lastNode.textContent.trim();
      const target  = parseInt(rawText.replace(/,/g, ''), 10);
      if (isNaN(target)) return;

      const numSpan = document.createElement('span');
      numSpan.className = 'fig-num';
      numSpan.textContent = '0';
      lastNode.replaceWith(numSpan);

      gsap.to({ val: 0 }, {
        val: target,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: function() {
          numSpan.textContent = Math.round(this.targets()[0].val).toLocaleString('en-US');
        }
      });
    }

    if (prefersReduced) {
      const all = [...indCards, ...bizCards,
                   ...(addonsEl ? [addonsEl] : []),
                   ...(extEl    ? [extEl]    : []),
                   ...(footnoteEl ? [footnoteEl] : [])];
      gsap.set(all, { clearProps: 'all' });
      return;
    }

    // ── Stage 1A: Individual cards cascade left → right ────────
    if (indCards.length) {
      gsap.set(indCards, { y: 50, opacity: 0 });

      gsap.to(indCards, {
        y: 0, opacity: 1,
        stagger: 0.08,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section.querySelector('.pkgs:not(.biz)'),
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        onComplete: function() {
          // Stage 1B: price counter roll-up
          indCards.forEach(card => rollUpFig(card.querySelector('.fig')));

          // Stage 1C: "Most Chosen" badge pop overshoot
          const badge = section.querySelector('.pkg.flag .badge');
          if (badge) {
            gsap.fromTo(badge,
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)', delay: 0.1 }
            );
          }
        }
      });
    }

    // ── Stage 2: Business cards slide-and-dock ─────────────────
    // Corrected coords: x:±35, y:25 for a diagonal slide feel
    if (bizCards.length >= 2) {
      gsap.set(bizCards[0], { x: -35, y: 25, opacity: 0 });
      gsap.set(bizCards[1], { x:  35, y: 25, opacity: 0 });

      const bizTl = gsap.timeline({
        scrollTrigger: {
          trigger: bizGrid,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });

      // Both cards arrive simultaneously with diagonal dock
      bizTl.to([bizCards[0], bizCards[1]], {
        x: 0, y: 0, opacity: 1,
        duration: 0.85,
        ease: 'power3.out'
      }, 0);

      // After cards dock, roll-up biz price counters
      bizTl.call(() => {
        bizCards.forEach(card => rollUpFig(card.querySelector('.fig')));
      }, [], 0.85);
    }

    // ── Stage 3: Add-ons panel vertical wipe + bullet stagger ──
    if (addonsEl) {
      const addonItems = Array.from(addonsEl.querySelectorAll('ul.ticks li'));
      gsap.set(addonsEl, { y: 30, opacity: 0 });
      if (addonItems.length) gsap.set(addonItems, { y: 12, opacity: 0 });

      const addonTl = gsap.timeline({
        scrollTrigger: {
          trigger: addonsEl,
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      addonTl.to(addonsEl, {
        y: 0, opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      }, 0);

      if (addonItems.length) {
        addonTl.to(addonItems, {
          y: 0, opacity: 1,
          stagger: 0.04,
          duration: 0.45,
          ease: 'power2.out'
        }, 0.18);
      }
    }

    // ── Stage 4: Extension panel + CTA spring bounce ───────────
    if (extEl) {
      const extItems = Array.from(extEl.querySelectorAll('ul.ticks li'));
      const ctaBtn   = extEl.querySelector('.btn-g');

      gsap.set(extEl, { y: 30, opacity: 0 });
      if (extItems.length) gsap.set(extItems, { y: 12, opacity: 0 });
      if (ctaBtn)          gsap.set(ctaBtn,   { scale: 0.92, opacity: 0 });

      const extTl = gsap.timeline({
        scrollTrigger: {
          // Trigger simultaneously with the add-ons panel
          trigger: addonsEl || extEl,
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      extTl.to(extEl, {
        y: 0, opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      }, 0);

      if (extItems.length) {
        extTl.to(extItems, {
          y: 0, opacity: 1,
          stagger: 0.04,
          duration: 0.45,
          ease: 'power2.out'
        }, 0.18);
      }

      // CTA button: spring overshoot after items appear
      if (ctaBtn) {
        extTl.to(ctaBtn, {
          scale: 1, opacity: 1,
          duration: 0.55,
          ease: 'back.out(1.8)'
        }, 0.44);
      }
    }

    // ── Stage 5: Footnote disclaimer fade-in ───────────────────
    if (footnoteEl) {
      gsap.set(footnoteEl, { opacity: 0, y: 10 });
      gsap.to(footnoteEl, {
        opacity: 1, y: 0,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footnoteEl,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  function initAllTransitions() {
    const run = (fn) => { try { if (typeof fn === 'function') fn(); } catch(e) {} };
    run(initCardStackingTransition);
    run(initSplitStorytellingTransition);
    run(initYearTimelineScrub);
    run(initDiagnosticMatrixTransition);
    run(initServicesPinnedChoreography);
    run(initAudiencesSheetTransition);
    run(initPricingCascade);
    run(initPriceSheetWipe);
    run(initFocusSheetWipe);
    run(initFileTaxesHeroTransition);
    run(initFintechLedgerTable);
    run(initTaxDialPinnedStorytelling);
    run(initWorkflowJourneyTransition);
    run(initFooterUnderlayReveal);
    run(initFlowAndStates);
    run(initTaxStrategyHeroTransition);
    run(initDarkStrategySheetWipe);
    run(initExposureScoreboard);
    run(initStandingSplitPinnedSequence);
    run(initAdvisoryClosingSheetWipe);
    run(initEngagementScopeTransition);
    run(initPersonaTracksDarkSheetWipe);
    run(initScopeDualColumnPinnedCascade);
    run(initPremiumSupportCascade);
    run(initQuarterlyCadenceScrub);
    run(initDialFitPinnedStage);
    run(initFeeSheetCurtain);
    run(initNewLawHeroTransition);
    run(initIndividualDeductionsTransition);
    run(initLegislativePolicyMatrixTransition);
    run(initConsultationSplitTransition);
    run(initBusinessReformsTransition);
    run(initBusinessAddendaStateWipe);
    run(initDocStrategicTransition);
    run(initCitationsFooterBridgeTransition);
    run(initFreeHelpHeroTransition);
    run(initDiagnosticToolsAndBridgeTransition);
    run(initComplimentaryReviewSplitStage);
    run(initIndustryGuidesMatrix);
    run(initAuditResolutionHero);
    run(initNoticeDiagnosticStage);
    run(initResolutionTiersLedger);
    run(initAuthoritySplitStage);
    run(initStateDeskTransition);
    run(initUnclePatPhilosophyTransition);
    run(initCircular230ThesisDeck);
    run(initCredentialDeck);
    run(initBusinessTransitions);
    run(initAppointmentsTransitions);
    run(initFileRoomTransitions);
    run(initResourcesTransitions);
    run(initLegalPoliciesTransitions);

    // Recalculate all ScrollTrigger start/end triggers accurately
    ScrollTrigger.refresh();
  }

  // ─────────────────────────────────────────────────────────────
  // FLOW PIPELINE + FIFTY STATES
  // Flow Section:
  // - Header reveal (eyebrow, h2, lede)
  // - Laser energy conduit sweeps across track (scaleX 0 -> 1)
  // - 5 Medallion nodes pop in sequence with punchy back.out(2.2) bounce
  // - Step texts (number, h3, p) float up into place
  // States Section:
  // - Left copy drift & bullet cascade (x: -24 -> 0)
  // - 50-State grid diagonal matrix ripple wave
  // - Spotlight home states (DC, MD, VA) with gold halo & breathing pulse
  // ─────────────────────────────────────────────────────────────
  function initFlowAndStates() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const flowSection   = document.getElementById('flow-section');
    const flowTrack     = document.getElementById('flow-track');
    const statesSection = document.getElementById('states-section');
    const statesGrid    = document.getElementById('states-grid');

    if (!flowSection && !statesSection) return;

    // ── 1. FLOW PIPELINE ──────────────────────────────────────────
    if (flowSection && flowTrack) {
      const sechead   = flowSection.querySelector('.sechead');
      const headItems = sechead ? Array.from(sechead.querySelectorAll('.eyebrow, h2, .lede')) : [];
      const steps     = Array.from(flowTrack.querySelectorAll('.st'));
      const medals    = Array.from(flowTrack.querySelectorAll('.st .med'));
      const stepTexts = Array.from(flowTrack.querySelectorAll('.st .n, .st h3, .st p'));

      if (prefersReduced) {
        gsap.set([...headItems, ...steps, ...medals, ...stepTexts], { clearProps: 'all' });
      } else {
        // Ensure glowing laser conduit element exists
        let conduit = flowTrack.querySelector('.flow-laser-conduit');
        if (!conduit) {
          conduit = document.createElement('div');
          conduit.className = 'flow-laser-conduit';
          conduit.setAttribute('aria-hidden', 'true');
          flowTrack.style.position = 'relative';
          flowTrack.insertBefore(conduit, flowTrack.firstChild);
        }

        // Set initial states
        if (headItems.length) gsap.set(headItems, { y: 22, opacity: 0 });
        gsap.set(conduit, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(medals, { scale: 0.3, opacity: 0, force3D: true });
        gsap.set(stepTexts, { y: 20, opacity: 0 });

        const flowTl = gsap.timeline({
          scrollTrigger: {
            trigger: flowTrack,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        });

        // Step 1: Section Header items drift up
        if (headItems.length) {
          flowTl.to(headItems, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power3.out'
          }, 0);
        }

        // Step 2: Glowing energy conduit shoots across the pipeline track
        flowTl.to(conduit, {
          scaleX: 1,
          duration: 0.85,
          ease: 'power2.inOut'
        }, 0.12);

        // Step 3: Medallions bounce in sequentially as the laser connects to each node
        flowTl.to(medals, {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          duration: 0.65,
          ease: 'back.out(2.2)',
          force3D: true
        }, 0.22);

        // Step 4: Step number, heading, and description rise into place
        flowTl.to(stepTexts, {
          y: 0,
          opacity: 1,
          stagger: 0.035,
          duration: 0.5,
          ease: 'power3.out'
        }, 0.45);
      }
    }

    // ── 2. FIFTY STATES MATRIX ───────────────────────────────────
    if (statesSection && statesGrid) {
      const stateCopy   = statesSection.querySelector('.split > div:first-child');
      const copyItems   = stateCopy ? Array.from(stateCopy.querySelectorAll('.eyebrow, h2, .lede, .ticks li')) : [];
      const stateTiles  = Array.from(statesGrid.querySelectorAll('span'));
      const homeTiles   = Array.from(statesGrid.querySelectorAll('span.home'));
      const statesNote  = statesSection.querySelector('p.small');

      if (prefersReduced) {
        gsap.set([...copyItems, ...stateTiles, statesNote].filter(Boolean), { clearProps: 'all' });
      } else {
        // Calculate 6-column diagonal wavefront order: (col + row)
        const COLS = 6;
        const sortedTiles = [...stateTiles].sort((a, b) => {
          const idxA = stateTiles.indexOf(a);
          const idxB = stateTiles.indexOf(b);
          const waveA = (idxA % COLS) + Math.floor(idxA / COLS);
          const waveB = (idxB % COLS) + Math.floor(idxB / COLS);
          return waveA - waveB;
        });

        // Set initial states
        if (copyItems.length) gsap.set(copyItems, { x: -24, opacity: 0 });
        gsap.set(stateTiles, { scale: 0.45, opacity: 0, force3D: true });
        if (statesNote) gsap.set(statesNote, { opacity: 0, y: 10 });

        let homePulse = null;

        const statesTl = gsap.timeline({
          scrollTrigger: {
            trigger: statesGrid,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          onComplete: function () {
            if (homeTiles.length && !homePulse) {
              homePulse = gsap.to(homeTiles, {
                boxShadow: '0 0 28px rgba(234, 228, 47, 0.95), inset 0 0 10px rgba(234, 228, 47, 0.45)',
                scale: 1.16,
                duration: 1.25,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              });
            }
          },
          onReverseComplete: function () {
            if (homePulse) {
              homePulse.kill();
              homePulse = null;
            }
            gsap.set(homeTiles, { scale: 0.45, opacity: 0, boxShadow: '0 0 16px rgba(234, 228, 47, 0.4)' });
          }
        });

        // Step 1: Left column copy floats in
        if (copyItems.length) {
          statesTl.to(copyItems, {
            x: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.55,
            ease: 'power3.out'
          }, 0);
        }

        // Step 2: Diagonal wave ripple of state cells
        statesTl.to(sortedTiles, {
          scale: 1,
          opacity: 1,
          stagger: 0.016,
          duration: 0.4,
          ease: 'back.out(1.7)',
          force3D: true
        }, 0.1);

        // Step 3: Spotlight Home States (DC, MD, VA)
        if (homeTiles.length) {
          statesTl.to(homeTiles, {
            scale: 1.14,
            boxShadow: '0 0 26px rgba(234, 228, 47, 0.85), inset 0 0 8px rgba(234, 228, 47, 0.4)',
            duration: 0.45,
            ease: 'back.out(2)',
            stagger: 0.08
          }, 0.5);
        }

        // Step 4: Caption beneath grid
        if (statesNote) {
          statesTl.to(statesNote, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          }, 0.48);
        }
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // WHITE → DARK PRICE SHEET WIPE (SORABAN-STYLE PINNED REVEAL)
  // Pin white content stage as testimonials finish reading.
  // Dark floating sheet enters from yPercent: 100 to 0 directly
  // over the white stage with deep elevation, rounded corners,
  // top hairline border, and staggered internal elements.
  // ─────────────────────────────────────────────────────────────
  function initPriceSheetWipe() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper   = document.getElementById('pinned-wipe-wrapper');
    const pinStage  = document.getElementById('white-pin-stage');
    const darkSheet = document.getElementById('dark-price-sheet');
    const sheetInner = document.getElementById('price-sheet-inner');

    if (!pinStage || !darkSheet) return;

    const stageTarget = wrapper || pinStage;
    const testimonialCards = Array.from(pinStage.querySelectorAll('.quotes figure'));

    // Stagger targets: headline, yellow CTA, stacked pricing pill badges
    const headline  = darkSheet.querySelector('h2');
    const yellowCta = darkSheet.querySelector('a.btn');
    const eyebrow   = darkSheet.querySelector('.eyebrow');
    const lede      = darkSheet.querySelector('p');
    const pillBadges = sheetInner
      ? Array.from(sheetInner.querySelectorAll(':scope > div:last-child > div'))
      : [];

    const staggerTargets = [
      eyebrow,
      headline,
      lede,
      yellowCta,
      ...pillBadges
    ].filter(Boolean);

    // Responsive ScrollTrigger execution via ScrollTrigger.matchMedia
    ScrollTrigger.matchMedia({
      // Desktop: screens >= 1024px with no reduced motion preference
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([pinStage, darkSheet, ...testimonialCards, ...staggerTargets], { clearProps: 'all' });
          return;
        }

        // 1. Initial State: dark sheet starts completely below the pinned stage
        gsap.set(darkSheet, { yPercent: 100, force3D: true });
        if (staggerTargets.length) {
          gsap.set(staggerTargets, { y: 30, opacity: 0 });
        }

        // 2. Pinned Scrub Timeline: Pin stage as testimonials finish reading (start: 'bottom bottom')
        const wipeTl = gsap.timeline({
          scrollTrigger: {
            trigger: stageTarget,
            start: 'bottom bottom',
            end: '+=130%',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // Step 1: White testimonial cards gently scale down (0.96), dim (0.3), drift up (-35px)
        if (testimonialCards.length) {
          wipeTl.to(testimonialCards, {
            scale: 0.96,
            opacity: 0.3,
            y: -35,
            ease: 'none',
            stagger: 0.02
          }, 0);
        }

        // Also subtly scale down the white stage background for enhanced depth
        wipeTl.to(pinStage, {
          scale: 0.98,
          opacity: 0.45,
          ease: 'none'
        }, 0);

        // Step 2: Dark sheet slides smoothly from yPercent: 100 to yPercent: 0 directly over white section
        wipeTl.to(darkSheet, {
          yPercent: 0,
          ease: 'none',
          force3D: true
        }, 0);

        // Step 3: As the dark section locks into place, stagger internal elements upward
        if (staggerTargets.length) {
          wipeTl.to(staggerTargets, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.35,
            ease: 'power3.out'
          }, 0.65);
        }

        return function () {
          gsap.set([pinStage, darkSheet, ...testimonialCards, ...staggerTargets], { clearProps: 'all' });
        };
      },

      // Fallback for screens < 1024px: smooth staggered entrance
      '(max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([pinStage, darkSheet, ...testimonialCards, ...staggerTargets], { clearProps: 'all' });
          return;
        }
        if (staggerTargets.length) {
          gsap.fromTo(staggerTargets,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: darkSheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // WHITE SPLIT → DARK FOCUS SHEET WIPE (SORABAN-STYLE PINNED REVEAL)
  // Pin white split content section ("Six things that cost you nothing." /
  // "Three we get every week.") using ScrollTrigger scrub for +=100vh.
  // Content recedes: scale: 0.96, y: -35px, opacity: 0.3, blur: 6px.
  // Incoming dark sheet ("Tax isn't a department here..."):
  // Elevated rounded card sheet (border-radius: 32px 32px 0 0,
  // background: #0E1621, box-shadow: 0 -30px 60px rgba(0, 0, 0, 0.45),
  // border-top: 1px solid rgba(255, 255, 255, 0.16)).
  // Slides upward from yPercent: 100 to yPercent: 0 directly covering white stage.
  // Staggered reveal: eyebrow, headline, lede, feature tabs, and callout.
  // ─────────────────────────────────────────────────────────────
  function initFocusSheetWipe() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper   = document.getElementById('focus-wipe-wrapper');
    const pinStage  = document.getElementById('white-help-pin-stage');
    const darkSheet = document.getElementById('dark-focus-sheet');
    const splitEl   = document.getElementById('free-help-split');

    if (!pinStage || !darkSheet) return;

    const stageTarget = wrapper || pinStage;

    // Receding targets: 6 free services list items and 3 FAQ items (and their columns)
    const tickItems = Array.from(pinStage.querySelectorAll('#free-help-ticks li'));
    const faqItems  = Array.from(pinStage.querySelectorAll('#free-help-faqs > div'));
    const whiteCols = Array.from(pinStage.querySelectorAll('.free-help-col'));
    const whiteRecedingTargets = [
      splitEl,
      ...whiteCols,
      ...tickItems,
      ...faqItems
    ].filter(Boolean);

    // Stagger targets inside dark focus sheet:
    // Eyebrow ("WHAT WE DO"), headline ("Tax isn't a department here..."), lede
    const eyebrow      = darkSheet.querySelector('#dark-focus-sechead .eyebrow');
    const headline     = darkSheet.querySelector('#dark-focus-sechead h2');
    const lede         = darkSheet.querySelector('#dark-focus-sechead .lede');
    const headGroup    = [eyebrow, headline, lede].filter(Boolean);

    // Bottom feature tabs ("Individual returns", "Business returns", "Tax strategy"...)
    const featureCards = Array.from(darkSheet.querySelectorAll('#dark-focus-grid .focus-card'));
    const callout      = darkSheet.querySelector('.focus-callout');

    const allStaggerTargets = [
      ...headGroup,
      ...featureCards,
      callout
    ].filter(Boolean);

    // Responsive ScrollTrigger execution via ScrollTrigger.matchMedia
    ScrollTrigger.matchMedia({
      // Desktop: screens >= 1024px with no reduced motion preference
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([pinStage, darkSheet, ...whiteRecedingTargets, ...allStaggerTargets], { clearProps: 'all' });
          return;
        }

        // 1. Initial State: dark sheet starts completely below the pinned stage
        gsap.set(darkSheet, { yPercent: 100, force3D: true });
        if (headGroup.length) {
          gsap.set(headGroup, { y: 30, opacity: 0 });
        }
        if (featureCards.length) {
          gsap.set(featureCards, { y: 35, opacity: 0 });
        }
        if (callout) {
          gsap.set(callout, { y: 25, opacity: 0 });
        }

        // 2. Pinned Scrub Timeline: Pin white section for duration of +=100vh
        const wipeTl = gsap.timeline({
          scrollTrigger: {
            trigger: stageTarget,
            start: 'bottom bottom',
            end: '+=100vh',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // Step 1: White split section content gently recedes (scale: 0.96, y: -35px, opacity: 0.3, blur: 6px)
        wipeTl.to(splitEl, {
          scale: 0.96,
          y: -35,
          opacity: 0.3,
          filter: 'blur(6px)',
          ease: 'none',
          force3D: true
        }, 0);

        // Also subtly scale down the white stage for depth layering
        wipeTl.to(pinStage, {
          scale: 0.98,
          opacity: 0.45,
          ease: 'none'
        }, 0);

        // Step 2: Incoming dark sheet slides smoothly from yPercent: 100 to yPercent: 0 covering white stage
        wipeTl.to(darkSheet, {
          yPercent: 0,
          ease: 'none',
          force3D: true
        }, 0);

        // Step 3: As the dark sheet locks into place, stagger internal elements
        // Eyebrow and headline rise from y: 30px to 0 with opacity 0 to 1
        if (headGroup.length) {
          wipeTl.to(headGroup, {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.35,
            ease: 'power3.out'
          }, 0.55);
        }

        // Bottom feature tabs glide in with a soft 0.08s stagger
        if (featureCards.length) {
          wipeTl.to(featureCards, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.38,
            ease: 'power3.out'
          }, 0.62);
        }

        // Callout finishes the composition entrance
        if (callout) {
          wipeTl.to(callout, {
            y: 0,
            opacity: 1,
            duration: 0.32,
            ease: 'power2.out'
          }, 0.82);
        }

        return function () {
          gsap.set([pinStage, darkSheet, splitEl, ...whiteRecedingTargets, ...allStaggerTargets], { clearProps: 'all' });
        };
      },

      // Fallback for screens < 1024px: smooth staggered entrance
      '(max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([pinStage, darkSheet, splitEl, ...whiteRecedingTargets, ...allStaggerTargets], { clearProps: 'all' });
          return;
        }
        if (allStaggerTargets.length) {
          gsap.fromTo(allStaggerTargets,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.07,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: darkSheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FIXED-UNDERLAY CURTAIN REVEAL FOOTER (SORABAN-STYLE)
  // Footer sits sticky at bottom: 0 beneath elevated main container.
  // As main rolls up with rounded bottom lip and drop shadow,
  // footer elements reveal with subtle parallax & staggered lift:
  // - Brand column: owl avatar + contact details (y: 30px -> 0, opacity: 0 -> 1)
  // - 3 Nav columns: cascade entrance (y: 25px -> 0, opacity: 0 -> 1, stagger: 0.08s)
  // - Legal disclaimer: fades in last (opacity: 0 -> 0.7)
  // ─────────────────────────────────────────────────────────────
  // FIXED-UNDERLAY CURTAIN REVEAL FOOTER (SORABAN-STYLE)
  // Footer sits sticky at bottom: 0 behind elevated main container.
  // As main rolls up with rounded bottom lip (border-radius: 0 0 28px 28px)
  // and drop shadow (box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35)),
  // footer elements reveal with subtle parallax & staggered lift:
  // - Brand column: owl mascot logo + contact block (y: 25px -> 0, opacity: 0 -> 1)
  // - 3 Nav columns: cascade from left to right (y: 20px -> 0, opacity: 0 -> 1, stagger: 0.08s)
  // - Legal disclaimer: fades in smoothly (opacity: 0 -> 0.75)
  // Responsive fallback on screens < 768px and prefers-reduced-motion.
  // ─────────────────────────────────────────────────────────────
  // UNIVERSAL MASTER FOOTER: SORABAN PINNED CURTAIN & TACTILE DOCK
  // 1. Pinned Curtain Unmask (sticky underlay positioning)
  // 2. Footer Stagger & Navigation Reveal:
  //    - Brand column drifts in (y: 25px -> 0, opacity: 0 -> 1, ease: 'power3.out')
  //    - 3 link columns cascade horizontally left-to-right (stagger: 0.08s, y: 20px -> 0, opacity: 0 -> 1)
  //    - Monospace column headers expand letter-tracking (0.08em -> 0.14em) in accent yellow (#EAE42F)
  // 3. Tactile Mascot Avatar Hover Blink & Pulse
  // 4. Bottom Seam: Dividing hairline draws across (scaleX: 0 -> 1, transform-origin: left, ease: 'power2.out')
  //    and crisp 12px monospace legal disclosure reveals smoothly
  // 5. Mobile & Fallback: ScrollTrigger.matchMedia() desktop (>=1024px) / mobile (<768px) / reduced-motion
  // ─────────────────────────────────────────────────────────────
  function initFooterUnderlayReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const footer = document.getElementById('site-footer') || document.querySelector('footer');
    if (!footer) return;

    const brandCol   = footer.querySelector('.footer-brand-col') || footer.querySelector('.cols > div:first-child');
    const navCols    = Array.from(footer.querySelectorAll('.footer-nav-col, .cols > div:not(:first-child)'));
    const colHeaders = Array.from(footer.querySelectorAll('.footer-nav-col h4, .cols > div h4'));
    const hairline   = footer.querySelector('.footer-hairline') || document.getElementById('footer-hairline');
    const legalNote  = footer.querySelector('.footer-legal') || footer.querySelector('.fine');

    const allTargets = [brandCol, ...navCols, hairline, legalNote].filter(Boolean);

    ScrollTrigger.matchMedia({
      // 1 & 2. Desktop (>= 1024px): Pinned curtain unmask & horizontal cascade
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          if (colHeaders.length) gsap.set(colHeaders, { clearProps: 'letterSpacing,color' });
          return;
        }

        // Set initial starting states for footer choreography
        if (brandCol) {
          gsap.set(brandCol, { y: 25, opacity: 0, force3D: true });
        }

        if (navCols.length) {
          gsap.set(navCols, { y: 20, opacity: 0, force3D: true });
        }

        if (colHeaders.length) {
          gsap.set(colHeaders, { letterSpacing: '0.08em', color: '#EAE42F' });
        }

        if (hairline) {
          gsap.set(hairline, { scaleX: 0, transformOrigin: '0% 50%', force3D: true });
        }

        if (legalNote) {
          gsap.set(legalNote, { opacity: 0, y: 12, force3D: true });
        }

        // Master Footer Timeline triggered at top 85%
        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });

        // 1. Brand column drifts in (y: 25px -> 0, opacity: 0 -> 1, ease: 'power3.out')
        if (brandCol) {
          footerTl.to(brandCol, {
            y: 0,
            opacity: 1,
            duration: 0.72,
            ease: 'power3.out',
            force3D: true
          }, 0);
        }

        // 2. The 3 link columns cascade horizontally from left to right (stagger: 0.08s, y: 20px -> 0, opacity: 0 -> 1)
        if (navCols.length) {
          footerTl.to(navCols, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true
          }, 0.12);
        }

        // Monospace column headers expand letter-tracking (0.08em -> 0.14em) in accent yellow (#EAE42F)
        if (colHeaders.length) {
          footerTl.to(colHeaders, {
            letterSpacing: '0.14em',
            color: '#EAE42F',
            duration: 0.6,
            ease: 'power2.out'
          }, 0.16);
        }

        // 4. Dividing hairline draws across from left to right (scaleX: 0 -> 1, transform-origin: left, ease: 'power2.out')
        if (hairline) {
          footerTl.to(hairline, {
            scaleX: 1,
            duration: 0.75,
            ease: 'power2.out',
            force3D: true
          }, 0.28);
        }

        // Legal text disclosure renders smoothly
        if (legalNote) {
          footerTl.to(legalNote, {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
            force3D: true
          }, 0.4);
        }

        // 3. Tactile Mascot Avatar Hover Blink & Soft Cyan Eye Glow
        const brandArea = brandCol ? (brandCol.querySelector('.brand') || brandCol) : null;
        let onBrandEnter, onBrandLeave;
        if (brandArea) {
          const owlMascot = brandArea.querySelector('img, svg');
          if (owlMascot) {
            onBrandEnter = function () {
              // Soft cyan glow + welcoming owl blink
              gsap.timeline({ overwrite: 'auto' })
                .to(owlMascot, {
                  scale: 1.12,
                  rotation: -2.5,
                  filter: 'brightness(1.4) drop-shadow(0 0 14px #019FFF)',
                  duration: 0.22,
                  ease: 'power2.out'
                })
                .to(owlMascot, {
                  scaleY: 0.25,
                  duration: 0.08,
                  ease: 'power1.inOut',
                  yoyo: true,
                  repeat: 1
                }, '+=0.04');
            };
            onBrandLeave = function () {
              gsap.to(owlMascot, {
                scale: 1,
                scaleY: 1,
                rotation: 0,
                filter: 'brightness(1.2) drop-shadow(0 0 0px rgba(1, 159, 255, 0))',
                duration: 0.32,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            };
            brandArea.addEventListener('mouseenter', onBrandEnter);
            brandArea.addEventListener('mouseleave', onBrandLeave);
          }
        }

        // 3. Client Portal Login Pill Micro-Physics
        const portalBtn = footer.querySelector('.portal-link');
        let onPortalEnter, onPortalLeave;
        if (portalBtn) {
          onPortalEnter = function () {
            gsap.to(portalBtn, {
              y: -2,
              backgroundColor: '#019FFF',
              borderColor: '#019FFF',
              color: '#FFFFFF',
              boxShadow: '0 0 20px rgba(1, 159, 255, 0.4), inset 0 0 10px rgba(1, 159, 255, 0.2)',
              duration: 0.25,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              overwrite: 'auto'
            });
          };
          onPortalLeave = function () {
            gsap.to(portalBtn, {
              y: 0,
              backgroundColor: 'rgba(1, 159, 255, 0.06)',
              borderColor: '#019FFF',
              color: '#019FFF',
              boxShadow: '0 0 0px rgba(1, 159, 255, 0), inset 0 0 0px rgba(1, 159, 255, 0)',
              duration: 0.25,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              overwrite: 'auto'
            });
          };
          portalBtn.addEventListener('mouseenter', onPortalEnter);
          portalBtn.addEventListener('mouseleave', onPortalLeave);
        }

        return function () {
          if (footerTl && footerTl.scrollTrigger) footerTl.scrollTrigger.kill();
          if (brandArea && onBrandEnter && onBrandLeave) {
            brandArea.removeEventListener('mouseenter', onBrandEnter);
            brandArea.removeEventListener('mouseleave', onBrandLeave);
          }
          if (portalBtn && onPortalEnter && onPortalLeave) {
            portalBtn.removeEventListener('mouseenter', onPortalEnter);
            portalBtn.removeEventListener('mouseleave', onPortalLeave);
          }
          gsap.set(allTargets, { clearProps: 'all' });
          if (colHeaders.length) gsap.set(colHeaders, { clearProps: 'letterSpacing,color' });
          if (portalBtn) gsap.set(portalBtn, { clearProps: 'all' });
        };
      },

      // Tablet View (768px - 1023px)
      '(max-width: 1023px) and (min-width: 768px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          if (colHeaders.length) gsap.set(colHeaders, { clearProps: 'letterSpacing,color' });
          return;
        }

        if (brandCol) gsap.set(brandCol, { y: 20, opacity: 0, force3D: true });
        if (navCols.length) gsap.set(navCols, { y: 15, opacity: 0, force3D: true });
        if (hairline) gsap.set(hairline, { scaleX: 0, transformOrigin: '0% 50%', force3D: true });
        if (legalNote) gsap.set(legalNote, { opacity: 0, y: 10, force3D: true });

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        });

        if (brandCol) tabletTl.to(brandCol, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0);
        if (navCols.length) tabletTl.to(navCols, { y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out' }, 0.1);
        if (hairline) tabletTl.to(hairline, { scaleX: 1, duration: 0.65, ease: 'power2.out' }, 0.22);
        if (legalNote) tabletTl.to(legalNote, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.32);

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
          if (colHeaders.length) gsap.set(colHeaders, { clearProps: 'letterSpacing,color' });
        };
      },

      // 5. Mobile Fallback (< 768px): smooth staggered entrance
      '(max-width: 767px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          if (colHeaders.length) gsap.set(colHeaders, { clearProps: 'letterSpacing,color' });
          return;
        }

        const mobileTargets = [brandCol, ...navCols, legalNote].filter(Boolean);
        if (mobileTargets.length) {
          gsap.fromTo(mobileTargets,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FILE-TAXES: PINNED HERO & FROSTED FLOATING DOCK (SORABAN SUITE)
  // - Pinned dark hero for scroll duration +=90vh (pin: true, scrub: 1.1, anticipatePin: 1)
  // - Headline gently lifts (y: -35px), scales to 0.97, opacity down to 0.25
  // - QuickPrepare frosted card glides smoothly to dock at lower threshold
  // - Lower Document Section: IRS Forms 1040 / 1120 parallax reveal (yPercent: -15)
  // - Headline fades in with high contrast & soft text-shadow
  // - CTA micro-interaction: hover lift & horizontal arrow translate (x: 4px)
  // - Hardware acceleration via will-change
  // - Responsive via ScrollTrigger.matchMedia (>= 900px), fallback for mobile & reduced motion
  // ─────────────────────────────────────────────────────────────
  function initFileTaxesHeroTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const heroSection      = document.getElementById('tax-hero-section');
    const heroContent      = document.getElementById('tax-hero-content');
    const quickprepareCard = document.getElementById('tax-quickprepare-card');
    const docBand          = document.getElementById('tax-document-section');
    const docBg            = document.getElementById('tax-document-bg');
    const docHeadline      = document.getElementById('tax-document-headline');
    const docEyebrow       = docBand ? docBand.querySelector('.tax-document-eyebrow') : null;
    const ctaBtn           = document.getElementById('tax-quickprepare-cta') || (quickprepareCard ? quickprepareCard.querySelector('.tax-quickprepare-btn') : null);
    const ctaArrow         = ctaBtn ? ctaBtn.querySelector('.tax-cta-arrow') : null;

    if (!heroSection || !heroContent || !quickprepareCard) return;

    const allTargets = [heroSection, heroContent, quickprepareCard, docBand, docBg, docHeadline, docEyebrow].filter(Boolean);

    // Micro-interactions: CTA button hover lift & horizontal arrow translate
    if (ctaBtn && ctaArrow) {
      ctaBtn.addEventListener('mouseenter', () => {
        gsap.to(ctaArrow, {
          x: 4,
          duration: 0.28,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });
      ctaBtn.addEventListener('mouseleave', () => {
        gsap.to(ctaArrow, {
          x: 0,
          duration: 0.24,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });
    }

    ScrollTrigger.matchMedia({
      // Desktop & Tablets (>= 900px) with no reduced motion preference
      '(min-width: 900px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // 1. Initial State: QuickPrepare card starts elevated/floating
        gsap.set(quickprepareCard, {
          y: 20,
          scale: 0.99,
          force3D: true
        });

        // 2. Master Scrubbed Pinned Timeline for Hero Section (duration: +=90vh)
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top 68px',
            end: '+=90vh',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // Headline gently lifts upward (y: -35px) and scales down to 0.97 while reducing to opacity: 0.25
        heroTl.to(heroContent, {
          y: -35,
          scale: 0.97,
          opacity: 0.25,
          ease: 'power1.out',
          force3D: true
        }, 0);

        // QuickPrepare box glides smoothly to dock at the lower threshold
        heroTl.to(quickprepareCard, {
          y: 0,
          scale: 1,
          ease: 'power1.out',
          force3D: true
        }, 0);

        // 3. Lower Document Section: IRS Forms 1040 / 1120 Parallax Reveal & Soft Dimming
        if (docBand && docBg) {
          gsap.fromTo(docBg,
            { yPercent: 0, opacity: 1, force3D: true },
            {
              yPercent: -20,
              opacity: 0.4,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: docBand,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
                invalidateOnRefresh: true
              }
            }
          );
        }

        if (docBand && docHeadline) {
          gsap.fromTo([docEyebrow, docHeadline].filter(Boolean),
            {
              opacity: 0.15,
              y: 28,
              force3D: true
            },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.65,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: {
                trigger: docBand,
                start: 'top 85%',
                end: 'top 45%',
                scrub: 1.1,
                invalidateOnRefresh: true
              }
            }
          );
        }

        return function () {
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Mobile & small screens (< 900px): clean native stacked flow with smooth entrance
      '(max-width: 899px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        if (heroContent) {
          gsap.fromTo(heroContent.children,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
          );
        }

        if (quickprepareCard) {
          gsap.fromTo(quickprepareCard,
            { y: 30, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, duration: 0.65, delay: 0.2, ease: 'back.out(1.3)' }
          );
        }

        if (docBand && docHeadline) {
          gsap.fromTo([docEyebrow, docHeadline].filter(Boolean),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: docBand,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FILE-TAXES: FINTECH INTERACTIVE LEDGER (SORABAN INTERACTION PHYSICS)
  // - Top Document Section: IRS Forms 1040/1120 background parallax & soft dimming
  // - Pinned Entrance: Section header ("Every tier covers...") pinned cleanly at top (start: 'top 70px') for +=60vh (pin: true, pinSpacing: false, anticipatePin: 1)
  // - Ledger Row Cascade: 4 tier rows glide in from y: 30px -> 0px, opacity: 0 -> 1 (stagger: 0.08s, ease: "power3.out")
  // - Tabular Figure Animated Numbers: Prices count up smoothly ($295, $425, $595, $750) with tabular figures
  // - Most Chosen Tag: Pop overshoot animation (scale: 0.8 -> 1, ease: 'back.out(2)')
  // - Tactile Row Micro-Interactions: Soft wash (#F7F9FB), elevation (translateX(4px)), brand blue (#019FFF), and font bolding
  // - Lower Section Bridge: "Partnership and corporate filings" reveals with y: 30 -> 0, opacity: 0 -> 1
  // ─────────────────────────────────────────────────────────────
  function initFintechLedgerTable() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const docBand           = document.getElementById('tax-document-section');
    const docBg             = document.getElementById('tax-document-bg');
    const ledgerHeader      = document.getElementById('tax-ledger-header');
    const ledgerTwrap       = document.getElementById('tax-ledger-twrap');
    const ledger1040        = document.getElementById('tax-1040-ledger');
    const mostChosenTag     = document.getElementById('most-chosen-tag');

    const bizHeader         = document.getElementById('tax-business-header');
    const bizTwrap          = document.getElementById('tax-business-twrap');
    const bizTable          = document.getElementById('tax-business-ledger');

    const bookkeepingBanner = document.getElementById('tax-bookkeeping-banner');
    const accentBar         = document.getElementById('bookkeeping-accent-bar');

    const addonsHeader      = document.getElementById('tax-addons-header');
    const addonsTwrap       = document.getElementById('tax-addons-twrap');
    const addonsTable       = document.getElementById('tax-addons-ledger');

    if (!ledger1040 && !ledgerTwrap && !bizTable && !addonsTable) return;

    const rows1040   = ledger1040 ? Array.from(ledger1040.querySelectorAll('.ledger-row')) : [];
    const bizRows    = bizTable ? Array.from(bizTable.querySelectorAll('.ledger-row')) : [];
    const addonsRows = addonsTable ? Array.from(addonsTable.querySelectorAll('.ledger-row')) : [];

    const allTargets = [
      docBand, docBg, ledgerHeader, ledgerTwrap, ledger1040, mostChosenTag,
      bizHeader, bizTwrap, bizTable, bookkeepingBanner, accentBar,
      addonsHeader, addonsTwrap, addonsTable,
      ...rows1040, ...bizRows, ...addonsRows
    ].filter(Boolean);

    // Dynamic Cursor Spotlight on Ledger Tables
    const allLedgerTables = document.querySelectorAll('.tax-ledger-table');
    allLedgerTables.forEach(table => {
      table.addEventListener('mousemove', (e) => {
        const rect = table.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        table.style.setProperty('--spotlight-x', `${x}px`);
        table.style.setProperty('--spotlight-y', `${y}px`);
      });
      table.addEventListener('mouseleave', () => {
        table.style.setProperty('--spotlight-x', `-1000px`);
        table.style.setProperty('--spotlight-y', `-1000px`);
      });
    });

    ScrollTrigger.matchMedia({
      // Desktop & Tablets (>= 768px)
      '(min-width: 768px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // 1. Document Texture Parallax & Soft Dimming
        if (docBand && docBg) {
          gsap.fromTo(docBg,
            { yPercent: 0, opacity: 1, force3D: true },
            {
              yPercent: -20,
              opacity: 0.4,
              ease: 'none',
              force3D: true,
              scrollTrigger: {
                trigger: docBand,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.1,
                invalidateOnRefresh: true
              }
            }
          );
        }

        // 2. Document Banner & Pinned Entrance: Section Header Pin (+=60vh)
        if (ledgerHeader) {
          ScrollTrigger.create({
            trigger: ledgerHeader,
            start: 'top 70px',
            end: '+=60vh',
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true
          });
        }

        // 3. 1040 Individual Ledger Row Cascade (start: 'top 75%')
        if (rows1040.length) {
          gsap.set(rows1040, { y: 30, opacity: 0, force3D: true });
          if (mostChosenTag) {
            gsap.set(mostChosenTag, { scale: 0.8, opacity: 0, transformOrigin: 'center left' });
          }

          const cascadeTl = gsap.timeline({
            scrollTrigger: {
              trigger: ledgerTwrap || ledger1040,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          });

          cascadeTl.to(rows1040, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true
          }, 0);

          // Numeric count-up with tabular figures
          rows1040.forEach((row, idx) => {
            const priceEl = row.querySelector('.price-val');
            if (priceEl) {
              const targetVal = parseInt(priceEl.getAttribute('data-val'), 10) || parseInt(row.getAttribute('data-price'), 10) || 0;
              if (targetVal > 0) {
                const countObj = { val: Math.round(targetVal * 0.35) };
                cascadeTl.to(countObj, {
                  val: targetVal,
                  duration: 0.75,
                  ease: 'power2.out',
                  onUpdate: () => {
                    priceEl.textContent = '$' + Math.round(countObj.val).toLocaleString('en-US');
                  },
                  onComplete: () => {
                    priceEl.textContent = '$' + targetVal.toLocaleString('en-US');
                  }
                }, idx * 0.08);
              }
            }
          });

          if (mostChosenTag) {
            cascadeTl.to(mostChosenTag, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              force3D: true
            }, 0.28);
          }
        }

        // 4. Business Section: Partnership and corporate filings Cascade (start: 'top 75%')
        if (bizRows.length || bizHeader) {
          if (bizHeader) gsap.set(bizHeader, { y: 24, opacity: 0, force3D: true });
          if (bizRows.length) gsap.set(bizRows, { y: 30, opacity: 0, force3D: true });

          const bizTl = gsap.timeline({
            scrollTrigger: {
              trigger: bizHeader || bizTwrap || bizTable,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          });

          if (bizHeader) {
            bizTl.to(bizHeader, {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power2.out',
              force3D: true
            }, 0);
          }

          if (bizRows.length) {
            bizTl.to(bizRows, {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.65,
              ease: 'power3.out',
              force3D: true
            }, 0.1);

            // Animate Business prices ($1,150 and $1,950) with tabular figures
            bizRows.forEach((row, idx) => {
              const priceEl = row.querySelector('.price-val');
              if (priceEl) {
                const targetVal = parseInt(priceEl.getAttribute('data-val'), 10) || parseInt(row.getAttribute('data-price'), 10) || 0;
                if (targetVal > 0) {
                  const countObj = { val: Math.round(targetVal * 0.35) };
                  bizTl.to(countObj, {
                    val: targetVal,
                    duration: 0.75,
                    ease: 'power2.out',
                    onUpdate: () => {
                      priceEl.textContent = '$' + Math.round(countObj.val).toLocaleString('en-US');
                    },
                    onComplete: () => {
                      priceEl.textContent = '$' + targetVal.toLocaleString('en-US');
                    }
                  }, 0.1 + (idx * 0.08));
                }
              }
            });
          }
        }

        // 5. Bookkeeping Banner Accent Draw & Background Wash Expand
        if (bookkeepingBanner) {
          if (accentBar) {
            gsap.set(accentBar, { scaleY: 0, transformOrigin: 'top center', force3D: true });
          }

          const bannerTl = gsap.timeline({
            scrollTrigger: {
              trigger: bookkeepingBanner,
              start: 'top 78%',
              toggleActions: 'play none none none'
            }
          });

          if (accentBar) {
            bannerTl.to(accentBar, {
              scaleY: 1,
              duration: 0.65,
              ease: 'power2.out',
              force3D: true
            }, 0);
          }

          bannerTl.to(bookkeepingBanner, {
            backgroundColor: '#F7F9FB',
            duration: 0.55,
            ease: 'power2.out'
          }, 0.1);
        }

        // 6. Add-Ons Section: Clear rates cascade & tabular number counts (start: 'top 75%')
        if (addonsRows.length || addonsHeader) {
          if (addonsHeader) gsap.set(addonsHeader, { y: 24, opacity: 0, force3D: true });
          if (addonsRows.length) gsap.set(addonsRows, { y: 20, opacity: 0, force3D: true });

          const addonsTl = gsap.timeline({
            scrollTrigger: {
              trigger: addonsHeader || addonsTwrap || addonsTable,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          });

          if (addonsHeader) {
            addonsTl.to(addonsHeader, {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power2.out',
              force3D: true
            }, 0);
          }

          if (addonsRows.length) {
            addonsTl.to(addonsRows, {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.55,
              ease: 'power3.out',
              force3D: true
            }, 0.08);

            addonsRows.forEach((row, idx) => {
              const priceEl = row.querySelector('.price-val');
              if (priceEl) {
                const targetVal = parseInt(priceEl.getAttribute('data-val'), 10) || parseInt(row.getAttribute('data-price'), 10) || 0;
                if (targetVal > 0) {
                  const countObj = { val: Math.round(targetVal * 0.4) };
                  addonsTl.to(countObj, {
                    val: targetVal,
                    duration: 0.65,
                    ease: 'power2.out',
                    onUpdate: () => {
                      priceEl.textContent = '$' + Math.round(countObj.val).toLocaleString('en-US');
                    },
                    onComplete: () => {
                      priceEl.textContent = '$' + targetVal.toLocaleString('en-US');
                    }
                  }, 0.08 + (idx * 0.04));
                }
              }
            });
          }
        }

        return function () {
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Fallback for Mobile & Small Screens (< 768px)
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });

        const mobileElements = [
          { targets: rows1040, trigger: ledgerTwrap || ledger1040 },
          { targets: [bizHeader, ...bizRows].filter(Boolean), trigger: bizHeader || bizTwrap },
          { targets: [bookkeepingBanner], trigger: bookkeepingBanner },
          { targets: [addonsHeader, ...addonsRows].filter(Boolean), trigger: addonsHeader || addonsTwrap }
        ];

        mobileElements.forEach(item => {
          if (item.targets.length && item.trigger) {
            gsap.fromTo(item.targets,
              { y: 18, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.06,
                duration: 0.45,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item.trigger,
                  start: 'top 85%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FILE-TAXES: 3D TAX KNOB DIAL & PINNED PRODUCT STORYTELLING
  // - Pinned Stage Setup: Pinned for +=120vh scroll distance (pin: true, scrub: 1.1, anticipatePin: 1)
  // - Dial Rotation & Parallax: Scale (1.0 -> 1.06), rotation (-6deg -> +4deg), SVG glow intensifies to MAX
  // - Content & Checklist Stagger: Right column locks; 3 line items translate (x: 20 -> 0) & fade
  // - Horizontal Dividers: Expand from scaleX: 0 -> 1 (width: 0% -> 100%)
  // - Yellow CTA Physics: Elevation lift & accent glow (box-shadow: 0 12px 30px rgba(234, 228, 47, 0.25))
  // - Responsive via matchMedia: >=1024px desktop scrub; fallback for mobile & prefers-reduced-motion
  // ─────────────────────────────────────────────────────────────
  function initTaxDialPinnedStorytelling() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const dialSection = document.getElementById('tax-dial-section');
    if (!dialSection) return;

    const dialImg      = document.getElementById('tax-dial-img');
    const dialGlow     = document.getElementById('tax-dial-glow');
    const textCol      = document.getElementById('tax-dial-text-col');
    const topDivider   = document.getElementById('tax-dial-top-divider');
    const checkItems   = Array.from(dialSection.querySelectorAll('.tax-dial-item'));
    const itemDividers = Array.from(dialSection.querySelectorAll('.item-divider'));
    const ctaBtn       = document.getElementById('tax-dial-cta-btn');

    const allTargets = [dialSection, dialImg, dialGlow, textCol, topDivider, ctaBtn, ...checkItems, ...itemDividers].filter(Boolean);

    ScrollTrigger.matchMedia({
      // Desktop & High-Resolution Displays (>= 1024px)
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial setup for pinned scrub
        if (dialImg) {
          gsap.set(dialImg, {
            scale: 1.0,
            rotation: -6,
            transformOrigin: '32% 52%',
            force3D: true
          });
        }
        if (dialGlow) {
          gsap.set(dialGlow, {
            opacity: 0.15,
            scale: 1.0,
            force3D: true
          });
        }
        if (topDivider) {
          gsap.set(topDivider, { scaleX: 0, transformOrigin: 'left center', force3D: true });
        }
        if (checkItems.length) {
          gsap.set(checkItems, { x: 20, opacity: 0, force3D: true });
        }
        if (itemDividers.length) {
          gsap.set(itemDividers, { scaleX: 0, transformOrigin: 'left center', force3D: true });
        }
        if (ctaBtn) {
          gsap.set(ctaBtn, {
            y: 20,
            opacity: 0.4,
            scale: 0.96,
            boxShadow: '0 4px 12px rgba(234, 228, 47, 0)',
            force3D: true
          });
        }

        // Master Pinned Timeline (duration: +=120vh)
        const dialTl = gsap.timeline({
          scrollTrigger: {
            trigger: dialSection,
            start: 'top top',
            end: '+=120vh',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. Knob Dial Rotation & Depth Scale (-6deg -> +4deg, scale 1.0 -> 1.06)
        if (dialImg) {
          dialTl.to(dialImg, {
            scale: 1.06,
            rotation: 4,
            ease: 'none',
            force3D: true
          }, 0);
        }

        // 2. Ambient MAX Glow Intensifies
        if (dialGlow) {
          dialTl.to(dialGlow, {
            opacity: 0.85,
            scale: 1.3,
            ease: 'power2.out',
            force3D: true
          }, 0.1);
        }

        // 3. Top divider expands horizontally
        if (topDivider) {
          dialTl.to(topDivider, {
            scaleX: 1,
            duration: 0.25,
            ease: 'power2.out',
            force3D: true
          }, 0.15);
        }

        // 4. Checklist Items & Dividers Sequential Stagger (0.12s stagger)
        checkItems.forEach((item, idx) => {
          const startTime = 0.22 + (idx * 0.14);
          dialTl.to(item, {
            x: 0,
            opacity: 1,
            duration: 0.28,
            ease: 'power3.out',
            force3D: true
          }, startTime);

          const divider = itemDividers[idx];
          if (divider) {
            dialTl.to(divider, {
              scaleX: 1,
              duration: 0.25,
              ease: 'power2.out',
              force3D: true
            }, startTime + 0.05);
          }
        });

        // 5. Yellow CTA Button: Elevation lift & accent glow
        if (ctaBtn) {
          dialTl.to(ctaBtn, {
            y: 0,
            opacity: 1,
            scale: 1,
            boxShadow: '0 12px 30px rgba(234, 228, 47, 0.25)',
            duration: 0.35,
            ease: 'back.out(1.8)',
            force3D: true
          }, 0.68);
        }

        return function () {
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Fallback for Mobile & Tablet (< 1024px)
      '(max-width: 1023px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });

        if (checkItems.length) {
          gsap.fromTo(checkItems,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: dialSection.querySelector('.tax-dial-checklist') || dialSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (ctaBtn) {
          gsap.fromTo(ctaBtn,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ctaBtn,
                start: 'top 90%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // WORKFLOW JOURNEY: 5-STEP LASER-FILL, 3-COL CHECKLIST & DOCKING CTA
  // (SORABAN FINTECH INTERACTION MECHANICS)
  // 1. 5-Step Pipeline Laser-Fill:
  //    - Trigger when #tax-steps-section reaches top 70% viewport
  //    - Active horizontal SVG guide line (#pipeline-laser-line) draws 1000 -> 0
  //    - 5 process cards stagger into place (y: 25px -> 0px, opacity: 0 -> 1, stagger: 0.08s, ease: "power3.out")
  //    - Step numbers (01-05) illuminate with brand-blue (#019FFF) glow
  // 2. Three-Column Checklist Stagger & Border Spotlight:
  //    - Trigger when #tax-checklist-section reaches top 75%
  //    - 3 checklist cards enter with opposing fan-out:
  //      Card 1: x: -20px -> 0
  //      Card 2: y: 20px -> 0
  //      Card 3: x: 20px -> 0
  //    - Bullet points cascade downward with 0.03s stagger (y: 12px -> 0px, opacity: 0 -> 1)
  //    - Cursor spotlight tracking across the 3 cards (--spot-x, --spot-y)
  // 3. Ready to File? Docking Action Banner:
  //    - Spring bounce entrance (scale: 0.95 -> 1, opacity: 0 -> 1, ease: "back.out(1.8)")
  // 4. Responsive fallback for < 800px and prefers-reduced-motion
  // ─────────────────────────────────────────────────────────────
  function initWorkflowJourneyTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stepsSection = document.getElementById('tax-steps-section');
    const stepsTrack   = document.getElementById('steps-pipeline-track');
    const laserLine    = document.getElementById('pipeline-laser-line');
    const stepCards    = stepsSection ? Array.from(stepsSection.querySelectorAll('.step-card')) : [];
    const stepNums     = stepsSection ? Array.from(stepsSection.querySelectorAll('.step-k')) : [];
    const stepsHeader  = document.getElementById('tax-steps-header');

    const checkSection = document.getElementById('tax-checklist-section');
    const checkHeader  = document.getElementById('tax-checklist-header');
    const checkCard1   = document.getElementById('tax-check-card-1');
    const checkCard2   = document.getElementById('tax-check-card-2');
    const checkCard3   = document.getElementById('tax-check-card-3');
    const checkCards   = [checkCard1, checkCard2, checkCard3].filter(Boolean);
    const checkBullets = checkSection ? Array.from(checkSection.querySelectorAll('.tax-check-card ul.ticks li')) : [];
    const dockingCta   = document.getElementById('tax-docking-cta');
    const ctaWrap      = document.getElementById('tax-cta-dock-wrap');

    if (!stepsSection && !checkSection) return;

    // Mousemove Cursor Spotlight Tracking across the 3 checklist cards
    if (checkCards.length) {
      checkCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--spot-x', `${x}px`);
          card.style.setProperty('--spot-y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--spot-x', '-500px');
          card.style.setProperty('--spot-y', '-500px');
        });
      });
    }

    const allStepTargets  = [stepsHeader, laserLine, ...stepCards, ...stepNums].filter(Boolean);
    const allCheckTargets = [checkHeader, ...checkCards, ...checkBullets, dockingCta, ctaWrap].filter(Boolean);

    ScrollTrigger.matchMedia({
      // Desktop & Tablets (>= 800px) with no reduced motion preference
      '(min-width: 800px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([...allStepTargets, ...allCheckTargets], { clearProps: 'all' });
          return;
        }

        // ── 1. 5-STEP PIPELINE LASER-FILL TIMELINE ──────────────────
        if (stepsSection) {
          if (stepsHeader) gsap.set(stepsHeader, { y: 20, opacity: 0 });
          if (laserLine) {
            gsap.set(laserLine, { strokeDasharray: 1000, strokeDashoffset: 1000 });
          }
          if (stepCards.length) {
            gsap.set(stepCards, { y: 25, opacity: 0, force3D: true });
          }

          const stepsTl = gsap.timeline({
            scrollTrigger: {
              trigger: stepsSection,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          });

          // Header reveals gently
          if (stepsHeader) {
            stepsTl.to(stepsHeader, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power3.out'
            }, 0);
          }

          // Draw active horizontal SVG laser line running across the top of cards 01 to 05
          if (laserLine) {
            stepsTl.to(laserLine, {
              strokeDashoffset: 0,
              duration: 0.85,
              ease: 'power2.inOut'
            }, 0.1);
          }

          // 5 process cards stagger into place (y: 25px -> 0px, opacity: 0 -> 1, stagger: 0.08s)
          if (stepCards.length) {
            stepsTl.to(stepCards, {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: 'power3.out',
              force3D: true
            }, 0.2);
          }

          // Step index numbers illuminate with a brief brand-blue (#019FFF) glow
          if (stepNums.length) {
            stepsTl.fromTo(stepNums,
              {
                color: 'var(--blue)',
                textShadow: '0 0 0px rgba(1, 159, 255, 0)'
              },
              {
                color: '#019FFF',
                textShadow: '0 0 16px rgba(1, 159, 255, 0.75)',
                stagger: 0.08,
                duration: 0.45,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
              },
              0.3
            );
          }
        }

        // ── 2. THREE-COLUMN CHECKLIST & DOCKING CTA TIMELINE ─────────
        if (checkSection) {
          if (checkHeader) gsap.set(checkHeader, { y: 20, opacity: 0 });
          if (checkCard1) gsap.set(checkCard1, { x: -20, opacity: 0, force3D: true });
          if (checkCard2) gsap.set(checkCard2, { y: 20, opacity: 0, force3D: true });
          if (checkCard3) gsap.set(checkCard3, { x: 20, opacity: 0, force3D: true });
          if (checkBullets.length) {
            gsap.set(checkBullets, { y: 12, opacity: 0 });
          }
          if (dockingCta) {
            gsap.set(dockingCta, { scale: 0.95, opacity: 0, force3D: true });
          }

          const checkTl = gsap.timeline({
            scrollTrigger: {
              trigger: checkSection,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          });

          // Header reveal
          if (checkHeader) {
            checkTl.to(checkHeader, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power3.out'
            }, 0);
          }

          // Opposing fan-out entrance of 3 checklist containers
          if (checkCard1) {
            checkTl.to(checkCard1, {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              force3D: true
            }, 0.15);
          }
          if (checkCard2) {
            checkTl.to(checkCard2, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              force3D: true
            }, 0.15);
          }
          if (checkCard3) {
            checkTl.to(checkCard3, {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              force3D: true
            }, 0.15);
          }

          // Bullet points cascade downward with rapid 0.03s stagger
          if (checkBullets.length) {
            checkTl.to(checkBullets, {
              y: 0,
              opacity: 1,
              stagger: 0.03,
              duration: 0.4,
              ease: 'power2.out'
            }, 0.4);
          }

          // "Ready to File?" Docking Action Banner enters with subtle spring bounce
          if (dockingCta) {
            checkTl.to(dockingCta, {
              scale: 1,
              opacity: 1,
              duration: 0.65,
              ease: 'back.out(1.8)',
              force3D: true
            }, 0.65);
          }
        }

        return function () {
          gsap.set([...allStepTargets, ...allCheckTargets], { clearProps: 'all' });
        };
      },

      // Fallback for Mobile (< 800px)
      '(max-width: 799px)': function () {
        gsap.set([...allStepTargets, ...allCheckTargets], { clearProps: 'all' });

        if (stepCards.length) {
          gsap.fromTo(stepCards,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              duration: 0.45,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stepsSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (checkCards.length) {
          gsap.fromTo(checkCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: checkSection,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (dockingCta) {
          gsap.fromTo(dockingCta,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.6)',
              scrollTrigger: {
                trigger: dockingCta,
                start: 'top 90%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: HERO PIN & CASE STUDY ELEVATED SHEET WIPE
  // Soraban-grade B2B fintech interaction suite
  // ─────────────────────────────────────────────────────────────
  function initTaxStrategyHeroTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[TaxStrategyHero] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const wrapper = document.getElementById('strategy-pinned-wrapper');
      const heroStage = document.getElementById('strategy-hero-stage');
      const heroCopy = document.getElementById('strategy-hero-copy');
      const owlContainer = document.getElementById('owl-container');
      const caseSheet = document.getElementById('strategy-case-sheet');
      const caseHeader = document.getElementById('strategy-case-header');
      const caseTable = document.getElementById('strategy-case-table');
      const calloutCard = document.getElementById('strategy-callout-card');
      const calloutLine = document.getElementById('strategy-callout-accent-line');
      const patsays = document.getElementById('strategy-patsays');

      if (!wrapper || !heroStage || !caseSheet) return;

      const allElements = [
        wrapper, heroStage, heroCopy, owlContainer, caseSheet,
        caseHeader, caseTable, calloutCard, calloutLine, patsays
      ].filter(Boolean);

      if (!isDesktop) {
        // Mobile & Reduced-Motion Fallback: clean native scroll flow
        gsap.set(allElements, { clearProps: 'all' });

        if (caseHeader) {
          gsap.fromTo(caseHeader,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: caseSheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (calloutLine) {
          gsap.set(calloutLine, { scaleY: 1 });
        }

        return function () {
          gsap.set(allElements, { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED SHEET WIPE TIMELINE (>= 1024px) ──
      // Initial states for fluid curtain reveal: sheet slides from bottom, contents fully styled and ready
      gsap.set(caseSheet, { yPercent: 100, force3D: true });
      if (caseHeader) gsap.set(caseHeader, { y: 0, opacity: 1, force3D: true });
      if (caseTable) gsap.set(caseTable, { y: 0, opacity: 1, force3D: true });
      if (calloutCard) gsap.set(calloutCard, { scale: 1, opacity: 1, force3D: true });
      if (calloutLine) gsap.set(calloutLine, { scaleY: 1, transformOrigin: 'top center', force3D: true });
      if (patsays) gsap.set(patsays, { y: 0, opacity: 1, force3D: true });

      // Master Scrubbed Timeline: Pin stage for +=100vh
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 68px',
          end: '+=100vh',
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress >= 0.20 && caseTable) {
              animateTableFigures(caseTable);
            }
          }
        }
      });

      // 1. Hero text and action buttons gently float upward (y: -35px) and fade down to opacity: 0.2
      if (heroCopy) {
        masterTl.to(heroCopy, {
          y: -35,
          opacity: 0.2,
          ease: 'power1.out',
          force3D: true
        }, 0);
      }

      // 2. Uncle Pat mascot moves along an independent depth parallax track (y: -50px, scale: 0.94, opacity: 0)
      if (owlContainer) {
        masterTl.to(owlContainer, {
          y: -50,
          scale: 0.94,
          opacity: 0,
          ease: 'power1.out',
          force3D: true
        }, 0);
      }

      // 3. Incoming White Case Study Sheet Wipe: smoothly slides upward from yPercent: 100 to yPercent: 0 directly over dark stage
      masterTl.to(caseSheet, {
        yPercent: 0,
        ease: 'power1.out',
        duration: 0.45,
        force3D: true
      }, 0);

      // 4. Stationary Reading Pause: Holds docked card in full view
      masterTl.to({}, { duration: 0.55 }, 0.45);

      // Interactive number roll-up for breakdown table
      let figuresRolled = false;
      function animateTableFigures(table) {
        if (figuresRolled) return;
        figuresRolled = true;

        const cells = table.querySelectorAll('td');
        cells.forEach(td => {
          const originalText = td.textContent.trim();
          const hasTilde = originalText.startsWith('~');
          const isNegative = originalText.includes('-');
          const match = originalText.match(/[\d,]+/);
          if (!match) return;

          const numStr = match[0];
          const targetNum = parseInt(numStr.replace(/,/g, ''), 10);
          if (isNaN(targetNum)) return;

          const counter = { val: 0 };
          gsap.to(counter, {
            val: targetNum,
            duration: 0.85,
            ease: 'power2.out',
            onUpdate: function () {
              const formatted = Math.round(counter.val).toLocaleString('en-US');
              const prefix = hasTilde ? '~' : '';
              const sign = isNegative ? '-' : '';
              td.textContent = `${prefix}${sign}$${formatted}`;
            }
          });
        });
      }

      return function () {
        gsap.set(allElements, { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: DARK SHEET WIPE & PINNED STRATEGY STAGE
  // Soraban-style elevated sheet and synchronized triad
  // ─────────────────────────────────────────────────────────────
  function initDarkStrategySheetWipe() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[DarkStrategySheet] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const stage = document.getElementById('dark-strategy-stage');
      const sheet = document.getElementById('dark-strategy-sheet');
      const head = document.getElementById('dark-strategy-head');
      const cards = Array.from(document.querySelectorAll('.strategy-card'));
      const numerals = Array.from(document.querySelectorAll('.strategy-numeral'));
      const callout = document.getElementById('dark-strategy-callout');

      if (!stage || !sheet) return;

      const allElements = [stage, sheet, head, ...cards, ...numerals, callout].filter(Boolean);

      if (!isDesktop) {
        // Mobile & Reduced-Motion Fallback: native scroll with clean layout
        gsap.set(allElements, { clearProps: 'all' });

        if (cards.length) {
          gsap.fromTo(cards,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        return function () {
          gsap.set(allElements, { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED STRATEGY STAGE (>= 1024px) ──
      // Set initial states for high-depth sheet entrance
      gsap.set(sheet, { yPercent: 100, force3D: true });
      if (head) gsap.set(head, { y: 20, opacity: 0, force3D: true });
      if (cards.length) gsap.set(cards, { y: 40, opacity: 0, force3D: true });
      if (numerals.length) gsap.set(numerals, { color: '#0A2533', textShadow: 'none', scale: 0.9, force3D: true });
      if (callout) gsap.set(callout, { scale: 0.98, opacity: 0, y: 15, force3D: true });

      // Master Scrubbed Timeline: Pin stage for +=120vh of scroll distance
      const darkTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top 68px',
          end: '+=120vh',
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. Incoming Dark Sheet Wipe: slides smoothly from yPercent: 100 to yPercent: 0 directly over white section
      darkTl.to(sheet, {
        yPercent: 0,
        ease: 'none',
        force3D: true
      }, 0);

      // Headline and intro copy lock into place at top (y: 20px to 0, opacity: 0 to 1)
      if (head) {
        darkTl.to(head, {
          y: 0,
          opacity: 1,
          duration: 0.22,
          ease: 'power3.out',
          force3D: true
        }, 0.20);
      }

      // 2. The 3 strategy cards (1, 2, 3) enter as a synchronized triad (stagger: 0.1s, y: 40px to 0, opacity: 0 to 1)
      if (cards.length) {
        darkTl.to(cards, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.25,
          ease: 'power3.out',
          force3D: true
        }, 0.35);
      }

      // Step numerals ("1", "2", "3") illuminate with brand cyan (#019FFF) accents
      if (numerals.length) {
        darkTl.to(numerals, {
          color: '#019FFF',
          textShadow: '0 0 18px rgba(1, 159, 255, 0.45)',
          scale: 1,
          stagger: 0.1,
          duration: 0.25,
          ease: 'back.out(2)',
          force3D: true
        }, 0.38);
      }

      // 3. Callout Card Reveal: Once all 3 cards dock, bottom banner glides up with subtle spring bounce (scale: 0.98 to 1)
      if (callout) {
        darkTl.to(callout, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: 'back.out(1.6)',
          force3D: true
        }, 0.65);
      }

      // 4. Stationary Reading Pause: Holds docked triad in full view so the user can review before unpinning
      darkTl.to({}, { duration: 0.20 }, 0.80);

      return function () {
        gsap.set(allElements, { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: FINANCIAL SCOREBOARD & PHOTO BRIDGE
  // Interactive data displays, rolling number counters & photo parallax
  // ─────────────────────────────────────────────────────────────
  function initExposureScoreboard() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[ExposureScoreboard] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const section = document.getElementById('exposure-section');
      const header = document.getElementById('exposure-header');
      const baCards = Array.from(document.querySelectorAll('.exposure-card-ba'));
      const kpiCards = Array.from(document.querySelectorAll('.exposure-card-kpi'));
      const assetIntro = document.getElementById('exposure-asset-intro');
      const benefitItems = Array.from(document.querySelectorAll('.exposure-benefit-item'));
      const photoSplit = document.getElementById('exposure-photo-split');
      const photoImg = document.getElementById('exposure-photo-img');

      if (!section) return;

      const allElements = [
        header, ...baCards, ...kpiCards, assetIntro, ...benefitItems
      ].filter(Boolean);

      if (!isDesktop) {
        // Mobile / Reduced-Motion Fallback: native layout
        gsap.set(allElements, { clearProps: 'all' });
        if (photoImg) gsap.set(photoImg, { clearProps: 'all' });

        if (baCards.length) {
          gsap.fromTo(baCards,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1,
              stagger: 0.08, duration: 0.45, ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set(allElements, { clearProps: 'all' });
        };
      }

      // ── DESKTOP SCOREBOARD SEQUENCE ──
      // Set initial states
      if (header) gsap.set(header, { y: 20, opacity: 0, force3D: true });
      if (baCards.length) gsap.set(baCards, { y: 35, opacity: 0, force3D: true });
      if (kpiCards.length) gsap.set(kpiCards, { y: 25, opacity: 0, force3D: true });
      if (assetIntro) gsap.set(assetIntro, { y: 20, opacity: 0, force3D: true });
      if (benefitItems.length) gsap.set(benefitItems, { x: -15, opacity: 0, force3D: true });

      // Rolling number counter logic
      let numbersTriggered = false;
      function triggerNumberRolls() {
        if (numbersTriggered) return;
        numbersTriggered = true;

        const numElements = section.querySelectorAll('.exposure-num');
        numElements.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-val') || numEl.textContent.replace(/[^0-9]/g, ''), 10);
          if (isNaN(target)) return;

          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 0.95,
            ease: 'power2.out',
            onUpdate: function () {
              numEl.textContent = `$${Math.round(counter.val).toLocaleString('en-US')}`;
            }
          });
        });
      }

      // Master Timeline: Trigger when "What happened to the exposure." reaches 70% viewport
      const scoreboardTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
          onEnter: () => triggerNumberRolls()
        }
      });

      // 1. Header fades & floats in
      if (header) {
        scoreboardTl.to(header, {
          y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', force3D: true
        }, 0);
      }

      // 2. The 2 top comparison cards glide in (y: 35px to 0, opacity: 0 to 1, stagger: 0.1s, ease: "power3.out")
      if (baCards.length) {
        scoreboardTl.to(baCards, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out', force3D: true
        }, 0.1);
      }

      // 3. Three lower metric cards slide up sequentially (stagger: 0.06s, y: 25px to 0, opacity: 0 to 1)
      if (kpiCards.length) {
        scoreboardTl.to(kpiCards, {
          y: 0, opacity: 1, stagger: 0.06, duration: 0.55, ease: 'power3.out', force3D: true
        }, 0.32);
      }

      // 4. Asset narrative text and benefits
      if (assetIntro) {
        scoreboardTl.to(assetIntro, {
          y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', force3D: true
        }, 0.52);
      }

      if (benefitItems.length) {
        scoreboardTl.to(benefitItems, {
          x: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power2.out', force3D: true
        }, 0.62);
      }

      // 5. Architectural Interior Photo Parallax Bridge (yPercent: -15)
      // Only attach if standing-split-stage is not pinned
      if (photoSplit && photoImg && !document.getElementById('standing-split-stage')) {
        gsap.fromTo(photoImg,
          { yPercent: 0, force3D: true },
          {
            yPercent: -15,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: photoSplit,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
              invalidateOnRefresh: true
            }
          }
        );
      }

      return function () {
        gsap.set(allElements, { clearProps: 'all' });
        if (photoImg) gsap.set(photoImg, { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: PROACTIVE ADVISORY PINNED SPLIT SEQUENCE
  // Pinned stage (+=110vh), image scaling & deep parallax,
  // headline docking, checklist horizontal stagger & hairline line sweeps
  // ─────────────────────────────────────────────────────────────
  function initStandingSplitPinnedSequence() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[StandingSplitPinnedSequence] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const stage = document.getElementById('standing-split-stage');
      const photoImg = document.getElementById('standing-split-photo-img');
      const textCol = document.getElementById('standing-split-text-col');
      const eyebrow = document.getElementById('standing-split-eyebrow');
      const heading = document.getElementById('standing-split-heading');
      const lede = document.getElementById('standing-split-lede');
      const items = Array.from(document.querySelectorAll('.standing-split-item'));
      const dividers = Array.from(document.querySelectorAll('.standing-split-divider'));
      const ctaBtn = document.getElementById('standing-split-btn');

      if (!stage) return;

      const animElements = [eyebrow, heading, lede, ...items, ...dividers, ctaBtn].filter(Boolean);

      if (!isDesktop) {
        // Mobile / Tablet (< 1024px) or Reduced Motion: Natural vertical flow
        gsap.set(animElements, { clearProps: 'all' });
        if (photoImg) gsap.set(photoImg, { clearProps: 'all' });
        if (stage) gsap.set(stage, { clearProps: 'all' });

        // Gentle entrance fade for mobile
        if (eyebrow || heading) {
          gsap.fromTo([eyebrow, heading, lede, ...items, ctaBtn].filter(Boolean),
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stage,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set(animElements, { clearProps: 'all' });
          if (photoImg) gsap.set(photoImg, { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED SEQUENCE (>= 1024px) ──
      // Set initial states
      gsap.set([eyebrow, heading, lede], { y: 25, opacity: 0, force3D: true });
      gsap.set(items, { x: -20, opacity: 0, force3D: true });
      gsap.set(dividers, { scaleX: 0, transformOrigin: 'left center', force3D: true });
      if (ctaBtn) gsap.set(ctaBtn, { y: 15, opacity: 0, force3D: true });
      if (photoImg) gsap.set(photoImg, { scale: 1.08, y: -40, force3D: true });

      // Master Pinned Timeline: +=110vh scroll distance
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=110vh',
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. Photographic Parallax & Scaling: scale 1.08 -> 1.0, y: -40px -> 0px
      if (photoImg) {
        pinTl.to(photoImg, {
          scale: 1.0,
          y: 0,
          ease: 'none',
          force3D: true,
          duration: 1.0
        }, 0);
      }

      // 2. Left Column Content Entrance: Eyebrow, Heading, Lede dock into view
      pinTl.to([eyebrow, heading, lede].filter(Boolean), {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 0.45,
        ease: 'power3.out',
        force3D: true
      }, 0.05);

      // 3. Checklist Items Reveal with horizontal stagger (x: -20px -> 0, opacity: 0 -> 1)
      if (items.length) {
        pinTl.to(items, {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.42,
          ease: 'power3.out',
          force3D: true
        }, 0.22);
      }

      // 4. Hairline Dividers Sweep from Left to Right (scaleX: 0 -> 1, origin: left)
      if (dividers.length) {
        pinTl.to(dividers, {
          scaleX: 1,
          stagger: 0.1,
          duration: 0.45,
          ease: 'power2.out',
          force3D: true
        }, 0.25);
      }

      // 5. CTA Button dock into view
      if (ctaBtn) {
        pinTl.to(ctaBtn, {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          force3D: true
        }, 0.52);
      }

      // 6. Stationary reading window before unpinning
      pinTl.to({}, { duration: 0.35 }, 0.65);

      return function () {
        gsap.set(animElements, { clearProps: 'all' });
        if (photoImg) gsap.set(photoImg, { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: ADVISORY PINNED STAGE -> CLOSING WHITE SHEET WIPE
  // Dark stage pinned for +=90vh; headline & 3 pillar cards lift/fade (y: -30px, opacity: 0.25);
  // white card sheet slides smoothly over dark stage (yPercent: 100 -> 0);
  // left copy & right disclaimer card stagger in
  // ─────────────────────────────────────────────────────────────
  function initAdvisoryClosingSheetWipe() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[AdvisoryClosingSheetWipe] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const darkStage = document.getElementById('advisory-pinned-stage');
      const whiteSheet = document.getElementById('closing-white-sheet');
      const head = document.getElementById('advisory-pinned-head');
      const cards = Array.from(document.querySelectorAll('.advisory-pillar-card'));
      const waitWrap = document.getElementById('advisory-wait-wrap');
      const ctaBtn = document.getElementById('advisory-cta-btn');
      const leftCopy = document.getElementById('closing-white-left');
      const disclaimer = document.getElementById('closing-disclaimer-card');

      if (!darkStage || !whiteSheet) return;

      const darkElements = [head, ...cards, waitWrap, ctaBtn].filter(Boolean);
      const whiteElements = [leftCopy, disclaimer].filter(Boolean);

      if (!isDesktop) {
        // Mobile / Tablet (< 1024px) or Reduced Motion: Natural vertical scroll
        gsap.set([darkStage, whiteSheet, ...darkElements, ...whiteElements], { clearProps: 'all' });

        if (leftCopy) {
          gsap.fromTo([leftCopy, disclaimer].filter(Boolean),
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: whiteSheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set([darkStage, whiteSheet, ...darkElements, ...whiteElements], { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED SHEET WIPE (>= 1024px) ──
      // Set initial states
      gsap.set(whiteSheet, { yPercent: 100, force3D: true });
      if (leftCopy) gsap.set(leftCopy, { y: 25, opacity: 0, force3D: true });
      if (disclaimer) gsap.set(disclaimer, { y: 25, opacity: 0, force3D: true });

      // Master Pinned Timeline: Pin dark stage for +=90vh while white sheet climbs
      const wipeTl = gsap.timeline({
        scrollTrigger: {
          trigger: darkStage,
          start: 'top top',
          end: '+=90vh',
          pin: true,
          pinSpacing: false,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. Dark Section Content: Headline and 3 pillar cards gently lift upward (y: -30px) & fade down (opacity: 0.25)
      if (head) {
        wipeTl.to(head, {
          y: -30,
          opacity: 0.25,
          duration: 0.45,
          ease: 'power2.out',
          force3D: true
        }, 0);
      }

      if (cards.length) {
        wipeTl.to(cards, {
          y: -30,
          opacity: 0.25,
          stagger: 0.04,
          duration: 0.45,
          ease: 'power2.out',
          force3D: true
        }, 0.04);
      }

      if (waitWrap) {
        wipeTl.to(waitWrap, {
          y: -20,
          opacity: 0.35,
          duration: 0.45,
          ease: 'power2.out',
          force3D: true
        }, 0.08);
      }

      // 2. Incoming White Sheet Overlay: Slides smoothly from yPercent: 100 to yPercent: 0 directly over pinned dark stage
      wipeTl.to(whiteSheet, {
        yPercent: 0,
        ease: 'none',
        force3D: true,
        duration: 0.65
      }, 0);

      // 3. Internal Stagger & Disclaimer Reveal
      if (leftCopy) {
        wipeTl.to(leftCopy, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          force3D: true
        }, 0.48);
      }

      if (disclaimer) {
        wipeTl.to(disclaimer, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          force3D: true
        }, 0.54);
      }

      // 4. Reading hold before unpinning
      wipeTl.to({}, { duration: 0.25 }, 0.75);

      return function () {
        gsap.set([darkStage, whiteSheet, ...darkElements, ...whiteElements], { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: THREE PILLARS (ENGAGEMENT SCOPE) TRANSITION
  // Header drift (y: 25px -> 0, opacity: 0 -> 1);
  // Equalizer stagger: Card 02 lands first, then Cards 01 & 03 (y: 40px -> 0, back.out(1.4));
  // Numerals ("01", "02", "03") sequential accent cyan illumination
  // ─────────────────────────────────────────────────────────────
  function initEngagementScopeTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[EngagementScopeTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const section = document.getElementById('engagement-scope-section');
      const head = document.getElementById('engagement-scope-head');
      const card01 = document.getElementById('engagement-card-01');
      const card02 = document.getElementById('engagement-card-02');
      const card03 = document.getElementById('engagement-card-03');
      const tag01 = document.getElementById('engagement-tag-01');
      const tag02 = document.getElementById('engagement-tag-02');
      const tag03 = document.getElementById('engagement-tag-03');

      if (!section) return;

      const allElements = [head, card01, card02, card03, tag01, tag02, tag03].filter(Boolean);

      if (!isDesktop) {
        // Mobile / Tablet (< 768px) or Reduced Motion: Natural vertical scroll
        gsap.set(allElements, { clearProps: 'all' });

        if (head) {
          gsap.fromTo([head, card01, card02, card03].filter(Boolean),
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set(allElements, { clearProps: 'all' });
        };
      }

      // ── DESKTOP EQUALIZER SEQUENCE (>= 768px) ──
      // Set initial states
      if (head) gsap.set(head, { y: 25, opacity: 0, force3D: true });
      if (card01) gsap.set(card01, { y: 40, opacity: 0, force3D: true });
      if (card02) gsap.set(card02, { y: 40, opacity: 0, force3D: true });
      if (card03) gsap.set(card03, { y: 40, opacity: 0, force3D: true });

      // Master Timeline: Trigger when section top hits 75% viewport
      const scopeTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true
        }
      });

      // 1. Eyebrow & headline drift into view (y: 25px -> 0, opacity: 0 -> 1, ease: "power3.out")
      if (head) {
        scopeTl.to(head, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          force3D: true
        }, 0);
      }

      // 2. Equalizer-style card stagger: Center Card (02) lands first, followed by Cards 01 and 03
      // Stagger: 0.08s, y: 40px to 0, opacity: 0 to 1, ease: "back.out(1.4)"
      const orderedCards = [card02, card01, card03].filter(Boolean);
      if (orderedCards.length) {
        scopeTl.to(orderedCards, {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.65,
          ease: 'back.out(1.4)',
          force3D: true
        }, 0.18);
      }

      // 3. Numerals ("01", "02", "03") illuminate sequentially with subtle accent cyan before settling into muted slate
      const orderedTags = [tag02, tag01, tag03].filter(Boolean);
      orderedTags.forEach((tag, idx) => {
        scopeTl.to(tag, {
          color: '#019FFF',
          textShadow: '0 0 14px rgba(1, 159, 255, 0.45)',
          duration: 0.28,
          ease: 'power2.out'
        }, 0.35 + idx * 0.10);

        scopeTl.to(tag, {
          color: '#64748B',
          textShadow: 'none',
          duration: 0.4,
          ease: 'power2.out'
        }, 0.65 + idx * 0.10);
      });

      return function () {
        gsap.set(allElements, { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: TWO TRACKS (PERSONA STAGE) -> INCLUDED DARK SHEET WIPE
  // Pin persona stage for +=90vh;
  // As scrub progresses, both cards compress (scale: 0.96), lift (y: -30px) and dim (opacity: 0.35);
  // Dark sheet enters from yPercent: 100 -> 0 over persona stage;
  // Eyebrow (#EAE42F) and headline dock into view (y: 25px -> 0, opacity: 0 -> 1)
  // ─────────────────────────────────────────────────────────────
  function initPersonaTracksDarkSheetWipe() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[PersonaTracksDarkSheetWipe] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const personaStage = document.getElementById('persona-tracks-stage');
      const darkSheet = document.getElementById('included-dark-sheet');
      const personaHead = document.getElementById('persona-tracks-head');
      const trackA = document.getElementById('persona-track-a');
      const trackB = document.getElementById('persona-track-b');
      const darkHead = document.getElementById('included-dark-head');
      const darkEyebrow = document.getElementById('included-dark-eyebrow');
      const darkH2 = document.getElementById('included-dark-h2');
      const darkLede = document.getElementById('included-dark-lede');

      if (!personaStage || !darkSheet) return;

      const personaElements = [personaHead, trackA, trackB].filter(Boolean);
      const darkElements = [darkEyebrow, darkH2, darkLede].filter(Boolean);

      if (!isDesktop) {
        // Mobile / Tablet (< 1024px) or Reduced Motion: Natural vertical scroll
        gsap.set([personaStage, darkSheet, ...personaElements, ...darkElements], { clearProps: 'all' });

        if (darkHead) {
          gsap.fromTo(darkElements,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: darkSheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set([personaStage, darkSheet, ...personaElements, ...darkElements], { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED SHEET WIPE (>= 1024px) ──
      // Set initial states
      gsap.set(darkSheet, { yPercent: 100, force3D: true });
      if (darkEyebrow) gsap.set(darkEyebrow, { y: 25, opacity: 0, force3D: true });
      if (darkH2) gsap.set(darkH2, { y: 25, opacity: 0, force3D: true });
      if (darkLede) gsap.set(darkLede, { y: 25, opacity: 0, force3D: true });

      // Master Pinned Timeline: Pin persona tracks stage for +=90vh while dark sheet sweeps over
      const wipeTl = gsap.timeline({
        scrollTrigger: {
          trigger: personaStage,
          start: 'top top',
          end: '+=90vh',
          pin: true,
          pinSpacing: false,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. As scrub progresses toward 75%, both white cards compress (scale: 0.96), drift upward (y: -30px), and dim down to opacity: 0.35
      const trackCards = [trackA, trackB].filter(Boolean);
      if (trackCards.length) {
        wipeTl.to(trackCards, {
          scale: 0.96,
          y: -30,
          opacity: 0.35,
          filter: 'blur(4px)',
          duration: 0.6,
          ease: 'power2.out',
          force3D: true
        }, 0.1);
      }

      if (personaHead) {
        wipeTl.to(personaHead, {
          y: -25,
          opacity: 0.3,
          duration: 0.5,
          ease: 'power2.out',
          force3D: true
        }, 0.1);
      }

      // 2. Incoming Dark Sheet Wipe ("No line items. No surprise invoices.")
      // Slides smoothly upward from yPercent: 100 to yPercent: 0 directly over the two track cards
      wipeTl.to(darkSheet, {
        yPercent: 0,
        ease: 'none',
        force3D: true,
        duration: 0.7
      }, 0);

      // 3. Internal Stagger: Eyebrow (#EAE42F) & Headline & Lede upward reveal
      if (darkElements.length) {
        wipeTl.to(darkElements, {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.45,
          ease: 'power3.out',
          force3D: true
        }, 0.52);
      }

      // 4. Reading hold before stage unpins
      wipeTl.to({}, { duration: 0.25 }, 0.75);

      return function () {
        gsap.set([personaStage, darkSheet, ...personaElements, ...darkElements], { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: INCLUDED IN ENGAGEMENT (SCOPE PINNED STAGE)
  // Pin dark scope stage for +=110vh;
  // Dual-column laser cascade: headers tracking expansion (0.1em -> 0.16em);
  // Alternating items reveal down the page (stagger: 0.04s, y: 16px -> 0);
  // Hairline dividers draw from left to right (scaleX: 0 -> 1);
  // Bottom boundary card docks (y: 30px -> 0);
  // Premium support white sheet climbs over stage (yPercent: 100 -> 0)
  // ─────────────────────────────────────────────────────────────
  function initScopeDualColumnPinnedCascade() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[ScopeDualColumnPinnedCascade] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const stage = document.getElementById('scope-pinned-stage');
      const whiteSheet = document.getElementById('support-white-sheet');
      const head = document.getElementById('scope-pinned-head');
      const colHeadAdvice = document.getElementById('scope-head-advice');
      const colHeadFiling = document.getElementById('scope-head-filing');
      const adviceItems = Array.from(document.querySelectorAll('#scope-list-advice .scope-item'));
      const filingItems = Array.from(document.querySelectorAll('#scope-list-filing .scope-item'));
      const adviceDividers = Array.from(document.querySelectorAll('#scope-list-advice .scope-item-divider'));
      const filingDividers = Array.from(document.querySelectorAll('#scope-list-filing .scope-item-divider'));
      const boundaryCard = document.getElementById('scope-boundary-card');
      const whiteHead = document.getElementById('support-white-head');

      if (!stage || !whiteSheet) return;

      const allItems = [...adviceItems, ...filingItems];
      const allDividers = [...adviceDividers, ...filingDividers];
      const stageElements = [head, colHeadAdvice, colHeadFiling, ...allItems, ...allDividers, boundaryCard].filter(Boolean);

      if (!isDesktop) {
        // Mobile / Tablet (< 1024px) or Reduced Motion: Natural vertical scroll
        gsap.set([stage, whiteSheet, ...stageElements, whiteHead].filter(Boolean), { clearProps: 'all' });

        if (allItems.length) {
          gsap.fromTo(allItems,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.45,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: stage,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set([stage, whiteSheet, ...stageElements, whiteHead].filter(Boolean), { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED CASCADE TIMELINE (>= 1024px) ──
      // Set initial states
      // opacity: 0 hides the layout box so it doesn’t create a blank white ghost
      // when the sheet is displaced off-screen with yPercent: 100
      gsap.set(whiteSheet, { yPercent: 100, opacity: 0, force3D: true });
      if (colHeadAdvice) gsap.set(colHeadAdvice, { letterSpacing: '0.08em', opacity: 0.8, force3D: true });
      if (colHeadFiling) gsap.set(colHeadFiling, { letterSpacing: '0.08em', opacity: 0.8, force3D: true });
      gsap.set(allItems, { y: 16, opacity: 0, force3D: true });
      gsap.set(allDividers, { scaleX: 0, transformOrigin: 'left center', force3D: true });
      if (boundaryCard) gsap.set(boundaryCard, { y: 30, opacity: 0, force3D: true });

      // Master Pinned Timeline: Pin dark scope stage for +=110vh while line items cascade & white sheet sweeps
      const scopePinTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=110vh',
          pin: true,
          pinSpacing: false,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. Column Headers tracking expansion (0.08em -> 0.16em)
      const colHeads = [colHeadAdvice, colHeadFiling].filter(Boolean);
      if (colHeads.length) {
        scopePinTl.to(colHeads, {
          letterSpacing: '0.16em',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          force3D: true
        }, 0.05);
      }

      // 2. Dual-Column Alternating Progressive Cascade:
      // We interleave Advice & Filing items for alternating harmony down the ledger
      const maxRows = Math.max(adviceItems.length, filingItems.length);
      const interleavedItems = [];
      const interleavedDividers = [];
      for (let i = 0; i < maxRows; i++) {
        if (adviceItems[i]) interleavedItems.push(adviceItems[i]);
        if (filingItems[i]) interleavedItems.push(filingItems[i]);
        if (adviceDividers[i]) interleavedDividers.push(adviceDividers[i]);
        if (filingDividers[i]) interleavedDividers.push(filingDividers[i]);
      }

      // Items reveal down the page (stagger: 0.04s, y: 16px -> 0, opacity: 0 -> 1)
      if (interleavedItems.length) {
        scopePinTl.to(interleavedItems, {
          y: 0,
          opacity: 1,
          stagger: 0.035,
          duration: 0.38,
          ease: 'power3.out',
          force3D: true
        }, 0.12);
      }

      // Hairline dividers draw from left to right (scaleX: 0 -> 1, transform-origin: left)
      if (interleavedDividers.length) {
        scopePinTl.to(interleavedDividers, {
          scaleX: 1,
          stagger: 0.035,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true
        }, 0.14);
      }

      // 3. Bottom Legal Boundary Card Docks with elevation glow (y: 30px -> 0, opacity: 0 -> 1)
      if (boundaryCard) {
        scopePinTl.to(boundaryCard, {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
          force3D: true
        }, 0.52);
      }

      // 4. Reading hold — scope cascade is now fully self-contained on the dark stage.
      // The Premium Support white sheet is owned exclusively by initPremiumSupportCascade.
      scopePinTl.to({}, { duration: 0.20 }, 0.62);

      return function () {
        gsap.set([stage, ...stageElements].filter(Boolean), { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: PREMIUM SUPPORT — STANDALONE PINNED WIPE
  // Independent +=90vh pin: white sheet glides from yPercent:100 to 0
  // over the dark scope stage, then cascades typography & 4-card equalizer.
  // Hover micro-physics: lift, glow ring, sibling dimming.
  // Mobile / reduced-motion: natural document scroll entrance.
  // ─────────────────────────────────────────────────────────────
  function initPremiumSupportCascade() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const stage      = document.getElementById('support-pinned-stage');
      const sheet      = document.getElementById('support-white-sheet');
      const eyebrow    = document.getElementById('support-eyebrow');
      const h2         = document.getElementById('support-h2');
      const lede       = document.getElementById('support-lede');
      const cards      = Array.from(document.querySelectorAll('.support-pillar-card'));
      const tags       = Array.from(document.querySelectorAll('.support-tag'));

      if (!stage || !sheet) return;

      // ── HOVER MICRO-PHYSICS (runs on all breakpoints) ──
      // Lift + glow ring on active card; sibling dimming via GSAP
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -6, scale: 1.015,
            boxShadow: '0 20px 40px -12px rgba(1,159,255,0.16), 0 0 0 1px #019FFF',
            zIndex: 10,
            duration: 0.32, ease: 'cubic-bezier(0.16,1,0.3,1)',
            overwrite: 'auto', force3D: true
          });
          cards.forEach(sib => {
            if (sib !== card) gsap.to(sib, { opacity: 0.7, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0, scale: 1,
            boxShadow: '0 4px 16px rgba(14,22,33,0.06)',
            zIndex: 1,
            duration: 0.36, ease: 'power3.out',
            overwrite: 'auto', force3D: true
          });
          cards.forEach(sib => gsap.to(sib, { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }));
        });
      });

      if (!isDesktop) {
        // ── MOBILE: simple staggered scroll entrance ──
        gsap.set([eyebrow, h2, lede, ...cards].filter(Boolean), { clearProps: 'all' });
        gsap.fromTo(
          [eyebrow, h2, lede].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: sheet, start: 'top 82%', toggleActions: 'play none none none' }
          }
        );
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: sheet, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
        return function () {
          gsap.set([eyebrow, h2, lede, ...cards, ...tags].filter(Boolean), { clearProps: 'all' });
        };
      }

      // ── DESKTOP: EXTENDED PINNED SEQUENCE (>= 1024px) ──
      //
      // Phase 1 (0.00 → 0.48): White sheet entrance
      //   0.000-0.010  opacity ghost removal
      //   0.010-0.270  yPercent:100→0 sheet wipe
      //   0.265-0.355  eyebrow / h2 / lede drift up
      //   0.295-0.430  4 cards equalizer stagger
      //   0.330-0.450  tag letter-tracking
      //   0.460-0.490  reading hold
      //
      // Phase 2 (0.50 → 1.00): Quarterly dark sheet wipe
      //   0.505-0.510  quarterly section opacity ghost removal
      //   0.510-0.760  dark sheet yPercent:100→0  (simultaneously: white cards compress)
      //   0.760-0.870  quarterly eyebrow + headline cascade
      //   0.800-0.920  laser beam draws Q1→Q4
      //   0.840-0.960  Q1–Q4 card stagger + node illumination
      //   0.970-1.000  reading hold

      const allContent = [eyebrow, h2, lede, ...cards, ...tags].filter(Boolean);

      // Grab quarterly elements for Phase 2
      const qSection   = document.getElementById('quarterly-cadence-section');
      const qHead      = document.getElementById('quarterly-cadence-head');
      const qLaserBeam = document.getElementById('quarterly-laser-beam');
      const qNodes     = [1,2,3,4].map(n => document.getElementById('qnode-' + n));
      const qCards     = [1,2,3,4].map(n => document.getElementById('quarterly-card-q' + n));

      // Phase 1: Initial states (white sheet)
      gsap.set(sheet, { yPercent: 100, opacity: 0, force3D: true });
      gsap.set([eyebrow, h2, lede].filter(Boolean), { y: 25, opacity: 0, force3D: true });
      gsap.set(cards, { y: 35, opacity: 0, force3D: true });
      gsap.set(tags, { letterSpacing: '0.08em' });

      // Phase 2: Initial states (quarterly dark section)
      if (qSection) gsap.set(qSection, { yPercent: 100, opacity: 0, force3D: true });
      if (qHead)    gsap.set(qHead,    { y: 25, opacity: 0, force3D: true });
      if (qLaserBeam) gsap.set(qLaserBeam, { attr: { 'stroke-dashoffset': 1000 } });
      qNodes.filter(Boolean).forEach(n => gsap.set(n, { attr: { stroke: 'rgba(255,255,255,0.18)', fill: '#0E1621' } }));
      qCards.filter(Boolean).forEach(c => gsap.set(c, { y: 35, opacity: 0, force3D: true }));

      const supTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=180vh',
          pin: true,
          pinSpacing: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // ── PHASE 1: White sheet entrance ──
      supTl.to(sheet, { opacity: 1, duration: 0.01, ease: 'none' }, 0);
      supTl.to(sheet, { yPercent: 0, ease: 'none', duration: 0.26, force3D: true }, 0.01);
      supTl.to([eyebrow, h2, lede].filter(Boolean), {
        y: 0, opacity: 1, stagger: 0.04, duration: 0.11, ease: 'power3.out', force3D: true
      }, 0.265);
      supTl.to(cards, {
        y: 0, opacity: 1, stagger: 0.035, duration: 0.12, ease: 'back.out(1.4)', force3D: true
      }, 0.295);
      supTl.to(tags, {
        letterSpacing: '0.14em', stagger: 0.03, duration: 0.10, ease: 'power2.out'
      }, 0.330);
      supTl.to({}, { duration: 0.03 }, 0.460); // hold

      // ── PHASE 2: Quarterly dark sheet wipe ──

      // 2a. Ghost removal — flash quarterly to visible right before slide
      if (qSection) supTl.to(qSection, { opacity: 1, duration: 0.005, ease: 'none' }, 0.505);

      // 2b. Dark sheet slides from yPercent:100 to 0  +  white cards compress simultaneously
      if (qSection) {
        supTl.to(qSection, {
          yPercent: 0, ease: 'none', duration: 0.25, force3D: true
        }, 0.510);
      }
      supTl.to(cards, {
        scale: 0.96, y: -30, opacity: 0.3,
        filter: 'blur(6px)',
        stagger: 0.015, duration: 0.22, ease: 'power2.out', force3D: true
      }, 0.510);

      // 2c. Quarterly typography cascade (eyebrow + headline)
      if (qHead) {
        supTl.to(qHead, {
          y: 0, opacity: 1, duration: 0.12, ease: 'power3.out', force3D: true
        }, 0.760);
      }

      // 2d. Laser beam draws Q1 → Q4
      if (qLaserBeam) {
        supTl.to(qLaserBeam, {
          attr: { 'stroke-dashoffset': 0 }, duration: 0.28, ease: 'none'
        }, 0.800);
      }

      // 2e. Q1–Q4 card stagger + node illumination
      qCards.filter(Boolean).forEach((card, i) => {
        const pos = 0.840 + i * 0.030;
        supTl.to(card, {
          y: 0, opacity: 1, duration: 0.14, ease: 'back.out(1.4)', force3D: true
        }, pos);
        const node = qNodes[i];
        if (node) {
          supTl.to(node, {
            attr: { stroke: '#019FFF', fill: '#019FFF' }, duration: 0.08, ease: 'power2.out'
          }, pos);
          supTl.call(() => { card.classList.add('is-active'); node.classList.add('is-active'); }, null, pos + 0.01);
        }
      });

      // 2f. Reading hold
      supTl.to({}, { duration: 0.03 }, 0.970);

      // Cleanup
      const allQ = [qSection, qHead, qLaserBeam, ...qNodes, ...qCards].filter(Boolean);
      return function () {
        qCards.filter(Boolean).forEach(c => c.classList.remove('is-active'));
        qNodes.filter(Boolean).forEach(n => n.classList.remove('is-active'));
        gsap.set([sheet, ...allContent, ...allQ], { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TAX STRATEGY: QUARTERLY CADENCE — HOVER MICRO-PHYSICS + MOBILE
  // Desktop entrance (laser rail, card reveals, dial parallax) is
  // handled by Phase 2 of initPremiumSupportCascade (support pin
  // extended to +=180vh). This function owns:
  //   • Hover: lift + blue bloom + bullet brightening (all breakpoints)
  //   • Mobile: vertical scroll entrance for each Q card
  //   • Dial banner: image parallax (independent scrollTrigger)
  // ─────────────────────────────────────────────────────────────
  function initQuarterlyCadenceScrub() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const section    = document.getElementById('quarterly-cadence-section');
      const dialBanner = document.getElementById('quarterly-dial-banner');
      const dialInner  = document.getElementById('quarterly-dial-inner');
      const dialEyebrow= document.getElementById('quarterly-dial-eyebrow');
      const dialH2     = document.getElementById('quarterly-dial-h2');
      const dialAccent = document.getElementById('quarterly-dial-accent');
      const cards      = [1, 2, 3, 4].map(n => document.getElementById('quarterly-card-q' + n));

      if (!section) return;

      // ── HOVER MICRO-PHYSICS (all breakpoints) ──
      // Lift + blue ambient bloom; bullet list brightens to white
      cards.filter(Boolean).forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -6,
            boxShadow: '0 16px 36px -10px rgba(1,159,255,0.25)',
            borderColor: '#019FFF',
            duration: 0.32, ease: 'cubic-bezier(0.16,1,0.3,1)',
            overwrite: 'auto', force3D: true
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            boxShadow: 'none',
            borderColor: 'rgba(255,255,255,0.10)',
            duration: 0.36, ease: 'power3.out',
            overwrite: 'auto', force3D: true
          });
        });
      });

      if (!isDesktop) {
        // ── MOBILE: vertical scroll entrance ──
        gsap.set([...cards].filter(Boolean), { clearProps: 'all' });
        cards.filter(Boolean).forEach(card => {
          gsap.fromTo(card,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
              scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
            }
          );
        });
        if (dialInner) {
          gsap.fromTo(dialInner,
            { y: 24, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: dialBanner || dialInner, start: 'top 80%', toggleActions: 'play none none none' }
            }
          );
        }
        return function () {
          gsap.set([...cards, dialInner, dialEyebrow, dialH2, dialAccent].filter(Boolean), { clearProps: 'all' });
        };
      }

      // ── DESKTOP: dial banner parallax only (entrance handled by support pin Phase 2) ──
      if (dialBanner) {
        gsap.fromTo(dialBanner,
          { backgroundPositionY: '55%' },
          {
            backgroundPositionY: '35%',
            ease: 'none',
            scrollTrigger: {
              trigger: dialBanner,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      return function () {
        cards.filter(Boolean).forEach(c => c.classList.remove('is-active'));
        gsap.set([...cards, dialInner, dialEyebrow, dialH2, dialAccent].filter(Boolean), { clearProps: 'all' });
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAllTransitions();
      setTimeout(() => ScrollTrigger.refresh(), 350);
    });
  } else {
    initAllTransitions();
    setTimeout(() => ScrollTrigger.refresh(), 350);
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  window.initCardStackingTransition = initCardStackingTransition;
  window.initSplitStorytellingTransition = initSplitStorytellingTransition;
  window.initYearTimelineScrub = initYearTimelineScrub;
  window.initDiagnosticMatrixTransition = initDiagnosticMatrixTransition;
  window.initServicesPinnedChoreography = initServicesPinnedChoreography;
  window.initAudiencesSheetTransition = initAudiencesSheetTransition;
  window.initPricingCascade = initPricingCascade;
  window.initFlowAndStates = initFlowAndStates;
  window.initPriceSheetWipe = initPriceSheetWipe;
  window.initFocusSheetWipe = initFocusSheetWipe;
  window.initFooterUnderlayReveal = initFooterUnderlayReveal;
  window.initFileTaxesHeroTransition = initFileTaxesHeroTransition;
  window.initFintechLedgerTable = initFintechLedgerTable;
  window.initTaxDialPinnedStorytelling = initTaxDialPinnedStorytelling;
  window.initWorkflowJourneyTransition = initWorkflowJourneyTransition;
  window.initTaxStrategyHeroTransition = initTaxStrategyHeroTransition;
  window.initDarkStrategySheetWipe = initDarkStrategySheetWipe;
  window.initExposureScoreboard = initExposureScoreboard;
  window.initStandingSplitPinnedSequence = initStandingSplitPinnedSequence;
  window.initAdvisoryClosingSheetWipe = initAdvisoryClosingSheetWipe;
  window.initEngagementScopeTransition = initEngagementScopeTransition;
  window.initPersonaTracksDarkSheetWipe = initPersonaTracksDarkSheetWipe;
  window.initScopeDualColumnPinnedCascade = initScopeDualColumnPinnedCascade;
  window.initPremiumSupportCascade = initPremiumSupportCascade;
  window.initQuarterlyCadenceScrub = initQuarterlyCadenceScrub;
  window.initDialFitPinnedStage    = initDialFitPinnedStage;
  window.initFeeSheetCurtain       = initFeeSheetCurtain;
  window.initNewLawHeroTransition  = initNewLawHeroTransition;
  window.initIndividualDeductionsTransition = initIndividualDeductionsTransition;
  window.initLegislativePolicyMatrixTransition = initLegislativePolicyMatrixTransition;
  window.initConsultationSplitTransition = initConsultationSplitTransition;

  // ─────────────────────────────────────────────────────────────
  // DIAL-FIT PINNED STAGE
  // Gauge Banner Scrub + Elevated White Fit Sheet Curtain Wipe
  //
  // Sequence:
  //   1. Pin the dark dial banner for 90vh (ScrollTrigger pin, scrub: 1.1)
  //      – Gauge SVG background rotates from -10deg to +15deg
  //      – Headline locks then dims (scale: 0.97, opacity: 0.25)
  //   2. White Fit Sheet wipes upward over the pinned banner
  //      (yPercent: 100 → 0), high-depth rounded card effect (CSS)
  //   3. Two-column ledger stagger:
  //      – Sechead (eyebrow, h2, lede) floats in y:25→0 / opacity 0→1
  //      – Left column earns-items slide in, 0.04s stagger, brand cyan accents
  //      – Right column not-yet-items fade simultaneously, muted/warn styling
  //   4. Hover micro-interactions via CSS (.fit-item:hover)
  //   5. matchMedia: >= 1024px desktop full choreography;
  //      mobile < 768px and prefers-reduced-motion fall back to native scroll
  // ─────────────────────────────────────────────────────────────
  function initDialFitPinnedStage() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[DialFitPinnedStage] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      // ── DOM references ──────────────────────────────────────────
      const dialBannerWrap = document.getElementById('dial-banner-wrap');
      const dialGaugeBg    = document.getElementById('dial-gauge-bg');
      const dialHeadline   = document.getElementById('dial-banner-h2');
      const dialEyebrow    = document.getElementById('dial-banner-eyebrow');
      const fitSheet       = document.getElementById('fit-white-sheet');
      const fitEyebrow     = document.getElementById('fit-eyebrow');
      const fitHeadline    = document.getElementById('fit-headline');
      const fitLede        = document.getElementById('fit-lede');
      const fitColLeft     = document.getElementById('fit-col-left');
      const fitColRight    = document.getElementById('fit-col-right');
      const earnItems      = fitColLeft  ? Array.from(fitColLeft.querySelectorAll('.fit-item'))  : [];
      const notItems       = fitColRight ? Array.from(fitColRight.querySelectorAll('.fit-item')) : [];
      const earnColhead    = document.getElementById('fit-colhead-earn');
      const notColhead     = document.getElementById('fit-colhead-not');

      // Guards — silently skip if we are not on tax-strategy page
      if (!dialBannerWrap || !fitSheet) return;

      // ── Shared lists ────────────────────────────────────────────
      const fitTypography  = [fitEyebrow, fitHeadline, fitLede].filter(Boolean);
      const colheads       = [earnColhead, notColhead].filter(Boolean);
      const allColumnItems = [...earnItems, ...notItems].filter(Boolean);

      // ── MOBILE / REDUCED-MOTION FALLBACK ────────────────────────
      if (!isDesktop) {
        // Ensure nothing is invisibly hidden on mobile — clear any GSAP state
        const allEls = [
          dialBannerWrap, dialGaugeBg, dialHeadline, dialEyebrow,
          fitSheet, ...fitTypography, ...colheads, ...allColumnItems
        ].filter(Boolean);
        gsap.set(allEls, { clearProps: 'all' });

        // Gentle staggered entrance for the fit section on scroll
        const revealGroup = [...fitTypography, ...colheads].filter(Boolean);
        if (revealGroup.length) {
          gsap.fromTo(revealGroup,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out',
              scrollTrigger: {
                trigger: fitSheet,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
        if (allColumnItems.length) {
          gsap.fromTo(allColumnItems,
            { y: 14, opacity: 0 },
            {
              y: 0, opacity: 1, stagger: 0.035, duration: 0.42, ease: 'power2.out',
              scrollTrigger: {
                trigger: fitColLeft || fitSheet,
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set(allEls, { clearProps: 'all' });
        };
      }

      // ── DESKTOP: Full choreography ───────────────────────────────
      //
      // Architecture:
      //   • The dial banner is pinned with pinSpacing: FALSE so no extra
      //     scroll-space is injected — the fit sheet's natural position stays
      //     correct and it visually "climbs over" the banner as you scroll.
      //   • We give the fit sheet a CSS overlap via a negative margin-top
      //     equal to the dial banner's height, stacked above it with z-index.
      //   • Content inside the fit sheet reveals with viewport-entrance
      //     ScrollTrigger (toggleActions, not scrubbed) for crisp stagger.

      // ── Pull the fit sheet up to overlap the dial banner ─────────
      // Measure the banner height so the overlap is exact
      const bannerH = dialBannerWrap.getBoundingClientRect().height;
      gsap.set(fitSheet, {
        marginTop:  -bannerH,   // pulls sheet up into the banner area
        position:   'relative',
        zIndex:     10,         // ensures it renders above the pinned banner
        force3D:    true
      });

      // Initial hidden states for fit-sheet content
      if (fitTypography.length)  gsap.set(fitTypography,  { y: 25, opacity: 0 });
      if (colheads.length)        gsap.set(colheads,       { y: 16, opacity: 0 });
      if (allColumnItems.length)  gsap.set(allColumnItems, { y: 18, opacity: 0 });

      // ────────────────────────────────────────────────────────────
      // PHASE 1: Pinned Dial Banner Scrub
      // pinSpacing: false — fit sheet stays in-flow, slides over banner
      // ────────────────────────────────────────────────────────────
      const dialTl = gsap.timeline({
        scrollTrigger: {
          trigger:       dialBannerWrap,
          start:         'top top',
          end:           '+=90vh',
          pin:           true,
          pinSpacing:    false,    // ← no extra scroll space; sheet overlaps naturally
          scrub:         1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id:            'dial-pin'
        }
      });

      // Gauge: rotation -10deg → +15deg through the scrub
      if (dialGaugeBg) {
        dialTl.fromTo(dialGaugeBg,
          { rotation: -10 },
          { rotation: 15, ease: 'none', force3D: true },
          0
        );
      }

      // Headline: locks, then dims + micro-scales as sheet approaches
      const dialCopy = [dialHeadline, dialEyebrow].filter(Boolean);
      if (dialCopy.length) {
        dialTl.to(dialCopy,
          {
            scale:   0.97,
            opacity: 0.25,
            y:       -8,
            ease:    'power1.in',
            force3D: true,
            stagger: 0.03
          },
          0.45   // start dimming after mid-point of scrub
        );
      }

      // ────────────────────────────────────────────────────────────
      // PHASE 2: Fit-sheet entrance parallax
      // A gentle parallax on the sheet itself as it rises into view
      // (no yPercent wipe — the sheet is already in the right position)
      // ────────────────────────────────────────────────────────────
      gsap.fromTo(fitSheet,
        { y: 40, scale: 0.99 },
        {
          y: 0, scale: 1, ease: 'power2.out', force3D: true,
          scrollTrigger: {
            trigger:  fitSheet,
            start:    'top 95%',
            end:      'top 40%',
            scrub:    1.1,
            invalidateOnRefresh: true,
            id:       'fit-sheet-rise'
          }
        }
      );

      // ────────────────────────────────────────────────────────────
      // PHASE 3: Two-Column Ledger Stagger
      // Fires once the sheet is fully visible in the viewport
      // ────────────────────────────────────────────────────────────

      // A. Sechead (eyebrow, h2, lede)
      if (fitTypography.length) {
        gsap.to(fitTypography, {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out', force3D: true,
          scrollTrigger: {
            trigger:      fitSheet,
            start:        'top 72%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
            id:           'fit-header-reveal'
          }
        });
      }

      // B. Column headings
      if (colheads.length) {
        gsap.to(colheads, {
          y: 0, opacity: 1, stagger: 0.06, duration: 0.45, ease: 'power2.out', force3D: true,
          scrollTrigger: {
            trigger:      fitSheet,
            start:        'top 65%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
            id:           'fit-colheads-reveal'
          }
        });
      }

      // C. Left column earns-items — brand cyan, 0.04s stagger
      if (earnItems.length) {
        gsap.to(earnItems, {
          y: 0, opacity: 1, stagger: 0.04, duration: 0.40, ease: 'power2.out', force3D: true,
          scrollTrigger: {
            trigger:      fitColLeft || fitSheet,
            start:        'top 60%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
            id:           'fit-earn-items'
          }
        });
      }

      // D. Right column not-yet-items — simultaneous with left, muted styling via CSS
      if (notItems.length) {
        gsap.to(notItems, {
          y: 0, opacity: 1, stagger: 0.04, duration: 0.40, ease: 'power2.out', force3D: true,
          scrollTrigger: {
            trigger:      fitColRight || fitSheet,
            start:        'top 60%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
            id:           'fit-not-items'
          }
        });
      }

      // ── Cleanup (matchMedia context teardown) ────────────────────
      return function () {
        const toReset = [
          dialBannerWrap, dialGaugeBg, dialHeadline, dialEyebrow,
          fitSheet, ...fitTypography, ...colheads, ...allColumnItems
        ].filter(Boolean);
        gsap.set(toReset, { clearProps: 'all' });
        // Reset the margin-top we injected
        if (fitSheet) gsap.set(fitSheet, { clearProps: 'marginTop,zIndex,position' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FEE PINNED STAGE & CURTAIN WIPE
  // Elevated Dark Fee Sheet Overlay Wipe + Two-Column Stagger +
  // Sequential Dossier Accent Beam + Uncle Pat Spring
  // ─────────────────────────────────────────────────────────────
  function initFeeSheetCurtain() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[FeeSheetCurtain] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const feeStage        = document.getElementById('fee-pinned-stage');
      const feeDarkSheet    = document.getElementById('fee-dark-sheet');
      const feeEyebrow      = document.getElementById('fee-eyebrow');
      const feeHeadline     = document.getElementById('fee-headline');
      const feeLede         = document.getElementById('fee-lede');
      const feeBullets      = Array.from(document.querySelectorAll('.fee-bullet-item'));
      const feeCtaWrap      = document.getElementById('fee-cta-wrap');
      const feeCtaPrimary   = document.getElementById('fee-cta-primary');
      const feeCtaPhone     = document.getElementById('fee-cta-phone');
      const feeDossierCard  = document.getElementById('fee-dossier-card');
      const feeSteps        = Array.from(document.querySelectorAll('.fee-step-item'));
      const feeDossierNote  = document.getElementById('fee-dossier-note');
      const feePatsays      = document.getElementById('fee-patsays');
      const feePatAvatar    = document.getElementById('fee-pat-avatar');

      // Guard — exit if not on tax-strategy page
      if (!feeDarkSheet) return;

      const leftTypo = [feeEyebrow, feeHeadline, feeLede].filter(Boolean);
      const ctas = [feeCtaPrimary, feeCtaPhone].filter(Boolean);
      const allAnimatable = [
        feeDarkSheet, ...leftTypo, ...feeBullets, ...ctas,
        feeDossierCard, ...feeSteps, feeDossierNote, feePatsays
      ].filter(Boolean);

      // ── MOBILE OR PREFERS-REDUCED-MOTION FALLBACK ───────────────
      if (!isDesktop) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allAnimatable, { clearProps: 'all' });
          feeSteps.forEach(step => step.classList.add('is-lit'));
          return function () {
            gsap.set(allAnimatable, { clearProps: 'all' });
            feeSteps.forEach(step => step.classList.remove('is-lit'));
          };
        }

        const leftGroup = [...leftTypo, ...feeBullets, ...ctas].filter(Boolean);
        if (leftGroup.length) {
          gsap.fromTo(leftGroup,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: feeDarkSheet,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (feeDossierCard) {
          gsap.fromTo(feeDossierCard,
            { y: 30, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              ease: 'back.out(1.4)',
              scrollTrigger: {
                trigger: feeDossierCard,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                  feeSteps.forEach((s, idx) => {
                    setTimeout(() => s.classList.add('is-lit'), idx * 120);
                  });
                }
              }
            }
          );
        }

        if (feePatsays) {
          gsap.fromTo(feePatsays,
            { y: 20, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: feePatsays,
                start: 'top 88%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        return function () {
          gsap.set(allAnimatable, { clearProps: 'all' });
          feeSteps.forEach(step => step.classList.remove('is-lit'));
        };
      }

      // ── DESKTOP CHOREOGRAPHY ─────────────────────────────────────
      // 1. Tactile curtain unmask:
      // Pull sheet up (-48px) to overlap the preceding white card curved seam
      gsap.set(feeDarkSheet, {
        marginTop: -48,
        position:  'relative',
        zIndex:    20,
        force3D:   true
      });

      // Initial resting positions
      if (leftTypo.length)       gsap.set(leftTypo,       { y: 28, opacity: 0 });
      if (feeBullets.length)     gsap.set(feeBullets,     { y: 16, opacity: 0 });
      if (ctas.length)           gsap.set(ctas,           { y: 18, opacity: 0, scale: 0.96 });
      if (feeDossierCard)        gsap.set(feeDossierCard, { y: 32, opacity: 0, scale: 0.98 });
      if (feeSteps.length)       gsap.set(feeSteps,       { y: 14, opacity: 0 });
      if (feeDossierNote)        gsap.set(feeDossierNote, { opacity: 0 });
      if (feePatsays)            gsap.set(feePatsays,     { y: 30, opacity: 0, scale: 0.98 });

      // PHASE 1: Elevated Dark Sheet Overlay Wipe Parallax (scrub: 1.1)
      gsap.fromTo(feeDarkSheet,
        { y: 50, scale: 0.988 },
        {
          y: 0,
          scale: 1,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger:             feeDarkSheet,
            start:               'top 95%',
            end:                 'top 45%',
            scrub:               1.1,
            invalidateOnRefresh: true,
            id:                  'fee-sheet-wipe'
          }
        }
      );

      // PHASE 2: Left Column Typography Reveal (Eyebrow, Headline, Lede)
      if (leftTypo.length) {
        gsap.to(leftTypo, {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger:             feeDarkSheet,
            start:               'top 68%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'fee-left-typo'
          }
        });
      }

      // PHASE 3: 4 Bullet Line-Items Stagger
      if (feeBullets.length) {
        gsap.to(feeBullets, {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.42,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger:             feeDarkSheet,
            start:               'top 60%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'fee-bullets'
          }
        });
      }

      // PHASE 4: Dual CTA Block Pop
      if (ctas.length) {
        gsap.to(ctas, {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.48,
          ease: 'back.out(1.6)',
          force3D: true,
          scrollTrigger: {
            trigger:             feeCtaWrap || feeDarkSheet,
            start:               'top 78%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'fee-ctas'
          }
        });
      }

      // PHASE 5: Right Column Dossier Card Entrance
      if (feeDossierCard) {
        gsap.to(feeDossierCard, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger:             feeDossierCard,
            start:               'top 72%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'fee-dossier-card-reveal'
          }
        });
      }

      // PHASE 6: Dossier 4 Steps Stagger & Sequential Illumination Beam
      if (feeSteps.length) {
        gsap.to(feeSteps, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger:             feeDossierCard,
            start:               'top 66%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'fee-steps-enter',
            onEnter: () => {
              feeSteps.forEach((step, idx) => {
                gsap.delayedCall(idx * 0.14, () => {
                  step.classList.add('is-lit');
                });
              });
            },
            onLeaveBack: () => {
              feeSteps.forEach(step => step.classList.remove('is-lit'));
            }
          }
        });
      }

      // Note inside dossier
      if (feeDossierNote) {
        gsap.to(feeDossierNote, {
          opacity: 1,
          duration: 0.4,
          delay: 0.6,
          ease: 'power1.out',
          scrollTrigger: {
            trigger:             feeDossierCard,
            start:               'top 66%',
            toggleActions:       'play none none reverse',
            id:                  'fee-dossier-note-reveal'
          }
        });
      }

      // PHASE 7: Uncle Pat Mascot Quote Banner Entrance (Spring Physics)
      if (feePatsays) {
        gsap.to(feePatsays, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          ease: 'back.out(1.4)',
          force3D: true,
          scrollTrigger: {
            trigger:             feePatsays,
            start:               'top 86%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'fee-pat-quote-spring'
          }
        });

        // Interactive mouse tilt on Uncle Pat avatar
        if (feePatAvatar) {
          const onAvatarEnter = () => {
            gsap.to(feePatAvatar, { scale: 1.12, rotate: 6, duration: 0.28, ease: 'back.out(2)' });
          };
          const onAvatarLeave = () => {
            gsap.to(feePatAvatar, { scale: 1, rotate: 0, duration: 0.35, ease: 'power2.out' });
          };
          feePatAvatar.addEventListener('mouseenter', onAvatarEnter);
          feePatAvatar.addEventListener('mouseleave', onAvatarLeave);

          context.add(() => {
            return () => {
              feePatAvatar.removeEventListener('mouseenter', onAvatarEnter);
              feePatAvatar.removeEventListener('mouseleave', onAvatarLeave);
            };
          });
        }
      }

      // ── Cleanup ──────────────────────────────────────────────────
      return function () {
        gsap.set(allAnimatable, { clearProps: 'all' });
        if (feeDarkSheet) gsap.set(feeDarkSheet, { clearProps: 'marginTop,zIndex,position' });
        feeSteps.forEach(step => step.classList.remove('is-lit'));
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NEW LAW HERO STAGE & LEGISLATIVE BREAKDOWN
  // Dual Policy Cards · 3D Perspective · Expiration Accent · Frosted Callout
  // ─────────────────────────────────────────────────────────────
  function initNewLawHeroTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[NewLawHeroTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const heroSec       = document.getElementById('newlaw-hero');
      const eyebrow       = document.getElementById('newlaw-eyebrow');
      const dateStamp     = document.getElementById('newlaw-date-stamp');
      const headline      = document.getElementById('newlaw-headline');
      const lede          = document.getElementById('newlaw-lede');
      const versusWrap    = document.getElementById('newlaw-versus');
      const cardPerm      = document.getElementById('newlaw-card-perm');
      const cardTemp      = document.getElementById('newlaw-card-temp');
      const honestCallout = document.getElementById('newlaw-honest-headline');
      const ctaPrimary    = document.getElementById('newlaw-cta-primary');
      const ctaSecondary  = document.getElementById('newlaw-cta-secondary');

      if (!heroSec || !cardPerm || !cardTemp) return;

      const badges = [eyebrow, dateStamp].filter(Boolean);
      const cards  = [cardPerm, cardTemp].filter(Boolean);
      const ctas   = [ctaPrimary, ctaSecondary].filter(Boolean);
      const allEls = [
        ...badges, headline, lede, ...cards, honestCallout, ...ctas
      ].filter(Boolean);

      // ── MOBILE OR REDUCED-MOTION FALLBACK ─────────────────────────
      if (!isDesktop) {
        gsap.set(allEls, { clearProps: 'all' });
        gsap.fromTo([headline, lede, ...cards, honestCallout].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out',
            scrollTrigger: {
              trigger: heroSec,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return function () {
          gsap.set(allEls, { clearProps: 'all' });
        };
      }

      // ── DESKTOP CHOREOGRAPHY ─────────────────────────────────────
      // Initial states
      if (badges.length) {
        gsap.set(badges, { y: 16, opacity: 0, letterSpacing: '0.08em' });
      }
      if (headline)      gsap.set(headline, { y: 35, opacity: 0 });
      if (lede)          gsap.set(lede,     { y: 20, opacity: 0 });
      if (cards.length) {
        gsap.set(cards, {
          y: 40,
          opacity: 0,
          rotationX: -6,
          transformPerspective: 1200,
          transformOrigin: '50% 0%'
        });
      }
      if (honestCallout) gsap.set(honestCallout, { y: 26, opacity: 0 });
      if (ctaPrimary)    gsap.set(ctaPrimary,    { scale: 0.96, opacity: 0, y: 15 });
      if (ctaSecondary)  gsap.set(ctaSecondary,  { opacity: 0, y: 15 });

      // Master coordinated timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:             heroSec,
          start:               'top 80%',
          toggleActions:       'play none none reverse',
          invalidateOnRefresh: true,
          id:                  'newlaw-hero-entrance'
        }
      });

      // 1. Verification badge & eyebrow drift with letter-spacing tracking expansion (0.08em to 0.14em)
      if (badges.length) {
        tl.to(badges, {
          y: 0,
          opacity: 1,
          letterSpacing: '0.14em',
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out'
        });
      }

      // 2. High-contrast masked headline reveal slide
      if (headline) {
        tl.to(headline, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out'
        }, '-=0.45');
      }

      // Lede copy float
      if (lede) {
        tl.to(lede, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out'
        }, '-=0.5');
      }

      // 3. Dual Policy Cards Stagger & Synchronized 3D Perspective Settle
      if (cards.length) {
        tl.to(cards, {
          y: 0,
          opacity: 1,
          rotationX: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'back.out(1.4)'
        }, '-=0.35');
      }

      // 4. Reality Check Frosted Callout Card Reveal
      if (honestCallout) {
        tl.to(honestCallout, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.3');
      }

      // 5. Yellow CTA button spring bounce + Secondary outline button
      if (ctaPrimary) {
        tl.to(ctaPrimary, {
          scale: 1.0,
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'back.out(1.8)'
        }, '-=0.25');
      }

      if (ctaSecondary) {
        tl.to(ctaSecondary, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.4');
      }

      // ── Teardown ──
      return function () {
        gsap.set(allEls, { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NEW LAW — INDIVIDUAL DEDUCTIONS SECTION
  // 2x2 Matrix Stagger · Illuminated Tags · Schedule 1-A Callout
  // ─────────────────────────────────────────────────────────────
  function initIndividualDeductionsTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[IndividualDeductionsTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const sec            = document.getElementById('indiv-section');
      const eyebrow        = document.getElementById('indiv-eyebrow');
      const headline       = document.getElementById('indiv-headline');
      const lede           = document.getElementById('indiv-lede');
      const cardTips       = document.getElementById('indiv-card-tips');
      const cardOvertime   = document.getElementById('indiv-card-overtime');
      const cardCarloan    = document.getElementById('indiv-card-carloan');
      const cardSenior     = document.getElementById('indiv-card-senior');
      const sched1aCallout = document.getElementById('indiv-sched1a-callout');

      if (!sec || !cardTips || !cardOvertime || !cardCarloan || !cardSenior) return;

      const row1Cards = [cardTips, cardOvertime];
      const row2Cards = [cardCarloan, cardSenior];
      const allCards  = [...row1Cards, ...row2Cards];
      const tags      = Array.from(sec.querySelectorAll('.indiv-tag'));
      const headerEls = [eyebrow, headline, lede].filter(Boolean);
      const allEls    = [...headerEls, ...allCards, sched1aCallout].filter(Boolean);

      // ── MOBILE OR REDUCED-MOTION FALLBACK ─────────────────────────
      if (!isDesktop) {
        gsap.set(allEls, { clearProps: 'all' });
        gsap.fromTo([...headerEls, ...allCards, sched1aCallout].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return function () {
          gsap.set(allEls, { clearProps: 'all' });
          tags.forEach(t => t.classList.remove('is-illuminated'));
        };
      }

      // ── DESKTOP CHOREOGRAPHY ─────────────────────────────────────
      // Initial states
      if (eyebrow)          gsap.set(eyebrow,        { y: 25, opacity: 0 });
      if (headline)         gsap.set(headline,       { y: 25, opacity: 0 });
      if (lede)             gsap.set(lede,           { y: 18, opacity: 0 });
      if (row1Cards.length) gsap.set(row1Cards,      { y: 30, opacity: 0 });
      if (row2Cards.length) gsap.set(row2Cards,      { y: 30, opacity: 0 });
      if (sched1aCallout)   gsap.set(sched1aCallout, { scale: 0.98, y: 20, opacity: 0 });

      // Master coordinated timeline (triggers at 75% of viewport)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:             sec,
          start:               'top 75%',
          toggleActions:       'play none none reverse',
          invalidateOnRefresh: true,
          id:                  'indiv-deductions-entrance',
          onLeaveBack: () => {
            tags.forEach(t => t.classList.remove('is-illuminated'));
          }
        }
      });

      // 1. Viewport Arrival & Masked Header Reveal
      tl.to([eyebrow, headline].filter(Boolean), {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out'
      });

      if (lede) {
        tl.to(lede, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out'
        }, '-=0.4');
      }

      // 2. 2x2 Deduction Matrix Stagger (Alternating cross-axis sequence)
      // Row 1: Tips & Overtime
      tl.to(row1Cards, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power2.out'
      }, '-=0.25');

      // Row 2: Car loan interest & Senior deduction
      tl.to(row2Cards, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power2.out'
      }, '-=0.45');

      // Expiration tags illuminate with soft warning yellow accent before settling
      tl.add(() => {
        tags.forEach(t => t.classList.add('is-illuminated'));
        gsap.delayedCall(0.9, () => {
          tags.forEach(t => t.classList.remove('is-illuminated'));
        });
      }, '-=0.35');

      // 3. Schedule 1-A Callout Docking (Elevated scale pop)
      if (sched1aCallout) {
        tl.to(sched1aCallout, {
          scale: 1.0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.6)'
        }, '-=0.25');
      }

      // ── Teardown ──
      return function () {
        gsap.set(allEls, { clearProps: 'all' });
        tags.forEach(t => t.classList.remove('is-illuminated'));
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NEW LAW — LEGISLATIVE POLICY MATRIX & CLOSED PROVISIONS
  // 2x2 Policy Grid · Status Tags Illumination · Sunset Accent Beam
  // ─────────────────────────────────────────────────────────────
  function initLegislativePolicyMatrixTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[LegislativePolicyMatrixTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const matrixGrid    = document.getElementById('policy-matrix-grid');
      const cardSalt      = document.getElementById('policy-card-salt');
      const cardRates     = document.getElementById('policy-card-rates');
      const cardCtc       = document.getElementById('policy-card-ctc');
      const cardCharity   = document.getElementById('policy-card-charity');
      const sunsetBanner  = document.getElementById('sunset-alert-banner');
      const sunsetBeam    = document.getElementById('sunset-accent-beam');
      const sunsetEyebrow = document.getElementById('sunset-eyebrow');

      if (!matrixGrid || !cardSalt || !cardRates || !cardCtc || !cardCharity) return;

      const row1Cards = [cardSalt, cardRates];
      const row2Cards = [cardCtc, cardCharity];
      const allCards  = [...row1Cards, ...row2Cards];
      const permTags  = Array.from(matrixGrid.querySelectorAll('.policy-tag-perm'));
      const warnTags  = Array.from(matrixGrid.querySelectorAll('.policy-tag-reverts, .policy-tag-new'));
      const allTags   = [...permTags, ...warnTags];

      // ── MOBILE OR REDUCED-MOTION FALLBACK ─────────────────────────
      if (!isDesktop) {
        gsap.set(allCards, { clearProps: 'all' });
        if (sunsetBanner)  gsap.set(sunsetBanner,  { clearProps: 'all' });
        if (sunsetBeam)    gsap.set(sunsetBeam,    { scaleY: 1 });
        if (sunsetEyebrow) gsap.set(sunsetEyebrow, { clearProps: 'all' });

        gsap.fromTo(allCards,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out',
            scrollTrigger: {
              trigger: matrixGrid,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return function () {
          gsap.set([...allCards, sunsetBanner, sunsetEyebrow].filter(Boolean), { clearProps: 'all' });
          allTags.forEach(t => t.classList.remove('is-illuminated'));
        };
      }

      // ── DESKTOP CHOREOGRAPHY ─────────────────────────────────────
      // Initial states
      if (row1Cards.length) gsap.set(row1Cards,    { y: 30, opacity: 0 });
      if (row2Cards.length) gsap.set(row2Cards,    { y: 30, opacity: 0 });
      if (sunsetBanner)     gsap.set(sunsetBanner, { y: 22, opacity: 0 });
      if (sunsetBeam)       gsap.set(sunsetBeam,   { scaleY: 0 });
      if (sunsetEyebrow)    gsap.set(sunsetEyebrow, { letterSpacing: '0.08em', opacity: 0 });

      // 1. Coordinated 2x2 Grid Viewport Arrival (triggers at 75% of viewport)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:             matrixGrid,
          start:               'top 75%',
          toggleActions:       'play none none reverse',
          invalidateOnRefresh: true,
          id:                  'policy-matrix-entrance',
          onLeaveBack: () => {
            allTags.forEach(t => t.classList.remove('is-illuminated'));
          }
        }
      });

      // Row 1: Card 1 (SALT) & Card 2 (Rates)
      tl.to(row1Cards, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out'
      });

      // Row 2: Card 3 (Child tax credit) & Card 4 (Charitable giving)
      tl.to(row2Cards, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out'
      }, '-=0.45');

      // Status badges illuminate upon arrival:
      // "PERMANENT" in brand cyan (#019FFF)
      // "THEN REVERTS" and "NEW IN 2026" in accent yellow (#EAE42F)
      tl.add(() => {
        allTags.forEach(t => t.classList.add('is-illuminated'));
        gsap.delayedCall(1.0, () => {
          allTags.forEach(t => t.classList.remove('is-illuminated'));
        });
      }, '-=0.35');

      // 2. Sunset Alert Banner ("CREDITS THAT HAVE ALREADY CLOSED")
      if (sunsetBanner) {
        const sunsetTl = gsap.timeline({
          scrollTrigger: {
            trigger:             sunsetBanner,
            start:               'top 85%',
            toggleActions:       'play none none reverse',
            invalidateOnRefresh: true,
            id:                  'sunset-banner-entrance'
          }
        });

        // Banner surface entrance
        sunsetTl.to(sunsetBanner, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        });

        // Amber left accent border drawing downward (scaleY: 0 to 1)
        if (sunsetBeam) {
          sunsetTl.to(sunsetBeam, {
            scaleY: 1,
            duration: 0.8,
            ease: 'power2.inOut'
          }, '-=0.45');
        }

        // Eyebrow uppercase letter-tracking expansion (0.08em to 0.14em)
        if (sunsetEyebrow) {
          sunsetTl.to(sunsetEyebrow, {
            letterSpacing: '0.14em',
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out'
          }, '-=0.6');
        }
      }

      // ── Teardown ──
      return function () {
        gsap.set([...allCards, sunsetBanner, sunsetEyebrow].filter(Boolean), { clearProps: 'all' });
        if (sunsetBeam) gsap.set(sunsetBeam, { scaleY: 0 });
        allTags.forEach(t => t.classList.remove('is-illuminated'));
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NEW LAW — CONSULTATION PINNED SPLIT STAGE
  // Elevated Rounded Sheet · Parallax Photo Scaling · Divider Sweeps
  // ─────────────────────────────────────────────────────────────
  function initConsultationSplitTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[ConsultationSplitTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const pinnedStage = document.getElementById('counsel-pinned-stage');
      const splitSec    = document.getElementById('counsel-split');
      const imgCol      = document.getElementById('counsel-img-col');
      const photoImg    = document.getElementById('counsel-img');
      const eyebrow     = document.getElementById('counsel-eyebrow');
      const headline    = document.getElementById('counsel-headline');
      const narrative   = document.getElementById('counsel-narrative');
      const dividers    = Array.from(document.querySelectorAll('.counsel-divider'));
      const itemTexts   = Array.from(document.querySelectorAll('.counsel-item-content'));
      const ctaBtn      = document.getElementById('counsel-cta');

      if (!pinnedStage || !splitSec || !photoImg) return;

      const rightTypo = [eyebrow, headline, narrative].filter(Boolean);
      const allRightEls = [...rightTypo, ...dividers, ...itemTexts, ctaBtn].filter(Boolean);

      // ── MOBILE OR REDUCED-MOTION FALLBACK ─────────────────────────
      if (!isDesktop) {
        gsap.set([photoImg, ...allRightEls], { clearProps: 'all' });
        dividers.forEach(d => gsap.set(d, { scaleX: 1 }));

        gsap.fromTo(allRightEls,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out',
            scrollTrigger: {
              trigger: splitSec,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return function () {
          gsap.set([photoImg, ...allRightEls], { clearProps: 'all' });
        };
      }

      // ── DESKTOP CHOREOGRAPHY ─────────────────────────────────────
      // Initial states
      gsap.set(photoImg, { scale: 1.08, y: -40, force3D: true });
      if (headline)  gsap.set(headline,  { y: 25, opacity: 0 });
      if (narrative) gsap.set(narrative, { y: 20, opacity: 0 });
      if (dividers.length)  gsap.set(dividers,  { scaleX: 0 });
      if (itemTexts.length) gsap.set(itemTexts, { x: -20, opacity: 0 });
      if (ctaBtn)    gsap.set(ctaBtn,    { scale: 0.96, opacity: 0, y: 15 });

      // Pinned Scrub Timeline (pin: true, scrub: 1.1, anticipatePin: 1, +=110vh)
      const topbarEl = document.querySelector('.topbar');
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger:             pinnedStage,
          start:               () => 'top ' + (topbarEl ? topbarEl.offsetHeight : 68) + 'px',
          end:                 '+=110vh',
          pin:                 true,
          scrub:               1.1,
          anticipatePin:       1,
          invalidateOnRefresh: true,
          id:                  'counsel-split-pin'
        }
      });

      // 1. Photographic Parallax & Scaling (scale: 1.08 -> 1.0, y: -40px -> 0px)
      pinTl.to(photoImg, {
        scale:    1.0,
        y:        0,
        ease:     'none',
        duration: 1
      }, 0);

      // 2. Headline & Intro narrative dock cleanly into view
      if (headline) {
        pinTl.to(headline, {
          y:        0,
          opacity:  1,
          duration: 0.35,
          ease:     'power3.out'
        }, 0.08);
      }

      if (narrative) {
        pinTl.to(narrative, {
          y:        0,
          opacity:  1,
          duration: 0.35,
          ease:     'power2.out'
        }, 0.16);
      }

      // 3. The 3 hairline dividers draw across from left to right (scaleX: 0 to 1)
      if (dividers.length) {
        pinTl.to(dividers, {
          scaleX:   1,
          stagger:  0.08,
          duration: 0.45,
          ease:     'power2.inOut'
        }, 0.28);
      }

      // 4. The 3 checklist items reveal with a horizontal stagger (x: -20px to 0)
      if (itemTexts.length) {
        pinTl.to(itemTexts, {
          x:        0,
          opacity:  1,
          stagger:  0.08,
          duration: 0.42,
          ease:     'power2.out'
        }, 0.32);
      }

      // 5. Yellow CTA button entrance with subtle spring bounce
      if (ctaBtn) {
        pinTl.to(ctaBtn, {
          scale:    1.0,
          opacity:  1,
          y:        0,
          duration: 0.35,
          ease:     'back.out(1.5)'
        }, 0.62);
      }

      // ── Teardown ──
      return function () {
        gsap.set([photoImg, ...allRightEls], { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NEW LAW — BUSINESS REFORMS SECTION
  // Pinned Stage · 3x2 Matrix Cascade · Tag Illumination · Hover Physics
  // ─────────────────────────────────────────────────────────────
  function initBusinessReformsTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[BusinessReformsTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1100px) and (prefers-reduced-motion: no-preference)',
      isTabletOrMobile:  '(max-width: 1099px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      const sec          = document.getElementById('biz-reforms-section');
      const eyebrow      = document.getElementById('biz-eyebrow');
      const headline     = document.getElementById('biz-headline');
      const lede         = document.getElementById('biz-lede');
      const grid         = document.getElementById('biz-grid');
      const cardDeprec   = document.getElementById('biz-card-deprec');
      const cardSec179   = document.getElementById('biz-card-sec179');
      const cardRd       = document.getElementById('biz-card-rd');
      const card199a     = document.getElementById('biz-card-199a');
      const cardQsbs     = document.getElementById('biz-card-qsbs');
      const card1099     = document.getElementById('biz-card-1099');

      if (!sec || !grid || !cardDeprec || !cardSec179 || !cardRd || !card199a || !cardQsbs || !card1099) return;

      const topRowCards    = [cardDeprec, cardSec179, cardRd];
      const bottomRowCards = [card199a, cardQsbs, card1099];
      const allCards       = [...topRowCards, ...bottomRowCards];
      const permTags       = Array.from(sec.querySelectorAll('.biz-tag .tag-perm'));
      const dateTags       = Array.from(sec.querySelectorAll('.biz-tag .tag-date'));
      const headerEls      = [eyebrow, headline, lede].filter(Boolean);
      const allAnimatable  = [...headerEls, ...allCards];

      // ── MOBILE OR REDUCED-MOTION FALLBACK ─────────────────────────
      if (!isDesktop) {
        gsap.set(allAnimatable, { clearProps: 'all' });
        permTags.forEach(t => t.classList.remove('is-illuminated'));
        dateTags.forEach(t => t.classList.remove('is-illuminated'));

        gsap.fromTo([...headerEls, ...allCards],
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return function () {
          gsap.set(allAnimatable, { clearProps: 'all' });
        };
      }

      // ── DESKTOP PINNED SEQUENCE (>= 1100px) ──────────────────────
      // Initial states
      if (eyebrow)  gsap.set(eyebrow,  { y: 25, opacity: 0 });
      if (headline) gsap.set(headline, { y: 25, opacity: 0 });
      if (lede)     gsap.set(lede,     { y: 18, opacity: 0 });
      gsap.set(topRowCards,    { y: 35, opacity: 0, force3D: true });
      gsap.set(bottomRowCards, { y: 35, opacity: 0, force3D: true });

      const topbarEl = document.querySelector('.topbar');

      // Pinned scrub timeline: pin for +=100vh
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger:             sec,
          start:               () => 'top ' + (topbarEl ? topbarEl.offsetHeight : 68) + 'px',
          end:                 '+=100vh',
          pin:                 true,
          scrub:               1.1,
          anticipatePin:       1,
          invalidateOnRefresh: true,
          id:                  'biz-reforms-pin',
          onLeaveBack: () => {
            permTags.forEach(t => t.classList.remove('is-illuminated'));
            dateTags.forEach(t => t.classList.remove('is-illuminated'));
          }
        }
      });

      // 1. Eyebrow and headline masked glide reveal (y: 25px -> 0, opacity: 0 -> 1)
      pinTl.to([eyebrow, headline].filter(Boolean), {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out'
      }, 0);

      if (lede) {
        pinTl.to(lede, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out'
        }, 0.1);
      }

      // 2. 3x2 Matrix Cascade
      // Wave 1: Top Row (Cards 1, 2, 3) glides in from y: 35px -> 0px (stagger: 0.08s)
      pinTl.to(topRowCards, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power3.out',
        force3D: true
      }, 0.22);

      // Wave 2: Bottom Row (Cards 4, 5, 6) follows seamlessly with 0.12s offset
      pinTl.to(bottomRowCards, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power3.out',
        force3D: true
      }, 0.34);

      // Status tags illuminate upon arrival:
      // PERMANENT in cyan (#019FFF), Dates in accent yellow (#EAE42F)
      pinTl.add(() => {
        permTags.forEach(t => t.classList.add('is-illuminated'));
        dateTags.forEach(t => t.classList.add('is-illuminated'));

        gsap.delayedCall(1.1, () => {
          permTags.forEach(t => t.classList.remove('is-illuminated'));
          dateTags.forEach(t => t.classList.remove('is-illuminated'));
        });
      }, 0.55);

      // ── Cleanup ──
      return function () {
        gsap.set(allAnimatable, { clearProps: 'all' });
        permTags.forEach(t => t.classList.remove('is-illuminated'));
        dateTags.forEach(t => t.classList.remove('is-illuminated'));
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // NEW LAW — BUSINESS ADDENDA INTO STATE NON-CONFORMITY WIPE
  // Warning Banner & 3-Card Stagger · Pinned White Sheet Wipe (+=80vh)
  // ─────────────────────────────────────────────────────────────
  function initBusinessAddendaStateWipe() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[BusinessAddendaStateWipe] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const wrapper     = document.getElementById('state-wipe-wrapper');
    const darkStage   = document.getElementById('biz-addenda-stage');
    const shutWindow  = document.getElementById('biz-shut-window');
    const cardsGrid   = document.getElementById('biz-addenda-grid');
    const cards       = Array.from(document.querySelectorAll('.biz-addenda-card'));
    const whiteSheet  = document.getElementById('state-white-sheet');
    const sheetInner  = document.getElementById('state-sheet-inner');
    const eyebrow     = document.getElementById('state-eyebrow');
    const headline    = document.getElementById('state-headline');
    const lede        = document.getElementById('state-lede');
    const splitSec    = document.getElementById('state-split');
    const splitCopy   = document.getElementById('state-split-copy');
    const splitCallout = document.getElementById('state-split-callout');

    if (!darkStage || !whiteSheet || !cardsGrid) return;

    const darkTargets = [shutWindow, ...cards].filter(Boolean);
    const whiteStaggerTargets = [eyebrow, headline, lede, splitCopy, splitCallout].filter(Boolean);

    // ── 1. DARK STAGE ENTRANCE CASCADE (Trigger: top 75%) ──
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger:             darkStage,
        start:               'top 75%',
        toggleActions:       'play none none reverse',
        invalidateOnRefresh: true,
        id:                  'biz-addenda-entrance'
      }
    });

    if (shutWindow) {
      entranceTl.fromTo(shutWindow,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out'
        }, 0
      );
    }

    if (cards.length) {
      entranceTl.fromTo(cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          force3D: true
        }, 0.12
      );
    }

    // ── 2. PINNED SHEET WIPE VIA MATCHMEDIA ──────────────────────
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 1023px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      if (!isDesktop) {
        gsap.set([whiteSheet, ...whiteStaggerTargets], { clearProps: 'all' });
        gsap.fromTo(whiteStaggerTargets,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: whiteSheet,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
        return function () {
          gsap.set([whiteSheet, ...whiteStaggerTargets], { clearProps: 'all' });
        };
      }

      // Initial state: white sheet starts completely below (yPercent: 100)
      gsap.set(whiteSheet, { yPercent: 100, force3D: true });
      if (whiteStaggerTargets.length) {
        gsap.set(whiteStaggerTargets, { y: 30, opacity: 0 });
      }

      const stageTarget = wrapper || darkStage;

      // Pinned scrub timeline: pin dark stage for +=80vh
      const wipeTl = gsap.timeline({
        scrollTrigger: {
          trigger:             stageTarget,
          start:               'bottom bottom',
          end:                 '+=80vh',
          pin:                 true,
          scrub:               1.1,
          anticipatePin:       1,
          invalidateOnRefresh: true,
          id:                  'state-sheet-wipe'
        }
      });

      // Dark stage content recedes slightly for depth (scale: 0.97, opacity: 0.35, y: -30)
      if (darkTargets.length) {
        wipeTl.to(darkTargets, {
          scale:    0.97,
          opacity:  0.35,
          y:        -30,
          ease:     'none',
          stagger:  0.02
        }, 0);
      }

      // Incoming white sheet slides smoothly from yPercent: 100 to yPercent: 0 directly over dark stage
      wipeTl.to(whiteSheet, {
        yPercent: 0,
        ease:     'none',
        force3D:  true
      }, 0);

      // As the white sheet locks into place, stagger internal elements upward
      if (whiteStaggerTargets.length) {
        wipeTl.to(whiteStaggerTargets, {
          y:        0,
          opacity:  1,
          stagger:  0.08,
          duration: 0.35,
          ease:     'power3.out'
        }, 0.55);
      }

      return function () {
        gsap.set([darkStage, whiteSheet, ...darkTargets, ...whiteStaggerTargets], { clearProps: 'all' });
      };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // IRS DOCUMENT PARALLAX & STRATEGIC PLAYBOOK TRANSITION
  // Pinned Document · Paper Parallax · Masked Typography · Tactical Card Cascade
  // ─────────────────────────────────────────────────────────────
  function initDocStrategicTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[DocStrategicTransition] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const banner        = document.getElementById('doc-pinned-banner');
    const stage         = document.getElementById('playbook-stage');
    if (!banner || !stage) return;

    const bgParallax    = document.getElementById('doc-banner-parallax');
    const bannerContent = document.getElementById('doc-banner-content');
    const eyebrow       = document.getElementById('playbook-eyebrow');
    const headline      = document.getElementById('playbook-headline');
    const lede          = document.getElementById('playbook-lede');
    const cards         = stage.querySelectorAll('.playbook-card');
    const tag1          = document.getElementById('move-tag-1');
    const tag2          = document.getElementById('move-tag-2');

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 899px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop } = context.conditions;

      if (!isDesktop) {
        // Fallback for mobile and prefers-reduced-motion
        gsap.set([bgParallax, bannerContent, eyebrow, headline, lede, ...cards], { clearProps: 'all' });
        
        // Gentle mobile entrance without pinning
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger:       stage,
            start:         'top 85%',
            toggleActions: 'play none none none'
          }
        });

        mobileTl.fromTo([eyebrow, headline, lede].filter(Boolean),
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
        );

        if (cards.length) {
          mobileTl.fromTo(cards,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
          );
        }

        return function () {
          gsap.set([bgParallax, bannerContent, eyebrow, headline, lede, ...cards], { clearProps: 'all' });
        };
      }

      // ─────────────────────────────────────────────────────────
      // 1. IRS DOCUMENT PARALLAX & PINNED REVEAL (Pin for +=75vh)
      // ─────────────────────────────────────────────────────────
      const docTl = gsap.timeline({
        scrollTrigger: {
          trigger:             banner,
          start:               'top top',
          end:                 '+=75vh',
          pin:                 true,
          pinSpacing:          false,
          scrub:               1.1,
          anticipatePin:       1,
          invalidateOnRefresh: true,
          id:                  'doc-banner-parallax-pin'
        }
      });

      // Angled IRS Form 1040/1120 background glides upward on a deeper parallax plane
      // yPercent: -18, scale: 1.05 to 1.0
      if (bgParallax) {
        docTl.fromTo(bgParallax,
          { yPercent: 0, scale: 1.05 },
          { yPercent: -18, scale: 1.0, ease: 'none', force3D: true },
          0
        );
      }

      // Headline text & yellow accent copy lock in place at the top of viewport before fading to opacity: 0.3
      if (bannerContent) {
        docTl.to(bannerContent, {
          opacity: 0.3,
          ease:    'power1.out',
          force3D: true
        }, 0.3);
      }

      // ─────────────────────────────────────────────────────────
      // 2. PLAYBOOK STAGE ENTRANCE & 3. TACTICAL CARD CASCADE
      // As pin completes, slide "What to actually do about it" section up over document texture
      // ─────────────────────────────────────────────────────────
      const stageTl = gsap.timeline({
        scrollTrigger: {
          trigger:             stage,
          start:               'top 75%',
          toggleActions:       'play none none reverse',
          invalidateOnRefresh: true,
          id:                  'playbook-stage-entrance'
        }
      });

      // Masked upward drift for eyebrow & headline (y: 25px to 0, opacity: 0 to 1, ease: "power3.out")
      const headerTargets = [eyebrow, headline, lede].filter(Boolean);
      if (headerTargets.length) {
        gsap.set(headerTargets, { y: 25, opacity: 0 });
        stageTl.to(headerTargets, {
          y:        0,
          opacity:  1,
          stagger:  0.08,
          duration: 0.65,
          ease:     'power3.out'
        }, 0);
      }

      // Tactical cards cascade: alternating slide (stagger: 0.1s, y: 35px to 0, opacity: 0 to 1, ease: "back.out(1.4)")
      if (cards.length) {
        gsap.set(cards, { y: 35, opacity: 0 });
        stageTl.to(cards, {
          y:        0,
          opacity:  1,
          stagger:  0.1,
          duration: 0.75,
          ease:     'back.out(1.4)',
          force3D:  true
        }, 0.2);
      }

      // Monospace year tags ("2026" & "2026-2028") illuminate in brand cyan (#019FFF) and accent yellow (#EAE42F)
      if (tag1) {
        stageTl.fromTo(tag1,
          { color: '#68899A', borderColor: 'transparent', boxShadow: 'none' },
          {
            color:       '#019FFF',
            borderColor: 'rgba(1, 159, 255, 0.4)',
            boxShadow:   '0 0 14px rgba(1, 159, 255, 0.35)',
            duration:    0.45,
            ease:        'power2.out'
          },
          0.45
        );
      }

      if (tag2) {
        stageTl.fromTo(tag2,
          { color: '#68899A', borderColor: 'transparent', boxShadow: 'none' },
          {
            color:       '#EAE42F',
            borderColor: 'rgba(234, 228, 47, 0.4)',
            boxShadow:   '0 0 14px rgba(234, 228, 47, 0.35)',
            duration:    0.45,
            ease:        'power2.out'
          },
          0.55
        );
      }

      return function () {
        gsap.set([bgParallax, bannerContent, eyebrow, headline, lede, ...cards], { clearProps: 'all' });
      };
    });
  }

  
  // ─────────────────────────────────────────────────────────────
  // BUSINESS PAGE: KINETIC HERO, 3D PACKAGE CASCADE & TABLE FLOW
  // ─────────────────────────────────────────────────────────────
  
  // ─────────────────────────────────────────────────────────────
  // TAX RESOURCES: COMPREHENSIVE SCROLL CHOREOGRAPHY
  // Hero · Parallax Band · Deadlines · Reference Figures · Cards
  // Checklists · Official Tools · Uncle Pat Quote · Callout
  // ─────────────────────────────────────────────────────────────
  function initResourcesTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── DOM References ──────────────────────────────────────────
    const heroSechead   = document.querySelector('#main > section.tight:first-child .sechead');
    const imgband       = document.querySelector('#main .imgband');
    const calendarSec   = document.querySelector('#main section.night.tight');
    const datesSection  = calendarSec ? calendarSec.querySelector('.dates') : null;
    const calSechead    = calendarSec ? calendarSec.querySelector('.sechead') : null;
    const figsSec       = document.querySelector('#main .figcols');
    const figsTables    = document.querySelectorAll('#main .figcols .figs');
    const figSechead    = figsSec ? figsSec.closest('section')?.querySelector('.sechead') : null;
    const explainSec    = document.querySelectorAll('#main section.night.tight')[1];
    const explainSechead = explainSec ? explainSec.querySelector('.sechead') : null;
    const explainCards  = document.querySelectorAll('#main section.night.tight .card');
    const patsays       = document.querySelector('#main .patsays');
    const checkSec      = document.querySelector('#main section:not(.tight):not(.night) .split');
    const checkSechead  = checkSec ? checkSec.closest('section')?.querySelector('.sechead') : null;
    const tickLists     = document.querySelectorAll('#main .ticks');
    const toolsSec      = document.querySelector('#main .res');
    const toolsSechead  = toolsSec ? toolsSec.closest('section')?.querySelector('.sechead') : null;
    const toolsLinks    = document.querySelectorAll('#main .res a');
    const callout       = document.querySelector('#main .callout');

    if (!heroSechead && !datesSection && !imgband) return;

    // ── 1. HERO ENTRANCE — staggered children float up ──────────
    if (heroSechead) {
      gsap.fromTo(heroSechead.children,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, duration: 0.7, ease: 'power3.out' }
      );
    }

    // ── 2. IMAGE BAND PARALLAX + inner text reveal ───────────────
    if (imgband) {
      gsap.fromTo(imgband,
        { backgroundPositionY: '65%' },
        {
          backgroundPositionY: '35%',
          ease: 'none',
          scrollTrigger: { trigger: imgband, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
      // Inner text: translate-only (no opacity) so text is never invisible
      const inner = imgband.querySelector('.imgband-inner');
      if (inner) {
        gsap.fromTo(Array.from(inner.children),
          { y: 18 },
          {
            y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: {
              trigger: imgband, start: 'top 90%', toggleActions: 'play none none none',
              onEnter: () => ScrollTrigger.refresh()
            }
          }
        );
      }
    }

    // ── 3. CALENDAR SECTION SECHEAD ─────────────────────────────
    if (calSechead) {
      gsap.fromTo(calSechead.children,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: calSechead, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    // ── 4. DEADLINE ITEMS — slide in left + gold pulse on .soon ──
    if (datesSection) {
      const dateItems = datesSection.querySelectorAll('.d');
      if (dateItems.length) {
        gsap.fromTo(dateItems,
          { x: -28, opacity: 0 },
          {
            x: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'back.out(1.2)',
            scrollTrigger: { trigger: datesSection, start: 'top 82%', toggleActions: 'play none none none' }
          }
        );
        // Gold ambient pulse on upcoming (.soon) items
        const soonItems = datesSection.querySelectorAll('.d.soon');
        soonItems.forEach(item => {
          gsap.fromTo(item,
            { boxShadow: '0 0 0px rgba(234, 228, 47, 0)' },
            { boxShadow: '0 0 20px rgba(234, 228, 47, 0.25)', duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }
          );
        });
      }
    }

    // ── 5. REFERENCE FIGURES SECHEAD ────────────────────────────
    if (figSechead) {
      gsap.fromTo(figSechead.children,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: figSechead, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    // ── 6. REFERENCE FIGURES TABLES — left column first, then right ──
    if (figsTables.length) {
      const leftTables  = Array.from(figsTables).filter((_, i) => i < Math.ceil(figsTables.length / 2));
      const rightTables = Array.from(figsTables).filter((_, i) => i >= Math.ceil(figsTables.length / 2));

      if (leftTables.length) {
        gsap.fromTo(leftTables,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: leftTables[0], start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }
      if (rightTables.length) {
        gsap.fromTo(rightTables,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: rightTables[0], start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }

      // Row highlight shimmer on each table
      figsTables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          row.addEventListener('mouseenter', () => {
            gsap.to(row, { backgroundColor: 'rgba(1, 159, 255, 0.06)', duration: 0.18, ease: 'power1.out', overwrite: 'auto' });
          });
          row.addEventListener('mouseleave', () => {
            gsap.to(row, { backgroundColor: 'rgba(0, 0, 0, 0)', duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
          });
        });
      });
    }

    // ── 7. PLAIN ENGLISH SECHEAD ─────────────────────────────────
    if (explainSechead) {
      gsap.fromTo(explainSechead.children,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: explainSechead, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    // ── 8. EXPLAINER CARDS — 3D cascade with hover lift ─────────
    if (explainCards.length) {
      gsap.fromTo(explainCards,
        { y: 38, opacity: 0, scale: 0.96, rotationX: -4, transformPerspective: 900, transformOrigin: '50% 0%' },
        {
          y: 0, opacity: 1, scale: 1, rotationX: 0, stagger: 0.09, duration: 0.65, ease: 'back.out(1.3)',
          scrollTrigger: { trigger: explainCards[0], start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
      explainCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -7, boxShadow: '0 20px 40px -8px rgba(1, 159, 255, 0.22)', borderColor: '#019FFF', duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, boxShadow: '', borderColor: '', duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
        });
      });
    }

    // ── 9. UNCLE PAT QUOTE — slide in from left ─────────────────
    if (patsays) {
      gsap.fromTo(patsays,
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: patsays, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    }

    // ── 10. CHECKLIST SECTION SECHEAD ───────────────────────────
    if (checkSechead) {
      gsap.fromTo(checkSechead.children,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: checkSechead, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    // ── 11. CHECKLIST TICK ITEMS — reveal stagger ───────────────
    tickLists.forEach(list => {
      const items = list.querySelectorAll('li');
      if (!items.length) return;
      gsap.fromTo(items,
        { x: -20, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.05, duration: 0.45, ease: 'power2.out',
          scrollTrigger: { trigger: list, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    // ── 12. OFFICIAL TOOLS SECHEAD ──────────────────────────────
    if (toolsSechead) {
      gsap.fromTo(toolsSechead.children,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: toolsSechead, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    // ── 13. OFFICIAL TOOLS LINKS — staggered cascade + hover ────
    if (toolsLinks.length) {
      gsap.fromTo(toolsLinks,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: toolsSec, start: 'top 83%', toggleActions: 'play none none none' }
        }
      );
      toolsLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          gsap.to(link, { x: 6, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
        });
        link.addEventListener('mouseleave', () => {
          gsap.to(link, { x: 0, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
        });
      });
    }

    // ── 14. DISCLAIMER CALLOUT — fade up ────────────────────────
    if (callout) {
      gsap.fromTo(callout,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: callout, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  function initBusinessTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const hero = document.querySelector('#main > section.night.tight');
    const pkgsContainer = document.querySelector('.pkgs');
    const bridge = document.querySelector('.bridge');
    if (!pkgsContainer && !bridge) return;

    // 1. Hero Stagger Entrance
    if (hero) {
      const sechead = hero.querySelector('.sechead');
      if (sechead) {
        gsap.fromTo(sechead.children,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
        );
      }
    }

    // 2. Conversion Advantage Bridge (Elevated Sheet Reveal)
    if (bridge) {
      gsap.fromTo(bridge,
        { y: 45, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: bridge,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // 3. Monthly Bookkeeping Packages (Staggered Cascade & 3D Hover Physics)
    if (pkgsContainer) {
      const cards = pkgsContainer.querySelectorAll('.pkg');
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 55, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: pkgsContainer,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );

        cards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              scale: 1.015,
              boxShadow: '0 20px 42px -10px rgba(1,159,255,0.22), 0 0 0 1px #019FFF',
              borderColor: '#019FFF',
              duration: 0.28,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              boxShadow: '0 4px 16px rgba(10,28,40,0.04)',
              borderColor: '',
              duration: 0.35,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          });
        });
      }
    }

    // 4. Small Business Operations Split Parallax
    const splitSection = document.querySelector('section.night .split');
    if (splitSection) {
      const imgCol = splitSection.children[0];
      const textCol = splitSection.children[1];
      if (imgCol) {
        gsap.fromTo(imgCol,
          { y: -25 },
          {
            y: 25, ease: 'none',
            scrollTrigger: {
              trigger: splitSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }
      if (textCol) {
        gsap.fromTo(textCol.children,
          { x: 30, opacity: 0 },
          {
            x: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power3.out',
            scrollTrigger: {
              trigger: splitSection,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    // 5. Compliance Table Rows Cascade
    const tableRows = document.querySelectorAll('.twrap .ptab tbody tr');
    if (tableRows.length) {
      gsap.fromTo(tableRows,
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0, stagger: 0.05, duration: 0.45, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.twrap',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // APPOINTMENTS: 4-CARD STAGGER, BANNER PARALLAX & DIRECT FORM
  // ─────────────────────────────────────────────────────────────
  function initAppointmentsTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const cardsGrid = document.querySelector('.grid.g4');
    const directForm = document.getElementById('in-page-booking-form');
    if (!cardsGrid && !directForm) return;

    // 1. Hero Entrance
    const heroHead = document.querySelector('#main > section.night.tight .sechead');
    if (heroHead) {
      gsap.fromTo(heroHead.children,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
      );
    }

    // 2. Consultation Cards 4-Card Spring Cascade
    if (cardsGrid) {
      const cards = cardsGrid.querySelectorAll('.card');
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 50, opacity: 0, scale: 0.94 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: cardsGrid,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          }
        );

        cards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              boxShadow: '0 20px 42px -10px rgba(1,159,255,0.2), 0 0 0 1px #019FFF',
              borderColor: '#019FFF',
              duration: 0.28,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              boxShadow: '0 4px 16px rgba(10,28,40,0.04)',
              borderColor: '',
              duration: 0.35,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          });
        });
      }
    }

    // 3. Image Band Parallax
    const imgband = document.querySelector('.imgband');
    if (imgband) {
      gsap.fromTo(imgband,
        { backgroundPositionY: '65%' },
        {
          backgroundPositionY: '35%',
          ease: 'none',
          scrollTrigger: {
            trigger: imgband,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
      const inner = imgband.querySelector('.imgband-inner');
      if (inner) {
        gsap.fromTo(inner.children,
          { y: 25, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: imgband, start: 'top 78%', toggleActions: 'play none none none' }
          }
        );
      }
    }

    // 4. Direct Booking Split Stage
    const splitBooking = directForm ? directForm.closest('.split') : null;
    if (splitBooking) {
      const leftCol = splitBooking.children[0];
      const rightCard = splitBooking.children[1];
      if (leftCol) {
        gsap.fromTo(leftCol.children,
          { x: -35, opacity: 0 },
          {
            x: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: splitBooking, start: 'top 80%', toggleActions: 'play none none none' }
          }
        );
      }
      if (rightCard) {
        gsap.fromTo(rightCard,
          { x: 35, opacity: 0, scale: 0.98 },
          {
            x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: splitBooking, start: 'top 80%', toggleActions: 'play none none none' }
          }
        );
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LEGAL & POLICY PAGES: READING PROGRESS & TOC INTERACTION
  // ─────────────────────────────────────────────────────────────
  function initLegalPoliciesTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const tocBar = document.querySelector('.legal-toc-bar');
    const legalContent = document.querySelector('.legal-card.legal-content');
    if (!tocBar && !legalContent) return;

    // 1. Top Reading Progress Indicator
    let progBar = document.getElementById('legal-reading-progress');
    if (!progBar) {
      progBar = document.createElement('div');
      progBar.id = 'legal-reading-progress';
      progBar.style.cssText = 'position:fixed;top:0;left:0;height:3.5px;width:0%;z-index:99999;background:linear-gradient(90deg,#019FFF 0%,#EAE42F 100%);box-shadow:0 0 10px rgba(1,159,255,0.6);pointer-events:none;transition:width 0.08s ease;';
      document.body.appendChild(progBar);
    }

    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        progBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
      }
    }, { passive: true });

    // 2. Hero Header & Badges Entrance
    const badges = document.querySelectorAll('.legal-badge-row .legal-badge');
    if (badges.length) {
      gsap.fromTo(badges,
        { scale: 0.85, opacity: 0, y: 10 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }

    // 3. Legal Card Elevation Entrance
    if (legalContent) {
      gsap.fromTo(legalContent,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: legalContent, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    }

    // 4. Smooth Anchor Scrolling & Section Highlight Glow
    const tocLinks = document.querySelectorAll('.legal-toc-link');
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        const targetEl = targetId ? document.getElementById(targetId) : null;
        if (targetEl) {
          e.preventDefault();
          const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 110;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          gsap.fromTo(targetEl,
            { backgroundColor: 'rgba(1, 159, 255, 0.09)', borderRadius: '6px' },
            { backgroundColor: 'transparent', duration: 1.4, ease: 'power2.out' }
          );
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // THE FILE ROOM: 3D DEVICE STAGE, TABS & STRATEGY CARDS
  // ─────────────────────────────────────────────────────────────
  function initFileRoomTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const appDevice = document.getElementById('app-device');
    const appToolbar = document.querySelector('.app-toolbar');
    if (!appDevice && !appToolbar) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 1. App Toolbar Entrance
    if (appToolbar) {
      gsap.fromTo(appToolbar,
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }

    // 2. 10-Screen Navigation Tab Bar Cascade
    const tabs = document.querySelectorAll('.app-screen-tab');
    if (tabs.length) {
      gsap.fromTo(tabs,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, duration: 0.45, ease: 'power2.out', delay: 0.15 }
      );
    }

    // 3. Device Mockup Smooth Entrance on both Mobile and Desktop
    if (appDevice) {
      gsap.fromTo(appDevice,
        { y: 35, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', delay: 0.2 }
      );

      const stage = appDevice.closest('.app-stage-container') || appDevice.parentElement;
      if (stage) {
        stage.style.perspective = '1400px';
        stage.addEventListener('mousemove', (e) => {
          if (window.innerWidth < 768) return;
          const rect = stage.getBoundingClientRect();
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          gsap.to(appDevice, {
            rotateY: normX * 4,
            rotateX: -normY * 4,
            scale: 1.008,
            duration: 0.4,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        });
        stage.addEventListener('mouseleave', () => {
          gsap.to(appDevice, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      }
    }

    // 4. Lower Strategy Architecture Cards Cascade
    const strategyCards = document.querySelectorAll('section.night .grid.g3 .card');
    if (strategyCards.length) {
      gsap.fromTo(strategyCards,
        { y: 45, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: strategyCards[0].closest('.grid') || strategyCards[0],
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
      strategyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -6,
            borderColor: '#019FFF',
            boxShadow: '0 16px 36px -10px rgba(1,159,255,0.25)',
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            borderColor: 'var(--night-line)',
            boxShadow: 'none',
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        });
      });
    }
  }

  // Export to window for external invocation
  window.initDocStrategicTransition = initDocStrategicTransition;

  // ─────────────────────────────────────────────────────────────
  // NEW LAW: CITATIONS STAGE, VERIFICATION & FOOTER BRIDGE
  // Uncle Pat Pop · Verification Banner · 2x2 Citation Cascade · Pinned Footer Unmask
  // ─────────────────────────────────────────────────────────────
  function initCitationsFooterBridgeTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[CitationsFooterBridge] GSAP or ScrollTrigger not detected.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const stage        = document.getElementById('citations-stage');
    const footer       = document.getElementById('site-footer') || document.querySelector('footer');
    if (!stage) return;

    const patsays      = document.getElementById('citation-patsays');
    const verification = document.getElementById('verification-banner');
    const cards        = stage.querySelectorAll('.citation-card');
    const brandCol     = footer ? (footer.querySelector('.footer-brand-col') || footer.querySelector('.cols > div:first-child')) : null;
    const navCols      = footer ? Array.from(footer.querySelectorAll('.footer-nav-col, .cols > div:not(:first-child)')) : [];
    const legalNote    = footer ? (footer.querySelector('.footer-legal') || footer.querySelector('.fine')) : null;

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop:         '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      isTablet:          '(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)',
      isMobileOrReduced: '(max-width: 767px), (prefers-reduced-motion: reduce)'
    }, (context) => {
      const { isDesktop, isTablet } = context.conditions;

      if (!isDesktop && !isTablet) {
        // Mobile fallback (< 768px) with smooth entrance
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set([patsays, verification, ...cards], { clearProps: 'all' });
          if (footer) gsap.set([brandCol, ...navCols, legalNote].filter(Boolean), { clearProps: 'all' });
          return;
        }

        const mobileTargets = [patsays, verification, ...cards].filter(Boolean);
        if (mobileTargets.length) {
          gsap.fromTo(mobileTargets,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stage,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (footer) {
          const footerTargets = [brandCol, ...navCols, legalNote].filter(Boolean);
          if (footerTargets.length) {
            gsap.fromTo(footerTargets,
              { y: 18, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.06,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: footer,
                  start: 'top 90%',
                  toggleActions: 'play none none none'
                }
              }
            );
          }
        }
        return;
      }

      // ─────────────────────────────────────────────────────────
      // 1. UNCLE PAT QUOTE, VERIFICATION & 2x2 CITATION CASCADE
      // Trigger: section top reaches 75% of viewport
      // ─────────────────────────────────────────────────────────
      const stageTl = gsap.timeline({
        scrollTrigger: {
          trigger:             stage,
          start:               'top 75%',
          toggleActions:       'play none none reverse',
          invalidateOnRefresh: true,
          id:                  'citations-stage-entrance'
        }
      });

      // Uncle Pat quote card enters with elevated scale pop (scale: 0.96 to 1.0, y: 25px to 0, opacity: 0 to 1, ease: "back.out(1.6)")
      if (patsays) {
        stageTl.fromTo(patsays,
          { scale: 0.96, y: 25, opacity: 0 },
          {
            scale:    1.0,
            y:        0,
            opacity:  1,
            duration: 0.65,
            ease:     'back.out(1.6)',
            force3D:  true
          },
          0
        );
      }

      // "HOW CURRENT THIS PAGE IS" banner glides up directly beneath (y: 20px to 0, opacity: 0 to 1)
      if (verification) {
        stageTl.fromTo(verification,
          { y: 20, opacity: 0 },
          {
            y:        0,
            opacity:  1,
            duration: 0.6,
            ease:     'power3.out',
            force3D:  true
          },
          0.12
        );
      }

      // 2. 2x2 IRS Citation Ledger Cascade: alternating cross-axis sequence (stagger: 0.06s, y: 25px to 0, opacity: 0 to 1, ease: "power3.out")
      if (cards.length) {
        stageTl.fromTo(cards,
          { y: 25, opacity: 0 },
          {
            y:        0,
            opacity:  1,
            stagger:  0.06,
            duration: 0.65,
            ease:     'power3.out',
            force3D:  true
          },
          0.24
        );
      }

      // ─────────────────────────────────────────────────────────
      // 4. PINNED FOOTER CURTAIN UNMASK (Screens >= 1024px)
      // As the user scrolls past the citation grid, the white stage slides up to cleanly unmask the anchored dark footer beneath
      // ─────────────────────────────────────────────────────────
      if (isDesktop && footer) {
        const footerTargets = [brandCol, ...navCols, legalNote].filter(Boolean);
        if (footerTargets.length) {
          gsap.fromTo(footerTargets,
            { y: 20, opacity: 0.2 },
            {
              y:        0,
              opacity:  1,
              stagger:  0.08,
              duration: 0.6,
              ease:     'power2.out',
              scrollTrigger: {
                trigger:       footer,
                start:         'top 92%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      return function () {
        gsap.set([patsays, verification, ...cards], { clearProps: 'all' });
        if (footer) gsap.set([brandCol, ...navCols, legalNote].filter(Boolean), { clearProps: 'all' });
      };
    });
  }

  // Export to window for external invocation
  window.initCitationsFooterBridgeTransition = initCitationsFooterBridgeTransition;

  // ─────────────────────────────────────────────────────────────
  // FREE-HELP: HERO STAGE & COMPLIMENTARY TRIAGE GRID
  // - Pinned Hero Stage for +=90vh (pin: true, scrub: 1.1, anticipatePin: 1)
  // - Eyebrow & headline masked glide (y: 30px -> 0, opacity: 0 -> 1, ease: 'power3.out')
  // - Dual card alternating cross-axis slide:
  //   * Card 1 (The Second Look): x: -25px, y: 35px, opacity: 0 -> 1, back.out(1.4)
  //   * Card 2 (Notice Triage): x: 25px, y: 35px, opacity: 0 -> 1, 0.08s stagger
  // - Monospace offer pills expand letter-tracking (0.08em -> 0.14em) + cyan fill
  // - Tactile card hover micro-physics & sibling dimming
  // - Responsive matchMedia: desktop (>=900px) vs mobile (<900px)
  // ─────────────────────────────────────────────────────────────
  function initFreeHelpHeroTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = document.getElementById('free-help-hero-stage');
    if (!stage) return;

    const eyebrow = stage.querySelector('#free-help-eyebrow, .free-help-eyebrow');
    const h1      = stage.querySelector('#free-help-h1, .free-help-h1');
    const lede    = stage.querySelector('#free-help-lede, .free-help-lede');
    const card1   = stage.querySelector('#triage-card-second-look');
    const card2   = stage.querySelector('#triage-card-notice-triage');
    const tags    = Array.from(stage.querySelectorAll('.triage-tag'));

    const allTargets = [eyebrow, h1, lede, card1, card2, ...tags].filter(Boolean);

    ScrollTrigger.matchMedia({
      // Desktop (>= 900px and min-height: 560px): Pinned scroll entrance and synchronized dual card cascade
      '(min-width: 900px) and (min-height: 560px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // 1. Initial Arrival Reveal for Header Elements
        // Ensure on page arrival (scroll 0), the headline and eyebrow smoothly animate into view immediately
        gsap.fromTo([eyebrow, h1, lede].filter(Boolean),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true
          }
        );

        // 2. Initial state for Dual Cards before scrub
        if (card1) gsap.set(card1, { x: -25, y: 35, opacity: 0.5, force3D: true });
        if (card2) gsap.set(card2, { x: 25, y: 35, opacity: 0.5, force3D: true });
        if (tags.length) {
          gsap.set(tags, { letterSpacing: '0.08em', backgroundColor: 'rgba(1, 159, 255, 0.08)' });
        }

        // 3. Pinned Hero Stage Timeline
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: 'top 102px',
            end: () => '+=' + Math.round(window.innerHeight * 0.85),
            scrub: 1.1,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true
          }
        });

        // Dual card alternating cross-axis slide
        if (card1) {
          heroTl.to(card1, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'back.out(1.4)'
          }, 0.04);
        }

        if (card2) {
          heroTl.to(card2, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'back.out(1.4)'
          }, 0.12); // 0.08s stagger
        }

        // Monospace offer pills expand with uppercase letter-tracking and subtle cyan fill
        if (tags.length) {
          heroTl.to(tags, {
            letterSpacing: '0.14em',
            backgroundColor: 'rgba(1, 159, 255, 0.16)',
            duration: 0.45,
            ease: 'power2.out'
          }, 0.16);
        }

        return function () {
          if (heroTl && heroTl.scrollTrigger) heroTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Mobile / Small Viewport Fallback: Clean vertical stack and standard document flow
      '(max-width: 899px), (max-height: 559px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
        gsap.fromTo([eyebrow, h1, lede, card1, card2].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stage,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // 4. Tactile Card Hover Micro-Physics with sibling dimming
    const cards = [card1, card2].filter(Boolean);
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const isGold = card.id === 'triage-card-notice-triage';
        gsap.to(card, {
          y: -5,
          scale: 1.015,
          zIndex: 10,
          boxShadow: isGold
            ? '0 20px 40px -10px rgba(234, 228, 47, 0.28), 0 0 0 1px #EAE42F'
            : '0 20px 40px -10px rgba(1, 159, 255, 0.22), 0 0 0 1px #019FFF',
          borderTopColor: isGold ? '#EAE42F' : '#019FFF',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Sibling card softens in contrast
        cards.forEach((sibling) => {
          if (sibling !== card) {
            gsap.to(sibling, {
              opacity: 0.7,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        const isGold = card.id === 'triage-card-notice-triage';
        gsap.to(card, {
          y: 0,
          scale: 1,
          zIndex: 1,
          boxShadow: '0 10px 28px -4px rgba(0, 0, 0, 0.16)',
          borderTopColor: isGold ? 'rgba(234, 228, 47, 0.6)' : 'rgba(1, 159, 255, 0.3)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Restore sibling card
        cards.forEach((sibling) => {
          if (sibling !== card) {
            gsap.to(sibling, {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FREE-HELP: DIAGNOSTIC TOOL SUITE
  // Coordinated 4-Card Equalizer Cascade & Tactile Hover Physics
  // ─────────────────────────────────────────────────────────────
  function initDiagnosticToolsAndBridgeTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('diagnostic-tools-section');
    if (!section) return;

    const eyebrow = section.querySelector('#diagnostic-eyebrow, .diagnostic-eyebrow');
    const h2      = section.querySelector('#diagnostic-h2, .diagnostic-h2');
    const cards   = Array.from(section.querySelectorAll('.diagnostic-card'));
    const tags    = Array.from(section.querySelectorAll('.diagnostic-tag'));

    const allTargets = [eyebrow, h2, ...cards, ...tags].filter(Boolean);

    ScrollTrigger.matchMedia({
      // Desktop & Tablet (>= 768px): Coordinated cascade
      '(min-width: 768px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // 1. Initial starting states for Tool Suite
        if (eyebrow) gsap.set(eyebrow, { y: 25, opacity: 0 });
        if (h2)      gsap.set(h2, { y: 25, opacity: 0 });
        if (cards.length) {
          gsap.set(cards, { y: 35, opacity: 0, force3D: true });
        }
        if (tags.length) {
          gsap.set(tags, { letterSpacing: '0.08em' });
        }

        // 2. Coordinated 4-Card Equalizer Cascade (Trigger at 75% viewport)
        const cascadeTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true
          }
        });

        // Clean masked reveal for eyebrow and headline
        if (eyebrow) {
          cascadeTl.to(eyebrow, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out'
          }, 0);
        }

        if (h2) {
          cascadeTl.to(h2, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out'
          }, 0.06);
        }

        // 4 Cards equalizer stagger from left to right (stagger: 0.08s, y: 35px to 0, ease: back.out(1.4))
        if (cards.length) {
          cascadeTl.to(cards, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: 'back.out(1.4)'
          }, 0.15);
        }

        // Category labels expand letter-tracking (0.08em to 0.14em)
        if (tags.length) {
          cascadeTl.to(tags, {
            letterSpacing: '0.14em',
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out'
          }, 0.22);
        }

        return function () {
          if (cascadeTl && cascadeTl.scrollTrigger) cascadeTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Mobile Fallback (< 768px): Clean vertical stack and standard document flow
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
        gsap.fromTo([eyebrow, h2, ...cards].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Tactile Card Hover Micro-Physics with sibling dimming
    cards.forEach((card) => {
      const btn = card.querySelector('.diagnostic-btn, .btn');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -6,
          scale: 1.015,
          zIndex: 10,
          boxShadow: '0 20px 40px -12px rgba(1, 159, 255, 0.16), 0 0 0 1px #019FFF',
          borderTopColor: '#019FFF',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        if (btn) {
          gsap.to(btn, {
            backgroundColor: '#F0F7FD',
            borderColor: '#019FFF',
            color: '#019FFF',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        // Sibling non-hovered cards drop slightly in opacity (0.7)
        cards.forEach((sibling) => {
          if (sibling !== card) {
            gsap.to(sibling, {
              opacity: 0.7,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          zIndex: 1,
          boxShadow: '0 4px 16px -2px rgba(14, 22, 33, 0.05)',
          borderTopColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        if (btn) {
          gsap.to(btn, {
            clearProps: 'backgroundColor,borderColor,color',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        // Restore sibling cards
        cards.forEach((sibling) => {
          if (sibling !== card) {
            gsap.to(sibling, {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FREE-HELP: COMPLIMENTARY REVIEW PINNED SPLIT STAGE
  // 1. Pinned stage setup for +=100vh with elevated deck unmask
  // 2. Image parallax & frame reveal (yPercent: -12, scale: 1.06 -> 1.0)
  // 3. Right column content stagger & hairline divider sweeps
  // 4. Tactile micro-interactions (Yellow CTA hover & diagnostic row wash)
  // 5. ScrollTrigger.matchMedia for desktop (>=1024px) / mobile (<768px)
  // ─────────────────────────────────────────────────────────────
  function initComplimentaryReviewSplitStage() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const bridge = document.getElementById('editorial-bridge');
    if (!bridge) return;

    const imgCol       = bridge.querySelector('#editorial-img-col, .editorial-img-col');
    const imgFrame     = bridge.querySelector('#editorial-img-frame, .editorial-img-frame');
    const photo        = bridge.querySelector('#editorial-photo, .editorial-photo');
    const textCol      = bridge.querySelector('#editorial-text-col, .editorial-text-col');
    const eyebrowPill  = bridge.querySelector('#editorial-eyebrow, .editorial-eyebrow');
    const headline     = bridge.querySelector('#editorial-h2, .editorial-h2');
    const narrative    = bridge.querySelector('#editorial-p, .editorial-p');
    const deliverables = bridge.querySelector('#complimentary-deliverables, .complimentary-deliverables');
    const items        = Array.from(bridge.querySelectorAll('.complimentary-item'));
    const dividers     = Array.from(bridge.querySelectorAll('.complimentary-divider'));
    const rows         = Array.from(bridge.querySelectorAll('.complimentary-row'));
    const ctaBtn       = bridge.querySelector('#editorial-cta, .editorial-cta');

    const allTargets = [
      bridge, imgCol, imgFrame, photo, textCol,
      eyebrowPill, headline, narrative, deliverables,
      ...items, ...dividers, ctaBtn
    ].filter(Boolean);

    ScrollTrigger.matchMedia({
      // Desktop (>= 1024px): Interactive pinned scroll entrance and scrub
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial setup for pinned scrub
        if (photo) {
          gsap.set(photo, {
            scale: 1.06,
            yPercent: 0,
            force3D: true
          });
        }

        if (eyebrowPill) {
          gsap.set(eyebrowPill, {
            letterSpacing: '0.08em',
            boxShadow: '0 0 0px rgba(1, 159, 255, 0)',
            borderColor: 'rgba(1, 159, 255, 0.3)',
            force3D: true
          });
        }

        if (headline) {
          gsap.set(headline, { y: 25, opacity: 0, force3D: true });
        }

        if (narrative) {
          gsap.set(narrative, { y: 25, opacity: 0, force3D: true });
        }

        if (items.length) {
          gsap.set(items, { x: -20, opacity: 0, force3D: true });
        }

        if (dividers.length) {
          gsap.set(dividers, { scaleX: 0, transformOrigin: '0% 50%', force3D: true });
        }

        if (ctaBtn) {
          gsap.set(ctaBtn, { y: 20, opacity: 0, force3D: true });
        }

        // Pinned scrub timeline (duration: +=100vh)
        const stageTl = gsap.timeline({
          scrollTrigger: {
            trigger: bridge,
            start: 'top top',
            end: '+=100vh',
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. Photo drifts vertically on an independent parallax plane (scale: 1.06 -> 1.0, yPercent: 0 -> -12)
        if (photo) {
          stageTl.to(photo, {
            yPercent: -12,
            scale: 1.0,
            ease: 'none',
            force3D: true
          }, 0);
        }

        // 2. "COMPLIMENTARY REVIEW" pill reveals with uppercase letter-tracking expansion (0.08em -> 0.14em) & cyan glow
        if (eyebrowPill) {
          stageTl.to(eyebrowPill, {
            letterSpacing: '0.14em',
            boxShadow: '0 0 24px rgba(1, 159, 255, 0.45)',
            borderColor: '#019FFF',
            duration: 0.35,
            ease: 'power2.out',
            force3D: true
          }, 0.05);
        }

        // 3. Headline and narrative slide into view (y: 25px -> 0, opacity: 0 -> 1, ease: 'power3.out')
        if (headline) {
          stageTl.to(headline, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
            force3D: true
          }, 0.1);
        }

        if (narrative) {
          stageTl.to(narrative, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
            force3D: true
          }, 0.18);
        }

        // 4. The 3 hairline divider rules draw across sequentially from left to right (scaleX: 0 -> 1, ease: 'power2.out')
        if (dividers.length) {
          stageTl.to(dividers, {
            scaleX: 1,
            stagger: 0.1,
            duration: 0.45,
            ease: 'power2.out',
            force3D: true
          }, 0.25);
        }

        // 5. The 3 diagnostic items cascade in from left to right (stagger: 0.1s, x: -20px -> 0, opacity: 0 -> 1)
        if (items.length) {
          stageTl.to(items, {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.45,
            ease: 'power3.out',
            force3D: true
          }, 0.28);
        }

        // 6. Yellow CTA button rises into place
        if (ctaBtn) {
          stageTl.to(ctaBtn, {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
            force3D: true
          }, 0.52);
        }

        return function () {
          if (stageTl && stageTl.scrollTrigger) stageTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Tablet View (768px - 1023px): Smooth unpinned scroll entrance
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        if (headline) gsap.set(headline, { y: 20, opacity: 0 });
        if (narrative) gsap.set(narrative, { y: 20, opacity: 0 });
        if (dividers.length) gsap.set(dividers, { scaleX: 0, transformOrigin: '0% 50%' });
        if (items.length) gsap.set(items, { x: -15, opacity: 0 });
        if (ctaBtn) gsap.set(ctaBtn, { y: 15, opacity: 0 });

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: bridge,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });

        if (headline) tabletTl.to(headline, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, 0);
        if (narrative) tabletTl.to(narrative, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.08);
        if (dividers.length) tabletTl.to(dividers, { scaleX: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, 0.16);
        if (items.length) tabletTl.to(items, { x: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0.2);
        if (ctaBtn) tabletTl.to(ctaBtn, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.35);

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Mobile Fallback (< 768px): Natural vertical document flow with image stacked above text
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });

        gsap.fromTo([headline, narrative, ...items, ctaBtn].filter(Boolean),
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bridge,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // 4. Tactile Micro-Interactions: Yellow CTA Button
    if (ctaBtn) {
      ctaBtn.addEventListener('mouseenter', () => {
        gsap.to(ctaBtn, {
          y: -2,
          boxShadow: '0 10px 24px rgba(234, 228, 47, 0.35)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });

      ctaBtn.addEventListener('mouseleave', () => {
        gsap.to(ctaBtn, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 14px rgba(234, 228, 47, 0.18)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });

      ctaBtn.addEventListener('mousedown', () => {
        gsap.to(ctaBtn, {
          scale: 0.97,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      ctaBtn.addEventListener('mouseup', () => {
        gsap.to(ctaBtn, {
          scale: 1,
          y: -2,
          duration: 0.15,
          ease: 'back.out(2)',
          overwrite: 'auto'
        });
      });
    }

    // Diagnostic Line Item Hover: soft wash background & illuminated leading dash marker
    rows.forEach((row) => {
      const dash = row.querySelector('.complimentary-dash');
      const label = row.querySelector('.complimentary-label');

      row.addEventListener('mouseenter', () => {
        gsap.to(row, {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (dash) {
          gsap.to(dash, {
            color: '#019FFF',
            textShadow: '0 0 10px rgba(1, 159, 255, 0.7)',
            x: 2,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
        if (label) {
          gsap.to(label, {
            color: '#FFFFFF',
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      row.addEventListener('mouseleave', () => {
        gsap.to(row, {
          backgroundColor: 'transparent',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (dash) {
          gsap.to(dash, {
            color: 'rgba(255, 255, 255, 0.45)',
            textShadow: '0 0 0px rgba(1, 159, 255, 0)',
            x: 0,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
        if (label) {
          gsap.to(label, {
            color: 'rgba(255, 255, 255, 0.85)',
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FREE-HELP: INDUSTRY DEDUCTION GUIDES MATRIX
  // 1. Viewport arrival & header masked reveal (start: 'top 75%')
  // 2. 3x2 Grid cascade in two 3-card waves (top row, then bottom row +0.12s)
  //    with uppercase industry tag letter-tracking expansion (0.08em -> 0.14em)
  // 3. Tactile card hover micro-physics (elevation, arrow translate +4px, sibling dimming)
  // 4. ScrollTrigger.matchMedia for desktop (>=1100px) / tablet (768-1099px) / mobile (<768px)
  // ─────────────────────────────────────────────────────────────
  function initIndustryGuidesMatrix() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('industry-guides-section');
    if (!section) return;

    const eyebrow  = section.querySelector('#industry-eyebrow, .industry-eyebrow');
    const h2       = section.querySelector('#industry-h2, .industry-h2');
    const lede     = section.querySelector('#industry-lede, .industry-lede');
    const grid     = section.querySelector('#industry-grid, .industry-grid');
    const cards    = Array.from(section.querySelectorAll('.industry-card'));
    const tags     = Array.from(section.querySelectorAll('.industry-tag'));

    // Top row (cards 1, 2, 3) and bottom row (cards 4, 5, 6)
    const topRowCards    = cards.slice(0, 3);
    const bottomRowCards = cards.slice(3, 6);

    const allTargets = [eyebrow, h2, lede, grid, ...cards, ...tags].filter(Boolean);

    ScrollTrigger.matchMedia({
      // Desktop & Tablet (>= 768px)
      '(min-width: 768px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial states
        if (eyebrow) gsap.set(eyebrow, { y: 25, opacity: 0 });
        if (h2)      gsap.set(h2, { y: 25, opacity: 0 });
        if (lede)    gsap.set(lede, { y: 25, opacity: 0 });
        if (cards.length) {
          gsap.set(cards, { y: 35, opacity: 0, force3D: true });
        }
        if (tags.length) {
          gsap.set(tags, { letterSpacing: '0.08em' });
        }

        // 1. Master timeline triggered when section top reaches 75% of viewport
        const matrixTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true
          }
        });

        // Header masked reveal (y: 25px -> 0, opacity: 0 -> 1, ease: 'power3.out')
        if (eyebrow) {
          matrixTl.to(eyebrow, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out'
          }, 0);
        }

        if (h2) {
          matrixTl.to(h2, {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out'
          }, 0.06);
        }

        if (lede) {
          matrixTl.to(lede, {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out'
          }, 0.12);
        }

        // 2. 3x2 Grid Cascade:
        // Wave 1: Top Row (Cards 1, 2, 3) glides in from y: 35px to 0px (stagger: 0.08s, ease: 'power3.out')
        if (topRowCards.length) {
          matrixTl.to(topRowCards, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out'
          }, 0.2);
        }

        // Wave 2: Bottom Row (Cards 4, 5, 6) follows seamlessly with a 0.12s offset
        if (bottomRowCards.length) {
          matrixTl.to(bottomRowCards, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out'
          }, 0.32);
        }

        // Industry tags expand letter-tracking (0.08em to 0.14em) in brand blue (#019FFF)
        if (tags.length) {
          matrixTl.to(tags, {
            letterSpacing: '0.14em',
            stagger: 0.06,
            duration: 0.5,
            ease: 'power2.out'
          }, 0.28);
        }

        return function () {
          if (matrixTl && matrixTl.scrollTrigger) matrixTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Mobile Fallback (< 768px): Clean vertical stagger
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
        gsap.fromTo([eyebrow, h2, lede, ...cards].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // 3. Tactile Card Hover Micro-Physics with sibling dimming
    cards.forEach((card) => {
      const btn   = card.querySelector('.industry-btn, .btn');
      const arrow = card.querySelector('.industry-arrow');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          scale: 1.015,
          zIndex: 10,
          boxShadow: '0 20px 40px -12px rgba(1, 159, 255, 0.16), 0 0 0 1px #019FFF',
          borderTopColor: '#019FFF',
          duration: 0.3,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });

        if (btn) {
          gsap.to(btn, {
            backgroundColor: '#F0F7FD',
            borderColor: '#019FFF',
            color: '#019FFF',
            duration: 0.28,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }

        if (arrow) {
          gsap.to(arrow, {
            x: 4,
            duration: 0.28,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }

        // Sibling non-hovered cards drop slightly in opacity (0.75)
        cards.forEach((sibling) => {
          if (sibling !== card) {
            gsap.to(sibling, {
              opacity: 0.75,
              duration: 0.28,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              overwrite: 'auto'
            });
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          zIndex: 1,
          boxShadow: '0 4px 16px -2px rgba(14, 22, 33, 0.05)',
          borderTopColor: 'transparent',
          duration: 0.28,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });

        if (btn) {
          gsap.to(btn, {
            clearProps: 'backgroundColor,borderColor,color',
            duration: 0.28,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }

        if (arrow) {
          gsap.to(arrow, {
            x: 0,
            duration: 0.28,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }

        // Restore sibling cards
        cards.forEach((sibling) => {
          if (sibling !== card) {
            gsap.to(sibling, {
              opacity: 1,
              duration: 0.28,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              overwrite: 'auto'
            });
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // AUDIT-RESOLUTION: PINNED HERO STAGE & TRIAGE DOCK (SORABAN SUITE)
  // 1. Pinned stage for +=90vh (pin: true, scrub: 1.1, anticipatePin: 1)
  // 2. Eyebrow and headline masked reveal (y: 35px -> 0, opacity: 0 -> 1, ease: 'power3.out')
  //    Active headline emphasis unmask ("Send it over. We'll read it today.")
  // 3. Dual CTAs elevated spring settle (scale: 0.96 -> 1, y: 20px -> 0, ease: 'back.out(1.6)')
  //    Primary CTA hover lift (-2px, shadow bloom), press scale(0.97)
  //    Secondary CTA hover (#019FFF) + arrow bounce
  // 4. Uncle Pat quote banner spring dock (y: 25px -> 0, opacity: 0 -> 1, ease: 'back.out(1.5)')
  //    Ambient welcoming owl glow and blink micro-interaction
  // 5. ScrollTrigger.matchMedia() desktop (>=1024px) / mobile (<768px)
  // ─────────────────────────────────────────────────────────────
  function initAuditResolutionHero() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = document.getElementById('audit-hero-stage');
    if (!stage) return;

    const eyebrow   = stage.querySelector('#audit-eyebrow, .audit-eyebrow');
    const h1        = stage.querySelector('#audit-h1, .audit-h1');
    const emphasis  = stage.querySelector('#audit-h1-emphasis, .audit-h1-emphasis');
    const lede      = stage.querySelector('#audit-lede, .audit-lede');
    const ctaRow    = stage.querySelector('#audit-cta-row, .audit-cta-row');
    const btnPri    = stage.querySelector('#audit-cta-primary, .audit-cta-primary');
    const btnSec    = stage.querySelector('#audit-cta-secondary, .audit-cta-secondary');
    const arrow     = stage.querySelector('.audit-arrow-down');
    const patCard   = stage.querySelector('#audit-patsays, .audit-patsays');
    const owlMascot = stage.querySelector('#audit-owl-mascot, .audit-owl-mascot');

    const allTargets = [eyebrow, h1, emphasis, lede, btnPri, btnSec, patCard].filter(Boolean);

    ScrollTrigger.matchMedia({
      // 1. Desktop (>= 1024px): Pinned Stage Architecture
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Viewport Arrival & Masked Text Reveal on Initial Load
        gsap.fromTo([eyebrow, h1, lede].filter(Boolean),
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true
          }
        );

        // Initial setup for interactive pinned scrub
        if (emphasis) gsap.set(emphasis, { opacity: 0.55 });
        if (btnPri)   gsap.set(btnPri, { scale: 0.96, y: 20, opacity: 0.6 });
        if (btnSec)   gsap.set(btnSec, { scale: 0.96, y: 20, opacity: 0.6 });
        if (patCard)  gsap.set(patCard, { y: 25, opacity: 0.6 });

        // Master Pinned Timeline: pinned for +=90vh
        const stageTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * 0.9),
            scrub: 1.1,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true
          }
        });

        // Eyebrow and headline masked reveal (y: 35px to 0, opacity: 0 to 1, ease: 'power3.out')
        if (eyebrow) {
          stageTl.to(eyebrow, {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: 'power3.out'
          }, 0);
        }

        if (h1) {
          stageTl.to(h1, {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out'
          }, 0.05);
        }

        // Active headline emphasis text unmask & brightening
        if (emphasis) {
          stageTl.to(emphasis, {
            opacity: 1,
            filter: 'blur(0px)',
            color: '#FFFFFF',
            duration: 0.4,
            ease: 'power2.out',
            onStart: () => emphasis.classList.add('is-illuminated'),
            onReverseComplete: () => emphasis.classList.remove('is-illuminated')
          }, 0.15);
        }

        if (lede) {
          stageTl.to(lede, {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power3.out'
          }, 0.18);
        }

        // Dual CTAs enter with an elevated spring settle (scale: 0.96 to 1.0, y: 20px to 0, ease: 'back.out(1.6)')
        if (btnPri) {
          stageTl.to(btnPri, {
            scale: 1.0,
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(1.6)'
          }, 0.26);
        }

        if (btnSec) {
          stageTl.to(btnSec, {
            scale: 1.0,
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(1.6)'
          }, 0.34);
        }

        // Uncle Pat quote card spring dock (y: 25px to 0, opacity: 0 to 1, ease: 'back.out(1.5)')
        if (patCard) {
          stageTl.to(patCard, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.5)'
          }, 0.42);
        }

        // Mascot ambient welcoming glow on settle
        if (owlMascot) {
          stageTl.to(owlMascot, {
            filter: 'brightness(1.35) drop-shadow(0 0 14px rgba(1, 159, 255, 0.75))',
            duration: 0.35,
            ease: 'power2.out'
          }, 0.55);
        }

        return function () {
          if (stageTl && stageTl.scrollTrigger) stageTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Tablet View (768px - 1023px)
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        gsap.fromTo([eyebrow, h1, lede, btnPri, btnSec, patCard].filter(Boolean),
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stage,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      },

      // Mobile Fallback (< 768px): Natural vertical flow with smooth entrance
      '(max-width: 767px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const headGroup = [eyebrow, h2, lede, stepLabel].filter(Boolean);
        if (headGroup.length) {
          gsap.fromTo(headGroup,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.5,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stage,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(cards,
            { y: 25, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.06,
              duration: 0.55,
              ease: 'back.out(1.3)',
              scrollTrigger: {
                trigger: cards[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (drawer) {
          gsap.fromTo(drawer,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: drawer,
                start: 'top 90%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });

    // 2 & 3. Interactive Hover & Tactile Physics
    if (btnPri) {
      btnPri.addEventListener('mouseenter', () => {
        gsap.to(btnPri, {
          y: -2,
          boxShadow: '0 12px 28px rgba(234, 228, 47, 0.38)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });
      btnPri.addEventListener('mouseleave', () => {
        gsap.to(btnPri, {
          y: 0,
          boxShadow: '0 4px 14px rgba(234, 228, 47, 0.2)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });
      btnPri.addEventListener('mousedown', () => {
        gsap.to(btnPri, { scale: 0.97, duration: 0.1, overwrite: 'auto' });
      });
      btnPri.addEventListener('mouseup', () => {
        gsap.to(btnPri, { scale: 1.0, duration: 0.18, ease: 'back.out(2)', overwrite: 'auto' });
      });
    }

    if (btnSec) {
      btnSec.addEventListener('mouseenter', () => {
        gsap.to(btnSec, {
          borderColor: '#019FFF',
          color: '#019FFF',
          backgroundColor: 'rgba(1, 159, 255, 0.06)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (arrow) {
          gsap.to(arrow, {
            y: 3,
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
      });
      btnSec.addEventListener('mouseleave', () => {
        gsap.to(btnSec, {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: '#F5F8FB',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (arrow) {
          gsap.to(arrow, {
            y: 0,
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
      });
    }

    // Uncle Pat mascot hover blink & glow micro-interaction
    if (patCard && owlMascot) {
      patCard.addEventListener('mouseenter', () => {
        gsap.timeline({ overwrite: 'auto' })
          .to(owlMascot, {
            scale: 1.12,
            rotation: -2,
            filter: 'brightness(1.4) drop-shadow(0 0 16px rgba(1, 159, 255, 0.85))',
            duration: 0.22,
            ease: 'power2.out'
          })
          .to(owlMascot, {
            scaleY: 0.25,
            duration: 0.08,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 1
          }, '+=0.05');
      });

      patCard.addEventListener('mouseleave', () => {
        gsap.to(owlMascot, {
          scale: 1,
          scaleY: 1,
          rotation: 0,
          filter: 'brightness(1.2) drop-shadow(0 0 0px rgba(1, 159, 255, 0))',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // AUDIT-RESOLUTION: INTERACTIVE NOTICE DIAGNOSTIC (SORABAN SUITE)
  // 1. Pinned stage for +=90vh (pin: true, scrub: 1.1, anticipatePin: 1)
  // 2. Top examiner banner scale down (1.05 -> 1.0) and fade to opacity: 0.3
  // 3. 6 Notice cards staggered cascade (y: 25 -> 0, opacity: 0 -> 1, stagger: 0.05)
  // 4. Dynamic lower drawer spring settle (y: 20 -> 0, opacity: 0 -> 1)
  // 5. ScrollTrigger.matchMedia() desktop (>=1024px) / mobile (<768px)
  // ─────────────────────────────────────────────────────────────
  function initNoticeDiagnosticStage() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = document.getElementById('notice-diagnostic-stage');
    if (!stage) return;

    // Ensure notice triage elements are rendered if not already initialized
    if (!stage.querySelector('.triage-opt') && typeof window.renderNoticeTriage === 'function') {
      window.renderNoticeTriage('notice-triage-container');
    }

    const examinerBand = stage.querySelector('#notice-examiner-band, .notice-examiner-band');
    const shell        = stage.querySelector('#notice-diagnostic-shell, .notice-diagnostic-shell');
    const eyebrow      = stage.querySelector('#notice-eyebrow, .notice-eyebrow');
    const h2           = stage.querySelector('#notice-h2, .notice-h2');
    const lede         = stage.querySelector('#notice-lede, .notice-lede');
    const stepLabel    = stage.querySelector('#triage-step-label, .triage-step-label');
    const cards        = Array.from(stage.querySelectorAll('.triage-opt'));
    const drawer       = stage.querySelector('#triage-result-area, .triage-result');

    const allTargets = [examinerBand, eyebrow, h2, lede, stepLabel, ...cards, drawer].filter(Boolean);

    ScrollTrigger.matchMedia({
      // 1. Desktop (>= 1024px): Pinned Stage & Examiner Scale/Fade
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial setup for interactive pinned scrub
        if (examinerBand) gsap.set(examinerBand, { scale: 1.05, opacity: 1 });
        if (cards.length) {
          cards.forEach(card => {
            gsap.set(card, {
              y: 25,
              opacity: card.classList.contains('selected') ? 0.6 : 0.4
            });
          });
        }
        if (drawer) gsap.set(drawer, { y: 20, opacity: 0.5 });

        // Master Pinned Timeline: pinned for +=90vh
        const stageTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: 'top 68px',
            end: () => '+=' + Math.round(window.innerHeight * 0.9),
            scrub: 1.1,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true
          }
        });

        // Top examiner image gently scales down (1.05 -> 1.0) and fades to opacity: 0.3
        if (examinerBand) {
          stageTl.to(examinerBand, {
            scale: 1.0,
            opacity: 0.3,
            duration: 0.45,
            ease: 'power2.out'
          }, 0);
        }

        // Header copy slides into center view
        const headGroup = [eyebrow, h2, lede, stepLabel].filter(Boolean);
        if (headGroup.length) {
          stageTl.fromTo(headGroup,
            { y: 20, opacity: 0.6 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.35,
              ease: 'power3.out'
            },
            0.05
          );
        }

        // 6-Card Grid Cascade (stagger: 0.05s, y: 25px to 0, opacity: 0 to 1, ease: 'power3.out')
        if (cards.length) {
          stageTl.to(cards, {
            y: 0,
            opacity: (i, el) => el.classList.contains('selected') ? 1 : 0.7,
            stagger: 0.05,
            duration: 0.45,
            ease: 'power3.out'
          }, 0.18);
        }

        // Dynamic Lower Drawer Spring Settle
        if (drawer) {
          stageTl.to(drawer, {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(1.4)'
          }, 0.38);
        }

        return function () {
          if (stageTl && stageTl.scrollTrigger) stageTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // Tablet View (768px - 1023px)
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        gsap.fromTo([eyebrow, h2, lede, stepLabel, ...cards, drawer].filter(Boolean),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: (i, el) => el.classList && el.classList.contains('selected') ? 1 : (el.classList && el.classList.contains('triage-opt') ? 0.7 : 1),
            stagger: 0.04,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stage,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      },

      // Mobile Fallback (< 768px): Natural vertical flow
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // AUDIT-RESOLUTION: RESOLUTION TIERS & AUDIT SHIELD (SORABAN SUITE)
  // 1. Pinned Ledger Stage for +=120vh (pin: true, scrub: 1.1, anticipatePin: 1)
  // 2. Eyebrow and headline lock into view (y: 25 -> 0, opacity: 0 -> 1, ease: 'power3.out')
  // 3. Staggered Row Cascade (stagger: 0.08s, y: 30 -> 0, opacity: 0 -> 1)
  //    - Monospace index numerals illuminate in brand cyan (#019FFF)
  //    - Tabular pricing blocks reveal
  //    - Hairline laser dividers draw across (scaleX: 0 -> 1, transformOrigin: 'left center')
  // 4. Audit Shield Card Docking: scale: 0.96 -> 1.0, y: 25 -> 0, opacity: 0 -> 1, ease: 'back.out(1.6)'
  // 5. Tactile micro-interactions: tier row hover wash, title slide +4px, price glow, CTA button hover lift
  // 6. Responsive matchMedia: desktop (>=1024px) pinned, tablet (768-1023px), mobile (<768px)
  // ─────────────────────────────────────────────────────────────
  function initResolutionTiersLedger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = document.getElementById('resolution-tiers');
    if (!stage) return;

    const eyebrow = stage.querySelector('#tiers-eyebrow, .tiers-eyebrow');
    const h2 = stage.querySelector('#tiers-h2, .tiers-h2');
    const lede = stage.querySelector('#tiers-lede, .tiers-lede');
    const rows = Array.from(stage.querySelectorAll('.ledger-tier'));
    const laserDividers = Array.from(stage.querySelectorAll('.tier-laser-divider'));
    const indexNumerals = Array.from(stage.querySelectorAll('.tier-index'));
    const pricingBlocks = Array.from(stage.querySelectorAll('.tier-pricing'));
    const shieldCard = stage.querySelector('#audit-shield-card, .audit-shield-card');
    const shieldCta = stage.querySelector('#btn-add-audit-shield, .shield-cta');

    const allTargets = [eyebrow, h2, lede, ...rows, ...laserDividers, ...indexNumerals, ...pricingBlocks, shieldCard].filter(Boolean);

    ScrollTrigger.matchMedia({
      // 1. Desktop Stage (>= 1024px): Pinned Ledger Scrub
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial setup for scrub entrance
        if (eyebrow) gsap.set(eyebrow, { y: 25, opacity: 0 });
        if (h2) gsap.set(h2, { y: 25, opacity: 0 });
        if (lede) gsap.set(lede, { y: 25, opacity: 0 });

        if (rows.length) {
          gsap.set(rows, { y: 30, opacity: 0 });
        }

        if (laserDividers.length) {
          gsap.set(laserDividers, { scaleX: 0, transformOrigin: 'left center' });
        }

        if (indexNumerals.length) {
          gsap.set(indexNumerals, { color: 'rgba(1, 159, 255, 0.35)', textShadow: '0 0 0px rgba(1, 159, 255, 0)' });
        }

        if (shieldCard) {
          gsap.set(shieldCard, {
            scale: 0.96,
            y: 25,
            opacity: 0,
            boxShadow: '0 0 10px rgba(1, 159, 255, 0.05)',
            border: '1px solid rgba(1, 159, 255, 0.15)'
          });
        }

        // Master Scrubbed Ledger Timeline: pinned for +=120vh
        const ledgerTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: 'top 68px',
            end: () => '+=' + Math.round(window.innerHeight * 1.2),
            scrub: 1.1,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true
          }
        });

        // 1. Eyebrow, headline, and lede lock into view
        const headerEls = [eyebrow, h2, lede].filter(Boolean);
        if (headerEls.length) {
          ledgerTl.to(headerEls, {
            y: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.3,
            ease: 'power3.out'
          }, 0);
        }

        // 2. 4 Resolution Tier Rows Cascade (stagger: 0.08s, y: 30px to 0, opacity: 0 to 1)
        if (rows.length) {
          ledgerTl.to(rows, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: 'power3.out'
          }, 0.12);
        }

        // Monospace index numerals illuminate in brand cyan (#019FFF)
        if (indexNumerals.length) {
          ledgerTl.to(indexNumerals, {
            color: '#019FFF',
            textShadow: '0 0 16px rgba(1, 159, 255, 0.35)',
            stagger: 0.08,
            duration: 0.45,
            ease: 'power2.out'
          }, 0.14);
        }

        // Hairline dividers beneath each tier draw across from left to right (scaleX: 0 to 1)
        if (laserDividers.length) {
          ledgerTl.to(laserDividers, {
            scaleX: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: 'power2.out'
          }, 0.18);
        }

        // Upward glide so tall ledger content and Audit Shield card dock comfortably inside viewport
        const shell = stage.querySelector('#tiers-shell, .tiers-shell');
        const availableH = window.innerHeight - 80;
        const shellH = shell ? shell.scrollHeight : 0;
        const excessH = Math.max(0, shellH - availableH);

        if (excessH > 0 && shell) {
          ledgerTl.to(shell, {
            y: -excessH,
            duration: 0.55,
            ease: 'none'
          }, 0.28);
        }

        // 3. Audit Shield Card Docking (scale: 0.96 to 1.0, y: 25px to 0, opacity: 0 to 1, ease: 'back.out(1.6)')
        if (shieldCard) {
          ledgerTl.to(shieldCard, {
            scale: 1.0,
            y: 0,
            opacity: 1,
            boxShadow: '0 0 25px rgba(1, 159, 255, 0.15)',
            border: '1px solid rgba(1, 159, 255, 0.35)',
            duration: 0.4,
            ease: 'back.out(1.6)'
          }, 0.52);
        }

        return function () {
          if (ledgerTl && ledgerTl.scrollTrigger) ledgerTl.scrollTrigger.kill();
          gsap.set([shell, ...allTargets].filter(Boolean), { clearProps: 'all' });
        };
      },

      // 2. Tablet View (768px - 1023px): Natural unpinned cascade
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });

        tabletTl.fromTo([eyebrow, h2, lede].filter(Boolean),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power3.out' }
        );

        if (rows.length) {
          tabletTl.fromTo(rows,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
            '-=0.25'
          );
        }

        if (laserDividers.length) {
          tabletTl.fromTo(laserDividers,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
            '-=0.45'
          );
        }

        if (shieldCard) {
          tabletTl.fromTo(shieldCard,
            { scale: 0.96, y: 20, opacity: 0 },
            { scale: 1.0, y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' },
            '-=0.2'
          );
        }

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // 3. Mobile Fallback (< 768px): Natural document scroll with stacked layout
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
      }
    });

    // 4. Tactile Micro-Interactions
    // Hovering any tier row shifts background to soft wash, slides title rightward by 4px, turns price pure white
    rows.forEach(row => {
      const title = row.querySelector('.tier-title');
      const amount = row.querySelector('.tier-amount');

      row.addEventListener('mouseenter', () => {
        gsap.to(row, {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (title) {
          gsap.to(title, {
            x: 4,
            color: '#019FFF',
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
        if (amount) {
          gsap.to(amount, {
            color: '#FFFFFF',
            textShadow: '0 0 14px rgba(255, 255, 255, 0.5)',
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
      });

      row.addEventListener('mouseleave', () => {
        gsap.to(row, {
          backgroundColor: 'transparent',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (title) {
          gsap.to(title, {
            x: 0,
            color: '#FFFFFF',
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
        if (amount) {
          gsap.to(amount, {
            color: 'rgba(255, 255, 255, 0.92)',
            textShadow: 'none',
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
      });
    });

    // Yellow CTA button ("Add Audit Shield"): smooth hover lift (translateY(-2px), box-shadow)
    if (shieldCta) {
      shieldCta.addEventListener('mouseenter', () => {
        gsap.to(shieldCta, {
          y: -2,
          boxShadow: '0 10px 24px rgba(234, 228, 47, 0.35)',
          backgroundColor: '#F4EF3E',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });

      shieldCta.addEventListener('mouseleave', () => {
        gsap.to(shieldCta, {
          y: 0,
          boxShadow: '0 4px 14px rgba(234, 228, 47, 0.2)',
          backgroundColor: '#EAE42F',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });

      shieldCta.addEventListener('mousedown', () => {
        gsap.to(shieldCta, {
          scale: 0.97,
          duration: 0.1,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      });

      shieldCta.addEventListener('mouseup', () => {
        gsap.to(shieldCta, {
          scale: 1.0,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // AUDIT-RESOLUTION: AUTHORITY SPLIT STAGE (SORABAN SUITE)
  // 1. Pinned Stage Architecture: pin for +=100vh (pin: true, scrub: 1.1, anticipatePin: 1)
  //    Elevated deck container enters with subtle scale and lift
  // 2. Portrait Parallax & Reveal: scale 1.08 -> 1.0, yPercent: -12 -> 0
  // 3. Right Column Content Stagger:
  //    - Eyebrow letter-spacing expands 0.08em -> 0.14em, opacity: 0 -> 1 (#EAE42F)
  //    - Headline slides up into position (y: 25 -> 0, opacity: 0 -> 1)
  //    - Narrative slides in (y: 20 -> 0, opacity: 0 -> 1)
  //    - 3 Deliverable items slide in sequentially (stagger: 0.1s, x: -20 -> 0, opacity: 0 -> 1)
  //    - 3 Hairline dividers sweep across from left to right (scaleX: 0 -> 1)
  //    - Yellow CTA button enters with back.out(1.4)
  // 4. Tactile Micro-Interactions:
  //    - Deliverable items hover tint (rgba(255, 255, 255, 0.03)) and text slide 3px
  //    - Yellow CTA hover lift (translateY(-2px), box-shadow) and press scale(0.97)
  // 5. Responsive matchMedia: desktop (>=1024px) pinned, tablet (768-1023px) scroll trigger, mobile (<768px) natural flow
  // ─────────────────────────────────────────────────────────────
  function initAuthoritySplitStage() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = document.getElementById('authority-split');
    if (!stage) return;

    const deck         = stage.querySelector('#authority-deck, .authority-deck-container');
    const portraitCol  = stage.querySelector('#authority-portrait-col, .authority-portrait-col');
    const portraitImg  = stage.querySelector('#authority-portrait-img, .authority-portrait-img');
    const contentCol   = stage.querySelector('#authority-content-col, .authority-content-col');
    const eyebrow      = stage.querySelector('#authority-eyebrow, .authority-eyebrow');
    const headline     = stage.querySelector('#authority-headline, .authority-headline');
    const narrative    = stage.querySelector('#authority-narrative, .authority-narrative');
    const items        = Array.from(stage.querySelectorAll('.authority-deliverable-item'));
    const dividers     = Array.from(stage.querySelectorAll('.deliverable-hairline'));
    const ctaBtn       = stage.querySelector('#btn-authority-review, .authority-cta-btn');

    const allTargets = [deck, portraitCol, portraitImg, contentCol, eyebrow, headline, narrative, ...items, ...dividers, ctaBtn].filter(Boolean);

    ScrollTrigger.matchMedia({
      // 1. Desktop 50/50 Split Pinned Stage (>= 1024px)
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial setup for scrub entrance
        if (deck) gsap.set(deck, { y: 35, scale: 0.985, opacity: 0.9 });
        if (portraitImg) gsap.set(portraitImg, { scale: 1.08, yPercent: -12 });
        if (eyebrow) gsap.set(eyebrow, { letterSpacing: '0.08em', opacity: 0, y: 15 });
        if (headline) gsap.set(headline, { y: 25, opacity: 0 });
        if (narrative) gsap.set(narrative, { y: 20, opacity: 0 });
        if (items.length) {
          items.forEach(item => gsap.set(item, { x: -20, opacity: 0 }));
        }
        if (dividers.length) {
          dividers.forEach(div => gsap.set(div, { scaleX: 0, transformOrigin: 'left center' }));
        }
        if (ctaBtn) gsap.set(ctaBtn, { y: 20, opacity: 0 });

        // Master Pinned Timeline: pinned for +=100vh
        const authTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: 'top 68px',
            end: () => '+=' + Math.round(window.innerHeight * 1.0),
            scrub: 1.1,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true
          }
        });

        // 1. Elevated deck container settles into view
        if (deck) {
          authTl.to(deck, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out'
          }, 0);
        }

        // 2. Portrait Parallax & Reveal (scale: 1.08 -> 1.0, yPercent: -12 -> 0)
        if (portraitImg) {
          authTl.to(portraitImg, {
            scale: 1.0,
            yPercent: 0,
            ease: 'none',
            duration: 1.0
          }, 0);
        }

        // 3. Eyebrow letter-tracking expansion & illumination
        if (eyebrow) {
          authTl.to(eyebrow, {
            letterSpacing: '0.14em',
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out'
          }, 0.06);
        }

        // 4. Headline slides up into position
        if (headline) {
          authTl.to(headline, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out'
          }, 0.12);
        }

        // 5. Narrative follows
        if (narrative) {
          authTl.to(narrative, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out'
          }, 0.2);
        }

        // 6. Representation Deliverables Stagger
        if (items.length) {
          authTl.to(items, {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.45,
            ease: 'power3.out'
          }, 0.28);
        }

        // 7. Hairline Dividers sweep across left to right
        if (dividers.length) {
          authTl.to(dividers, {
            scaleX: 1,
            stagger: 0.1,
            duration: 0.45,
            ease: 'power2.out'
          }, 0.34);
        }

        // 8. Primary CTA Button enters
        if (ctaBtn) {
          authTl.to(ctaBtn, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.4)'
          }, 0.58);
        }

        return function () {
          if (authTl && authTl.scrollTrigger) authTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // 2. Tablet View (768px - 1023px): Natural unpinned scroll entrance
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });

        if (portraitImg) {
          tabletTl.fromTo(portraitImg,
            { scale: 1.06, yPercent: -8 },
            { scale: 1.0, yPercent: 0, duration: 0.8, ease: 'power2.out' },
            0
          );
        }

        tabletTl.fromTo([eyebrow, headline, narrative].filter(Boolean),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out' },
          0.1
        );

        if (items.length) {
          tabletTl.fromTo(items,
            { x: -16, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
            '-=0.25'
          );
        }

        if (dividers.length) {
          tabletTl.fromTo(dividers,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
            '-=0.4'
          );
        }

        if (ctaBtn) {
          tabletTl.fromTo(ctaBtn,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' },
            '-=0.2'
          );
        }

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // 3. Mobile Fallback (< 768px): Stacked layout with natural vertical document flow
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
      }
    });

    // Tactile Micro-Interactions:
    // 1. Deliverable items hover tint (rgba(255, 255, 255, 0.03)) and text slide 3px
    items.forEach(item => {
      const text = item.querySelector('.deliverable-text');
      const bullet = item.querySelector('.deliverable-bullet');

      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (text) {
          gsap.to(text, {
            x: 3,
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
        if (bullet) {
          gsap.to(bullet, {
            color: '#FFFFFF',
            textShadow: '0 0 14px rgba(1, 159, 255, 0.8)',
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          backgroundColor: 'transparent',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
        if (text) {
          gsap.to(text, {
            x: 0,
            duration: 0.25,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto'
          });
        }
        if (bullet) {
          gsap.to(bullet, {
            color: '#019FFF',
            textShadow: '0 0 10px rgba(1, 159, 255, 0.35)',
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });

    // 2. Yellow CTA button: hover lift (translateY(-2px), box-shadow) and active press scale(0.97)
    if (ctaBtn) {
      ctaBtn.addEventListener('mouseenter', () => {
        gsap.to(ctaBtn, {
          y: -2,
          boxShadow: '0 10px 24px rgba(234, 228, 47, 0.35)',
          backgroundColor: '#F4EF3E',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });

      ctaBtn.addEventListener('mouseleave', () => {
        gsap.to(ctaBtn, {
          y: 0,
          boxShadow: '0 4px 14px rgba(234, 228, 47, 0.2)',
          backgroundColor: '#EAE42F',
          duration: 0.25,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto'
        });
      });

      ctaBtn.addEventListener('mousedown', () => {
        gsap.to(ctaBtn, {
          scale: 0.97,
          duration: 0.1,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      });

      ctaBtn.addEventListener('mouseup', () => {
        gsap.to(ctaBtn, {
          scale: 1.0,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // AUDIT-RESOLUTION: 50-STATE REVENUE DEPARTMENT (SORABAN SUITE)
  // 1. Pinned Sheet Overlay Wipe: pin preceding dark section for +=85vh
  //    (pin: true, scrub: 1.1, anticipatePin: 1) as white sheet rolls from yPercent: 100 to 0
  // 2. Header Reveal & 3-Card Equalizer Cascade:
  //    - Eyebrow and headline glide up (y: 25 -> 0, opacity: 0 -> 1, ease: 'power3.out')
  //    - 3 Regional cards cascade from left to right (stagger: 0.08s, y: 35 -> 0, opacity: 0 -> 1, ease: 'back.out(1.4)')
  //    - State labels expand letter-tracking (0.08em to 0.14em) in brand cyan (#019FFF)
  // 3. Statutory Callout Dock: scale: 0.97 -> 1.0, y: 20 -> 0, opacity: 0 -> 1
  // 4. Tactile Card Hover Micro-Physics:
  //    - Active card lifts (translateY(-5px) scale(1.015)), blooms shadow & cyan top beam
  //    - Sibling cards drop to 0.7 opacity
  // 5. Responsive matchMedia: desktop (>=1024px) 3-col, tablet (768-1023px), mobile (<768px) stack
  // ─────────────────────────────────────────────────────────────
  function initStateDeskTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const authStage  = document.getElementById('authority-split');
    const stage      = document.getElementById('state-desk');
    if (!stage) return;

    const deck       = stage.querySelector('#state-deck-container, .state-deck-container');
    const eyebrow    = stage.querySelector('#state-desk-eyebrow, .state-desk-eyebrow');
    const h2         = stage.querySelector('#state-desk-h2, .state-desk-h2');
    const lede       = stage.querySelector('#state-desk-lede, .state-desk-lede');
    const cards      = Array.from(stage.querySelectorAll('.state-card'));
    const tags       = Array.from(stage.querySelectorAll('.state-tag'));
    const statutory  = stage.querySelector('#statutory-callout-card, .statutory-callout-card');

    const allTargets = [deck, eyebrow, h2, lede, ...cards, ...tags, statutory].filter(Boolean);

    ScrollTrigger.matchMedia({
      // 1. Desktop Sheet Overlay Wipe (>= 1024px)
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // Initial setup for scrubbed entrance
        if (deck) gsap.set(deck, { yPercent: 100, force3D: true });
        if (eyebrow) gsap.set(eyebrow, { y: 25, opacity: 0, letterSpacing: '0.08em' });
        if (h2) gsap.set(h2, { y: 25, opacity: 0 });
        if (lede) gsap.set(lede, { y: 20, opacity: 0 });
        if (cards.length) {
          cards.forEach(card => gsap.set(card, { y: 35, opacity: 0 }));
        }
        if (tags.length) {
          tags.forEach(tag => gsap.set(tag, { letterSpacing: '0.08em' }));
        }
        if (statutory) gsap.set(statutory, { scale: 0.97, y: 20, opacity: 0 });

        // Master Pinned Timeline: Pin preceding dark section briefly for +=85vh
        // as the white sheet rolls smoothly upward from yPercent: 100 to 0
        const triggerTarget = authStage || stage;
        const wipeTl = gsap.timeline({
          scrollTrigger: {
            id: 'state-desk-wipe',
            trigger: triggerTarget,
            start: 'bottom bottom',
            end: () => '+=' + Math.round(window.innerHeight * 0.85),
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // 1. White sheet rolls smoothly upward from yPercent: 100 to 0
        if (deck) {
          wipeTl.to(deck, {
            yPercent: 0,
            ease: 'none',
            duration: 1.0,
            force3D: true
          }, 0);
        }

        // Preceding dark deck subtly dims and scales for Soraban depth card stacking
        const authDeck = authStage ? authStage.querySelector('#authority-deck') : null;
        if (authDeck) {
          wipeTl.to(authDeck, {
            scale: 0.97,
            opacity: 0.4,
            ease: 'none',
            duration: 0.7
          }, 0);
        }

        // 2. Header Reveal (Eyebrow & Headline glide up into view)
        const headElements = [eyebrow, h2, lede].filter(Boolean);
        if (headElements.length) {
          wipeTl.to(headElements, {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.35,
            ease: 'power3.out'
          }, 0.35);
        }

        // Eyebrow letter-tracking expansion in brand cyan
        if (eyebrow) {
          wipeTl.to(eyebrow, {
            letterSpacing: '0.14em',
            duration: 0.35,
            ease: 'power2.out'
          }, 0.35);
        }

        // State labels letter-tracking expansion in brand cyan (#019FFF)
        if (tags.length) {
          wipeTl.to(tags, {
            letterSpacing: '0.14em',
            stagger: 0.08,
            duration: 0.4,
            ease: 'power2.out'
          }, 0.42);
        }

        // 3 Regional department cards cascade in from left to right
        if (cards.length) {
          wipeTl.to(cards, {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: 'back.out(1.4)'
          }, 0.42);
        }

        // 3. Statutory Callout Card Docking with elevated scale pop
        if (statutory) {
          wipeTl.to(statutory, {
            scale: 1.0,
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.5)'
          }, 0.65);
        }

        return function () {
          if (wipeTl && wipeTl.scrollTrigger) wipeTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
          if (authDeck) gsap.set(authDeck, { clearProps: 'all' });
        };
      },

      // 2. Tablet View (768px - 1023px): Natural unpinned scroll entrance
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });

        tabletTl.fromTo([eyebrow, h2, lede].filter(Boolean),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out' }
        );

        if (cards.length) {
          tabletTl.fromTo(cards,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.4)' },
            '-=0.25'
          );
        }

        if (statutory) {
          tabletTl.fromTo(statutory,
            { scale: 0.97, y: 15, opacity: 0 },
            { scale: 1.0, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' },
            '-=0.2'
          );
        }

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // 3. Mobile Fallback (< 768px): Stacked vertical flow
      '(max-width: 767px)': function () {
        gsap.set(allTargets, { clearProps: 'all' });
      }
    });

    // 4. Tactile Card Hover Micro-Physics
    cards.forEach(card => {
      const beam = card.querySelector('.state-card-top-beam');
      const tag  = card.querySelector('.state-tag');

      card.addEventListener('mouseenter', () => {
        // Sibling cards drop to 0.7 opacity
        cards.forEach(other => {
          if (other !== card) {
            gsap.to(other, {
              opacity: 0.7,
              scale: 0.99,
              duration: 0.3,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              overwrite: 'auto'
            });
          }
        });

        gsap.to(card, {
          y: -5,
          scale: 1.015,
          opacity: 1,
          borderColor: '#019FFF',
          boxShadow: '0 20px 40px -12px rgba(1, 159, 255, 0.16), 0 0 0 1px #019FFF',
          duration: 0.3,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          overwrite: 'auto',
          zIndex: 10
        });

        if (beam) {
          gsap.to(beam, {
            backgroundColor: '#019FFF',
            boxShadow: '0 0 12px rgba(1, 159, 255, 0.8)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        if (tag) {
          gsap.to(tag, {
            letterSpacing: '0.16em',
            backgroundColor: 'rgba(1, 159, 255, 0.14)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        cards.forEach(c => {
          gsap.to(c, {
            y: 0,
            scale: 1,
            opacity: 1,
            borderColor: '#E3E8ED',
            boxShadow: '0 4px 16px rgba(10, 28, 40, 0.04)',
            duration: 0.3,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            overwrite: 'auto',
            zIndex: 1
          });
          const b = c.querySelector('.state-card-top-beam');
          if (b) {
            gsap.to(b, {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
          const t = c.querySelector('.state-tag');
          if (t) {
            gsap.to(t, {
              letterSpacing: '0.14em',
              backgroundColor: 'rgba(1, 159, 255, 0.08)',
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // MEET-UNCLE-PAT: CIRCULAR 230 THESIS DECK & PRACTITIONER PANEL
  // 1. Pinned Stage Architecture:
  //    - Pin the thesis section for +=110vh using GSAP ScrollTrigger (pin: true, scrub: 1.1, anticipatePin: 1)
  //    - The dark container enters as an elevated rounded deck (border-radius: 36px 36px 0 0; background: #0E1621; box-shadow: 0 -35px 70px rgba(0, 0, 0, 0.55); border-top: 1px solid rgba(255, 255, 255, 0.16);)
  // 2. Practitioner Photo Parallax & Vignette:
  //    - Radial vignette mask
  //    - Photo scales slowly down from scale: 1.08 to 1.0, yPercent: -15 to 0
  // 3. Thesis Reveal & Gold Beam Strike:
  //    - Monospace eyebrow drifts in with letter-tracking expansion (0.08em to 0.16em)
  //    - Sentence 1 reveals via crisp masked slide-up (y: 30px to 0, opacity: 0 to 1, ease: 'power3.out')
  //    - Climax punchline snaps into place with illuminated gold flare (#EAE42F) & glowing text-shadow
  // 4. Laser Divider Sweep:
  //    - 1px cyan-to-yellow horizontal gradient divider sweeps across (scaleX: 0 to 1, transform-origin: center, ease: 'power2.out')
  // ─────────────────────────────────────────────────────────────
  // MEET-UNCLE-PAT: PHILOSOPHY & VOICE RULES CARD-STACKING TRANSITIONS
  // 1. Pinned Stage Architecture (Soraban Stack):
  //    - Pins #pat-hero-stage for +=95vh
  //    - Hero recedes into the background: scale: 0.96, y: -25px, opacity: 0.25, filter: blur(6px)
  //    - Elevated white deck (#owl-philosophy-deck) climbs upward over the pinned hero
  // 2. Left Column Content Reveal:
  //    - Eyebrow letter-tracking expands from 0.08em to 0.14em, y: 25 -> 0, opacity: 0 -> 1
  //    - Title unmasks and slides in (y: 30 -> 0, opacity: 0 -> 1)
  //    - Lede and narrative paragraphs cascade in sequentially
  // 3. Right Column: The Five Voice Rules Card & Laser Top Beam:
  //    - Voice card enters with elastic elevation: y: 40 -> 0, opacity: 0 -> 1, scale: 0.96 -> 1.0 (ease: back.out(1.3))
  //    - Laser top beam sweeps across: scaleX: 0 -> 1
  //    - 5 Voice Rule items cascade sequentially from left to right (stagger: 0.06s, x: -16 -> 0, opacity: 0 -> 1)
  // 4. Guardrail Transition:
  //    - ScrollTrigger reveal for #guardrail-callout (y: 25 -> 0, opacity: 0 -> 1)
  // 5. Tactile Micro-Interactions:
  //    - Voice card hover lift & cyan top beam glow
  //    - Voice rule item hover horizontal slide (translateX: 5px)
  // ─────────────────────────────────────────────────────────────
  function initUnclePatPhilosophyTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const heroStage   = document.getElementById('pat-hero-stage');
    const philStage   = document.getElementById('owl-philosophy-stage');
    if (!philStage) return;

    const deck        = philStage.querySelector('#owl-philosophy-deck, .owl-philosophy-deck');
    const markCol     = philStage.querySelector('#owl-mark-col, .owl-mark-col');
    const eyebrow     = philStage.querySelector('#mark-eyebrow, .eyebrow');
    const title       = philStage.querySelector('#mark-title, h2');
    const lede        = philStage.querySelector('#mark-lede, .lede');
    const desc1       = philStage.querySelector('#mark-desc-1, .mark-desc-1');
    const desc2       = philStage.querySelector('#mark-desc-2, .mark-desc-2');
    const voiceCard   = philStage.querySelector('#voice-rules-card, .voice-rules-card');
    const topBeam     = philStage.querySelector('#voice-card-top-beam, .voice-card-top-beam');
    const voiceItems  = Array.from(philStage.querySelectorAll('.voice-rule-item'));
    const guardStage  = document.getElementById('guardrail-stage');
    const guardCallout= document.getElementById('guardrail-callout');

    const allTargets = [deck, markCol, eyebrow, title, lede, desc1, desc2, voiceCard, topBeam, ...voiceItems].filter(Boolean);

    ScrollTrigger.matchMedia({
      // ── 1. Desktop & Large Screens (>= 1024px): Pinned Card-Stacking Scrub ──
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          if (heroStage) gsap.set(heroStage, { clearProps: 'all' });
          return;
        }

        // Initial setup for scrubbed card stack entrance
        if (deck) gsap.set(deck, { y: 120, force3D: true });
        if (eyebrow) gsap.set(eyebrow, { y: 25, opacity: 0, letterSpacing: '0.08em' });
        if (title) gsap.set(title, { y: 30, opacity: 0 });
        const textElements = [lede, desc1, desc2].filter(Boolean);
        if (textElements.length) gsap.set(textElements, { y: 22, opacity: 0 });
        if (voiceCard) gsap.set(voiceCard, { y: 40, opacity: 0, scale: 0.96, force3D: true });
        if (topBeam) gsap.set(topBeam, { scaleX: 0 });
        if (voiceItems.length) gsap.set(voiceItems, { x: -16, opacity: 0 });

        let stackTl;

        if (heroStage) {
          // Master Timeline: Pin Hero while Philosophy Deck climbs over it
          stackTl = gsap.timeline({
            scrollTrigger: {
              id: 'pat-philosophy-pin',
              trigger: heroStage,
              start: 'top top',
              end: () => '+=' + Math.round(window.innerHeight * 1.0),
              pin: true,
              pinSpacing: false,
              scrub: 1.1,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          });

          // 1. Hero recedes smoothly into background
          stackTl.to(heroStage, {
            scale: 0.96,
            y: -25,
            opacity: 0.25,
            filter: 'blur(6px)',
            ease: 'none',
            duration: 0.7
          }, 0);

          // 2. Philosophy Deck climbs up over the pinned hero
          if (deck) {
            stackTl.to(deck, {
              y: 0,
              ease: 'power2.out',
              duration: 0.75
            }, 0);
          }
        } else {
          stackTl = gsap.timeline({
            scrollTrigger: {
              trigger: philStage,
              start: 'top 80%',
              scrub: 1.1
            }
          });
          if (deck) {
            stackTl.to(deck, { y: 0, duration: 0.5, ease: 'power2.out' }, 0);
          }
        }

        // 3. Left Column Content Reveals
        if (eyebrow) {
          stackTl.to(eyebrow, {
            y: 0,
            opacity: 1,
            letterSpacing: '0.14em',
            duration: 0.35,
            ease: 'power2.out'
          }, 0.25);
        }

        if (title) {
          stackTl.to(title, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out'
          }, 0.3);
        }

        if (textElements.length) {
          stackTl.to(textElements, {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.38,
            ease: 'power2.out'
          }, 0.35);
        }

        // 4. Right Column Voice Rules Card Reveal
        if (voiceCard) {
          stackTl.to(voiceCard, {
            y: 0,
            opacity: 1,
            scale: 1.0,
            duration: 0.45,
            ease: 'back.out(1.3)'
          }, 0.32);
        }

        if (topBeam) {
          stackTl.to(topBeam, {
            scaleX: 1,
            duration: 0.4,
            ease: 'power2.out'
          }, 0.45);
        }

        if (voiceItems.length) {
          stackTl.to(voiceItems, {
            x: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.35,
            ease: 'power2.out'
          }, 0.42);
        }

        // Guardrail Entrance Trigger
        let guardTl;
        if (guardStage && guardCallout) {
          gsap.set(guardCallout, { y: 30, opacity: 0 });
          guardTl = gsap.timeline({
            scrollTrigger: {
              trigger: guardStage,
              start: 'top 82%',
              toggleActions: 'play none none none'
            }
          });
          guardTl.to(guardCallout, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out'
          });
        }

        return function () {
          if (stackTl && stackTl.scrollTrigger) stackTl.scrollTrigger.kill();
          if (guardTl && guardTl.scrollTrigger) guardTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
          if (heroStage) gsap.set(heroStage, { clearProps: 'all' });
          if (guardCallout) gsap.set(guardCallout, { clearProps: 'all' });
        };
      },

      // ── 2. Tablet View (768px - 1023px): Natural unpinned scroll entrance ──
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: philStage,
            start: 'top 78%',
            toggleActions: 'play none none none'
          }
        });

        if (deck) {
          tabletTl.fromTo(deck,
            { y: 40, opacity: 0.9 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            0
          );
        }

        if (eyebrow) {
          tabletTl.fromTo(eyebrow,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            0.1
          );
        }

        if (title) {
          tabletTl.fromTo(title,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
            0.18
          );
        }

        const textElements = [lede, desc1, desc2].filter(Boolean);
        if (textElements.length) {
          tabletTl.fromTo(textElements,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out' },
            0.24
          );
        }

        if (voiceCard) {
          tabletTl.fromTo(voiceCard,
            { y: 30, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1.0, duration: 0.5, ease: 'back.out(1.3)' },
            0.22
          );
        }

        if (voiceItems.length) {
          tabletTl.fromTo(voiceItems,
            { x: -12, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.05, duration: 0.35, ease: 'power2.out' },
            0.32
          );
        }

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // ── 3. Mobile (< 768px): Natural flow with smooth ScrollTrigger reveals ──
      '(max-width: 767px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          if (heroStage) gsap.set(heroStage, { clearProps: 'all' });
          if (guardCallout) gsap.set(guardCallout, { clearProps: 'all' });
          return;
        }

        const mobDeckTl = gsap.timeline({
          scrollTrigger: {
            trigger: philStage,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        if (deck) {
          mobDeckTl.fromTo(deck,
            { y: 30, opacity: 0.95 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
            0
          );
        }

        if (eyebrow) {
          mobDeckTl.fromTo(eyebrow,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
            0.1
          );
        }

        if (title) {
          mobDeckTl.fromTo(title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
            0.15
          );
        }

        const textEls = [lede, desc1, desc2].filter(Boolean);
        if (textEls.length) {
          mobDeckTl.fromTo(textEls,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.38, ease: 'power2.out' },
            0.2
          );
        }

        if (voiceCard) {
          mobDeckTl.fromTo(voiceCard,
            { y: 25, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1.0, duration: 0.45, ease: 'back.out(1.2)' },
            0.25
          );
        }

        if (voiceItems.length) {
          mobDeckTl.fromTo(voiceItems,
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
            0.32
          );
        }

        return function () {
          if (mobDeckTl && mobDeckTl.scrollTrigger) mobDeckTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      }
    });

    // Tactile micro-interactions for Voice Rules card
    if (voiceCard) {
      voiceCard.addEventListener('mouseenter', () => {
        gsap.to(voiceCard, {
          y: -4,
          borderColor: 'rgba(1, 159, 255, 0.45)',
          boxShadow: '0 16px 36px rgba(1, 159, 255, 0.12), 0 4px 16px rgba(10, 28, 40, 0.06)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        if (topBeam) {
          gsap.to(topBeam, {
            backgroundColor: '#019FFF',
            boxShadow: '0 0 16px rgba(1, 159, 255, 0.7)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });

      voiceCard.addEventListener('mouseleave', () => {
        gsap.to(voiceCard, {
          y: 0,
          borderColor: 'var(--line)',
          boxShadow: '0 4px 20px rgba(10, 28, 40, 0.05)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        if (topBeam) {
          gsap.to(topBeam, {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    }

    voiceItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          x: 5,
          backgroundColor: 'rgba(1, 159, 255, 0.04)',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          x: 0,
          backgroundColor: 'transparent',
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // MEET-UNCLE-PAT: CIRCULAR 230 THESIS DECK & PRACTITIONER PANEL
  function initCircular230ThesisDeck() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const stage = document.getElementById('thesis-stage');
    if (!stage) return;

    const deck       = stage.querySelector('#thesis-deck-container, .thesis-deck-container');
    const bgImg      = stage.querySelector('#thesis-bg-img, .thesis-bg-img');
    const eyebrow    = stage.querySelector('#thesis-eyebrow, .thesis-eyebrow');
    const leadH2     = stage.querySelector('#thesis-headline-lead, .thesis-headline-lead');
    const climaxH2   = stage.querySelector('#thesis-headline-climax, .thesis-headline-climax');
    const divider    = stage.querySelector('#thesis-laser-divider, .thesis-laser-divider');

    const allTargets = [deck, bgImg, eyebrow, leadH2, climaxH2, divider].filter(Boolean);

    ScrollTrigger.matchMedia({
      // ── 1. Desktop & Large Screens (>= 1024px): Smooth Parallax & Entrance ──
      '(min-width: 1024px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        // 1. Practitioner Photo Parallax Scrub across section
        let parallaxTween;
        if (bgImg) {
          parallaxTween = gsap.fromTo(bgImg,
            { scale: 1.12, yPercent: -14 },
            {
              scale: 1.0,
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: stage,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.0
              }
            }
          );
        }

        // 2. Crisp Staggered Content Reveal on Section Enter
        const thesisTl = gsap.timeline({
          scrollTrigger: {
            id: 'circular-230-thesis-reveal',
            trigger: stage,
            start: 'top 72%',
            toggleActions: 'play none none none'
          }
        });

        if (eyebrow) {
          thesisTl.fromTo(eyebrow,
            { y: 22, opacity: 0, letterSpacing: '0.08em' },
            { y: 0, opacity: 1, letterSpacing: '0.16em', duration: 0.5, ease: 'power2.out' },
            0.08
          );
        }

        if (leadH2) {
          thesisTl.fromTo(leadH2,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
            0.2
          );
        }

        if (climaxH2) {
          thesisTl.fromTo(climaxH2,
            { y: 28, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1.0, duration: 0.55, ease: 'back.out(1.4)' },
            0.35
          );
        }

        if (divider) {
          thesisTl.fromTo(divider,
            { scaleX: 0, transformOrigin: 'center center' },
            { scaleX: 1, duration: 0.55, ease: 'power2.out' },
            0.46
          );
        }

        return function () {
          if (parallaxTween && parallaxTween.scrollTrigger) parallaxTween.scrollTrigger.kill();
          if (thesisTl && thesisTl.scrollTrigger) thesisTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // ── 2. Tablet View (768px - 1023px): Natural unpinned scroll entrance ──
      '(min-width: 768px) and (max-width: 1023px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const tabletTl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });

        if (bgImg) {
          tabletTl.fromTo(bgImg,
            { scale: 1.06, yPercent: -8 },
            { scale: 1.0, yPercent: 0, duration: 0.8, ease: 'power2.out' },
            0
          );
        }

        if (eyebrow) {
          tabletTl.fromTo(eyebrow,
            { y: 20, opacity: 0, letterSpacing: '0.08em' },
            { y: 0, opacity: 1, letterSpacing: '0.16em', duration: 0.45, ease: 'power2.out' },
            0.1
          );
        }

        if (leadH2) {
          tabletTl.fromTo(leadH2,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
            0.2
          );
        }

        if (climaxH2) {
          tabletTl.fromTo(climaxH2,
            { y: 25, opacity: 0, scale: 0.97 },
            { y: 0, opacity: 1, scale: 1.0, duration: 0.5, ease: 'back.out(1.4)' },
            0.32
          );
        }

        if (divider) {
          tabletTl.fromTo(divider,
            { scaleX: 0, transformOrigin: 'center center' },
            { scaleX: 1, duration: 0.5, ease: 'power2.out' },
            0.42
          );
        }

        return function () {
          if (tabletTl && tabletTl.scrollTrigger) tabletTl.scrollTrigger.kill();
          gsap.set(allTargets, { clearProps: 'all' });
        };
      },

      // ── 3. Mobile Fallback (< 768px): Natural vertical document flow with smooth entrance ──
      '(max-width: 767px)': function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set(allTargets, { clearProps: 'all' });
          return;
        }

        const mobileElements = [eyebrow, leadH2, climaxH2, divider].filter(Boolean);
        if (mobileElements.length) {
          gsap.fromTo(mobileElements,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stage,
                start: 'top 82%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // MEET-UNCLE-PAT: PRACTICE & TEAM CREDENTIAL DECK
  // ─────────────────────────────────────────────────────────────
  function initCredentialDeck() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var stage      = document.getElementById('credential-deck-stage');
    var container  = document.getElementById('credential-deck-container');
    var eyebrow    = document.getElementById('credential-eyebrow');
    var headline   = document.getElementById('credential-headline');
    var lede       = document.getElementById('credential-lede');
    var cards      = document.querySelectorAll('.credential-card');
    var tags       = document.querySelectorAll('.cred-tag');
    var ctaWrap    = document.getElementById('credential-cta-wrap');

    if (!stage || !container || cards.length === 0) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Skip all animation for accessibility — just show content
      return;
    }

    // ── Initial hidden states ──────────────────────────────────────
    if (eyebrow)  gsap.set(eyebrow,  { y: 22, opacity: 0 });
    if (headline) gsap.set(headline, { y: 22, opacity: 0 });
    if (lede)     gsap.set(lede,     { y: 18, opacity: 0 });
    gsap.set(cards,  { y: 32, opacity: 0 });
    gsap.set(tags,   { letterSpacing: '0.08em' });
    if (ctaWrap)  gsap.set(ctaWrap,  { y: 18, opacity: 0, scale: 0.95 });

    // ── Single timeline triggered on section enter — no pin, no spacer ──
    // Works identically on desktop, tablet and mobile.
    var tl = gsap.timeline({
      scrollTrigger: {
        id: 'credential-deck-enter',
        trigger: stage,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // 1. Eyebrow → Headline → Lede staggered reveal
    if (eyebrow) {
      tl.to(eyebrow,
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        0
      );
    }
    if (headline) {
      tl.to(headline,
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        0.08
      );
    }
    if (lede) {
      tl.to(lede,
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        0.16
      );
    }

    // 2. Card cascade — left → right with Soraban-style back.out spring
    tl.to(cards,
      {
        y: 0, opacity: 1,
        duration: 0.55,
        ease: 'back.out(1.4)',
        stagger: 0.09
      },
      0.26
    );

    // 3. Tag letter-spacing expansion
    tl.to(tags,
      { letterSpacing: '0.14em', duration: 0.4, ease: 'power2.out', stagger: 0.09 },
      0.34
    );

    // 4. CTA spring pop
    if (ctaWrap) {
      tl.to(ctaWrap,
        { y: 0, opacity: 1, scale: 1.0, duration: 0.55, ease: 'back.out(1.6)' },
        0.58
      );
    }
  }

  // Export to window for external invocation
  window.initFreeHelpHeroTransition = initFreeHelpHeroTransition;
  window.initDiagnosticToolsAndBridgeTransition = initDiagnosticToolsAndBridgeTransition;
  window.initComplimentaryReviewSplitStage = initComplimentaryReviewSplitStage;
  window.initIndustryGuidesMatrix = initIndustryGuidesMatrix;
  window.initAuditResolutionHero = initAuditResolutionHero;
  window.initNoticeDiagnosticStage = initNoticeDiagnosticStage;
  window.initResolutionTiersLedger = initResolutionTiersLedger;
  window.initAuthoritySplitStage = initAuthoritySplitStage;
  window.initStateDeskTransition = initStateDeskTransition;
  window.initUnclePatPhilosophyTransition = initUnclePatPhilosophyTransition;
  window.initCircular230ThesisDeck = initCircular230ThesisDeck;
  window.initCredentialDeck = initCredentialDeck;
  window.initBusinessTransitions = initBusinessTransitions;
  window.initAppointmentsTransitions = initAppointmentsTransitions;
  window.initFileRoomTransitions = initFileRoomTransitions;
  window.initLegalPoliciesTransitions = initLegalPoliciesTransitions;
  window.initResourcesTransitions = initResourcesTransitions;

})(window, document);




