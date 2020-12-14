const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonDrivers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
	geoLocation: geoLocationController,
} = require("../../controllers");
const { permissions } = require("../../../db/mongo/enums/user");

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

module.exports = router;
