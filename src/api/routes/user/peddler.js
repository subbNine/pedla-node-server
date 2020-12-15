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
} = require("../../controllers");
const fileUpload = require("../../middlewares/file-upload");

const router = Router();

router.use(bounceNonPeddlers);

router.use(shield(perms.PERM000));

/**
 * @api {post} /api/user/peddler/profile Update peddler's profile
 * @apiName postProfileUpdate
 * @apiGroup Profile Management
 *
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
	fileUpload.single("avatarImg"),
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
router.get("/drivers", catchAsync(userController.getDrivers));

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
	fileUpload.single("avatarImg"),
	catchAsync(userController.updateDriver)
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
 * @apiParam {ID} product type of product loaded on the truck
 * @apiParam {Number} size size of truck in litres
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
	catchAsync(truckController.updateTruck)
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
	catchAsync(truckAndDriverController.updateTruckAndDriver)
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
	catchAsync(truckAndDriverController.getTruckAndDrivers)
);

/**
 * @api {get} /api/user/peddler/nearest-drivers?lat={lat}&&lon={lon}&&radius={search-radius} get Trucks which have been assigned Driver
 * @apiName getTrucksDrivers
 * @apiGroup Trucks And Drivers Management
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription This endpoint will fetch all online drivers within the radius passed in
 * from the coordinate specified by lat and lon params
 *
 * @apiParam {Number} [lat]
 * @apiParam {Number} [lon]
 * @apiParam {Number} [radius=5]
 */
router.get(
	"/nearest-drivers",
	catchAsync(geoLocationController.getNearestOnlinePeddlers)
);

module.exports = router;
