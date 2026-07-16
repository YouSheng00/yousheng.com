// Minimal interactions for the template.
// Replace / extend as you wire up real content.

(() => {
  const dock = document.querySelector('.dock');
  if (!dock) return;

  // Active state on dock links (placeholder routing).
  dock.addEventListener('click', (e) => {
    const link = e.target.closest('.dock__link');
    if (!link) return;
    dock.querySelectorAll('.dock__link').forEach((el) => el.classList.remove('is-active'));
    link.classList.add('is-active');
  });

  // Theme toggle — flips the root class AND persists choice to localStorage
  // so the next page (and the next visit) opens in the same theme.
  const toggle = dock.querySelector('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('theme-light');
      try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
    });
  }

  // Back action — uses browser history if available, falls back to href.
  document.querySelectorAll('[data-back]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });

  // Video loop windows — clips a self-hosted <video> to one or more
  // [start, end] segments (in seconds). Supports two forms:
  //   • data-loop-segments='[[s,e],[s,e],...]'  multi-segment loop
  //   • data-loop-start / data-loop-end          single segment shorthand
  // Multi-segment plays segments back-to-back, then loops to the first.
  document.querySelectorAll('video[data-loop-segments], video[data-loop-start]').forEach((v) => {
    let segments;
    if (v.dataset.loopSegments) {
      try { segments = JSON.parse(v.dataset.loopSegments); } catch (e) { return; }
    } else {
      const start = parseFloat(v.dataset.loopStart) || 0;
      const end = parseFloat(v.dataset.loopEnd);
      if (!Number.isFinite(end)) return;
      segments = [[start, end]];
    }
    if (!Array.isArray(segments) || segments.length === 0) return;

    let i = 0;
    const seekTo = (idx) => {
      const [s] = segments[idx];
      v.currentTime = s;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    v.addEventListener('loadedmetadata', () => seekTo(0));
    v.addEventListener('timeupdate', () => {
      const [, e] = segments[i];
      if (v.currentTime >= e) {
        i = (i + 1) % segments.length;
        seekTo(i);
      }
    });
  });

  // WIP overlay — intercepts clicks on [data-wip] links and shows a "coming soon" modal.
  const wipOverlay = document.getElementById('wipOverlay');
  if (wipOverlay) {
    const openWip = () => {
      wipOverlay.classList.add('is-open');
      wipOverlay.removeAttribute('aria-hidden');
      wipOverlay.querySelector('.wip-card__close')?.focus();
    };
    const closeWip = () => {
      wipOverlay.classList.remove('is-open');
      wipOverlay.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('[data-wip]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openWip();
      });
    });

    wipOverlay.querySelector('.wip-card__close')?.addEventListener('click', closeWip);
    wipOverlay.addEventListener('click', (e) => {
      if (e.target === wipOverlay) closeWip();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wipOverlay.classList.contains('is-open')) closeWip();
    });
  }

  // Slide embeds — the brand-overview slides are fixed desktop
  // compositions. On small screens, render the iframe at a desktop
  // width and scale it down to fit, preserving the layout instead of
  // letting it clip. CSS (≤768px) sets the fixed iframe size +
  // transform-origin; this just supplies the scale factor.
  const slideFrames = document.querySelectorAll('.slide-embed > iframe');
  if (slideFrames.length) {
    const SLIDE_W = 1100;
    const slideMq = window.matchMedia('(max-width: 768px)');
    const fitSlides = () => {
      slideFrames.forEach((frame) => {
        frame.style.transform = slideMq.matches
          ? `scale(${frame.parentElement.clientWidth / SLIDE_W})`
          : '';
      });
    };
    slideMq.addEventListener('change', fitSlides);
    window.addEventListener('resize', fitSlides);
    fitSlides();
  }

  // Lazy reveal cards on scroll.
  const cards = document.querySelectorAll('.card');
  if ('IntersectionObserver' in window && cards.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      io.observe(card);
    });
  }

  // Container-query scale FALLBACK — the hero/card iframes are fixed 1280px
  // desktop compositions scaled to fit via `transform: scale(100cqw / 1280px)`.
  // Some embedded browsers (notably WeChat's built-in browser) don't support
  // container-query units, so the scale silently fails and the frame sits at
  // its raw 1280px — leaving a dark gap on the right. Drive the same scale from
  // JS so it works everywhere: this inline transform overrides the cqw one and
  // computes the identical value in modern browsers.
  const cqFrames = document.querySelectorAll('iframe[style*="1280px"]');
  if (cqFrames.length) {
    const FIT_W = 1280;
    const fitCq = () => {
      cqFrames.forEach((frame) => {
        const w = frame.parentElement ? frame.parentElement.clientWidth : 0;
        if (w) frame.style.transform = `scale(${w / FIT_W})`;
      });
    };
    window.addEventListener('resize', fitCq);
    window.addEventListener('load', fitCq);
    fitCq();
  }

  // ---------------------------------------------------------------------------
  // Lazy, memory-safe media embeds — the mobile-Safari crash fix.
  //
  // The homepage cards used to mount THREE live <iframe> documents (each a full
  // desktop page in its own render context, one running 7 infinite animations)
  // plus an autoplay preload="auto" <video>, all at once. On iOS Safari that
  // blows the per-tab memory budget: the page loads, then dies on scroll with
  // "A problem repeatedly occurred". (Instagram's in-app webview gets a bigger
  // budget, which is why it survived there.)
  //
  // Fix mirrors the reference site (upset.ch): nothing preloads, and only the
  // embed currently on screen is live. iframes carry data-src instead of src so
  // they load nothing until observed; the video is preload="none" with no
  // autoplay. We mount/play on enter and, on small screens, unmount/pause on
  // exit — so at most ~one heavy context is ever alive. Desktop has memory to
  // spare, so there we mount-and-keep (no teardown) to preserve the live feel.
  const lazyFrames = Array.from(document.querySelectorAll('iframe[data-src]'));
  const lazyVideos = Array.from(document.querySelectorAll('video[data-lazy-video]'));
  const embeds = lazyFrames.map((el) => ({ el, isFrame: true }))
    .concat(lazyVideos.map((el) => ({ el, isFrame: false })));

  if (embeds.length) {
    const smallScreen = window.matchMedia('(max-width: 900px)');

    const mountFrame = (f) => {
      if (!f.getAttribute('src') && f.dataset.src) {
        // Fade the iframe in over its poster only once it has painted, so there
        // is no flash of a blank/loading frame.
        f.addEventListener('load', () => f.classList.add('is-shown'), { once: true });
        f.setAttribute('src', f.dataset.src);
      } else if (f.getAttribute('src')) {
        f.classList.add('is-shown');
      }
    };
    const unmountFrame = (f) => {
      // Fade back to the poster, then drop src to free the WebKit render context.
      f.classList.remove('is-shown');
      if (f.getAttribute('src')) f.removeAttribute('src');
    };
    const playVideo = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    const pauseVideo = (v) => { try { v.pause(); } catch (e) {} };
    const isVisible = (r, vh) => r.bottom > 0 && r.top < vh && r.height > 0;

    const reconcile = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (smallScreen.matches) {
        // Phones: exactly ONE live embed — the card nearest the viewport centre
        // (i.e. the one you're looking at). A hard cap of one heavy context is
        // what keeps iOS Safari under its per-tab memory budget; every card
        // still animates as it scrolls through the middle of the screen.
        const centre = vh / 2;
        let best = null;
        let bestDist = Infinity;
        embeds.forEach(({ el }) => {
          const r = el.getBoundingClientRect();
          if (!isVisible(r, vh)) return;
          const dist = Math.abs((r.top + r.bottom) / 2 - centre);
          if (dist < bestDist) { bestDist = dist; best = el; }
        });
        embeds.forEach(({ el, isFrame }) => {
          const live = el === best;
          if (isFrame) { live ? mountFrame(el) : unmountFrame(el); }
          else { live ? playVideo(el) : pauseVideo(el); }
        });
      } else {
        // Desktop has memory to spare: mount frames as they enter and keep them
        // (preserves the always-live feel); videos play while visible.
        embeds.forEach(({ el, isFrame }) => {
          const visible = isVisible(el.getBoundingClientRect(), vh);
          if (isFrame) { if (visible) mountFrame(el); }
          else { visible ? playVideo(el) : pauseVideo(el); }
        });
      }
    };

    // rAF-throttle so the scroll stays smooth on low-end phones.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; reconcile(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    smallScreen.addEventListener('change', reconcile);
    reconcile();
  }
})();
