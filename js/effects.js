/**
 * Westcoast Rippers — effects.js
 * Parallax hero, canvas ripple, foam particles, logo creak
 */
(function () {
  'use strict';

  /* ── PARALLAX HERO LAYERS ───────────────────────────── */
  const heroImg   = document.getElementById('heroImg');
  const pwLayers  = document.querySelectorAll('.pw-layer');

  function onScroll() {
    const sy = window.scrollY;
    // Hero image slow drift upward
    if (heroImg) {
      heroImg.style.transform = `translateY(${sy * 0.3}px)`;
    }
    // Wave layers at different parallax speeds
    pwLayers.forEach(function (layer, i) {
      const speed = [0.08, 0.14, 0.22][i] || 0.1;
      layer.style.transform = `translateX(var(--drift, 0px)) translateY(${-sy * speed}px)`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── CANVAS WATER RIPPLE ON MOUSE MOVE ─────────────── */
  const rippleCanvas = document.getElementById('rippleCanvas');
  if (rippleCanvas) {
    const ctx = rippleCanvas.getContext('2d');
    let W, H, cols, rows;
    let cur, prev;
    const DAMP = 0.985;
    const RADIUS = 4;

    function resizeRipple() {
      W = rippleCanvas.width  = rippleCanvas.offsetWidth;
      H = rippleCanvas.height = rippleCanvas.offsetHeight;
      cols = W;
      rows = H;
      cur  = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);
    }

    function dropAt(x, y, strength) {
      x = Math.round(x); y = Math.round(y);
      for (let dy = -RADIUS; dy <= RADIUS; dy++) {
        for (let dx = -RADIUS; dx <= RADIUS; dx++) {
          if (dx*dx + dy*dy <= RADIUS*RADIUS) {
            const nx = x+dx, ny = y+dy;
            if (nx>=0 && nx<cols && ny>=0 && ny<rows) {
              prev[ny*cols+nx] += strength;
            }
          }
        }
      }
    }

    let lastDrop = 0;
    function handleMouseMove(e) {
      const now = Date.now();
      if (now - lastDrop < 30) return;
      lastDrop = now;
      const rect = rippleCanvas.getBoundingClientRect();
      dropAt(e.clientX - rect.left, e.clientY - rect.top, 280);
    }

    // Touch support
    function handleTouch(e) {
      const rect = rippleCanvas.getBoundingClientRect();
      Array.from(e.changedTouches).forEach(function(t) {
        dropAt(t.clientX - rect.left, t.clientY - rect.top, 200);
      });
    }

    rippleCanvas.parentElement.addEventListener('mousemove', handleMouseMove);
    rippleCanvas.parentElement.addEventListener('touchmove', handleTouch, { passive: true });

    // Occasional random drops for ambient feel
    function randomDrop() {
      if (W && H) {
        dropAt(
          Math.random() * cols,
          Math.random() * rows * 0.7,
          120 + Math.random() * 80
        );
      }
      setTimeout(randomDrop, 800 + Math.random() * 1400);
    }
    randomDrop();

    function stepRipple() {
      const img = ctx.createImageData(W, H);
      const d   = img.data;

      for (let y = 1; y < rows-1; y++) {
        for (let x = 1; x < cols-1; x++) {
          const i = y*cols + x;
          const val = (
            prev[i-1] + prev[i+1] +
            prev[(y-1)*cols+x] + prev[(y+1)*cols+x]
          ) / 2 - cur[i];
          cur[i] = val * DAMP;

          // Map wave height to blue-white shimmer pixel
          const v = Math.max(0, Math.min(255, cur[i] + 128));
          const pi = (y*cols + x) * 4;
          // Only show wave crests (v>140) as bright blue/white pixels
          if (v > 140) {
            const intensity = ((v - 140) / 115);
            d[pi]   = Math.round(30  + intensity * 180);  // R
            d[pi+1] = Math.round(120 + intensity * 120);  // G
            d[pi+2] = Math.round(200 + intensity * 55);   // B
            d[pi+3] = Math.round(intensity * 200);        // A
          }
        }
      }

      ctx.putImageData(img, 0, 0);

      // Swap buffers
      const tmp = prev; prev = cur; cur = tmp;
      requestAnimationFrame(stepRipple);
    }

    window.addEventListener('resize', resizeRipple);
    resizeRipple();
    stepRipple();
  }


  /* ── FOAM PARTICLE SYSTEM ───────────────────────────── */
  const foamCanvas = document.getElementById('foamCanvas');
  if (foamCanvas) {
    const fctx = foamCanvas.getContext('2d');
    const particles = [];
    const MAX_PARTICLES = 90;

    function resizeFoam() {
      foamCanvas.width  = foamCanvas.offsetWidth;
      foamCanvas.height = foamCanvas.offsetHeight;
    }

    function spawnParticle() {
      return {
        x:     Math.random() * foamCanvas.width,
        y:     foamCanvas.height * (0.6 + Math.random() * 0.4),
        vx:    (Math.random() - 0.5) * 0.6,
        vy:    -(0.4 + Math.random() * 1.2),
        r:     1 + Math.random() * 3,
        alpha: 0.6 + Math.random() * 0.4,
        life:  0,
        maxLife: 60 + Math.random() * 100,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.04,
      };
    }

    function tickFoam() {
      fctx.clearRect(0, 0, foamCanvas.width, foamCanvas.height);

      // Spawn
      while (particles.length < MAX_PARTICLES) {
        particles.push(spawnParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.3;
        p.y += p.vy;
        p.vy *= 0.996; // gentle deceleration

        const progress = p.life / p.maxLife;
        const alpha = p.alpha * (1 - Math.pow(progress, 1.5));

        fctx.beginPath();
        fctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Colour: foam white with blue tint
        const blue  = Math.round(180 + 75 * (1 - progress));
        const green = Math.round(200 + 55 * (1 - progress));
        fctx.fillStyle = `rgba(220, ${green}, ${blue}, ${alpha})`;
        fctx.fill();

        if (p.life >= p.maxLife || p.y < foamCanvas.height * 0.1) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(tickFoam);
    }

    window.addEventListener('resize', resizeFoam);
    resizeFoam();
    tickFoam();
  }


  /* ── LOGO CREAK EASTER EGG ──────────────────────────── */
  const navBrand = document.getElementById('navBrand');
  const navLogo  = document.getElementById('navLogo');

  // Generate creak sound via Web Audio API — no file needed
  function playCreak() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ac = new AudioContext();

      // Oscillator rope-creak: pitched noise burst
      function makeCreak(freq, startTime, dur, gain) {
        const osc   = ac.createOscillator();
        const dist  = ac.createWaveShaper();
        const gainN = ac.createGain();

        // Make a distortion curve for the creak texture
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
        }
        dist.curve = curve;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.linearRampToValueAtTime(freq * 0.6, startTime + dur);

        gainN.gain.setValueAtTime(0, startTime);
        gainN.gain.linearRampToValueAtTime(gain, startTime + 0.02);
        gainN.gain.linearRampToValueAtTime(0, startTime + dur);

        osc.connect(dist);
        dist.connect(gainN);
        gainN.connect(ac.destination);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.05);
      }

      const t = ac.currentTime;
      makeCreak(180, t,        0.18, 0.08);
      makeCreak(220, t + 0.12, 0.22, 0.06);
      makeCreak(160, t + 0.28, 0.16, 0.07);
      makeCreak(200, t + 0.38, 0.20, 0.05);

      // Heavy thud for the helm settling
      const buf  = ac.createBuffer(1, ac.sampleRate * 0.15, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.04));
      }
      const src  = ac.createBufferSource();
      const filt = ac.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 180;
      const gn = ac.createGain();
      gn.gain.value = 0.4;
      src.buffer = buf;
      src.connect(filt);
      filt.connect(gn);
      gn.connect(ac.destination);
      src.start(t + 0.5);
    } catch(e) { /* Audio API not available — fail silently */ }
  }

  let spinCooldown = false;
  if (navBrand && navLogo) {
    navBrand.addEventListener('click', function (e) {
      if (spinCooldown) return;
      spinCooldown = true;
      navLogo.classList.add('is-spinning');
      playCreak();
      navLogo.addEventListener('animationend', function onEnd() {
        navLogo.classList.remove('is-spinning');
        navLogo.removeEventListener('animationend', onEnd);
        setTimeout(function() { spinCooldown = false; }, 400);
      });
    });
  }

})();
