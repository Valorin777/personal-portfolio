const tile = (name, image, alt) => `<div class="sig-proof"><img src="assets/v5/${image}" alt="${alt}" decoding="async"><span>${name}</span></div>`;

// The shape, facets and engraved monogram are original portfolio artwork.
export const signatureArt = `
  <div class="sig-face sig-face-front" aria-hidden="true">
    <div class="sig-face-surface"></div>
    <span class="sig-socket"></span>
    <p class="sig-micro sig-series"><span>ЛИЧНОЕ</span><span>ПОРТФОЛИО</span></p>
    <svg class="sig-engraving" viewBox="0 0 180 128" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="sig-violet" x1="20" y1="0" x2="145" y2="115" gradientUnits="userSpaceOnUse"><stop stop-color="#f0dfff"/><stop offset=".43" stop-color="#bea5fd"/><stop offset="1" stop-color="#8164c9"/></linearGradient>
        <linearGradient id="sig-amber" x1="103" y1="20" x2="147" y2="114" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe4b5"/><stop offset="1" stop-color="#db9277"/></linearGradient>
      </defs>
      <path d="M20 44 68 12h49l44 31v43l-44 31H68L20 84Z M69 12v105m49-105v105M20 44h141M20 84h141M37 33v64m106-65v65" stroke="#b59ddd" stroke-opacity=".32" stroke-width=".8"/>
      <path d="M20 47V32l12-8m119 6 10 7v15m0 30v12l-14 8M31 96l-11-8V75" stroke="#d2bdff" stroke-opacity=".66" stroke-width="1.1"/>
      <path d="m39 47 28-19 28 11v21l-5 4 8 5v21l-27 18-32-12Zm15 7v13l27-18-12-4Zm0 40 16 6 13-9V77Z" fill="url(#sig-violet)" fill-rule="evenodd"/>
      <path d="M94 41 111 30v28l12 4 15-10V36l16-10v69l-16 11V69l-14 10-30-11Z" fill="url(#sig-amber)"/>
      <path d="m40 47 27-19 28 11m44-4 15-9v69l-15 10M39 96l32 12 27-18" stroke="#fcf1ff" stroke-opacity=".5" stroke-width=".9"/>
      <path d="M11 63h11m137 0h11M92 4v13m0 94v13" stroke="#e8ba9e" stroke-width="1.1"/>
    </svg>
    <p class="sig-word">VALORIN</p>
    <div class="sig-bands"><span>WEB</span><span>PRODUCT</span><span>MOTION</span></div>
  </div>
  <div class="sig-face sig-face-back" aria-hidden="true">
    <div class="sig-face-surface"></div>
    <span class="sig-socket"></span>
    <p class="sig-micro sig-proof-title">ТРИ ПРОЕКТА</p>
    <div class="sig-proofs">
      ${tile('LAST WIND', 'last-wind-field.webp', '')}
      ${tile('RUSJET', 'rusjet-dusk-poster.jpg', '')}
      ${tile('ОКОШКО', 'okoshko-og.png', '')}
    </div>
    <p class="sig-micro sig-back-id"><span>В. ЧАРЫГИН</span><span>VALORIN</span></p>
  </div>
  <span class="sig-edge sig-edge-left" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-right" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-top" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-bottom" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-tl" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-tr" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-bl" aria-hidden="true"></span>
  <span class="sig-edge sig-edge-br" aria-hidden="true"></span>
`;
