const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonBuyers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
	geoLocation: geoLocationController,
} = require("../../controllers");
const { permissions } = require("../../../db/mongo/enums/user");

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

router.get("/profile/:userId", catchAsync(userController.getProfile));

router.post(
	"/geo-location",
	catchAsync(geoLocationController.updateGeoLocation)
);

router.get(
	"/nearest-peddlers",
	catchAsync(geoLocationController.getNearestOnlinePeddlers)
);

module.exports = router;
