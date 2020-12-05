module.exports = class SmsService {
	constructor(smsGateway) {
		this.smsGateway = smsGateway;
	}

	send(token) {
		console.log("sending sms", token)
	}
};
