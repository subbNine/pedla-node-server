const createAndSendOtp = require("./create-and-send-otp");
const alertOpsTeam = require("./alert-ops-team");
const sendPeddlerCode = require("./send-peddler-code");
const notifyPeddlerRejection = require("./notify-peddler-rejection");
const sendDriverInfo = require("./send-driver-info");
const updatePushDevice = require("./update-push-device");
const sendPushNotification = require("./send-notification");
const paymentInitialized = require("./payment-initialized");
const sendPasswordResetCode = require("./send-password-reset-code");
const handleTruckDeleted = require("./handle-truck-deleted");
const handleDriverDeletd = require("./handle-driver-deleted");
const handleOrderRated = require("./handle-order-rated");
const returnOrderedQuantityToTruck = require("./return-ordered-quantity-to-truck");
const subtractOrderedQuantityFromTruck = require("./subtract-ordered-quantity-from-truck");
const updateDriverStats = require("./update-driver-stats");
const attachTruckToDriver = require("./attach-truck-to-driver");
const updateProductPriceOnTruck = require("./update-price-of-product-on-truck");
const updateProductQuantityOnTruckAttachedToDriver = require("./update-quantity-on-truck-attached-to-driver");
const enforceOneDriverToOneTruck = require("./enforce-one-driver-to-one-truck");

module.exports = {
	createAndSendOtp,
	alertOpsTeam,
	sendPeddlerCode,
	notifyPeddlerRejection,
	sendDriverInfo,
	updatePushDevice,
	sendPushNotification,
	paymentInitialized,
	sendPasswordResetCode,
	handleTruckDeleted,
	handleDriverDeletd,
	handleOrderRated,
	returnOrderedQuantityToTruck,
	subtractOrderedQuantityFromTruck,
	updateDriverStats,
	attachTruckToDriver,
	updateProductPriceOnTruck,
	enforceOneDriverToOneTruck,
	updateProductQuantityOnTruckAttachedToDriver,
};
