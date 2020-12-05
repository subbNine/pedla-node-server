const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonBuyers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
} = require("../../controllers");

const router = Router();

router.use(bounceNonBuyers);

router.use(shield());

router.post("/", catchAsync(userController.createBuyerProfile));

router.get("/products", catchAsync(productController.getProducts));

router.get(
	"/peddler-products/:peddlerId",
	catchAsync(productController.getPeddlerProducts)
);

module.exports = router;
