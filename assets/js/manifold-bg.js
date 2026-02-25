(function () {
  var canvas = document.getElementById("manifold-bg");
  if (!canvas) {
    return;
  }

  var ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  var TAU = Math.PI * 2;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var width = 0;
  var height = 0;
  var topOffset = 0;
  var cx = 0;
  var cy = 0;
  var diskR = 0;
  var lastFrameTime = 0;
  var frameInterval = 1000 / 34;
  var start = performance.now();
  var geodesicSeeds = [];
  var SPEED = 0.5;

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
        phase: i * 0.31
      });
    }
  }

  function updateDensity() {
    if (width <= 640) {
      frameInterval = 1000 / 24;
      initSeeds(16);
    } else if (width <= 1100) {
      frameInterval = 1000 / 30;
      initSeeds(22);
    } else {
      frameInterval = 1000 / 34;
      initSeeds(28);
    }
  }

  function resize() {
    var masthead = document.querySelector(".masthead");
    topOffset = masthead ? Math.ceil(masthead.getBoundingClientRect().height) : 0;
    width = window.innerWidth;
    height = Math.max(1, window.innerHeight - topOffset);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.top = topOffset + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateDensity();
  }

  function unitPoint(theta) {
    return { x: Math.cos(theta), y: Math.sin(theta) };
  }

  function unitToScreen(p) {
    return { x: cx + p.x * diskR, y: cy + p.y * diskR };
  }

  function drawDiskBase(t) {
    var driftX = Math.sin(t * 0.22) * width * 0.018;
    var driftY = Math.cos(t * 0.28) * height * 0.018;
    cx = width * 0.5 + driftX;
    cy = height * 0.53 + driftY;
    diskR = Math.max(width, height) * 0.49;

    var background = ctx.createRadialGradient(
      width * 0.5,
      height * 0.52,
      0,
      width * 0.5,
      height * 0.52,
      Math.max(width, height) * 0.8
    );
    background.addColorStop(0, "rgba(22, 52, 33, 0.23)");
    background.addColorStop(1, "rgba(5, 8, 5, 0)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    var disk = ctx.createRadialGradient(
      cx - diskR * 0.13,
      cy - diskR * 0.08,
      diskR * 0.14,
      cx,
      cy,
      diskR
    );
    disk.addColorStop(0, "rgba(86, 230, 138, 0.12)");
    disk.addColorStop(1, "rgba(33, 95, 57, 0.02)");
    ctx.fillStyle = disk;
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.fill();

    ctx.lineWidth = 1.3;
    ctx.strokeStyle = "rgba(150, 255, 190, 0.24)";
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, diskR, 0, TAU);
    ctx.clip();

    var ringAlpha = 0.07 + 0.03 * Math.sin(t * 0.6);
    for (var i = 1; i <= 5; i += 1) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(120, 215, 150, " + (ringAlpha * (1 - i / 7)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(cx, cy, diskR * (i / 6), 0, TAU);
      ctx.stroke();
    }

    var spokes = 12;
    var spokeRotation = t * 0.12;
    ctx.strokeStyle = "rgba(120, 215, 150, 0.055)";
    for (var s = 0; s < spokes; s += 1) {
      var a = spokeRotation + (s / spokes) * TAU;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * diskR, cy + Math.sin(a) * diskR);
      ctx.lineTo(cx - Math.cos(a) * diskR, cy - Math.sin(a) * diskR);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGeodesic(u, v, alpha, color) {
    var det = u.x * v.y - u.y * v.x;
    ctx.strokeStyle = color.replace("__A__", alpha.toFixed(3));
    ctx.lineWidth = 1.05;

    if (Math.abs(det) < 0.028) {
      var su = unitToScreen(u);
      var sv = unitToScreen(v);
      ctx.beginPath();
      ctx.moveTo(su.x, su.y);
      ctx.lineTo(sv.x, sv.y);
      ctx.stroke();
      return;
    }

    var c = {
      x: (v.y - u.y) / det,
      y: (u.x - v.x) / det
    };
    var cNormSq = c.x * c.x + c.y * c.y;
    var rSq = cNormSq - 1;
    if (rSq <= 0) {
      return;
    }

    var r = Math.sqrt(rSq);
    var a1 = Math.atan2(u.y - c.y, u.x - c.x);
    var a2 = Math.atan2(v.y - c.y, v.x - c.x);
    var d1 = normalizeAngle(a2 - a1);
    var d2 = d1 > 0 ? d1 - TAU : d1 + TAU;

    var m1 = a1 + d1 * 0.5;
    var m2 = a1 + d2 * 0.5;
    var p1x = c.x + r * Math.cos(m1);
    var p1y = c.y + r * Math.sin(m1);
    var p2x = c.x + r * Math.cos(m2);
    var p2y = c.y + r * Math.sin(m2);

    var inside1 = p1x * p1x + p1y * p1y < 1;
    var delta = inside1 ? d1 : d2;

    var segments = Math.max(18, Math.ceil(Math.abs(delta) * 16));
    var first = true;
    ctx.beginPath();
    for (var i = 0; i <= segments; i += 1) {
      var t = i / segments;
      var ang = a1 + delta * t;
      var px = c.x + r * Math.cos(ang);
      var py = c.y + r * Math.sin(ang);
      var sp = unitToScreen({ x: px, y: py });
      if (first) {
        ctx.moveTo(sp.x, sp.y);
        first = false;
      } else {
        ctx.lineTo(sp.x, sp.y);
      }
    }
    ctx.stroke();
  }

  function renderFrame(now) {
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

    var rot = animT * 0.16 + 0.08 * Math.sin(animT * 0.5);
    var wobble = 0.15 * Math.cos(animT * 0.42);
    var focus = ((Math.sin(animT * 0.85) + 1) * 0.5) * (geodesicSeeds.length - 1);

    for (var i = 0; i < geodesicSeeds.length; i += 1) {
      var s = geodesicSeeds[i];
      var pulse = Math.exp(-Math.pow((i - focus) / 3.3, 2));
      var alpha = 0.05 + pulse * 0.2;

      var a = s.a + rot + 0.05 * Math.sin(animT * 0.9 + s.phase);
      var b = s.b - rot * 0.36 + wobble + 0.09 * Math.sin(animT * 0.65 + s.phase * 1.8);
      var u = unitPoint(a);
      var v = unitPoint(b);

      var color = i % 3 === 0 ? "rgba(112, 240, 161, __A__)" : "rgba(84, 206, 139, __A__)";
      drawGeodesic(u, v, alpha, color);
    }

    ctx.restore();
    window.requestAnimationFrame(renderFrame);
  }

  window.addEventListener("resize", resize);

  resize();
  renderFrame(performance.now());
})();
