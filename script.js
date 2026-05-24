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
})();
