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

  // ── 3D PARTICLE ANIMATION ────────────────
  function initParticleAnimation() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = vec4(position, 1.0);',
      '}'
    ].join('\n');

    var fragmentShader = [
      'uniform float u_time;',
      'uniform vec2 u_resolution;',
      'uniform float u_isDark;', 
      'uniform vec4 u_color;',
      'varying vec2 vUv;',
      '',
      'float hash(vec2 p) {',
      '  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);',
      '}',
      '',
      'float noise(vec2 p) {',
      '  vec2 i = floor(p);',
      '  vec2 f = fract(p);',
      '  f = f * f * (3.0 - 2.0 * f);',
      '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);',
      '}',
      '',
      'float fbm(vec2 p) {',
      '  float v = 0.0;',
      '  float a = 0.5;',
      '  vec2 shift = vec2(100.0);',
      '  for (int i = 0; i < 4; ++i) {',
      '    v += a * noise(p);',
      '    p = p * 2.0 + shift;',
      '    a *= 0.5;',
      '  }',
      '  return v;',
      '}',
      '',
      'void main() {',
      '  vec2 pixel_coord = gl_FragCoord.xy;',
      '  float t = u_time * 0.25;', 
      '',
      '  vec2 shape_uv = (vUv * 2.0 - 1.0);',
      '  shape_uv.x *= u_resolution.x / u_resolution.y;',
      '  shape_uv *= 2.4;',
      '',
      '  vec2 warp = vec2(fbm(shape_uv + vec2(t)), fbm(shape_uv + vec2(1.0, t)));',
      '  float n = fbm(shape_uv * 1.0 + warp * 0.6);',
      '  n = clamp(n, 0.0, 0.999);',
      '',
      '  // ---- TOPOGRAPHIC DENSITY BAND SELECTOR ----',
      '  float v = floor(n * 4.0);', // 4 levels: 0, 1, 2, 3
      '  float dSize = 6.0;',
      '  float radius = 0.3;',
      '',
      '  if (v < 1.0) {',
      '    dSize = 10.0; radius = 0.12;', // Band 0: Sparse Large Cells
      '  } else if (v < 2.0) {',
      '    dSize = 4.5;  radius = 0.28;', // Band 1: Medium Sparse
      '  } else if (v < 3.0) {',
      '    dSize = 2.5;  radius = 0.40;', // Band 2: Tight Dense Pack
      '  } else {',
      '    dSize = 6.0;  radius = 0.48;', // Band 3: Overlapped large
      '  }',
      '',
      '  vec2 grid = fract(pixel_coord / dSize);',
      '  float alpha = 1.0 - smoothstep(radius - 0.05, radius, length(grid - 0.5));',
      '',
      '  if (alpha <= 0.001) {',
      '    discard;',
      '  }',
      '',
      '  // --- COLOR GRADIENTS MIXING ---',
      '  float d = (1.0 - vUv.x) + vUv.y;', 
      '  d = clamp(d / 1.7, 0.0, 1.0);',
      '',
      '  vec3 final_color;',
      '  if (u_isDark > 0.5) {',
      '    vec3 col_dark  = vec3(0.01, 0.02, 0.07);',
      '    vec3 col_blue  = vec3(0.04, 0.12, 0.35);',
      '    vec3 col_cyan  = vec3(0.18, 0.55, 0.82);',
      '    vec3 col_white = vec3(0.95, 0.95, 0.98);',
      '',
      '    vec3 dot_col = mix(col_dark, col_blue, smoothstep(0.0, 0.3, d));',
      '    dot_col = mix(dot_col, col_cyan, smoothstep(0.3, 0.6, d));',
      '    dot_col = mix(dot_col, col_white, smoothstep(0.6, 1.0, d));',
      '    final_color = dot_col;',
      '  } else {',
      '    vec3 l_blue = vec3(0.40, 0.52, 0.72);',
      '    final_color = mix(u_color.rgb, l_blue, d * 0.4);',
      '  }',
      '',
      '  gl_FragColor = vec4(final_color, alpha * u_color.a);',
      '}'
    ].join('\n');

    var material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_isDark: { value: 1.0 },
        u_color: { value: new THREE.Vector4(1, 1, 1, 0.35) }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    function resize() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      if (material.uniforms.u_resolution) {
        material.uniforms.u_resolution.value.set(width, height);
      }
    }
    window.addEventListener('resize', resize);
    resize();

    var geometry = new THREE.PlaneGeometry(2, 2);
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function updateMaterialColor() {
      var isDark = document.body.classList.contains('dark');
      if (material.uniforms.u_isDark) {
        material.uniforms.u_isDark.value = isDark ? 1.0 : 0.0;
      }
      if (isDark) {
          material.uniforms.u_color.value.set(1.0, 1.0, 1.0, 0.35); // Lowered for text readability
      } else {
          material.uniforms.u_color.value.set(0.1, 0.12, 0.18, 0.18); // Lowered for light mode
      }
    }

    function animate(time) {
      requestAnimationFrame(animate);
      updateMaterialColor();
      if (material.uniforms.u_time) {
        material.uniforms.u_time.value = time * 0.001;
      }
      renderer.render(scene, camera);
    }
    
    animate(0);
  }

  // ── BOOTSTRAP ─────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initHeroText();
    initScrollReveal();
    initScrollRuler();
    initTheme();
    initParticleAnimation();
  });

})();
