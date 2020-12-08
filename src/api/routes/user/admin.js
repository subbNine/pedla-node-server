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

/**
 * @api {get} /api/user/admin/products Fetch added products
 * @apiName getProducts
 * @apiGroup Admin Product Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Fetch all products added
 *
 * @apiParam {String} name product name.
 * @apiParam {String} description product description
 *
 * @apiSuccess {ID} id product id
 * @apiUse NameConflictError
 */
router.get("/products", catchAsync(productController.getProducts));

/**
 * @api {post} /api/user/admin/product Product Addition from admin dashboard
 * @apiName postProduct
 * @apiGroup Admin Product Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Create new Product. It is with this endpoint that the respective products (DPK, AGO, PMS, ...etc) will be added to the
 * System by the admin.
 *
 * @apiParam {String} name product name.
 * @apiParam {String} description product description
 *
 * @apiSuccess {ID} id product id
 * @apiUse NameConflictError
 */
router.post("/product", catchAsync(productController.createProduct));

/**
 * @api {put} /api/user/admin/product/:productId Product Update from admin dashboard
 * @apiName putProduct
 * @apiGroup Admin Product Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Update Product
 *
 * @apiParam {String} name product name.
 * @apiParam {String} description product description
 * @apiParam {ID} productId id of the product that is about to be updated
 *
 * @apiSuccess {ID} id product id
 * @apiUse NameConflictError
 */
router.put("/product/:productId", catchAsync(productController.updateProduct));

/**
 * @api {post} /api/user/admin/verify-peddler/:peddlerId Admin verification of peddler profile
 * @apiName postPeddlerVerification
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription verify peddler profile
 *
 * @apiParam {ID} peddlerId Peddler's id.
 *
 * @apiSuccess {ID} id user id
 */
router.put(
	"/verify-peddler/:peddlerId",
	catchAsync(userController.verifyRegisteredPeddler)
);

module.exports = router;
