const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

const credentials = {
	apiKey: "1bef05d4ffb0aa24f56a95749834563e2ad73070364c287c485bf5a12c60a33a",
	username: "sandbox",
};

const africasTalking = require("africastalking")(credentials);

const sms = africasTalking.SMS;

function normalizePhoneNumber(phoneNumber) {
	const number = phoneUtil.parseAndKeepRawInput(phoneNumber, "NG");
	return phoneUtil.format(number, PNF.E164);
}

module.exports = {
	send({ to, message }) {
		const options = {
			from: "Peddler",
			to: normalizePhoneNumber(to),
			message,
		};

		if (to) {
			sms.send(options).then((res) => {
				console.log(res);
			});
		}
	},
};
