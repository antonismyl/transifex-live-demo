(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Transifex Live — illustrative onReady hook.
  // Guarded so it no-ops when live.js fails to load (placeholder API key).
  function onLiveReady() {
    if (typeof Transifex === 'undefined' || !Transifex.live) return;

    Transifex.live.onTranslatePage(function (langCode) {
      var badge = document.getElementById('tx-badge');
      if (!badge) return;
      var name = langCode;
      try {
        if (Transifex.live.hasLanguageCode && Transifex.live.hasLanguageCode(langCode)) {
          var all = Transifex.live.getAllLanguages && Transifex.live.getAllLanguages();
          if (all && all.length) {
            for (var i = 0; i < all.length; i++) {
              if (all[i].code === langCode) { name = all[i].name; break; }
            }
          }
        }
      } catch (e) { /* ignore */ }
      badge.textContent = 'Translated to ' + name;
      badge.classList.add('show');
      clearTimeout(onLiveReady._t);
      onLiveReady._t = setTimeout(function () { badge.classList.remove('show'); }, 2200);
    });
  }

  // Poll briefly for the Transifex global — snippet loads async.
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    if (typeof Transifex !== 'undefined' && Transifex.live && Transifex.live.onReady) {
      clearInterval(iv);
      Transifex.live.onReady(onLiveReady);
    } else if (tries > 10) {
      clearInterval(iv);
    }
  }, 300);

  // Highlight active nav link by URL section
  var path = window.location.pathname.toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var section = href.replace(/^\.+\//, '').split('/')[0];
    if (section && path.indexOf('/' + section) !== -1) a.classList.add('active');
    if (href === '../index.html' && (path.endsWith('/') || path.endsWith('/index.html'))) {
      // handled below
    }
  });

  // Product detail — chip selection demo
  document.querySelectorAll('.options .choices').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var target = e.target.closest('.chip');
      if (!target) return;
      group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('selected'); });
      target.classList.add('selected');
    });
  });
})();
