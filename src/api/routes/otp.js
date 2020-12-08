const { Router } = require("express");

const { otp: otpController } = require("../controllers");
const { catchAsync } = require("../../errors");

const router = Router();

router.post("/verify", catchAsync(otpController.verifyOtp));

router.post("/send", catchAsync(otpController.resendOtp));

module.exports = router;
