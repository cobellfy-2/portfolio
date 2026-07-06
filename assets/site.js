/* =========================================================
   Julia Köhn — Portfolio  ·  shared behaviour
   ========================================================= */
(function () {
  "use strict";

  /* ---- language: default German, persists across pages ---- */
  var STORE = "jk-lang";
  function getLang() {
    try { return localStorage.getItem(STORE) || "de"; }
    catch (e) { return "de"; }
  }
  function setLang(l) {
    try { localStorage.setItem(STORE, l); } catch (e) {}
  }

  function applyLang(l) {
    document.documentElement.setAttribute("lang", l);
    // swap every element carrying both translations
    var nodes = document.querySelectorAll("[data-de][data-en]");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var txt = l === "en" ? n.getAttribute("data-en") : n.getAttribute("data-de");
      // support simple <br> markers written as \n
      if (txt.indexOf("\\n") !== -1) {
        n.innerHTML = txt.split("\\n").map(escapeHtml).join("<br>");
      } else {
        n.textContent = txt;
      }
    }
    // update toggle buttons
    var btns = document.querySelectorAll(".lang-toggle button");
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.toggle("on", btns[j].getAttribute("data-lang") === l);
    }
    // swap page <title> if provided
    var t = document.querySelector("title");
    if (t && t.getAttribute("data-de")) {
      t.textContent = l === "en" ? t.getAttribute("data-en") : t.getAttribute("data-de");
    }
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- scroll reveal ---- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          // animate skill bars inside
          en.target.querySelectorAll("[data-fill]").forEach(function (b) {
            b.style.width = b.getAttribute("data-fill") + "%";
          });
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---- mobile nav ---- */
  function initNav() {
    var burger = document.querySelector(".burger");
    var links = document.querySelector(".nav-links");
    if (burger && links) {
      burger.addEventListener("click", function () {
        links.classList.toggle("open");
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") links.classList.remove("open");
      });
    }
  }

  /* ---- starfield ---- */
  function initStars() {
    var host = document.querySelector(".stars");
    if (!host) return;
    var n = window.innerWidth < 640 ? 26 : 46;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 5).toFixed(2) + "s";
      var sz = (Math.random() * 1.6 + 1).toFixed(1);
      s.style.width = sz + "px"; s.style.height = sz + "px";
      frag.appendChild(s);
    }
    host.appendChild(frag);
  }

  /* ---- boot ---- */
  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        var l = b.getAttribute("data-lang");
        setLang(l); applyLang(l);
      });
    });
    initReveal();
    initNav();
    initStars();
  });
})();
