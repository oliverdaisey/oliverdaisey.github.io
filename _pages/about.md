---
permalink: /
title: "Home"
layout: home
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

<section class="home-hero">
  <h1 class="home-hero__title">Home</h1>
</section>

<section class="home-grid" aria-label="Quick links">

  <a class="home-card" href="https://www.google.com/maps/place/Newcastle+upon+Tyne">
    <figure class="home-card__media home-card__media--location" aria-hidden="true">
      <img src="/images/bridges.jpg" alt="" loading="lazy">
    </figure>
    <div class="home-card__body">
      <p class="home-card__kicker">Location</p>
      <h2 class="home-card__title">Newcastle, UK</h2>
    </div>
  </a>

  <a class="home-card" href="/publications/">
    <figure class="home-card__media home-card__media--research" aria-hidden="true">
      <img src="/images/coxeter-projections.png" alt="" loading="lazy">
    </figure>
    <div class="home-card__body">
      <p class="home-card__kicker">Research</p>
      <h2 class="home-card__title">Recent work</h2>
    </div>
  </a>

  <a class="home-card" href="/files/oliver-cv.pdf">
    <figure class="home-card__media home-card__media--cv" aria-hidden="true">
      <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" role="img" focusable="false">
        <defs>
          <linearGradient id="cvsheet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(216,221,233,0.06)"/>
            <stop offset="100%" stop-color="rgba(216,221,233,0.015)"/>
          </linearGradient>
        </defs>
        <!-- back sheet -->
        <rect x="68" y="22" width="120" height="118" rx="2" fill="url(#cvsheet)" stroke="rgba(160,190,230,0.18)" stroke-width="0.8"/>
        <!-- front sheet -->
        <rect x="56" y="14" width="124" height="122" rx="2" fill="rgba(15,19,30,0.85)" stroke="rgba(160,190,230,0.4)" stroke-width="0.9"/>
        <!-- corner mark -->
        <path d="M 160 14 L 180 14 L 180 34 Z" fill="rgba(143,184,255,0.18)" stroke="rgba(160,190,230,0.4)" stroke-width="0.8"/>
        <!-- "name" -->
        <rect x="66" y="28" width="64" height="6" rx="1" fill="rgba(216,221,233,0.55)"/>
        <rect x="66" y="40" width="36" height="3" rx="1" fill="rgba(143,184,255,0.6)"/>
        <!-- divider -->
        <line x1="66" y1="52" x2="170" y2="52" stroke="rgba(160,190,230,0.25)" stroke-width="0.7"/>
        <!-- entries -->
        <g fill="rgba(216,221,233,0.18)">
          <rect x="66" y="60" width="100" height="2.5" rx="1"/>
          <rect x="66" y="66" width="80" height="2.5" rx="1"/>
          <rect x="66" y="72" width="92" height="2.5" rx="1"/>
        </g>
        <g fill="rgba(216,221,233,0.18)">
          <rect x="66" y="86" width="60" height="2.5" rx="1"/>
          <rect x="66" y="92" width="90" height="2.5" rx="1"/>
          <rect x="66" y="98" width="74" height="2.5" rx="1"/>
        </g>
        <g fill="rgba(216,221,233,0.18)">
          <rect x="66" y="112" width="85" height="2.5" rx="1"/>
          <rect x="66" y="118" width="55" height="2.5" rx="1"/>
        </g>
      </svg>
    </figure>
    <div class="home-card__body">
      <p class="home-card__kicker">Curriculum Vitae</p>
      <h2 class="home-card__title">CV <span class="home-card__suffix">(PDF)</span></h2>
    </div>
  </a>

  <a class="home-card" href="/files/">
    <figure class="home-card__media home-card__media--files" aria-hidden="true">
      <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" role="img" focusable="false">
        <g transform="translate(120 78)">
          <!-- stacked tilted panels -->
          <g transform="translate(-18 12) rotate(-8)">
            <rect x="-50" y="-30" width="100" height="60" rx="2" fill="rgba(15,19,30,0.85)" stroke="rgba(160,190,230,0.2)" stroke-width="0.8"/>
          </g>
          <g transform="translate(-4 0) rotate(-2)">
            <rect x="-50" y="-30" width="100" height="60" rx="2" fill="rgba(15,19,30,0.92)" stroke="rgba(160,190,230,0.3)" stroke-width="0.8"/>
            <rect x="-44" y="-22" width="38" height="3" fill="rgba(216,221,233,0.35)"/>
            <rect x="-44" y="-14" width="58" height="2" fill="rgba(216,221,233,0.18)"/>
            <rect x="-44" y="-8" width="48" height="2" fill="rgba(216,221,233,0.18)"/>
          </g>
          <g transform="translate(14 -12) rotate(6)">
            <rect x="-50" y="-30" width="100" height="60" rx="2" fill="rgba(15,19,30,0.95)" stroke="rgba(143,184,255,0.55)" stroke-width="0.9"/>
            <rect x="-44" y="-22" width="42" height="3" fill="rgba(216,221,233,0.7)"/>
            <rect x="-44" y="-14" width="68" height="2" fill="rgba(143,184,255,0.55)"/>
            <rect x="-44" y="-8" width="54" height="2" fill="rgba(216,221,233,0.28)"/>
            <rect x="-44" y="-2" width="60" height="2" fill="rgba(216,221,233,0.28)"/>
            <circle cx="32" cy="-22" r="2.5" fill="#8fb8ff"/>
          </g>
        </g>
      </svg>
    </figure>
    <div class="home-card__body">
      <p class="home-card__kicker">Archive</p>
      <h2 class="home-card__title">Files &amp; talks</h2>
    </div>
  </a>

</section>

