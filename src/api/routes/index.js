const { Router } = require("express");

const authRoutes = require("./auth");
const otpRoutes = require("./otp");
const userRoutes = require("./user");
const shield = require("../middlewares/shield");
const initExpressVars = require("../middlewares/init-express-global-vars");

const router = Router();

router.use(initExpressVars);

router.use("/account", authRoutes);

router.use("/otp", shield(), otpRoutes);

router.use("/user", shield(), userRoutes);

module.exports = router;
