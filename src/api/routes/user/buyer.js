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

router.put("/", catchAsync(userController.updateProfile));

router.put("/online", catchAsync(userController.setOnline));

router.put("/offline", catchAsync(userController.setOffline));

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
