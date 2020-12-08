const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonPeddlers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const { permissions: perms } = require("../../../db/mongo/enums").user;
const {
	product: productController,
	user: userController,
} = require("../../controllers");

const router = Router();

router.use(bounceNonPeddlers);

router.use(shield(perms.PERM000));

router.put("/", catchAsync(userController.updateProfile));

router.put("/online", catchAsync(userController.setOnline));

router.put("/offline", catchAsync(userController.setOffline));

router.get("/products", catchAsync(productController.getProducts));

router.get(
	"/peddler-products",
	catchAsync(productController.getPeddlerProducts)
);

router.post(
	"/product",
	shield(perms.PERM002),
	catchAsync(productController.createPeddlerProduct)
);

router.put(
	"/product/:productId",
	shield(perms.PERM002),
	catchAsync(productController.updatePeddlerProduct)
);

module.exports = router;
