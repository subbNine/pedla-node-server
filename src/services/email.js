module.exports = class EmailService {
	constructor(emailGateway) {
		this.emailGateway = emailGateway;
	}

	send({ from, to, subject, text, html }) {
		const options = { from, to, subject };

		if (text) {
			options.text = text;
		}
		if (html) {
			options.html = html;
		}

		this.emailGateway.send(options);
	}
};
