const sgMail = require("@sendgrid/mail");
const { EMAIL_API_KEY } = require("../config");

sgMail.setApiKey(EMAIL_API_KEY);

module.exports = {
	send({ from, to, subject, text, html }) {
		sgMail
			.send({
				from,
				to,
				subject,
				text,
				html,
			})
			.then(
				() => {},
				(error) => {
					console.error(error);

					if (error.response) {
						console.error(error.response.body);
					}
				}
			);
	},
};
