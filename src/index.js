const express = require("express");

const loadExpress = require("./loaders/express");
const loadCronJob = require("./loaders/cron");
const logger = require("./loaders/logger");
const { PORT } = require("./config");

const app = express();

loadExpress(app);
loadCronJob();

app.listen(PORT, (err) => {
	if (err) {
		logger.error(err);
		return;
	}
	logger.info("Server running on port " + PORT);
});
