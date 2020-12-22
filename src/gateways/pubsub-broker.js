const admin = require("firebase-admin");
const serviceAccount = require("../config/pedla-app-firebase-adminsdk-40onl-5780471780.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://pedla-app.firebaseio.com",
});

module.exports = {
	send({ message: messageBody, title, deviceTokens }) {
		const messageObject = {
			notification: {
				title,
				body: messageBody,
			},
			tokens: deviceTokens,
		};

		admin.messaging().sendMulticast(messageObject);
	},
};
