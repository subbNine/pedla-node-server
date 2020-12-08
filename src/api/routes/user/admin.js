const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonAdmins } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
} = require("../../controllers");

const router = Router();

router.use(bounceNonAdmins);

router.use(shield());

router.get("/products", catchAsync(productController.getProducts));

router.post("/product", catchAsync(productController.createProduct));

router.put("/product", catchAsync(productController.updateProduct));

/**
 * @api {post} /api/user/admin/verify-peddler/:peddlerId Admin verification of peddler's code
 * @apiName postPeddlerVerification
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription verify peddler profile
 *
 * @apiParam {String} peddlerId Peddler's id.
 *
 * @apiSuccess {ID} id user id
 */
router.put(
	"/verify-peddler/:peddlerId",
	catchAsync(userController.verifyRegisteredPeddler)
);

module.exports = router;
