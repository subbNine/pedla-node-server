const TruckDto = require("./truck");
const UserDto = require("./user");

module.exports = class TruckDriver {
	id;
	truck = new TruckDto();
	driver = new UserDto();
};
