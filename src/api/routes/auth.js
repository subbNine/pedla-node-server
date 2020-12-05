const { Router } = require("express");

const { auth: authController } = require("../controllers");
const { catchAsync } = require("../../errors");

const router = Router();

router.post("/signin", catchAsync(authController.signIn));

router.post("/peddler/signup", catchAsync(authController.peddlerSignup));

router.post("/buyer/signup", catchAsync(authController.buyerSignup));

module.exports = router;
