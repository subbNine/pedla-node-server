const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonBuyers } = require("../../middlewares/access-control");
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

router.get("/products", catchAsync(productController.getProducts));

router.use(bounceNonBuyers);

/**
 * @api {post} /api/user/buyer/profile Update buyer's profile
 * @apiName postBuyerProfileUpdate
 * @apiGroup Profile Management
 *
 * @apiParam {String} platform platform which the app is running on (android|ios)
 * @apiParam {String} deviceToken device token which will be used for push notification
 * @apiParam {String} firstName user's first name
 * @apiParam {String} email user's email
 * @apiParam {String} address user's address
 * @apiParam {String} phoneNumber user's phoneNumber
 * @apiParam {String} avatarUrl profile image url of the user
 * @apiVersion 1.0.0
 *
 * @apiDescription update buyer's profile
 */
router.post("/profile", catchAsync(userController.updateProfile));

/**
 * @api {post} /api/user/buyer/online Set Buyer's Presence to online
 * @apiName postBuyerPresenceOnline
 * @apiGroup Presence Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Set buyer's presence status to online
 */
router.post("/online", catchAsync(userController.setOnline));

/**
 * @api {post} /api/user/buyer/offline Set Buyer's Presence to offline
 * @apiName postBuyerPresenceOffline
 * @apiGroup Presence Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Set buyer's presence status to offline
 */
router.post("/offline", catchAsync(userController.setOffline));

router.get(
	"/peddler-products/:peddlerId",
	shield(permissions.PERM001),
	catchAsync(productController.getPeddlerProducts)
);

router.get("/profile", catchAsync(userController.getProfile));

/**
 * @api {get} /api/user/buyer/profile/:driverId get driver's profile
 * @apiName getProfileUpdate
 * @apiGroup Driver Profile
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription get driver's profile. To get all possible return fields call this test route logged in as a buyer:
 * /api/user/buyer/profile/5fd8b3fc7a78f300173bd7ee
 */
router.get("/profile/:userId", catchAsync(userController.getProfile));

router.post(
	"/geo-location",
	catchAsync(geoLocationController.updateGeoLocation)
);

/**
 * @api {get} /api/user/buyer/nearest-drivers?lat={lat}&&lon={lon}&&radius={search-radius} get Trucks which have been assigned Driver
 * @apiName getBuyerTruckDrivers
 * @apiGroup Buyer - Get Truck Drivers
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will fetch all online truck drivers within the radius passed in
 * from the coordinate specified by lat and lon params
 *
 * @apiParam {Number} [lat]
 * @apiParam {Number} [lon]
 * @apiParam {Number} [radius=10]
 */
router.get(
	"/nearest-drivers",
	catchAsync(geoLocationController.getNearestOnlinePeddlers)
);

router.get(
	"/nearest-peddlers",
	catchAsync(geoLocationController.getNearestOnlinePeddlers)
);

/**
 * @api {post} /api/user/buyer/order Make an order for a product
 * @apiName postOrder
 * @apiGroup Buyer - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Make a new order for peddlers product
 *
 * @apiParam {ID} driverId
 * @apiParam {ID} productId the seller's product id
 * @apiParam {Number} quantity the quantity in litres of product sold
 * @apiParam {Number} unitAmount the price per litre that the product cost
 * @apiParam {Number} driverLat the latitude if the driver
 * @apiParam {Number} driverLon the longitude of the driver
 * @apiParam {Number} buyerLat the latitude of the buyer
 * @apiParam {Number} buyerLon the longitude of the buyer
 * @apiParam {String} deliveryAddress delivery address
 * @apiParam {Date} deliveryDate delivery date
 * @apiParam {Date} creditPaymentDate proposed date to pay for product
 * @apiParam {String} paymentMethod mode of payment
 * @apiParam {String} priceCategory product price category
 */
router.post(
	"/order",
	shield(permissions.PERM002),
	catchAsync(orderController.createOrder)
);

