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
	handleOrderRated,
	handleTruckDeleted,
	returnOrderedQuantityToTruck,
	subtractOrderedQuantityFromTruck,
	updateDriverStats,
	attachTruckToDriver,
	updateProductPriceOnTruck,
	updateProductQuantityOnTruckAttachedToDriver,
	enforceOneDriverToOneTruck,
	detachDriverFromTruck,
	attachTruckToOrder,
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
eventEmitter.on(eventTypes.driverDeleted, detachDriverFromTruck);
eventEmitter.on(eventTypes.driverDisabled, detachDriverFromTruck);
eventEmitter.on(eventTypes.orderRated, handleOrderRated);
eventEmitter.on(eventTypes.truckDeleted, handleTruckDeleted);
eventEmitter.on(eventTypes.orderAccepted, subtractOrderedQuantityFromTruck);
eventEmitter.on(eventTypes.orderRejected, returnOrderedQuantityToTruck);
eventEmitter.on(eventTypes.orderCreated, updateDriverStats);
eventEmitter.on(eventTypes.orderCreated, attachTruckToOrder);
eventEmitter.on(eventTypes.orderRejected, updateDriverStats);
eventEmitter.on(eventTypes.orderCompleted, updateDriverStats);
eventEmitter.on(eventTypes.truckAssignedToDriver, attachTruckToDriver);
eventEmitter.on(eventTypes.truckAssignedToDriver, enforceOneDriverToOneTruck);
eventEmitter.on(eventTypes.priceOfProductUpdated, updateProductPriceOnTruck);
eventEmitter.on(
	eventTypes.quantityOfTruckUpdated,
	updateProductQuantityOnTruckAttachedToDriver
);

module.exports = eventEmitter;
