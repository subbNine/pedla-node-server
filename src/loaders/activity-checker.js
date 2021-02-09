const { activity } = require("../services");
const { INACTIVE_TTL } = require("../config");

function inactiveUsersChecker() {
	activity.setInactiveUsersOffline();
}

module.exports = function usersActivityChecker() {
	setInterval(inactiveUsersChecker, INACTIVE_TTL);
};
