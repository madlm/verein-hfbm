/*
 * Kontaktformular: sendet im Hintergrund an Formspree und zeigt die
 * Bestätigung direkt auf der Seite. Klappt das nicht (z. B. weil in
 * Formspree reCAPTCHA aktiv ist oder kein Netz), wird das Formular
 * klassisch abgeschickt — Formspree übernimmt dann Captcha und Danke-Seite.
 */
(function () {
	var form = document.getElementById('kontaktformular');
	if (!form || !window.fetch || !window.FormData) return;

	var status = document.getElementById('kontakt-status');
	var button = form.querySelector('input[type="submit"]');
	var betreff = form.querySelector('input[name="_subject"]');
	var anliegen = form.querySelector('select[name="anliegen"]');
	var basisBetreff = betreff.value;

	function zeige(text) {
		status.textContent = text;
	}

	function klassischAbsenden() {
		// form.submit() löst kein submit-Event aus, also keine Schleife.
		form.submit();
	}

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
				button.disabled = false;
				zeige('Vielen Dank! Ihre Nachricht ist bei uns angekommen. Wir melden uns so bald wie möglich.');
				return;
			}
			return antwort.json().catch(function () { return {}; }).then(function (daten) {
				if (antwort.status === 422 && daten.errors) {
					button.disabled = false;
					zeige('Bitte prüfen Sie Ihre Eingaben: ' + daten.errors.map(function (f) { return f.message; }).join(' '));
					return;
				}
				klassischAbsenden();
			});
		}).catch(klassischAbsenden);
	});
})();
