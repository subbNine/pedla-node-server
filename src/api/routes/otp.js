const { Router } = require("express");

const { otp: otpController } = require("../controllers");
const { catchAsync } = require("../../errors");

const { validateBody } = require("../middlewares/validator-helpers");
const validationSchemas = require("../validators");

const router = Router();

router.post(
	"/verify",
	validateBody(validationSchemas.otpToken),
	catchAsync(otpController.verifyOtp)
);

router.post("/send", otpController.sendOtp);

module.exports = router;
