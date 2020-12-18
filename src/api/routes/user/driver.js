const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonDrivers } = require("../../middlewares/access-control");
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

router.use(bounceNonDrivers);

router.use(shield(permissions.PERM000));

/**
 * @api {post} /api/user/driver/profile Update driver's profile
 * @apiName postDriverProfileUpdate
 * @apiGroup Profile Management
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

module.exports = router;
