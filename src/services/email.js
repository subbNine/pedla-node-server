module.exports = class EmailService {
	constructor(emailGateway) {
		this.emailGateway = emailGateway;
	}

	send({ from, to, subject, text, html }) {
		this.emailGateway.send({ from, to, subject, text, html });
	}
};
