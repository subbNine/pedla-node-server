const { Router } = require("express");

const authRoutes = require("./auth");
const otpRoutes = require("./otp");
const userRoutes = require("./user");
const fileUploadRoutes = require("./file-upload");
const shield = require("../middlewares/shield");
const initExpressVars = require("../middlewares/init-express-global-vars");
const { user: userController } = require("../controllers");

const router = Router();

router.get("/user", userController.checkUserExistence);

router.use(initExpressVars);

router.use("/auth", authRoutes);

router.use("/otp", shield(), otpRoutes);

router.use("/user", userRoutes);

router.use("/file", fileUploadRoutes);

module.exports = router;

/**
 * @apiDefine AuthHeader
 *
 * @apiHeader (header) {String} authorization Bearer Authorization Header
 */

/**
 * @apiDefine PaginationQuery
 *
 * @apiParam {Number} [page] Current Page
 * @apiParam {Number} [limit] Page Size
 */

/**
 * @apiDefine IncorrectPasswordError
 *
 * @apiError IncorrectPasswordError The password of the user is incorrect
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 400 Bad Request
 * 	{
 * 		"name": "IncorrectPasswordError",
 * 		"message": "The password you entered is incorrect",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine IncorrectUsernameError
 *
 * @apiError IncorrectUsernameError The username of the user is incorrect
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 404 Not Found
 * 	{
 * 		"name": "IncorrectUsernameError",
 * 		"message": "The username you entered is incorrect",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine IncorrectEmailError
 *
 * @apiError IncorrectEmailError A user with the email was not found
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 400 Bad Request
 * 	{
 * 		"name": "IncorrectEmailError",
 * 		"message": "The email you entered was not found",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine NameConflictError
 *
 * @apiError NameConflictError An entity already exists with the passed in name
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 409 Conflict Error
 * 	{
 * 		"name": "NameConflictError",
 * 		"message": "name already exists",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine EmailConflictError
 *
 * @apiError EmailConflictError User already exists with the passed in email
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 409 Conflict Error
 * 	{
 * 		"name": "EmailConflictError",
 * 		"message": "email already exists",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine UnverifiedProfileError
 *
 * @apiError UnverifiedProfileError Error thrown if pedddler tries to signup before verification
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 400 Bad Request
 * 	{
 * 		"name": "UnverifiedProfileError",
 * 		"message": "Profile not yet verified",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine InvalidCodeError
 *
 * @apiError InvalidCodeError Wrong registration code
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 400 Bad Request
 * 	{
 * 		"name": "InvalidCodeError",
 * 		"message": "You have entered a wrong code",
 * 		"isOperational": true
 * 	}
 */

/**
 * @apiDefine DupplicateAssignmentError
 *
 * @apiError DupplicateAssignmentError This error occurs when you have duplicate assignment to an entity
 *
 * @apiErrorExample Error-Response:
 * 	HTTP/1.1 409 Bad Request
 * 	{
 * 		"name": "DupplicateAssignmentError",
 * 		"message": "The passed in Truck has already been assigned to the passed in driver",
 * 		"isOperational": true
 * 	}
 */
