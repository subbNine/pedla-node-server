const cron = require("node-cron");
const { activity } = require("../services");

function putInactiveUsersOffline() {
	activity.setInactiveUsersOffline();
}

module.exports = () => cron.schedule("20 * * * *", putInactiveUsersOffline);
