const { activity } = require("../services");

function inactiveUsersChecker() {
	activity
		.setInactiveUsersOffline()
		.then((_r) => process.nextTick(inactiveUsersChecker));
}

module.exports = function usersActivityChecker() {
	process.nextTick(inactiveUsersChecker);
};
