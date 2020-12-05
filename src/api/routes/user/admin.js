const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonAdmins } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const { product: productController } = require("../../controllers");

const router = Router();

router.use(bounceNonAdmins);

router.use(shield());

router.get("/products", catchAsync(productController.getProducts));

router.post("/product", catchAsync(productController.createProduct));

router.put("/product", catchAsync(productController.updateProduct));

router.put("/verify-peddler", catchAsync());

router.put("/verify-buyer", () => {
	throw new Error("Not yet implemented");
});

module.exports = router;
