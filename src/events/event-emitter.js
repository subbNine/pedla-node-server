const EventEmitter = require("events");

const eventTypes = require("./event-types");
const { sendOtp, alertOpsTeam } = require("./handlers");

const eventEmitter = new EventEmitter();

eventEmitter.on(eventTypes.userProfileCreated, sendOtp);

eventEmitter.on(eventTypes.sendOtp, sendOtp);

eventEmitter.on(eventTypes.loggedIn, sendOtp);

eventEmitter.on(eventTypes.alertOpsTeam, alertOpsTeam);

module.exports = eventEmitter;
