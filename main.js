// =============================================
// NEW HORIZON — Falling Pattern + Theme + Scroll
// =============================================

(function () {

  // ── HERO TEXT SPLITTING ───────────────────
  function initHeroText() {
    var h1 = document.querySelector('.hero h1');
    if (!h1) return;

    var text = h1.textContent.trim();
    if (!text) return;

    h1.classList.add('splitting');
    h1.innerHTML = '';
    
    var charIndex = 0;
    var words = text.split(' ');
    
    words.forEach((word, wIdx) => {
      var wordSpan = document.createElement('span');
      wordSpan.style.whiteSpace = 'nowrap';
      wordSpan.style.display = 'inline-block';
      
      word.split('').forEach((char) => {
        var span = document.createElement('span');
        span.textContent = char;
        span.classList.add('char');
        span.style.display = 'inline-block';
        span.style.transitionDelay = (100 + charIndex * 30) + 'ms';
        wordSpan.appendChild(span);
        charIndex++;
      });
      
      h1.appendChild(wordSpan);
      
      if (wIdx < words.length - 1) {
        var space = document.createTextNode(' ');
        h1.appendChild(space);
        charIndex++;
      }
    });

    var sub = document.querySelector('.hero-sub');
    if (sub) {
      setTimeout(() => {
        sub.classList.add('visible');
      }, 500);
    }

    requestAnimationFrame(() => {
      h1.classList.add('visible');
    });
  }

  // ── SCROLL REVEAL ─────────────────────────
  function initScrollReveal() {
    var elements = document.querySelectorAll('.block');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── SCROLL RULER ──────────────────────────
  function initScrollRuler() {
    var indicator = document.querySelector('.ruler-indicator');
    var percentageText = document.querySelector('.ruler-percentage');
    if (!indicator || !percentageText) return;

    var ticking = false;

    function updateRuler() {
      var scrollTop = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
      
      scrollPercent = Math.max(0, Math.min(1, scrollPercent));
      
      indicator.style.top = (scrollPercent * 100) + '%';
      percentageText.textContent = Math.round(scrollPercent * 100) + '%';
      
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateRuler);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateRuler();
  }

  // ── THEME TOGGLE ──────────────────────────
  function initTheme() {
    var toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns.length) return;

    var currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      document.body.classList.add('dark');
    }

    toggleBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (document.body.classList.contains('dark')) {
          document.body.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          document.body.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      });
    });
  }

  // ── BOOTSTRAP ─────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initHeroText();
    initScrollReveal();
    initScrollRuler();
    initTheme();
  });

})();
