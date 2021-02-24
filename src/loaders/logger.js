const { APP_ENV } = require("../config");

const { createLogger, format, addColors, transports } = require("winston");
const Sentry = require("winston-transport-sentry-node").default;

const options = {
	sentry: {
		dsn:
			"https://15eb77b294a34b0ba706701e99076341@o499149.ingest.sentry.io/5577371",
	},
	level: "info",
};

const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf((info) => {
	return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		debug: 3,
	},
	colors: {
		error: "red",
		warn: "yellow",
		info: "blue",
		debug: "violet",
	},
};

addColors(logLevels);

module.exports = createLogger({
	format: combine(
		colorize(),
		label({ label: APP_ENV }),
		timestamp(),
		logFormat
	),
	levels: logLevels.levels,
	transports: [new transports.Console(), new Sentry(options)],
});
