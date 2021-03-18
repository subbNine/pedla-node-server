const { Router } = require("express");

const shield = require("../../middlewares/shield");
const { bounceNonPeddlers } = require("../../middlewares/access-control");
const { catchAsync } = require("../../../errors");
const { permissions: perms } = require("../../../db/mongo/enums").user;
const {
	product: productController,
	user: userController,
	geoLocation: geoLocationController,
	truck: truckController,
	truckAndDriver: truckAndDriverController,
	orderController,
	notificationController,
} = require("../../controllers");
const fileUpload = require("../../middlewares/file-upload");

const { permissions } = require("../../../db/mongo/enums").user;
const {
	validateBody,
	validateQuery,
} = require("../../middlewares/validator-helpers");
const validationSchemas = require("../../validators");

const router = Router();

router.use(bounceNonPeddlers);

router.use(shield(perms.PERM000));

/**
 * @api {post} /api/user/peddler/profile Update peddler's profile
 * @apiName postProfileUpdate
 * @apiGroup Profile Management
 *
 * @apiParam {String} platform platform which the app is running on (android|ios)
 * @apiParam {String} deviceToken device token which will be used for push notification
 * @apiParam {String} firstName user's first name
 * @apiParam {String} email user's email
 * @apiParam {String} address user's address
 * @apiParam {String} phoneNumber user's phoneNumber
 * @apiParam {String} avatarUrl profile image url of the user
 * @apiVersion 1.0.0
 *
 * @apiDescription update peddler's profile
 */
router.post("/profile", catchAsync(userController.updateProfile));

/**
 * @api {post} /api/user/peddler/online Set Peddler's Presence to online
 * @apiName postPresenceOnline
 * @apiGroup Presence Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Set peddler's presence status to online
 */
router.post("/online", catchAsync(userController.setOnline));

/**
 * @api {post} /api/user/peddler/offline Set Peddler's Presence to offline
 * @apiName postPresenceOffline
 * @apiGroup Presence Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Set peddler's presence status to offline
 */
router.post("/offline", catchAsync(userController.setOffline));

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

/**
 * @api {get} /api/user/peddler/profile get peddler's profile
 * @apiName getProfileUpdate
 * @apiGroup Profile Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription get peddler's profile
 */
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

/**
 * @api {post} /api/user/peddler/driver Create truck Driver
 * @apiName postPeddlerDriver
 * @apiGroup Driver Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers to create their Drivers
 *
 * @apiParam {String} firstName First name of the driver
 * @apiParam {String} lastName LastName of the driver
 * @apiParam {String} password Password of the driver
 * @apiParam {String} email Email of the driver
 * @apiParam {String} phoneNumber Phone Number of the driver
 * @apiParam {String} userName User name of the driver
 *
 */
router.post(
	"/driver",
	shield(permissions.PERM002),
	fileUpload.single("avatarImg"),
	validateBody(validationSchemas.postDriver),
	catchAsync(userController.createDriver)
);

/**
 * @api {get} /api/user/peddler/drivers Get peddler's truck drivers
 * @apiName gettPeddlerDrivers
 * @apiGroup Driver Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers to fetch all their Drivers
 *
 */
router.get(
	"/drivers",
	shield(permissions.PERM002),
	catchAsync(userController.getDrivers)
);

/**
 * @api {post} /api/user/peddler/driver/:driverId Update truck Driver
 * @apiName postPeddlerDriverUpdate
 * @apiGroup Driver Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers to update profiles of their Drivers
 *
 * @apiParam {String} firstName First name of the driver
 * @apiParam {String} lastName LastName of the driver
 * @apiParam {String} password Password of the driver
 * @apiParam {String} email Email of the driver
 * @apiParam {String} phoneNumber Phone Number of the driver
 * @apiParam {String} userName User name of the driver
 */
router.post(
	"/driver/:driverId",
	shield(permissions.PERM002),
	fileUpload.single("avatarImg"),
	catchAsync(userController.updateDriver)
);

