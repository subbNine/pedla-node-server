// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
// 	host: "smtp.ethereal.email",
// 	port: 587,
// 	secure: false,
// 	auth: {
// 		user: "larue.schmeler@ethereal.email",
// 		pass: "u25gurE4Gnu4vzwT92",
// 	},
// });

const sgMail = require("@sendgrid/mail");
const { EMAIL_API_KEY } = require("../config");

sgMail.setApiKey(EMAIL_API_KEY);

module.exports = {
	send({ from, to, subject, text, html }) {
		// send mail with defined transport object
		// transporter.sendMail({
		// 	from,
		// 	to,
		// 	subject,
		// 	text,
		// 	html,
		// });

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
