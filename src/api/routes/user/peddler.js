const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonPeddlers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const { permissions: perms } = require("../../../db/mongo/enums").user;
const {
	product: productController,
	user: userController,
	geoLocation: geoLocationController,
} = require("../../controllers");

const router = Router();

router.use(bounceNonPeddlers);

router.use(shield(perms.PERM000));

router.put("/", catchAsync(userController.updateProfile));

router.put("/online", catchAsync(userController.setOnline));

router.put("/offline", catchAsync(userController.setOffline));

/**
 * @api {get} /api/user/peddler/products Retrieve products addded by the admin to the system
 * @apiName getProducts
 * @apiGroup Peddler Product Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint enables peddler's retreive products in the system that has been added by the admin
 */
router.get("/products", catchAsync(productController.getProducts));

/**
 * @api {get} /api/user/peddler/own-products Retrieve products owned by peddler
 * @apiName getOwnProducts
 * @apiGroup Peddler Product Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint enables peddler's retreive products owned by them (i.e products added by them). The end point
 * requires that you pass in no parameters
 */
router.get("/own-products", catchAsync(productController.getPeddlerProducts));

router.get("/profile", catchAsync(userController.getProfile));

router.get("/profile/:userId", catchAsync(userController.getProfile));

/**
 * @api {post} /api/user/peddler/own-products Peddler's Product creation
 * @apiName postPeddlerProduct
 * @apiGroup Peddler Product Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint enables peddler's to create products
 *
 * @apiParam {Object[]} products list of Products
 * @apiParam {ID} productId id of the product.
 * @apiParam {Number} residentialAmt Residential Amount of the product
 * @apiParam {Number} commercialAmt Commercial Amount of the the product
 * @apiParam {Number} commercialOnCrAmt Commercial On Credit Amount of the Product
 * @apiParam {Number} quantity Quantity in litres of the Product
 *
 * @apiUse NameConflictError
 */
router.post(
	"/own-products",
	shield(perms.PERM002),
	catchAsync(productController.createPeddlerProducts)
);

router.put(
	"/own-product/:productId",
	shield(perms.PERM002),
	catchAsync(productController.updatePeddlerProduct)
);

/**
 * @api {post} /api/user/peddler/geo-location Geo-location Update for peddlers
 * @apiName postPeddlerGeoLocation
 * @apiGroup Geo-location
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This updates the peddler's Geo-location
 *
 * @apiParam {Number} lat latitude of the coordinate
 * @apiParam {Number} lon longitude of the coordinate
 *
 */
router.post(
	"/geo-location",
	catchAsync(geoLocationController.updateGeoLocation)
);

module.exports = router;
