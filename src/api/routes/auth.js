const { Router } = require("express");

const shield = require("../middlewares/shield");
const fileUpload = require("../middlewares/file-upload");
const { auth: authController } = require("../controllers");
const { catchAsync } = require("../../errors");

const { validateBody } = require("../middlewares/validator-helpers");
const validationSchemas = require("../validators");

const router = Router();

/**
 * @api {post} /api/auth/signin Buyer Sign In
 * @apiName postSignin
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Buyers Sign In end-point
 *
 * @apiParam {String} email User's unique Username.
 * @apiParam {String} password User's Password.
 *
 * @apiSuccess {String} token Authentication token
 * @apiSuccess {ID} id user id
 *
 * @apiUse IncorrectEmailError
 * @apiUse IncorrectPasswordError
 */
router.post(
	"/signin",
	validateBody(validationSchemas.postEmailAndPassword),
	catchAsync(authController.signIn)
);

/**
 * @api {post} /api/auth/peddler/signin Peddler Sign In
 * @apiName postPeddlerSignin
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Peddlers Sign In end-point. Calling this endpoint will return a
 * a temporary restricted token and will send an otp to the peddler.
 * the token will be used to identify the user during otp verification. on OTP verification
 * a permenent token will be sent
 *
 * @apiParam {String} userName User's unique Username.
 * @apiParam {String} password User's Password.
 *
 * @apiSuccess {String} token Authentication token
 * @apiSuccess {ID} id user id
 *
 * @apiUse IncorrectUsernameError
 * @apiUse IncorrectPasswordError
 */
router.post(
	"/peddler/signin",
	validateBody(validationSchemas.postUsernameAndPassword),
	catchAsync(authController.peddlerSignIn)
);

/**
 * @api {post} /api/auth/admin/signin Admin Sign In
 * @apiName postAdminSignin
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Admin authentication
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's Password.
 *
 * @apiSuccess {String} token Authentication token
 * @apiSuccess {ID} id user id
 *
 * @apiUse IncorrectEmailError
 * @apiUse IncorrectPasswordError
 */
router.post(
	"/admin/signin",
	validateBody(validationSchemas.postEmailAndPassword),
	catchAsync(authController.adminSignIn)
);

/**
 * @api {post} /api/auth/peddler Create Peddler Profile
 * @apiName postPeddler
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to Create Peddler's Profile. Calling this endpoint will return a temporary token
 * that will be used to access all routes that the peddler has to hit to complete account creation
 *
 * @apiParam {String} firstName User's first name.
 * @apiParam {String} lastName User's last name.
 * @apiParam {String} phoneNumber User's Phone number
 * @apiParam {String} nTrucks Number of trucks owned by peddler
 * @apiParam {String} pooImage Proof of ownership of trucks owned by peddlers
 * @apiParam {String} email Email address of peddler
 *
 * @apiSuccess {String} token Authentication token
 * @apiSuccess {ID} id user id
 *
 * @apiUse EmailConflictError
 */
router.post(
	"/peddler",
	validateBody(validationSchemas.postPeddlerProfile),
	fileUpload.single("pooImage"),
	catchAsync(authController.createPeddlerProfile)
);

/**
 * @api {post} /api/auth/peddler-signup Peddler's signup endpoint
 * @apiName postPeddler
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Peddler's signup route. This route is protected as it needs to be called
 * with the token gotten from calling the route that creates peddlers profile
 *
 * @apiParam {String} userName Peddler's username.
 * @apiParam {String} password Peddler's Password
 *
 * @apiSuccess {ID} id user id
 *
 * @apiUse NameConflictError
 * @apiUse UnverifiedProfileError
 */
router.post(
	"/peddler-signup",
	validateBody(validationSchemas.postUsernameAndPassword),
	shield(),
	catchAsync(authController.peddlerSignUp)
);