/**
 * @api {put} /api/user/peddler/driver/:driverId/disable Disable Driver
 * @apiName postPeddlerDriverDisable
 * @apiGroup Driver Management
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {ID} driverId id of driver you want to disable
 *
 * @apiDescription This endpoint will disbale a driver
 *
 */
router.put(
	"/driver/:driverId/disable",
	shield(permissions.PERM002),
	catchAsync(userController.disableDriver)
);

/**
 * @api {put} /api/user/peddler/driver/:driverId/enable Enable Driver
 * @apiName postPeddlerDriverEnable
 * @apiGroup Driver Management
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {ID} driverId id of driver you want to enable
 *
 * @apiDescription This endpoint will enable a driver
 *
 */
router.put(
	"/driver/:driverId/enable",
	shield(permissions.PERM002),
	catchAsync(userController.enableDriver)
);

/**
 * @api {put} /api/user/peddler/driver/:driverId/delete Delete Driver
 * @apiName postPeddlerDriverDelete
 * @apiGroup Driver Management
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {ID} driverId id of driver you want to delete
 *
 * @apiDescription This endpoint will delete a driver
 *
 */
router.put(
	"/driver/:driverId/delete",
	shield(permissions.PERM002),
	catchAsync(userController.deleteDriver)
);

/**
 * @api {post} /api/user/peddler/truck Create truck
 * @apiName postPeddlerTruck
 * @apiGroup Truck Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers to add their truck which will later be assigned to drivers
 *
 * @apiParam {String} model truck model number
 * @apiParam {String} brand truck Brand
 * @apiParam {ID} productId type of product loaded on the truck
 * @apiParam {Number} size size of truck in litres
 * @apiParam {Number} quantity the quantity of petroleum product that the truck carries
 * @apiParam {File} license truck liscence
 * @apiParam {File} insurance the truck's insurance
 * @apiParam {File} worthiness the truck's road worthiness
 * @apiParam {File} ownership the truck's proof of ownership
 */
router.post(
	"/truck",
	fileUpload.fields([
		{ name: "license", maxCount: 1 },
		{ name: "insurance", maxCount: 1 },
		{ name: "worthiness", maxCount: 1 },
		{ name: "ownership", maxCount: 1 },
	]),
	validateBody(validationSchemas.postTruck),
	catchAsync(truckController.createTruck)
);

/**
 * @api {get} /api/user/peddler/trucks Get trucks
 * @apiName getPeddlerTrucks
 * @apiGroup Truck Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers fetch all their trucks
 *
 */
router.get("/trucks", catchAsync(truckController.getPeddlerTrucks));

/**
 * @api {post} /api/user/peddler/truck/:truckId Update truck
 * @apiName postPeddlerTruckUpdate
 * @apiGroup Truck Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers to update their Truck
 *
 * @apiParam {String} model truck model number
 * @apiParam {String} brand truck Brand
 * @apiParam {ID} product type of product loaded on the truck
 * @apiParam {Number} size size of truck in litres
 * @apiParam {Number} quantity the quantity of petroleum product that the truck carries
 * @apiParam {File} license truck liscence
 * @apiParam {File} insurance the truck's insurance
 * @apiParam {File} worthiness the truck's road worthiness
 * @apiParam {File} ownership the truck's proof of ownership
 */
router.post(
	"/truck/:truckId",
	fileUpload.fields([
		{ name: "license", maxCount: 1 },
		{ name: "insurance", maxCount: 1 },
		{ name: "worthiness", maxCount: 1 },
		{ name: "ownership", maxCount: 1 },
	]),
	validateBody(validationSchemas.postTruck),
	catchAsync(truckController.updateTruck)
);

/**
 * @api {put} /api/user/peddler/truck/:truckId/delete Delete truck
 * @apiName postPeddlerTruckDelete
 * @apiGroup Truck Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint is used to delete a truck. The delete operation is a soft delete
 *
 * @apiParam {ID} truckId truck ID
 */
