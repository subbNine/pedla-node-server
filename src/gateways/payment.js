const https = require("https");

const { PAYMENT_SK_TEST } = require("../config");

const requestPromisified = (options, params) =>
	new Promise((resolve, reject) => {
		const req = https
			.request(options, (resp) => {
				let data = "";
				resp.on("data", (chunk) => {
					data += chunk;
				});
				resp.on("end", () => {
					resolve(JSON.parse(data));
				});
			})
			.on("error", (error) => {
				reject(error);
			});

		req.write(params);

		req.end();
	});

class PaymentGateway {
	hostname = "api.paystack.co";
	port = 443;
	headers = {
		Authorization: "Bearer " + PAYMENT_SK_TEST,
		"Content-Type": "application/json",
	};

	async initialize(params) {
		const jsonParams = JSON.stringify(params);

		const options = {
			hostname: this.hostname,
			port: this.port,
			path: "/transaction/initialize",
			method: "POST",
			headers: this.headers,
		};

		const resp = await requestPromisified(options, jsonParams);

		return resp;
	}
}

module.exports = new PaymentGateway();