/**
 * @api {post} /api/auth/peddler-code Peddler's code Activation
 * @apiName postPeddlerCode
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription verifies registration code recieved by peddlers when admin has approved a peddler's profile.
 * This route is protected just like the signup route
 *
 * @apiParam {String} code Peddler's registration code.
 *
 * @apiSuccess {ID} id user id
 *
 * @apiUse InvalidCodeError
 */
router.post(
	"/peddler-code",
	validateBody(validationSchemas.postPeddlerCode),
	shield(),
	catchAsync(authController.verifyPeddlerCode)
);

/**
 * @api {post} /api/auth/buyer Buyer's Signup endpoint
 * @apiName postBuyer
 * @apiGroup Authentication
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to sign buyers up to the platform
 *
 * @apiParam {String} firstName User's first name.
 * @apiParam {String} lastName User's last name.
 * @apiParam {String} phoneNumber User's Phone number
 * @apiParam {String} address Address of the buyer
 * @apiParam {String} password Password of the buyer
 * @apiParam {String} email Email address of peddler
 * @apiParam {String} cacUrl url of C.A.C document of corporate buyers
 * @apiParam {String} [buyerType=regular] type of buyer (corporate|regular)
 *
 * @apiSuccess {String} token Authentication token
 * @apiSuccess {ID} id user id
 *
 * @apiUse EmailConflictError
 */
router.post("/buyer", catchAsync(authController.buyerSignUp));

/**
 * @api {post} /api/auth/password-reset/init Initialize Password Reset
 * @apiName postAuthPasswordResetInit
 * @apiGroup Authentication (Password Reset)
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email email of the user that wants to reset passwaord
 *
 * @apiDescription Initialize Password Reset
 */
router.post(
	"/password-reset/init",
	catchAsync(authController.initPasswordReset)
);

/**
 * @api {post} /api/auth/password-reset/:resetToken Reset Password
 * @apiName postAuthPasswordReset
 * @apiGroup Authentication (Password Reset)
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} resetToken [url param] used to reset the password. This value is returned from
 * calling the password reset intialization endpoint
 * @apiParam {String} resetCode [body param] The password reset code sent to the user when the password-reset is initialized
 * @apiParam {String} password [body param] new password of the user
 *
 * @apiDescription Reset Password
 */
router.post(
	"/password-reset/:resetToken",
	catchAsync(authController.resetPassword)
);

/**
 * @api {get} /api/auth/password-reset/:resetToken Resend password reset code
 * @apiName getAuthPasswordReset
 * @apiGroup Authentication (Password Reset)
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} resetToken [url param] This value is returned from
 * calling the password reset intialization endpoint
 *
 * @apiDescription Send Reset Code
 */
router.get(
	"/password-reset/:resetToken",
	catchAsync(authController.sendResetCode)
);

/**
 * @api {post} /api/auth/change-password Change Password
 * @apiName postAuthChangePassword
 * @apiGroup Authentication (Change Password)
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} otpToken otp token user receive's from call to send otp route
 * @apiParam {String} oldPassword  old password of the user
 * @apiParam {String} newPassword [body param] new password of the user
 *
 * @apiDescription To initialize the process. Send an opt token by calling the send otp route. Then call this endpoint supplying the otp token,
 * new password and old password. The endpoint will return the updated user object
 */
router.post(
	"/change-password",
	shield(),
	catchAsync(authController.changePassword)
);

/**
 * @api {get} /api/auth/incomplete-profile Get incomplete peddler profile
 * @apiName getAuthIncompleteProfile
 * @apiGroup Authentication Peddler
 *
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email email that will be used to retreive incomplete profile to
 * continue peddler registration
 *
 * @apiDescription With this endpoint a peddler will get back a profile which has been
 * created but hasn't completed registration.
 *
 * @apiUse IncorrectEmailError
 */
router.get(
	"/incomplete-profile",
	catchAsync(authController.getIncompletePeddlerProfile)
);

module.exports = router;
