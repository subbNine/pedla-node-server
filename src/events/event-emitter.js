const EventEmitter = require("events");

const eventTypes = require("./event-types");
const {
	createAndSendOtp,
	alertOpsTeam,
	sendPeddlerCode,
	notifyPeddlerRejection,
	sendDriverInfo,
	updatePushDevice,
	sendPushNotification,
	paymentInitialized,
	sendPasswordResetCode,
} = require("./handlers");

const eventEmitter = new EventEmitter();

eventEmitter.on(eventTypes.peddlerProfileCreated, alertOpsTeam);
eventEmitter.on(eventTypes.createAndSendOtp, createAndSendOtp);
eventEmitter.on(eventTypes.loggedIn, createAndSendOtp);
eventEmitter.on(eventTypes.alertOpsTeam, alertOpsTeam);
eventEmitter.on(eventTypes.updatePushDevice, updatePushDevice);
eventEmitter.on(eventTypes.sendNotification, sendPushNotification);
eventEmitter.on(eventTypes.peddlerVerified, sendPeddlerCode);
eventEmitter.on(eventTypes.peddlerRejected, notifyPeddlerRejection);
eventEmitter.on(eventTypes.buyerCreated, createAndSendOtp);
eventEmitter.on(eventTypes.driverCreated, sendDriverInfo);
eventEmitter.on(eventTypes.paymentInitialized, paymentInitialized);
eventEmitter.on(eventTypes.sendPasswordResetCode, sendPasswordResetCode);

module.exports = eventEmitter;
