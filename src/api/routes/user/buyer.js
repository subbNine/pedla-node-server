const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonBuyers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
	geoLocation: geoLocationController,
	orderController,
} = require("../../controllers");
const { permissions } = require("../../../db/mongo/enums/user");
const { validateBody } = require("../../middlewares/validator-helpers");
const validationSchemas = require("../../validators");

const router = Router();

router.use(bounceNonBuyers);

router.use(shield(permissions.PERM000));

/**
 * @api {post} /api/user/buyer/profile Update buyer's profile
 * @apiName postBuyerProfileUpdate
 * @apiGroup Profile Management
 *
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
 */
router.post(
	"/order",
	shield(permissions.PERM002),
	validateBody(validationSchemas.postOrder),
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
 * @api {post} /api/user/buyer/order/:orderId/complete Confirm Order delivery
 * @apiName postCompleteOrder
 * @apiGroup Buyer - Order
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
	catchAsync(orderController.confirmOrderDelivery)
);

/**
 * @api {post} /api/user/buyer/search Search driver
 * @apiName getDriversBySearch
 * @apiGroup Driver - Search
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Search for driver
 *
 * @apiParam productId id of the product
 * @apiParam quantity quantity of the product
 * @apiParam [page] page number pagination
 * @apiParam [limit] limit page limit
 * @apiParam lat latitude of the search user
 * @apiParam lon longitude of the search user
 *
 */
router.post(
	"/search",
	validateBody(validationSchemas.search),
	catchAsync(userController.searchForProductDrivers)
);

module.exports = router;
