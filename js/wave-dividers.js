/**
 * Westcoast Rippers — wave-dividers.js
 * Canvas-drawn animated sine-wave dividers between sections.
 * Replaces broken CSS d:path() animation.
 */
(function () {
  'use strict';

  // Parse "#RRGGBB" → {r,g,b}
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function initCanvas(canvas) {
    const fromHex = canvas.dataset.from || '#020810';
    const toHex   = canvas.dataset.to   || '#040D1A';
    const from    = hexToRgb(fromHex);
    const to      = hexToRgb(toHex);

    const ctx = canvas.getContext('2d');
    let W, H, dpr;
    let t = Math.random() * Math.PI * 2; // random phase offset per divider

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W   = canvas.offsetWidth;
      H   = canvas.offsetHeight || 90;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    // Draw one wave layer
    function drawWave(phase, amplitude, speed, yBase, fillR, fillG, fillB, alpha) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 2) {
        const y = yBase
          + Math.sin((x / W) * Math.PI * speed + phase) * amplitude
          + Math.sin((x / W) * Math.PI * speed * 1.7 + phase * 0.8) * amplitude * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = `rgba(${fillR},${fillG},${fillB},${alpha})`;
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background fill (the "from" colour)
      ctx.fillStyle = fromHex;
      ctx.fillRect(0, 0, W, H);

      // 3 wave layers building up to the "to" colour
      // Back wave — most transparent, highest crest
      drawWave(t * 0.7, H * 0.28, 3, H * 0.55, to.r, to.g, to.b, 0.35);
      // Mid wave
      drawWave(t * 1.0 + 1.2, H * 0.22, 4, H * 0.62, to.r, to.g, to.b, 0.55);
      // Front wave — solid, fills the bottom
      drawWave(t * 1.4 + 2.5, H * 0.16, 5, H * 0.70, to.r, to.g, to.b, 1.0);

      // Foam crest highlights on the front wave — bright blue-white lines
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = H * 0.70
          + Math.sin((x / W) * Math.PI * 5 + t * 1.4 + 2.5) * H * 0.16
          + Math.sin((x / W) * Math.PI * 8.5 + t * 1.4 * 0.8) * H * 0.16 * 0.4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(43,191,240,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      t += 0.012;
    }

    function tick() {
      draw();
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', function () {
      resize();
      // Re-apply scale after resize
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    });

    resize();
    tick();
  }

  // Init all wave canvases
  document.querySelectorAll('.wave-divider-canvas').forEach(initCanvas);

})();
