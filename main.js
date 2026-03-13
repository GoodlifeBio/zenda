// =============================================
// NEW HORIZON — Mechanical Waves + Theme + Scroll
// =============================================

(function () {

  // ── THEME TOGGLE ──────────────────────────
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Force dark mode only
    document.body.classList.add('dark');
    btn.style.display = 'none';
  }

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
      // Create a span for the word to prevent it from breaking mid-word
      var wordSpan = document.createElement('span');
      wordSpan.style.whiteSpace = 'nowrap';
      wordSpan.style.display = 'inline-block';
      
      word.split('').forEach((char) => {
        var span = document.createElement('span');
        span.textContent = char;
        span.classList.add('char'); // Use a class for the character spans
        span.style.display = 'inline-block';
        span.style.transitionDelay = (100 + charIndex * 30) + 'ms';
        wordSpan.appendChild(span);
        charIndex++;
      });
      
      h1.appendChild(wordSpan);
      
      // Add a space after the word if it's not the last one
      if (wIdx < words.length - 1) {
        var space = document.createTextNode(' ');
        h1.appendChild(space);
        charIndex++; // Count space in delay timing
      }
    });

    // Subtitle reveal
    var sub = document.querySelector('.hero-sub');
    if (sub) {
      setTimeout(() => {
        sub.classList.add('visible');
      }, 500);
    }

    // Trigger heading reveal
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

  // ── BOOTSTRAP ─────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initHeroText();
    initScrollReveal();
  });

})();
