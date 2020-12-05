const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonPeddlers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
} = require("../../controllers");
const { permissions: perms } = require("../../../db/mongo/enums").user;
const fileUpload = require("../../middlewares/file-upload");

const router = Router();

router.use(bounceNonPeddlers);

router.use(shield());

router.post(
	"/",
	fileUpload.any(),
	catchAsync(userController.createPeddlerProfile)
);

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
