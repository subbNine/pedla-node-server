module.exports = class SmsService {
	constructor(smsGateway) {
		this.smsGateway = smsGateway;
	}

	send({ to, message }) {
		this.smsGateway.send({ to, message });
	}
};
