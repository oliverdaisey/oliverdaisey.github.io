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
    <input id="raster-radius" type="number" value="6" min="1" max="100" style="width:80px;padding:6px 8px;border:1px solid #ccc;border-radius:6px;">
    <button id="rasterize-button" type="button" style="padding:8px 14px;border:1px solid #004b6b;background:#006b9e;color:#fff;border-radius:6px;cursor:pointer;">Rasterise</button>
    <span id="raster-error" style="color:#b00020;font-weight:600;"></span>
  </div>
  <div class="raster-grid" style="display:flex;justify-content:center;align-items:center;margin-top:16px;width:360px;height:360px;overflow:hidden;">
    <canvas id="raster-canvas" width="360" height="360" style="width:360px;height:360px;"></canvas>
  </div>
  <div id="zoom-controls" style="display:none;margin-top:12px;">
    <div style="font-weight:600;margin-bottom:6px;">Zoom</div>
    <div style="font-size:0.9em;color:#444;margin-bottom:6px;">When radius &gt; 35, click the circle to inspect a 30×30 window.</div>
    <canvas id="zoom-canvas" width="240" height="240" style="width:240px;height:240px;border:1px solid #d0d7df;border-radius:6px;background:#fff;image-rendering:pixelated;"></canvas>
  </div>
</div>

<script>
(function() {
  const container = document.getElementById('circle-rasterizer');
  if (!container) return;

  const input = document.getElementById('raster-radius');
  const button = document.getElementById('rasterize-button');
  const canvas = document.getElementById('raster-canvas');
  const zoomCanvas = document.getElementById('zoom-canvas');
  const zoomControls = document.getElementById('zoom-controls');
  const error = document.getElementById('raster-error');
  const maxRadius = parseInt(input.max, 10) || 100;
  const maxGridSize = 360;
  const minCellSize = 2;
  const defaultCellSize = 18;
  const gapSize = 0;
  const ctx = canvas && canvas.getContext('2d');
  const zoomCtx = zoomCanvas && zoomCanvas.getContext('2d');
  const zoomSpan = 30;
  let lastRaster = null;

  function setZoomVisibility(radius) {
    if (!zoomControls) return;
    const show = radius > 35;
    zoomControls.style.display = show ? 'block' : 'none';
    if (!show && zoomCtx) {
      zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    }
  }

  function drawZoom(centerX, centerY) {
    if (!lastRaster || !zoomCtx) return;
    const { radius, size } = lastRaster;
    const span = Math.min(zoomSpan, size);
    const half = Math.floor(span / 2);
    const startX = Math.max(0, Math.min(size - span, centerX - half));
    const startY = Math.max(0, Math.min(size - span, centerY - half));
    const zoomCell = Math.max(4, Math.floor(zoomCanvas.width / span));

    zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomCtx.fillStyle = '#f7fbff';
    zoomCtx.fillRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    zoomCtx.strokeStyle = '#d0d7df';
    zoomCtx.lineWidth = 0.8;

    for (let gy = 0; gy < span; gy += 1) {
      for (let gx = 0; gx < span; gx += 1) {
        const gridX = startX + gx;
        const gridY = startY + gy;
        const cx = gridX - radius;
        const cy = radius - gridY;
        if ((cx * cx + cy * cy) <= radius * radius) {
          const dx = gx * zoomCell;
          const dy = gy * zoomCell;
          const grad = zoomCtx.createLinearGradient(dx, dy, dx + zoomCell, dy + zoomCell);
          grad.addColorStop(0, '#0d70b8');
          grad.addColorStop(1, '#0a547f');
          zoomCtx.fillStyle = grad;
          zoomCtx.fillRect(dx, dy, zoomCell, zoomCell);
          zoomCtx.strokeRect(dx + 0.3, dy + 0.3, zoomCell - 0.6, zoomCell - 0.6);
        }
      }
    }
  }

  function rasterize() {
    if (!ctx) return;

    const radius = parseInt(input.value, 10);
    error.textContent = '';
    ctx.clearRect(0, 0, maxGridSize, maxGridSize);

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
    const availablePerCell = Math.floor((maxGridSize - gapSize * (size - 1)) / size);
    const cellSize = Math.min(defaultCellSize, Math.max(minCellSize, availablePerCell));

    const gridSide = cellSize * size + gapSize * (size - 1);
    const scale = gridSide > maxGridSize ? maxGridSize / gridSide : 1;
    const offset = (maxGridSize - gridSide * scale) / 2;

    ctx.save();
    ctx.fillStyle = '#f3f6f9';
    ctx.fillRect(0, 0, maxGridSize, maxGridSize);
    ctx.translate(offset, offset);
    ctx.scale(scale, scale);

    const filledGradient = ctx.createLinearGradient(0, 0, cellSize, cellSize);
    filledGradient.addColorStop(0, '#0d70b8');
    filledGradient.addColorStop(1, '#0a547f');
    ctx.fillStyle = filledGradient;
    ctx.strokeStyle = '#d0d7df';
    ctx.lineWidth = 0.5;

    for (let y = radius; y >= -radius; y -= 1) {
      for (let x = -radius; x <= radius; x += 1) {
        const onCircle = (x * x + y * y) <= radius * radius;
        if (onCircle) {
          const drawX = (x + radius) * (cellSize + gapSize);
          const drawY = (radius - y) * (cellSize + gapSize);
          ctx.fillRect(drawX, drawY, cellSize, cellSize);
          ctx.strokeRect(drawX + 0.25, drawY + 0.25, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }

    ctx.restore();

    lastRaster = {
      radius,
      size,
      cellSize,
      gapSize,
      offset,
      scale
    };
    setZoomVisibility(radius);
  }

  button.addEventListener('click', rasterize);
  canvas.addEventListener('click', (event) => {
    if (!lastRaster || lastRaster.radius <= 35) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    const { scale, offset, cellSize, gapSize, size } = lastRaster;
    const logicalX = (clickX - offset) / scale;
    const logicalY = (clickY - offset) / scale;
    const step = cellSize + gapSize;
    const gridX = Math.floor(logicalX / step);
    const gridY = Math.floor(logicalY / step);
    if (gridX >= 0 && gridX < size && gridY >= 0 && gridY < size) {
      drawZoom(gridX, gridY);
    }
  });

  const baseStyle = document.createElement('style');
  baseStyle.textContent = `
    #raster-canvas {
      background: #f7fbff;
      border: 1px solid #d0d7df;
      border-radius: 8px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
      image-rendering: pixelated;
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
