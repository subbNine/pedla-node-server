const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");

const logger = require("./logger");
const api = require("../api/routes");
const errorMiddleware = require("../api/middlewares/error-handler");
const invalidRouteMiddleware = require("../api/middlewares/invalid-route-handler");
const { httpAuth } = require("../api/middlewares/auth");

/***
 * mount middlewares and application routes
 * @function
 * @param {object} app - express application
 **/
module.exports = function (app) {
	app.use(cors());
	app.use(express.static("public"));
	app.use(
		morgan("dev", {
			stream: {
				write: (msg) => {
					logger.info(msg);
				},
			},
		})
	);
	app.use(
		express.urlencoded({extended:true})
	);
	app.use(express.json());
	app.use(helmet());
	app.use(httpAuth);
	app.use("/api", api);
	app.use(invalidRouteMiddleware);
	app.use(errorMiddleware);
};
