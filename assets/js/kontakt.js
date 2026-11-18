/*
 * Kontaktformular: sendet im Hintergrund an Formspree und zeigt die
 * Bestätigung direkt auf der Seite. Lehnt Formspree das ab (z. B. weil
 * reCAPTCHA aktiv ist), wird das Formular klassisch abgeschickt —
 * Formspree übernimmt dann Captcha und Danke-Seite.
 */
(function () {
	var form = document.getElementById('kontaktformular');
	if (!form || !window.fetch || !window.FormData) return;

	var status = document.getElementById('kontakt-status');
	var button = form.querySelector('input[type="submit"]');
	var betreff = form.querySelector('input[name="_subject"]');
	var anliegen = form.querySelector('select[name="anliegen"]');
	var basisBetreff = betreff.value;

	var meldungen = {
		TYPE_EMAIL: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
		REQUIRED_FIELD_MISSING: 'Bitte füllen Sie alle Felder aus.',
		REQUIRED_FIELD_EMPTY: 'Bitte füllen Sie alle Felder aus.'
	};

	function zeige(text) {
		status.textContent = text;
	}

	function bereit() {
		button.disabled = false;
	}

	function klassischAbsenden() {
		// Vor dem Verlassen der Seite zurücksetzen, damit „Zurück“ ein
		// benutzbares Formular zeigt. form.submit() löst kein submit-Event aus.
		bereit();
		zeige('');
		form.submit();
	}

	// Rückkehr per „Zurück“ (Browser-Cache): Formular wieder freigeben.
	window.addEventListener('pageshow', function () {
		bereit();
		zeige('');
	});

	form.addEventListener('reset', function () {
		zeige('');
	});

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		betreff.value = anliegen.value ? basisBetreff + ': ' + anliegen.value : basisBetreff;
		button.disabled = true;
		zeige('Wird gesendet …');

		fetch(form.action, {
			method: 'POST',
			body: new FormData(form),
			headers: { Accept: 'application/json' }
		}).then(function (antwort) {
			if (antwort.ok) {
				form.reset();
				bereit();
				zeige('Vielen Dank! Ihre Nachricht ist bei uns angekommen. Wir melden uns so bald wie möglich.');
				return;
			}
			return antwort.json().catch(function () { return {}; }).then(function (daten) {
				if (antwort.status === 404) {
					// Formular bei Formspree nicht (mehr) eingerichtet: hier bleiben,
					// statt auf eine Fehlerseite zu springen und den Text zu verlieren.
					bereit();
					zeige('Das Formular ist gerade nicht erreichbar. Bitte schreiben Sie uns direkt an info@verein-hfbm.de.');
					return;
				}
				var feldFehler = (daten.errors || []).filter(function (f) { return f.field; });
				if (antwort.status === 422 && feldFehler.length) {
					bereit();
					zeige(meldungen[feldFehler[0].code] || 'Bitte prüfen Sie Ihre Eingaben.');
					return;
				}
				klassischAbsenden();
			});
		}).catch(function () {
			// Kein Netz: hier bleiben, damit die Eingaben nicht verloren gehen.
			bereit();
			zeige('Die Nachricht konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
		});
	});
})();
