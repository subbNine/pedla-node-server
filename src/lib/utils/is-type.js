module.exports = function isType(expectedTypeName = "", inputObj) {
	let matchedType = false;
	const _expectedTypeName = ("" + expectedTypeName).trim().toLowerCase();
	switch (_expectedTypeName) {
		case "array":
			matchedType =
				typeof inputObj === "object" && Array.isArray(inputObj) ? true : false;
			break;
		case "object":
			matchedType =
				typeof inputObj === "object" && !Array.isArray(inputObj) ? true : false;
			break;
		default:
			matchedType = typeof inputObj === _expectedTypeName;
			break;
	}

	return matchedType;
};
