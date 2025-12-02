---
layout: archive
title: "Code"
permalink: /code/
author_profile: true
redirect_from:
  - /code.html
---

{% include base_path %}

On this page are some interactive code cells that demonstrate the functionality of my software packages.

### Laurent Phenomenon Algebra Seed Cell

Type your own Sage code with the functionality of my `LPASeed` class. Documentation available [here](/lp_algebra_seed_docs/classlp__algebra__seed_1_1_l_p_a_seed.html). Source available [here](https://github.com/oliverdaisey/sage/blob/develop/src/sage/combinat/lp_algebra_seed.py) (not yet merged into Sage).

{% include sagecode.html %}

### Circle Rasteriser

Enter an integer radius and see how the circle looks when rasterised onto a square pixel grid.

<div id="circle-rasterizer" style="border:1px solid #e0e0e0;border-radius:8px;padding:16px;margin-top:12px;">
  <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
    <label for="raster-radius" style="font-weight:600;">Radius</label>
    <input id="raster-radius" type="number" value="6" min="1" max="40" style="width:80px;padding:6px 8px;border:1px solid #ccc;border-radius:6px;">
    <button id="rasterize-button" type="button" style="padding:8px 14px;border:1px solid #004b6b;background:#006b9e;color:#fff;border-radius:6px;cursor:pointer;">Rasterise</button>
    <span id="raster-error" style="color:#b00020;font-weight:600;"></span>
  </div>
  <div id="raster-grid" class="raster-grid" style="display:grid;gap:2px;margin-top:16px;justify-content:center;align-content:center;width:360px;height:360px;"></div>
</div>

<script>
(function() {
  const container = document.getElementById('circle-rasterizer');
  if (!container) return;

  const input = document.getElementById('raster-radius');
  const button = document.getElementById('rasterize-button');
  const grid = document.getElementById('raster-grid');
  const error = document.getElementById('raster-error');
  const maxRadius = parseInt(input.max, 10) || 40;
  const maxGridSize = 360;
  const minCellSize = 3;
  const defaultCellSize = 18;
  const gapSize = 1;

  function buildCell(isFilled, x, y) {
    const cell = document.createElement('div');
    cell.className = 'raster-cell' + (isFilled ? ' filled' : '');
    cell.title = `(${x}, ${y})`;
    return cell;
  }

  function rasterize() {
    const radius = parseInt(input.value, 10);
    grid.innerHTML = '';
    error.textContent = '';

    if (Number.isNaN(radius) || radius < 1) {
      error.textContent = 'Please enter a radius of at least 1.';
      return;
    }

    if (radius > maxRadius) {
      error.textContent = `Radius capped at ${maxRadius} to keep the grid readable.`;
      input.value = maxRadius;
      return rasterize();
    }

    const size = radius * 2 + 1;
    const cellSize = Math.min(
      defaultCellSize,
      Math.max(
        minCellSize,
        Math.floor((maxGridSize - gapSize * (size - 1)) / size)
      )
    );

    grid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;
    grid.style.width = `${maxGridSize}px`;
    grid.style.height = `${maxGridSize}px`;
    grid.style.gap = `${gapSize}px`;

    for (let y = radius; y >= -radius; y -= 1) {
      for (let x = -radius; x <= radius; x += 1) {
        const onCircle = (x * x + y * y) <= radius * radius;
        grid.appendChild(buildCell(onCircle, x, y));
      }
    }
  }

  input.addEventListener('input', rasterize);
  button.addEventListener('click', rasterize);

  const baseStyle = document.createElement('style');
  baseStyle.textContent = `
    #circle-rasterizer .raster-grid .raster-cell {
      width: 100%;
      height: 100%;
      background: #f3f6f9;
      border: 1px solid #d0d7df;
      border-radius: 4px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
    }
    #circle-rasterizer .raster-grid .raster-cell.filled {
      background: linear-gradient(135deg, #0d70b8, #0a547f);
      border-color: #0a547f;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.08);
    }
    #rasterize-button:hover {
      background:#005a86;
    }
    #rasterize-button:active {
      background:#004b6b;
    }
  `;
  document.head.appendChild(baseStyle);

  rasterize();
})();
</script>
