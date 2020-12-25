const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonDrivers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
	geoLocation: geoLocationController,
	orderController,
	notificationController,
} = require("../../controllers");
const { permissions } = require("../../../db/mongo/enums/user");
const { validateBody } = require("../../middlewares/validator-helpers");
const validationSchemas = require("../../validators");

const router = Router();

router.use(bounceNonDrivers);

router.use(shield(permissions.PERM000));

/**
 * @api {post} /api/user/driver/profile Update driver's profile
 * @apiName postDriverProfileUpdate
 * @apiGroup Profile Management
 *
 * @apiParam {String} platform platform which the app is running on (android|ios)
 * @apiParam {String} deviceToken device token which will be used for push notification
 * @apiParam {String} firstName user's first name
 * @apiParam {String} email user's email
 * @apiParam {String} address user's address
 * @apiParam {String} phoneNumber user's phoneNumber
 * @apiParam {String} avatarUrl profile image url of the user
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription update driver's profile
 */
router.post("/profile", catchAsync(userController.updateProfile));

/**
 * @api {post} /api/user/driver/online Set Driver's Presence to online
 * @apiName postDriverPresenceOnline
 * @apiGroup Presence Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Set driver's presence status to online
 */
router.post("/online", catchAsync(userController.setOnline));

/**
 * @api {post} /api/user/driver/offline Set Driver's Presence to offline
 * @apiName postDriverPresenceOffline
 * @apiGroup Presence Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Set driver's presence status to offline
 */
router.post("/offline", catchAsync(userController.setOffline));

router.get(
	"/products",
	shield(permissions.PERM001),
	catchAsync(productController.getProducts)
);

router.get(
	"/peddler-products/:peddlerId",
	shield(permissions.PERM001),
	catchAsync(productController.getPeddlerProducts)
);

router.get("/profile", catchAsync(userController.getProfile));

router.get("/profile/:userId", catchAsync(userController.getProfile));

router.post(
	"/geo-location",
	catchAsync(geoLocationController.updateGeoLocation)
);

/**
 * @api {post} /api/user/driver/order/:orderId/accept Accept Order
 * @apiName postAcceptDriverOrder
 * @apiGroup Driver - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable drivers to Accept an order
 *
 * @apiParam {ID} orderId the id of the order you want to confirm has acceptd
 */
router.post(
	"/order/:orderId/accept",
	shield(permissions.PERM002),
	catchAsync(orderController.acceptOrder)
);

/**
 * @api {get} /api/user/driver/order/:orderId Retrieve a specific order
 * @apiName getSpecificDriverOrder
 * @apiGroup Driver - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Get a specific order
 *
 * @apiParam {ID} orderId the id of the order you want to retrieve
 */
router.get(
	"/order/:orderId",
	shield(permissions.PERM002),
	catchAsync(orderController.getOrderById)
);

/**
 * @api {get} /api/user/driver/orders?status=pending+accepted Retrieve orders
 * @apiName getDriverOrders
 * @apiGroup Driver - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Return orders based on status (pending|accepted|completed|cancelled) passed in the status query params.
 * To return results with more than one status, seperate the status passed in the query with a plus symbol
 * @apiParam {String} status order status. multiple order status should be seperated with a "+" symbol
 */
router.get(
	"/orders",
	shield(permissions.PERM002),
	catchAsync(orderController.getOrders)
);

/**
 * @api {post} /api/user/driver/order/:orderId/cancel Cancel An Order
 * @apiName postCancelDriverOrder
 * @apiGroup Driver - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription cancel an order
 *
 * @apiParam {ID} orderId the id of the order you want to cancel
 * @apiParam {String} reason the reason for cancelling an order
 */
router.post(
	"/order/:orderId/cancel",
	shield(permissions.PERM002),
	validateBody(validationSchemas.orderReason),
	catchAsync(orderController.cancelOrder)
);

/**
 * @api {post} /api/user/driver/order/:orderId/start-delivery Start delivery of An Order
 * @apiName postStartDeliveryOrder
 * @apiGroup Driver - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription start journey for an order
 *
 * @apiParam {ID} orderId the id of the order you want to cancel
 */
router.post(
	"/order/:orderId/start-delivery",
	shield(permissions.PERM002),
	catchAsync(orderController.startDelivery)
);

/**
 * @api {post} /api/user/driver/order/:orderId/complete Confirm Order delivery
 * @apiName postCompleteOrder
 * @apiGroup Driver - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Complete an order
 *
 * @apiParam {ID} orderId the id of the order you want to confirm has completed
 */
router.post(
	"/order/:orderId/complete",
	shield(permissions.PERM002),
	catchAsync(orderController.completeOrder)
);

/**
 * @api {post} /api/user/driver/notification Send Push Notification From Driver's App
 * @apiName postBuyersNotification
 * @apiGroup Notification
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Send Push Notification From Driver's App. It is important to specify the platform as a user may have two
 * mobile devices running a particular instance of the app
 *
 * @apiParam {String} title title of the message
 * @apiParam {ID} receiverId The Id of the receiver
 * @apiParam {String} message message body
 * @apiParam {String} platform the platform which the message is sent from (android|ios)
 */
router.post(
	"/notification",
	catchAsync(notificationController.sendNotification)
);

module.exports = router;
