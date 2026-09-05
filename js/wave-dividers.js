/**
 * Westcoast Rippers — wave-dividers.js
 * Replaces canvas sine-wave dividers with the classic CSS ocean-wave animation
 * (repeating SVG background scrolled via @keyframes wave + swell).
 */
(function () {
  'use strict';

  var WAVE_SVG = 'https://cdn.kcak11.com/codepen_assets/wave_animation/wave.svg';

  function initDivider(wrap) {
    var fromColor = wrap.querySelector('canvas')
      ? (wrap.querySelector('canvas').dataset.to || '#040D1A')
      : '#040D1A';

    // Remove the canvas element
    var canvas = wrap.querySelector('canvas');
    if (canvas) wrap.removeChild(canvas);

    // Ocean container
    var ocean = document.createElement('div');
    ocean.className = 'kcak-ocean';
    ocean.style.cssText = [
      'position:relative',
      'width:100%',
      'height:90px',
      'background:' + fromColor,
      'overflow:hidden',
      'line-height:0',
      'margin-top:-2px',
      'margin-bottom:-2px',
    ].join(';');

    // Back wave layer
    var wave1 = document.createElement('div');
    wave1.className = 'kcak-wave kcak-wave--1';

    // Front wave layer (swell)
    var wave2 = document.createElement('div');
    wave2.className = 'kcak-wave kcak-wave--2';

    ocean.appendChild(wave1);
    ocean.appendChild(wave2);
    wrap.appendChild(ocean);
  }

  // Inject the keyframe CSS once
  function injectStyles() {
    if (document.getElementById('kcak-wave-styles')) return;

    var style = document.createElement('style');
    style.id = 'kcak-wave-styles';
    style.textContent = [
      '.kcak-wave {',
      '  background: url(' + WAVE_SVG + ') repeat-x;',
      '  position: absolute;',
      '  top: -108px;',      /* scale from 198px original to fit 90px container */
      '  width: 6400px;',
      '  height: 108px;',
      '  animation: kcakWave 7s cubic-bezier(0.36,0.45,0.63,0.53) infinite;',
      '  transform: translate3d(0,0,0);',
      '  background-size: auto 108px;',
      '}',
      '.kcak-wave--2 {',
      '  top: -95px;',
      '  animation: kcakWave 7s cubic-bezier(0.36,0.45,0.63,0.53) -0.125s infinite,',
      '             kcakSwell 7s ease -1.25s infinite;',
      '  opacity: 0.8;',
      '}',
      '@keyframes kcakWave {',
      '  0%   { margin-left: 0; }',
      '  100% { margin-left: -1600px; }',
      '}',
      '@keyframes kcakSwell {',
      '  0%, 100% { transform: translate3d(0,-14px,0); }',
      '  50%      { transform: translate3d(0, 3px,0); }',
      '}',
    ].join('\n');

    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    document.querySelectorAll('.wave-divider-wrap').forEach(initDivider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
