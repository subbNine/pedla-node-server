const { dbConnStr } = require("../../config");
const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

mongoose.connect(dbConnStr);

// Connection Signals
mongoose.connection
	.once("open", function () {
		console.log("Connection established");
	})
	.on("error", function (error) {
		console.log("Connect error", error);
	})
	.on("disconnected", function () {
		console.log("Connection disconnected");
	});

module.exports = mongoose;
