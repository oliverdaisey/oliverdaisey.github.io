(function () {
  var MOBILE_MAX_WIDTH = 1023;
  var nav = document.getElementById("site-nav");

  if (!nav) {
    return;
  }

  var button = nav.querySelector("button");
  var visibleLinks = nav.querySelector(".visible-links");
  var hiddenLinks = nav.querySelector(".hidden-links");

  if (!button || !visibleLinks || !hiddenLinks) {
    return;
  }

  var inMobileDropdownMode = false;
  var HOME_ITEM_CLASS = "masthead__menu-item--lg";

  function moveAll(source, target) {
    while (source.firstElementChild) {
      target.appendChild(source.firstElementChild);
    }
  }

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX_WIDTH;
  }

  function syncNavbarMode() {
    var homeItem = nav.querySelector("." + HOME_ITEM_CLASS);

    if (isMobile()) {
      if (homeItem && homeItem.parentElement === hiddenLinks) {
        visibleLinks.insertBefore(homeItem, visibleLinks.firstElementChild);
      }

      Array.from(visibleLinks.children).forEach(function (node) {
        if (!node.classList || !node.classList.contains(HOME_ITEM_CLASS)) {
          hiddenLinks.appendChild(node);
        }
      });

      button.classList.remove("hidden");
      hiddenLinks.classList.add("hidden");
      inMobileDropdownMode = true;
      return;
    }

    if (inMobileDropdownMode) {
      moveAll(hiddenLinks, visibleLinks);
      hiddenLinks.classList.add("hidden");
      button.classList.add("hidden");
      inMobileDropdownMode = false;
      window.dispatchEvent(new Event("resize"));
    }
  }

  window.addEventListener("resize", function () {
    window.requestAnimationFrame(syncNavbarMode);
  });

  window.addEventListener("load", syncNavbarMode);
  syncNavbarMode();
})();
