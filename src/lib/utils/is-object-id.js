const { Types } = require("mongoose");

module.exports = function isObjectId(id) {
	return Types.ObjectId.isValid(id);
};
