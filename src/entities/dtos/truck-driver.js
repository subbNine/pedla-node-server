const TruckDto = require("./truck");
const UserDto = require("./user");

module.exports = class TruckAndDriver {
	id;
	truck = new TruckDto();
	driver = new UserDto();
};