router.put(
	"/truck/:truckId/delete",
	validateBody(validationSchemas.deleteTruck),
	catchAsync(truckController.deleteTruck)
);

/**
 * @api {post} /api/user/peddler/truck-driver Assign Trucks to Driver
 * @apiName postTruckAndDriver
 * @apiGroup Trucks And Drivers Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers assign trucks to drivers
 *
 * @apiParam {ID} driverId Id of the driver to assign to a truck
 * @apiParam {ID}  truckId Id of the truck to assign to a driver
 *
 * @apiUse DupplicateAssignmentError
 */
router.post(
	"/truck-driver",
	shield(permissions.PERM002),
	validateBody(validationSchemas.postTruckAndDriver),
	catchAsync(truckAndDriverController.assignTruckToDriver)
);

/**
 * @api {post} /api/user/peddler/truck-driver/:truckAndDriverId update Trucks to Driver Assignment
 * @apiName postTruckAndDriverUpdate
 * @apiGroup Trucks And Drivers Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers update trucks to drivers assignment
 *
 * @apiParam {ID} driverId Id of the driver to assign to a truck
 * @apiParam {ID}  truckId Id of the truck to assign to a driver
 *
 * @apiUse DupplicateAssignmentError
 */
router.post(
	"/truck-driver/:truckDriverId",
	shield(permissions.PERM002),
	catchAsync(truckAndDriverController.updateTruckDriver)
);

/**
 * @api {get} /api/user/peddler/trucks-drivers get Trucks which have been assigned Driver
 * @apiName getTrucksDrivers
 * @apiGroup Trucks And Drivers Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will enable peddlers retrieve assigned trucks and drivers
 *
 */
router.get(
	"/trucks-drivers",
	catchAsync(truckAndDriverController.getPeddlerTruckDrivers)
);

/**
 * @api {get} /api/user/peddler/online-drivers Retrieve Online drivers
 * @apiName getPeddlerOnlineDrivers
 * @apiGroup Peddler - Drivers
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Retreives all online drivers of a peddler
 */
router.get(
	"/online-drivers",
	catchAsync(userController.getPeddlerOnlineDrivers)
);

router.get(
	"/nearest-drivers",
	validateQuery(validationSchemas.latlon),
	catchAsync(geoLocationController.getNearestOnlineDrivers)
);

router.post(
	"/order/:orderId/accept",
	shield(permissions.PERM002),
	catchAsync(orderController.acceptOrder)
);

router.get(
	"/order/:orderId",
	shield(permissions.PERM002),
	catchAsync(orderController.getOrderById)
);

/**
 * @api {post} /api/user/peddler/notification Send Push Notification From Peddler's App
 * @apiName postBuyersNotification
 * @apiGroup Notification
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Send Push Notification From Peddler's App. It is important to specify the platform as a user may have two
 * mobile devices running a particular instance of the app
 *
 * @apiParam {String} title title of the message
 * @apiParam {ID} receiverId The id of the receiver
 * @apiParam {String} message message body
 * @apiParam {String} platform the platform which the message is sent from (android|ios)
 */
router.post(
	"/notification",
	catchAsync(notificationController.sendNotification)
);

/**
 * @api {get} /api/user/peddler/orders?status=pending+accepted&limit=30&page=1 Retrieve orders
 * @apiName getPeddlerOrders
 * @apiGroup Peddler - Order
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Return orders based on status (pending|accepted|completed|cancelled|inprogress) passed in the status query params.
 * To return results with more than one status, seperate the status passed in the query with a plus symbol
 * @apiParam {String} status order status. multiple order status should be seperated with a "+" symbol
 * @apiParam {Number} [page] page number (query param)
 * @apiParam {Number} [limit] page limit (query Param)
 */
router.get(
	"/orders",
	shield(permissions.PERM002),
	validateQuery(validationSchemas.getOrders),
	catchAsync(orderController.getPeddlerOrders)
);

module.exports = router;
