const { Router } = require("express");

const buyerRoutes = require("./buyer");
const peddlerRoutes = require("./peddler");
const adminRoutes = require("./admin");
const { user: userController } = require("../../controllers");

const router = Router();

router.use("/buyer", buyerRoutes);

router.use("/peddler", peddlerRoutes);

router.use("/admin", adminRoutes);

module.exports = router;
