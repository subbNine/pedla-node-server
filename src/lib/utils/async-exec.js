const isType = require("./is-type");

module.exports = function asyncExec(arrOfData, func) {
	// asynchronously execute a function on a collection of data
	if (!(isType("array", arrOfData) || isType("object", arrOfData))) {
		throw new Error(`${arrOfData} should be of type
            'Array' but found ${typeof arrOfData}`);
	} else {
		if (!isType("array", arrOfData) && isType("object", arrOfData)) {
			return asyncExec(Array(arrOfData), func);
		}

		let arrOfPromises = [];
		for (let row of arrOfData) {
			arrOfPromises.push(func(row));
		}

		return Promise.all(arrOfPromises);
	}
};
