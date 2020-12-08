const EventEmitter = require("events");

const eventTypes = require("./event-types");
const {
	createAndSendOtp,
	alertOpsTeam,
	sendPeddlerCode,
} = require("./handlers");

const eventEmitter = new EventEmitter();

eventEmitter.on(eventTypes.peddlerProfileCreated, alertOpsTeam);

eventEmitter.on(eventTypes.createAndSendOtp, createAndSendOtp);

eventEmitter.on(eventTypes.loggedIn, createAndSendOtp);

eventEmitter.on(eventTypes.alertOpsTeam, alertOpsTeam);

eventEmitter.on(eventTypes.peddlerVerified, sendPeddlerCode);

eventEmitter.on(eventTypes.buyerCreated, createAndSendOtp);

module.exports = eventEmitter;
