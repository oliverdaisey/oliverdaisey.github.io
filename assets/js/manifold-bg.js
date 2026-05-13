(function () {
  var canvas = document.getElementById("manifold-bg");
  if (!canvas) {
    return;
  }

  var ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) {
    return;
  }

  var TAU = Math.PI * 2;
  var width = 0;
  var height = 0;
  var topOffset = 0;
  var cx = 0;
  var cy = 0;
  var diskR = 0;
  var lastFrameTime = 0;
  var frameInterval = 1000 / 28;
  var start = performance.now();
  var geodesicSeeds = [];
  var SPEED = 0.42;
  var running = true;
  var resizePending = false;
  var needsBaseRefresh = true;
  var baseCanvas = document.createElement("canvas");
  var baseCtx = baseCanvas.getContext("2d");
  var renderScale = 1;
  var dpr = 1;
  var lineColorA = "rgba(143, 184, 255, ";
  var lineColorB = "rgba(184, 160, 255, ";

  function fract(x) {
    return x - Math.floor(x);
  }

  function normalizeAngle(a) {
    while (a <= -Math.PI) {
      a += TAU;
    }
    while (a > Math.PI) {
      a -= TAU;
    }
    return a;
  }

  function initSeeds(count) {
    geodesicSeeds = [];
    for (var i = 0; i < count; i += 1) {
      var base = fract(i * 0.61803398875) * TAU;
      var span = (0.38 + fract(i * 0.7548776662) * 0.96) * Math.PI;
      if (span > 1.84 * Math.PI) {
        span = 1.84 * Math.PI;
      }
      geodesicSeeds.push({
        a: base,
        b: base + span,
        phase: i * 0.31,
        useA: i % 3 === 0
      });
    }
  }

  function updateDensity() {
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var threads = navigator.hardwareConcurrency || 4;

    if (reducedMotion) {
      renderScale = 0.72;
      frameInterval = 1000 / 12;
      initSeeds(10);
      return;
    }

    if (width <= 640 || threads <= 4) {
      renderScale = 0.78;
      frameInterval = 1000 / 20;
      initSeeds(12);
    } else if (width <= 1100) {
      renderScale = 0.84;
      frameInterval = 1000 / 24;
      initSeeds(16);
    } else {
      renderScale = 0.9;
      frameInterval = 1000 / 28;
      initSeeds(20);
    }
  }

  function updateBaseLayer() {
    if (!baseCtx || !width || !height) {
      return;
    }

    baseCtx.setTransform(1, 0, 0, 1, 0, 0);
    baseCtx.clearRect(0, 0, width, height);

    var background = baseCtx.createRadialGradient(
      width * 0.5,
      height * 0.52,
      0,
      width * 0.5,
      height * 0.52,
      Math.max(width, height) * 0.8
    );
    background.addColorStop(0, "rgba(24, 36, 64, 0.28)");
    background.addColorStop(1, "rgba(7, 9, 15, 0)");
    baseCtx.fillStyle = background;
    baseCtx.fillRect(0, 0, width, height);

    needsBaseRefresh = false;
  }

  function resize() {
    var masthead = document.querySelector(".masthead");
    topOffset = masthead ? Math.ceil(masthead.getBoundingClientRect().height) : 0;
    width = window.innerWidth;
    height = Math.max(1, window.innerHeight - topOffset);

    updateDensity();

    dpr = Math.min((window.devicePixelRatio || 1) * renderScale, 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.top = topOffset + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    baseCanvas.width = width;
    baseCanvas.height = height;
    needsBaseRefresh = true;
  }

  function queueResize() {
    if (resizePending) {
      return;
    }
    resizePending = true;
    window.requestAnimationFrame(function () {
      resizePending = false;
      resize();
    });
  }

  function drawDiskBase(t) {
    if (needsBaseRefresh) {
      updateBaseLayer();
    }
    ctx.drawImage(baseCanvas, 0, 0);

    var driftX = Math.sin(t * 0.22) * width * 0.014;
    var driftY = Math.cos(t * 0.28) * height * 0.014;
    cx = width * 0.5 + driftX;
    cy = height * 0.53 + driftY;
    diskR = Math.max(width, height) * 0.49;

    var disk = ctx.createRadialGradient(
      cx - diskR * 0.13,
      cy - diskR * 0.08,
      diskR * 0.14,
      cx,
      cy,
      diskR
    );
    disk.addColorStop(0, "rgba(143, 184, 255, 0.12)");
    disk.addColorStop(1, "rgba(40, 60, 110, 0.025)");
    ctx.fillStyle = disk;
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.fill();

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(180, 205, 255, 0.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.clip();

    var ringAlpha = 0.06 + 0.025 * Math.sin(t * 0.6);
    for (var i = 1; i <= 4; i += 1) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(160, 190, 230," + (ringAlpha * (1 - i / 6)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(cx, cy, diskR * (i / 5), 0, TAU);
      ctx.stroke();
    }

    var spokes = 10;
    var spokeRotation = t * 0.1;
    ctx.strokeStyle = "rgba(160, 190, 230,0.045)";
    for (var s = 0; s < spokes; s += 1) {
      var a = spokeRotation + (s / spokes) * TAU;
      var ca = Math.cos(a);
      var sa = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(cx + ca * diskR, cy + sa * diskR);
      ctx.lineTo(cx - ca * diskR, cy - sa * diskR);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGeodesic(ux, uy, vx, vy, alpha, useA) {
    var det = ux * vy - uy * vx;
    ctx.strokeStyle = (useA ? lineColorA : lineColorB) + alpha.toFixed(3) + ")";
    ctx.lineWidth = 1;

    if (Math.abs(det) < 0.035) {
      ctx.beginPath();
      ctx.moveTo(cx + ux * diskR, cy + uy * diskR);
      ctx.lineTo(cx + vx * diskR, cy + vy * diskR);
      ctx.stroke();
      return;
    }

    var ccx = (vy - uy) / det;
    var ccy = (ux - vx) / det;
    var cNormSq = ccx * ccx + ccy * ccy;
    var rSq = cNormSq - 1;
    if (rSq <= 0) {
      return;
    }

    var r = Math.sqrt(rSq);
    var a1 = Math.atan2(uy - ccy, ux - ccx);
    var a2 = Math.atan2(vy - ccy, vx - ccx);
    var d1 = normalizeAngle(a2 - a1);
    var d2 = d1 > 0 ? d1 - TAU : d1 + TAU;

    var m1 = a1 + d1 * 0.5;
    var p1x = ccx + r * Math.cos(m1);
    var p1y = ccy + r * Math.sin(m1);
    var inside1 = p1x * p1x + p1y * p1y < 1;
    var delta = inside1 ? d1 : d2;

    var segments = Math.max(10, Math.ceil(Math.abs(delta) * 10));
    ctx.beginPath();
    for (var i = 0; i <= segments; i += 1) {
      var t = i / segments;
      var ang = a1 + delta * t;
      var px = ccx + r * Math.cos(ang);
      var py = ccy + r * Math.sin(ang);
      var sx = cx + px * diskR;
      var sy = cy + py * diskR;
      if (i === 0) {
        ctx.moveTo(sx, sy);
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();
  }

  function renderFrame(now) {
    if (!running) {
      return;
    }

    if (now - lastFrameTime < frameInterval) {
      window.requestAnimationFrame(renderFrame);
      return;
    }
    lastFrameTime = now;

    var t = (now - start) * 0.001;
    var animT = t * SPEED;

    ctx.clearRect(0, 0, width, height);
    drawDiskBase(animT);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.clip();

    var rot = animT * 0.14 + 0.07 * Math.sin(animT * 0.5);
    var wobble = 0.12 * Math.cos(animT * 0.42);
    var focus = ((Math.sin(animT * 0.8) + 1) * 0.5) * (geodesicSeeds.length - 1);

    for (var i = 0; i < geodesicSeeds.length; i += 1) {
      var s = geodesicSeeds[i];
      var dist = (i - focus) / 3.2;
      var pulse = Math.exp(-(dist * dist));
      var alpha = 0.045 + pulse * 0.16;

      var a = s.a + rot + 0.045 * Math.sin(animT * 0.9 + s.phase);
      var b = s.b - rot * 0.34 + wobble + 0.075 * Math.sin(animT * 0.64 + s.phase * 1.8);
      drawGeodesic(Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b), alpha, s.useA);
    }

    ctx.restore();
    window.requestAnimationFrame(renderFrame);
  }

  function updateRunningState() {
    var nextRunning = document.visibilityState !== "hidden";
    if (nextRunning && !running) {
      running = true;
      lastFrameTime = 0;
      window.requestAnimationFrame(renderFrame);
    } else {
      running = nextRunning;
    }
  }

  window.addEventListener("resize", queueResize);
  document.addEventListener("visibilitychange", updateRunningState);

  resize();
  updateRunningState();
  if (running) {
    renderFrame(performance.now());
  }
})();
