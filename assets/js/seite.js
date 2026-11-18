/*
 * Kleine Helfer für die Seite – ohne Bibliotheken.
 * Alles funktioniert auch ohne JavaScript, nur etwas weniger bequem.
 */
(function () {
	'use strict';

	/* --- Menü auf kleinen Bildschirmen ---------------------------------- */
	var knopf = document.querySelector('[data-menue-knopf]');
	var menue = document.querySelector('[data-menue]');
	if (knopf && menue) {
		var setzeMenue = function (offen) {
			knopf.setAttribute('aria-expanded', String(offen));
			menue.classList.toggle('ist-offen', offen);
		};
		knopf.addEventListener('click', function () {
			setzeMenue(knopf.getAttribute('aria-expanded') !== 'true');
		});
		menue.addEventListener('click', function (e) {
			if (e.target.closest('a')) setzeMenue(false);
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && knopf.getAttribute('aria-expanded') === 'true') { setzeMenue(false); knopf.focus(); }
		});
	}

	/* --- Kopfzeile: Schatten beim Scrollen ------------------------------- */
	var kopf = document.querySelector('[data-kopfzeile]');
	if (kopf) {
		var pruefe = function () { kopf.classList.toggle('ist-gescrollt', window.scrollY > 8); };
		window.addEventListener('scroll', pruefe, { passive: true });
		pruefe();
	}

	/* --- IBAN kopieren ---------------------------------------------------- */
	if (navigator.clipboard) {
		document.querySelectorAll('[data-kopieren]').forEach(function (k) {
			k.hidden = false;
			var text = k.textContent;
			k.addEventListener('click', function () {
				navigator.clipboard.writeText(k.getAttribute('data-kopieren')).then(function () {
					k.textContent = 'Kopiert ✓';
					setTimeout(function () { k.textContent = text; }, 2000);
				});
			});
		});
	}

	/* --- Links „Unterstützung beantragen“ wählen das Anliegen vor ------- */
	var auswahl = document.getElementById('anliegen');
	document.querySelectorAll('[data-anliegen]').forEach(function (link) {
		link.addEventListener('click', function () {
			if (auswahl) auswahl.value = link.getAttribute('data-anliegen');
		});
	});

	/* --- Bildansicht (Leuchtkasten) --------------------------------------- */
	var kasten = document.querySelector('[data-leuchtkasten]');
	var links = Array.prototype.slice.call(document.querySelectorAll('[data-galerie]'));
	if (kasten && links.length && typeof kasten.showModal === 'function') {
		// gleiche Bilder (Titelbild + Galerie) nur einmal zählen
		var bilder = [];
		links.forEach(function (l) { if (bilder.indexOf(l.href) === -1) bilder.push(l.href); });
		var bild = kasten.querySelector('[data-leuchtkasten-bild]');
		var zaehler = kasten.querySelector('[data-leuchtkasten-zaehler]');
		var aktuell = 0;
		kasten.classList.toggle('leuchtkasten--einzeln', bilder.length < 2);

		var zeige = function (i) {
			aktuell = (i + bilder.length) % bilder.length;
			bild.src = bilder[aktuell];
			bild.alt = 'Bild ' + (aktuell + 1) + ' von ' + bilder.length;
			zaehler.textContent = (aktuell + 1) + ' / ' + bilder.length;
		};
		links.forEach(function (l) {
			l.addEventListener('click', function (e) {
				e.preventDefault();
				zeige(bilder.indexOf(l.href));
				kasten.showModal();
			});
		});
		kasten.querySelector('[data-leuchtkasten-zu]').addEventListener('click', function () { kasten.close(); });
		kasten.querySelector('[data-leuchtkasten-vor]').addEventListener('click', function () { zeige(aktuell + 1); });
		kasten.querySelector('[data-leuchtkasten-zurueck]').addEventListener('click', function () { zeige(aktuell - 1); });
		kasten.addEventListener('click', function (e) { if (e.target === kasten) kasten.close(); });
		kasten.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowRight') zeige(aktuell + 1);
			if (e.key === 'ArrowLeft') zeige(aktuell - 1);
		});
		// Wischen auf dem Handy
		var startX = null;
		kasten.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
		kasten.addEventListener('touchend', function (e) {
			if (startX === null) return;
			var dx = e.changedTouches[0].clientX - startX;
			if (Math.abs(dx) > 50) zeige(aktuell + (dx < 0 ? 1 : -1));
			startX = null;
		});
	}
})();
