(function () {
  var roles = ["mathematics", "machine learning", "optimisation", "geometry"];
  var el = document.getElementById("nav-typed-role");

  if (!el || !roles.length) {
    return;
  }

  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function tick() {
    var current = roles[roleIndex];

    if (deleting) {
      charIndex = Math.max(0, charIndex - 1);
      el.textContent = current.slice(0, charIndex);
    } else {
      charIndex = Math.min(current.length, charIndex + 1);
      el.textContent = current.slice(0, charIndex);
    }

    var delay = deleting ? 60 : 95;

    if (!deleting && charIndex === current.length) {
      delay = 1100;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 260;
    }

    window.setTimeout(tick, delay);
  }

  tick();
})();
