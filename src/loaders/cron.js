const cron = require("node-cron");
const { activity } = require("../services");
const { error } = require("../errors")

function putInactiveUsersOffline() {
	activity.setInactiveUsersOffline().catch(err => error(err));
}

module.exports = () => cron.schedule("20 * * * *", putInactiveUsersOffline);
