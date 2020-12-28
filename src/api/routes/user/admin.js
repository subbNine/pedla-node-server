const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonAdmins } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const {
	product: productController,
	user: userController,
	orderController,
} = require("../../controllers");

const {
	validateBody,
	validateParams,
} = require("../../middlewares/validator-helpers");
const validationSchemas = require("../../validators");

const router = Router();

router.use(bounceNonAdmins);

router.use(shield());

/**
 * @api {get} /api/user/admin/products Fetch added products
 * @apiName getProducts
 * @apiGroup Admin - Product Management
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
 * @apiGroup Admin - Product Management
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
router.post(
	"/product",
	validateBody(validationSchemas.postProduct),
	catchAsync(productController.createProduct)
);

/**
 * @api {put} /api/user/admin/product/:productId Product Update from admin dashboard
 * @apiName putProduct
 * @apiGroup Admin - Product Management
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
router.put(
	"/product/:productId",
	validateParams(validationSchemas.productId),
	validateBody(validationSchemas.postProduct),
	catchAsync(productController.updateProduct)
);

/**
 * @api {put} /api/user/admin/verify-peddler/:peddlerId Verify peddler
 * @apiName postPeddlerVerification
 * @apiGroup Admin - Users
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
	validateParams(validationSchemas.productId),
	catchAsync(userController.verifyRegisteredPeddler)
);

/**
 * @api {put} /api/user/admin/reject-peddler/:peddlerId reject peddler
 * @apiName postPeddlerVerification
 * @apiGroup Admin - Users
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription reject peddler profile
 *
 * @apiParam {ID} peddlerId Peddler's id.
 *
 * @apiSuccess {ID} id user id
 */
router.put(
	"/reject-peddler/:peddlerId",
	validateParams(validationSchemas.productId),
	catchAsync(userController.rejectRegisteredPeddler)
);

/**
 * @api {get} /api/user/admin/peddlers?vstatus=uncategorized get peddlers
 * @apiName getPeddlers
 * @apiGroup Admin - Users
 *
 * @apiVersion 1.0.0
 * @apiParam {String} vStatus verification status of user you want to retrieve
 * @apiParam {Number} [page] page number
 * @apiParam {Number} [limit] page limit
 *
 * @apiDescription Get peddlers by verification status
 *
 * @apiSuccess {String} vStatus Verification status verified|unverified|uncategorized
 */
router.get("/peddlers", catchAsync(userController.getPeddlers));

/**
 * @api {get} /api/user/admin/users?types=admin+peddler+driver+buyer&&page=1&&limit=10 get users
 * @apiName getAdminUsers
 * @apiGroup Admin - Users
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} types types of user (ADMIN|DRIVER|BUYER|PEDDLER) to retrieve defaults to all types of user in the system
 * @apiParam {Number} [page] page number
 * @apiParam {Number} [limit] page limit
 *
 * @apiDescription Get users by types. Seperate multiple types using comma(,) or plus(+)
 *
 */
router.get("/users", catchAsync(userController.getUsers));

/**
 * @api {get} /api/user/admin/users/count?types=admin+peddler+driver+buyer Get Number of users by types
 * @apiName getAdminUsersCount
 * @apiGroup Admin - Users
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} types types of user (ADMIN|DRIVER|BUYER|PEDDLER) to retrieve defaults to all types of user in the system
 *
 * @apiDescription Get number of users by types. Seperate multiple types using comma(,) or plus(+)
 *
 */
router.get("/users/count", catchAsync(userController.countUsers));

/**
 * @api {get} /api/user/admin/orders?status=pending+accepted&limit=30&page=1 Retrieve orders
 * @apiName getAdminOrders
 * @apiGroup Admin - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Return orders based on status (pending|accepted|completed|rejected) passed in the status query params.
 * To return results with more than one status, seperate the status passed in the query with a plus symbol
 * @apiParam {String} status order status. multiple order status should be seperated with a "+" symbol
 */
router.get("/orders", catchAsync(orderController.getOrders));

/**
 * @api {get} /api/user/admin/orders/count?status=pending+accepted Retrieve number of orders
 * @apiName getAdminOrdersCount
 * @apiGroup Admin - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Return number of orders based on status (pending|accepted|completed|rejected) passed in the status query params.
 * To return results with more than one status, seperate the status passed in the query with a plus symbol
 * @apiParam {String} status order status. multiple order status should be seperated with a "+" symbol
 */
router.get("/orders/count", catchAsync(orderController.countOrders));

/**
 * @api {get} /api/user/admin/orders/recent?status=pending+accepted&limit=30&page=1 Retrieve number of orders
 * @apiName getAdminOrdersRecent
 * @apiGroup Admin - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Return recent (today's) orders based on status (pending|accepted|completed|rejected) passed in the status query params.
 * To return results with more than one status, seperate the status passed in the query with a plus symbol
 * @apiParam {String} status order status. multiple order status should be seperated with a "+" symbol
 */
router.get("/orders/recent", catchAsync(orderController.todayOrders));

module.exports = router;
