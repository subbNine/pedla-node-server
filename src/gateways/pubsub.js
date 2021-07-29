const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase");
const errors = require("../errors");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://pedla-app.firebaseio.com",
});

const db = admin.firestore();

module.exports = {
	send({ message: messageBody, title, deviceTokens }) {
		const messageObject = {
			notification: {
				title,
				body: messageBody,
				// imageUrl: "",
			},
			tokens: deviceTokens,
			android: {
				notification: {
					click_action: "FLUTTER_NOTIFICATION_CLICK",
				},
			},
			apns: {
				payload: {
					aps: {
						category: "FLUTTER_NOTIFICATION_CLICK",
					},
				},
			},
		};

		admin
			.messaging()
			.sendMulticast(messageObject)
			.then((data) => {
				const { responses, successCount, failureCount } = data;

				for (const response of responses) {
					const { success, error } = response;

					if (!success) {
						console.log(error);
						errors.error(error);
					}
				}
			})
			.catch((error) => errors.error(error));
	},

	async putUserOffline(userId) {
		const userRef = db.doc(`users/${userId}`);
		await userRef.set({ presence: "offline" });
	},
};
