module.exports = class EmailService {
	constructor(emailGateway) {
		this.emailGateway = emailGateway;
	}

	send(token) {
		console.log("sending mail", token)
	}
};
