/**
 * Westcoast Rippers — effects.js
 * Parallax hero, canvas ripple, foam particles, logo creak
 */
(function () {
  'use strict';

  /* ── PARALLAX HERO LAYERS ───────────────────────────── */
  const heroImg   = document.getElementById('heroImg');

  function onScroll() {
    const sy = window.scrollY;
    if (heroImg) {
      heroImg.style.transform = `translateY(${sy * 0.3}px)`;
    }
    // pw-layers are now CSS-animated via background-position-x — no JS transform needed
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── RIPPLE CANVAS — removed (was O(W×H) per frame, main lag source) ── */
  const rippleCanvas = document.getElementById('rippleCanvas');
  if (rippleCanvas) rippleCanvas.style.display = 'none';


  /* ── FOAM CANVAS — removed (replaced by CSS wave animation) ── */
  const foamCanvas = document.getElementById('foamCanvas');
  if (foamCanvas) foamCanvas.style.display = 'none';


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
