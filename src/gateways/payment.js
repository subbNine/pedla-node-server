const https = require("https");

const { PAYMENT_SK_TEST } = require("../config");
const errors = require("../errors");

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

		if (params) {
			req.write(params);
		}
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

		let resp;

		try {
			resp = await requestPromisified(options, jsonParams);
		} catch (err) {
			errors.error(err);
		}

		return resp;
	}

	async verifyTransaction(reference) {
		const options = {
			hostname: "api.paystack.co",
			port: 443,
			path: `/transaction/verify/${reference}`,
			method: "GET",
			headers: {
				Authorization: this.headers.Authorization,
			},
		};

		const resp = await requestPromisified(options);

		return resp;
	}
}

module.exports = new PaymentGateway();