/**
 * @api {get} /api/user/buyer/orders?status=pending+accepted Retrieve orders
 * @apiName getBuyerOrders
 * @apiGroup Buyer - Order
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
 * @api {post} /api/user/buyer/order/:orderId/cancel Cancel An Order
 * @apiName postCancelOrder
 * @apiGroup Buyer - Order
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
 * @api {get} /api/user/buyer/order/:orderId Retrieve a specific order
 * @apiName getSpecificOrder
 * @apiGroup Buyer - Order
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
 * @api {post} /api/user/buyer/order/:orderId/rating Rate a driver
 * @apiName postOrderRating
 * @apiGroup Buyer - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Rate a driver. minimum rating = 1 maximum rating = 5
 *
 * @apiParam {Number} rating score for a transaction 1-5
 */
router.post(
	"/order/:orderId/rating",
	shield(permissions.PERM002),
	validateBody(validationSchemas.postRating),
	catchAsync(orderController.rateOrder)
);

/**
 * @api {post} /api/user/buyer/order/:orderId/cancel Cancel An Order
 * @apiName postCancelBuyerOrder
 * @apiGroup Buyer - Order
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
 * @api {post} /api/user/buyer/order/:orderId/delivered Confirm Order delivery
 * @apiName postDeliveredOrder
 * @apiGroup Buyer - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Confirm order has been delivered
 *
 * @apiParam {ID} orderId the id of the order you want to confirm has been delivered
 */
router.post(
	"/order/:orderId/delivered",
	shield(permissions.PERM002),
	catchAsync(orderController.confirmOrderDelivery)
);

/**
 * @api {post} /api/user/buyer/order/:orderId/rejected Reject Order delivery
 * @apiName postRejectedOrder
 * @apiGroup Buyer - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Reject order delivery
 *
 * @apiParam {ID} orderId the id of the order you want to confirm has been delivered
 */
router.post(
	"/order/:orderId/rejected",
	shield(permissions.PERM002),
	catchAsync(orderController.confirmOrderDelivery)
);

/**
 * @api {post} /api/user/buyer/search Search driver
 * @apiName getBuyersBySearch
 * @apiGroup Buyer - Search
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Search for driver
 *
 * @apiParam {ID} productId id of the product
 * @apiParam {Number} quantity quantity of the product
 * @apiParam {Number} [page] page number pagination
 * @apiParam {Number} [limit] limit page limit
 * @apiParam {Number} lat latitude of the search user
 * @apiParam {Number} lon longitude of the search user
 *
 */
router.post(
	"/search",
	validateBody(validationSchemas.search),
	catchAsync(userController.searchForProductDrivers)
);

/**
 * @api {post} /api/user/buyer/notification Send Push Notification From Buyer's App
 * @apiName postBuyersNotification
 * @apiGroup Notification
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Send Push Notification From Buyer's App. It is important to specify the platform as a user may have two
 * mobile devices running a particular instance of the app
 *
 * @apiParam {String} title title of the message
 * @apiParam {ID} receiverId the id of the receiver
 * @apiParam {String} message message body
 * @apiParam {String} platform the platform which the message is sent from (android|ios)
 */
router.post(
	"/notification",
	catchAsync(notificationController.sendNotification)
);

/**
 * @api {get} /api/user/buyer/payment/verify/:paymentRef Check if payment has been verified
 * @apiName getPaymentVerified
 * @apiGroup Payment
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Check if payment has been verified
 *
 * @apiParam {String} paymentRef payment reference received from transaction initialization
 */
router.get(
	"/payment/verify/:paymentRef",
	catchAsync(orderController.verifyPaystackPayment)
);

/**
 * @api {post} /api/user/buyer/payment/proof Upload proof of payment
 * @apiName postPaymentProof
 * @apiGroup Payment
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint Upload proof of payment
 * @apiParam {ID} orderId id of the order you want to upload proof of payment for
 * @apiParam {String} imgUrl the url of the proof of payment image
 */
router.post("/payment/proof", catchAsync(orderController.uploadProofOfPayment));

module.exports = router;
